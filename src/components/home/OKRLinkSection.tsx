import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Target, Link2, Building2, TrendingUp, Unlink } from "lucide-react";
import { toast } from "sonner";

interface KeyResult {
  id: string;
  title: string;
  target: number;
  current: number;
  unit: string;
}

interface OKR {
  id: string;
  title: string;
  description: string;
  period_start: string;
  period_end: string;
  status: "active" | "completed" | "archived";
  key_results: KeyResult[];
  linked_employee_ids: string[];
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

  useEffect(() => {
    loadCompanyOKRs();
    loadLinkedOKR();
  }, [objetivoId]);

  const loadCompanyOKRs = () => {
    // Get user's company from localStorage
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

    // Load company OKRs
    const stored = localStorage.getItem(`okrs_${employeeCompanyId}`);
    if (stored) {
      const okrs = JSON.parse(stored).filter((okr: OKR) => okr.status === "active");
      setCompanyOKRs(okrs);
    }
  };

  const loadLinkedOKR = () => {
    const links = localStorage.getItem("user_okr_links");
    if (!links) return;

    const linksList: OKRLink[] = JSON.parse(links);
    const link = linksList.find(l => l.objetivoId === objetivoId);
    
    if (link) {
      // Find the OKR details
      const user = localStorage.getItem("user");
      if (user) {
        const userData = JSON.parse(user);
        const stored = localStorage.getItem(`okrs_${userData.companyId}`);
        if (stored) {
          const okrs = JSON.parse(stored);
          const okr = okrs.find((o: OKR) => o.id === link.okrId);
          if (okr) {
            setLinkedOKR(okr);
          }
        }
      }
    }
  };

  const handleLinkOKR = (okrId: string) => {
    const okr = companyOKRs.find(o => o.id === okrId);
    if (!okr) return;

    const links = localStorage.getItem("user_okr_links");
    const linksList: OKRLink[] = links ? JSON.parse(links) : [];
    
    // Remove existing link for this objective
    const filteredLinks = linksList.filter(l => l.objetivoId !== objetivoId);
    
    // Add new link
    filteredLinks.push({
      objetivoId,
      okrId,
      okrTitle: okr.title
    });
    
    localStorage.setItem("user_okr_links", JSON.stringify(filteredLinks));
    setLinkedOKR(okr);
    setIsDialogOpen(false);
    toast.success("Objetivo vinculado ao OKR!");
    onLinkChange?.();
  };

  const handleUnlinkOKR = () => {
    const links = localStorage.getItem("user_okr_links");
    if (!links) return;

    const linksList: OKRLink[] = JSON.parse(links);
    const filteredLinks = linksList.filter(l => l.objetivoId !== objetivoId);
    
    localStorage.setItem("user_okr_links", JSON.stringify(filteredLinks));
    setLinkedOKR(null);
    toast.success("Vínculo removido!");
    onLinkChange?.();
  };

  const calculateOKRProgress = (okr: OKR): number => {
    if (okr.key_results.length === 0) return 0;
    const total = okr.key_results.reduce((acc, kr) => {
      const progress = Math.min((kr.current / kr.target) * 100, 100);
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
                              <span className="ml-auto">{kr.current}/{kr.target} {kr.unit}</span>
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
      const progress = Math.min((kr.current / kr.target) * 100, 100);
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
