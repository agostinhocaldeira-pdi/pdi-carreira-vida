import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Target, Link2, Building2, TrendingUp, Unlink } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface KeyResult {
  id: string;
  title: string;
  target_value: number;
  current_value: number;
  unit: string;
}

interface OKR {
  id: string;
  title: string;
  description: string;
  period_start: string;
  period_end: string;
  status: string;
  key_results: KeyResult[];
}

interface OKRLink {
  objetivoId: string;
  okrId: string;
  okrTitle: string;
}

interface OKRLinkSectionProps {
  objetivoId: string;
  objetivoTexto: string;
  onLinkChange?: () => void;
}

export function OKRLinkSection({ objetivoId, objetivoTexto, onLinkChange }: OKRLinkSectionProps) {
  const [companyOKRs, setCompanyOKRs] = useState<OKR[]>([]);
  const [linkedOKR, setLinkedOKR] = useState<OKR | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [companyName, setCompanyName] = useState<string>("");
  const [employeeId, setEmployeeId] = useState<string>("");

  useEffect(() => {
    loadCompanyOKRs();
    loadLinkedOKR();
  }, [objetivoId]);

  const loadCompanyOKRs = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Buscar employee data para obter company_id e employee id
      const { data: employeeData } = await supabase
        .from('company_employees')
        .select('id, company_id')
        .eq('user_id', user.id)
        .single();

      if (!employeeData) return;

      setEmployeeId(employeeData.id);

      // Buscar nome da empresa
      const { data: companyData } = await supabase
        .from('companies')
        .select('razao_social')
        .eq('id', employeeData.company_id)
        .single();

      if (companyData) {
        setCompanyName(companyData.razao_social);
      }

      // Buscar OKRs vinculados ao funcionário do Supabase
      const { data: linksData } = await supabase
        .from('company_okr_employee_links')
        .select('okr_id')
        .eq('employee_id', employeeData.id);

      if (linksData && linksData.length > 0) {
        const linkedOkrIds = linksData.map(l => l.okr_id);

        const { data: okrsData } = await supabase
          .from('company_okrs')
          .select(`
            id, title, description, period_start, period_end, status,
            okr_key_results (id, title, target_value, current_value, unit)
          `)
          .in('id', linkedOkrIds)
          .eq('status', 'active');

        if (okrsData) {
          const mappedOkrs = okrsData.map(okr => ({
            ...okr,
            key_results: okr.okr_key_results || []
          }));
          setCompanyOKRs(mappedOkrs);
        }
      } else {
        // Fallback para localStorage (dados antigos)
        const stored = localStorage.getItem(`okrs_${employeeData.company_id}`);
        if (stored) {
          const okrs = JSON.parse(stored)
            .filter((okr: any) => okr.status === "active")
            .filter((okr: any) => (okr.linked_employee_ids || []).includes(employeeData.id));
          setCompanyOKRs(okrs);
        }
      }
    } catch (error) {
      console.error('Error loading company OKRs:', error);
    }
  };

  const loadLinkedOKR = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Buscar vínculo do Supabase
      const { data: linkData } = await supabase
        .from('user_okr_links')
        .select(`
          okr_id,
          company_okrs (
            id, title, description, period_start, period_end, status,
            okr_key_results (id, title, target_value, current_value, unit)
          )
        `)
        .eq('user_id', user.id)
        .eq('objetivo_id', objetivoId)
        .single();

      if (linkData?.company_okrs) {
        const okr = linkData.company_okrs as any;
        setLinkedOKR({
          ...okr,
          key_results: okr.okr_key_results || []
        });
      }
    } catch (error) {
      // No link found, which is fine
    }
  };

  const handleLinkOKR = async (okrId: string) => {
    const okr = companyOKRs.find(o => o.id === okrId);
    if (!okr) return;

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Salvar vínculo no Supabase
      await supabase
        .from('user_okr_links')
        .upsert({
          user_id: user.id,
          objetivo_id: objetivoId,
          okr_id: okrId
        }, { onConflict: 'user_id,objetivo_id' });

      setLinkedOKR(okr);
      setIsDialogOpen(false);
      toast.success("Objetivo vinculado ao OKR!");
      onLinkChange?.();
    } catch (error) {
      console.error('Error linking OKR:', error);
      toast.error("Erro ao vincular objetivo");
    }
  };

  const handleUnlinkOKR = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      await supabase
        .from('user_okr_links')
        .delete()
        .eq('user_id', user.id)
        .eq('objetivo_id', objetivoId);

      setLinkedOKR(null);
      toast.success("Vínculo removido!");
      onLinkChange?.();
    } catch (error) {
      console.error('Error unlinking OKR:', error);
      toast.error("Erro ao remover vínculo");
    }
  };

  const calculateOKRProgress = (okr: OKR): number => {
    if (okr.key_results.length === 0) return 0;
    const total = okr.key_results.reduce((acc, kr) => {
      const progress = Math.min((kr.current_value / kr.target_value) * 100, 100);
      return acc + progress;
    }, 0);
    return Math.round(total / okr.key_results.length);
  };

  // Don't render if no company or no OKRs available
  if (companyOKRs.length === 0 && !linkedOKR) return null;

  return (
    <div className="mt-2">
      {linkedOKR ? (
        <div className="flex items-center gap-2 p-2 bg-primary/10 rounded-md border border-primary/20">
          <Building2 className="h-4 w-4 text-primary" />
          <div className="flex-1 min-w-0">
            <p className="text-xs text-muted-foreground">Contribui para OKR corporativo:</p>
            <p className="text-sm font-medium truncate">{linkedOKR.title}</p>
            <div className="flex items-center gap-2 mt-1">
              <Progress value={calculateOKRProgress(linkedOKR)} className="h-1.5 flex-1" />
              <span className="text-xs text-muted-foreground">{calculateOKRProgress(linkedOKR)}%</span>
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={handleUnlinkOKR} className="h-7 px-2">
            <Unlink className="h-3 w-3" />
          </Button>
        </div>
      ) : (
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm" className="h-7 text-xs gap-1">
              <Link2 className="h-3 w-3" />
              Vincular ao OKR
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                Vincular Objetivo ao OKR Corporativo
              </DialogTitle>
            </DialogHeader>
            
            <div className="space-y-4 mt-4">
              <div className="p-3 bg-muted rounded-md">
                <p className="text-sm font-medium">Seu objetivo:</p>
                <p className="text-sm text-muted-foreground">{objetivoTexto}</p>
              </div>

              {companyName && (
                <p className="text-sm text-muted-foreground flex items-center gap-2">
                  <Building2 className="h-4 w-4" />
                  OKRs de {companyName}
                </p>
              )}

              <div className="space-y-3 max-h-[300px] overflow-y-auto">
                {companyOKRs.map((okr) => {
                  const progress = calculateOKRProgress(okr);
                  return (
                    <Card 
                      key={okr.id} 
                      className="cursor-pointer hover:border-primary transition-colors"
                      onClick={() => handleLinkOKR(okr.id)}
                    >
                      <CardHeader className="p-3 pb-2">
                        <div className="flex items-start justify-between gap-2">
                          <CardTitle className="text-sm">{okr.title}</CardTitle>
                          <Badge variant="outline" className="text-xs">
                            {progress}%
                          </Badge>
                        </div>
                        <CardDescription className="text-xs line-clamp-2">
                          {okr.description}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="p-3 pt-0">
                        <Progress value={progress} className="h-1.5" />
                        <div className="mt-2 space-y-1">
                          {okr.key_results.slice(0, 2).map((kr) => (
                            <div key={kr.id} className="flex items-center gap-2 text-xs text-muted-foreground">
                              <TrendingUp className="h-3 w-3" />
                              <span className="truncate">{kr.title}</span>
                              <span className="ml-auto">{kr.current_value}/{kr.target_value} {kr.unit}</span>
                            </div>
                          ))}
                          {okr.key_results.length > 2 && (
                            <p className="text-xs text-muted-foreground">
                              +{okr.key_results.length - 2} resultados-chave
                            </p>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}

export function CompanyOKRsOverview() {
  const [companyOKRs, setCompanyOKRs] = useState<OKR[]>([]);
  const [companyName, setCompanyName] = useState<string>("");
  const [alignmentPercentage, setAlignmentPercentage] = useState(0);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    const user = localStorage.getItem("user");
    if (!user) return;

    const userData = JSON.parse(user);
    const employeeCompanyId = userData.companyId;
    
    if (!employeeCompanyId) return;

    // Load company name
    const companies = localStorage.getItem("companies");
    if (companies) {
      const companiesList = JSON.parse(companies);
      const company = companiesList.find((c: any) => c.id === employeeCompanyId);
      if (company) {
        setCompanyName(company.razao_social);
      }
    }

    // Load OKRs
    const stored = localStorage.getItem(`okrs_${employeeCompanyId}`);
    if (stored) {
      const okrs = JSON.parse(stored).filter((okr: OKR) => okr.status === "active");
      setCompanyOKRs(okrs);
    }

    // Calculate alignment
    const links = localStorage.getItem("user_okr_links");
    const objetivos = localStorage.getItem("objetivos");
    
    if (links && objetivos) {
      const linksList = JSON.parse(links);
      const objetivosList = JSON.parse(objetivos);
      
      if (objetivosList.length > 0) {
        const linkedCount = objetivosList.filter((obj: any) => 
          linksList.some((link: any) => link.objetivoId === obj.id.toString())
        ).length;
        setAlignmentPercentage(Math.round((linkedCount / objetivosList.length) * 100));
      }
    }
  };

  const calculateOKRProgress = (okr: OKR): number => {
    if (okr.key_results.length === 0) return 0;
    const total = okr.key_results.reduce((acc, kr) => {
      const progress = Math.min((kr.current_value / kr.target_value) * 100, 100);
      return acc + progress;
    }, 0);
    return Math.round(total / okr.key_results.length);
  };

  if (companyOKRs.length === 0) return null;

  return (
    <Card className="border-primary/20 bg-primary/5">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base flex items-center gap-2">
            <Building2 className="h-4 w-4 text-primary" />
            OKRs de {companyName || "Minha Empresa"}
          </CardTitle>
          <Badge variant={alignmentPercentage >= 50 ? "default" : "secondary"}>
            {alignmentPercentage}% alinhado
          </Badge>
        </div>
        <CardDescription className="text-xs">
          Seus objetivos pessoais contribuem para os OKRs da empresa
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {companyOKRs.map((okr) => {
          const progress = calculateOKRProgress(okr);
          return (
            <div key={okr.id} className="p-2 bg-background rounded border">
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium truncate flex-1">{okr.title}</span>
                <span className="text-xs text-muted-foreground ml-2">{progress}%</span>
              </div>
              <Progress value={progress} className="h-1.5" />
            </div>
          );
        })}
        <p className="text-xs text-muted-foreground text-center pt-2">
          Vincule seus objetivos aos OKRs na seção "Para onde vou"
        </p>
      </CardContent>
    </Card>
  );
}
