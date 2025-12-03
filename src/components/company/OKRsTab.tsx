import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Target, Plus, Pencil, Trash2, TrendingUp, Calendar, Users, UserPlus, X } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import ConfirmDeleteDialog from "@/components/ConfirmDeleteDialog";
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
  status: "active" | "completed" | "archived";
  key_results: KeyResult[];
  linked_employee_ids: string[];
}

interface OKRsTabProps {
  companyId: string;
  employees: Array<{ id: string; name: string }>;
}

export function OKRsTab({ companyId, employees }: OKRsTabProps) {
  const [okrs, setOkrs] = useState<OKR[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingOKR, setEditingOKR] = useState<OKR | null>(null);
  const [deleteOKRId, setDeleteOKRId] = useState<string | null>(null);
  const [newOKR, setNewOKR] = useState({
    title: "",
    description: "",
    period_start: "",
    period_end: "",
  });
  const [newKeyResults, setNewKeyResults] = useState<Omit<KeyResult, "id">[]>([
    { title: "", target_value: 100, current_value: 0, unit: "%" },
  ]);
  const [selectedEmployeeIds, setSelectedEmployeeIds] = useState<string[]>([]);

  useEffect(() => {
    loadOKRs();
  }, [companyId]);

  const loadOKRs = async () => {
    try {
      // Tentar carregar do Supabase primeiro
      const { data: okrsData, error } = await supabase
        .from('company_okrs')
        .select(`
          id, title, description, period_start, period_end, status,
          okr_key_results (id, title, target_value, current_value, unit)
        `)
        .eq('company_id', companyId);

      if (!error && okrsData && okrsData.length > 0) {
        // Carregar linked_employee_ids do localStorage (ainda não está no Supabase)
        const localData = localStorage.getItem(`okrs_${companyId}`);
        const linkedMap: Record<string, string[]> = {};
        if (localData) {
          const parsed = JSON.parse(localData);
          parsed.forEach((okr: any) => {
            linkedMap[okr.id] = okr.linked_employee_ids || [];
          });
        }

        const mappedOkrs = okrsData.map(okr => ({
          id: okr.id,
          title: okr.title,
          description: okr.description || '',
          period_start: okr.period_start,
          period_end: okr.period_end,
          status: okr.status as "active" | "completed" | "archived",
          key_results: okr.okr_key_results || [],
          linked_employee_ids: linkedMap[okr.id] || []
        }));

        setOkrs(mappedOkrs);
        // Atualizar localStorage para manter sync
        localStorage.setItem(`okrs_${companyId}`, JSON.stringify(mappedOkrs));
      } else {
        // Fallback para localStorage
        const stored = localStorage.getItem(`okrs_${companyId}`);
        if (stored) {
          const parsed = JSON.parse(stored).map((okr: any) => ({
            ...okr,
            linked_employee_ids: okr.linked_employee_ids || [],
          }));
          setOkrs(parsed);
        }
      }
    } catch (error) {
      console.error('Error loading OKRs:', error);
      // Fallback para localStorage em caso de erro
      const stored = localStorage.getItem(`okrs_${companyId}`);
      if (stored) {
        setOkrs(JSON.parse(stored));
      }
    }
  };

  const saveOKRs = (newOKRs: OKR[]) => {
    setOkrs(newOKRs);
    localStorage.setItem(`okrs_${companyId}`, JSON.stringify(newOKRs));
  };

  const handleAddOKR = async () => {
    if (!newOKR.title || !newOKR.period_start || !newOKR.period_end) {
      toast.error("Preencha os campos obrigatórios");
      return;
    }

    const validKeyResults = newKeyResults.filter((kr) => kr.title);
    if (validKeyResults.length === 0) {
      toast.error("Adicione pelo menos um Key Result");
      return;
    }

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error("Usuário não autenticado");
        return;
      }

      // Criar OKR no Supabase
      const { data: okrData, error: okrError } = await supabase
        .from('company_okrs')
        .insert({
          company_id: companyId,
          title: newOKR.title,
          description: newOKR.description,
          period_start: newOKR.period_start,
          period_end: newOKR.period_end,
          status: 'active',
          created_by: user.id
        })
        .select()
        .single();

      if (okrError) throw okrError;

      // Criar Key Results
      const keyResultsToInsert = validKeyResults.map(kr => ({
        okr_id: okrData.id,
        title: kr.title,
        target_value: kr.target_value,
        current_value: kr.current_value,
        unit: kr.unit
      }));

      const { data: krData, error: krError } = await supabase
        .from('okr_key_results')
        .insert(keyResultsToInsert)
        .select();

      if (krError) throw krError;

      const newOkr: OKR = {
        id: okrData.id,
        title: okrData.title,
        description: okrData.description || '',
        period_start: okrData.period_start,
        period_end: okrData.period_end,
        status: 'active',
        key_results: krData || [],
        linked_employee_ids: selectedEmployeeIds,
      };

      saveOKRs([...okrs, newOkr]);
      setShowAddModal(false);
      setNewOKR({ title: "", description: "", period_start: "", period_end: "" });
      setNewKeyResults([{ title: "", target_value: 100, current_value: 0, unit: "%" }]);
      setSelectedEmployeeIds([]);
      toast.success("OKR criado com sucesso!");
    } catch (error) {
      console.error('Error creating OKR:', error);
      toast.error("Erro ao criar OKR");
    }
  };

  const handleDeleteOKR = async () => {
    if (deleteOKRId) {
      try {
        // Deletar do Supabase
        await supabase.from('okr_key_results').delete().eq('okr_id', deleteOKRId);
        await supabase.from('company_okrs').delete().eq('id', deleteOKRId);
        
        saveOKRs(okrs.filter((o) => o.id !== deleteOKRId));
        toast.success("OKR removido");
        setDeleteOKRId(null);
      } catch (error) {
        console.error('Error deleting OKR:', error);
        toast.error("Erro ao remover OKR");
      }
    }
  };

  const updateKeyResultProgress = (okrId: string, krId: string, newValue: number) => {
    const updated = okrs.map((okr) => {
      if (okr.id === okrId) {
        return {
          ...okr,
          key_results: okr.key_results.map((kr) =>
            kr.id === krId ? { ...kr, current_value: newValue } : kr
          ),
        };
      }
      return okr;
    });
    saveOKRs(updated);
  };

  const calculateOKRProgress = (okr: OKR): number => {
    if (okr.key_results.length === 0) return 0;
    const total = okr.key_results.reduce((acc, kr) => {
      const progress = kr.target_value > 0 ? (kr.current_value / kr.target_value) * 100 : 0;
      return acc + Math.min(progress, 100);
    }, 0);
    return Math.round(total / okr.key_results.length);
  };

  const addKeyResultField = () => {
    setNewKeyResults([...newKeyResults, { title: "", target_value: 100, current_value: 0, unit: "%" }]);
  };

  const updateKeyResultField = (index: number, field: string, value: any) => {
    const updated = [...newKeyResults];
    updated[index] = { ...updated[index], [field]: value };
    setNewKeyResults(updated);
  };

  const toggleEmployeeForOKR = (okrId: string, employeeId: string) => {
    const updated = okrs.map((okr) => {
      if (okr.id === okrId) {
        const isLinked = okr.linked_employee_ids.includes(employeeId);
        return {
          ...okr,
          linked_employee_ids: isLinked
            ? okr.linked_employee_ids.filter((id) => id !== employeeId)
            : [...okr.linked_employee_ids, employeeId],
        };
      }
      return okr;
    });
    saveOKRs(updated);
  };

  const getEmployeeName = (employeeId: string) => {
    return employees.find((e) => e.id === employeeId)?.name || "Desconhecido";
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Target className="w-5 h-5 text-primary" />
            OKRs Corporativos
          </h3>
          <p className="text-sm text-muted-foreground">
            Objectives and Key Results da empresa
          </p>
        </div>
        <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Novo OKR
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Criar Novo OKR</DialogTitle>
              <DialogDescription>
                Defina um objetivo e seus resultados-chave mensuráveis
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Objetivo *</Label>
                <Input
                  placeholder="Ex: Aumentar satisfação do cliente"
                  value={newOKR.title}
                  onChange={(e) => setNewOKR({ ...newOKR, title: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Descrição</Label>
                <Textarea
                  placeholder="Descreva o objetivo em detalhes"
                  value={newOKR.description}
                  onChange={(e) => setNewOKR({ ...newOKR, description: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Início do período *</Label>
                  <Input
                    type="date"
                    value={newOKR.period_start}
                    onChange={(e) => setNewOKR({ ...newOKR, period_start: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Fim do período *</Label>
                  <Input
                    type="date"
                    value={newOKR.period_end}
                    onChange={(e) => setNewOKR({ ...newOKR, period_end: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label>Key Results *</Label>
                  <Button variant="outline" size="sm" onClick={addKeyResultField}>
                    <Plus className="w-3 h-3 mr-1" />
                    Adicionar
                  </Button>
                </div>
                {newKeyResults.map((kr, index) => (
                  <div key={index} className="p-3 border rounded-lg space-y-3">
                    <Input
                      placeholder="Ex: Aumentar NPS para 80"
                      value={kr.title}
                      onChange={(e) => updateKeyResultField(index, "title", e.target.value)}
                    />
                    <div className="grid grid-cols-3 gap-2">
                      <div>
                        <Label className="text-xs">Meta</Label>
                        <Input
                          type="number"
                          value={kr.target_value}
                          onChange={(e) => updateKeyResultField(index, "target_value", Number(e.target.value))}
                        />
                      </div>
                      <div>
                        <Label className="text-xs">Atual</Label>
                        <Input
                          type="number"
                          value={kr.current_value}
                          onChange={(e) => updateKeyResultField(index, "current_value", Number(e.target.value))}
                        />
                      </div>
                      <div>
                        <Label className="text-xs">Unidade</Label>
                        <Input
                          placeholder="%"
                          value={kr.unit}
                          onChange={(e) => updateKeyResultField(index, "unit", e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-3">
                <Label>Funcionários vinculados</Label>
                {employees.length === 0 ? (
                  <p className="text-sm text-muted-foreground">Nenhum funcionário cadastrado</p>
                ) : (
                  <div className="max-h-40 overflow-y-auto border rounded-lg p-3 space-y-2">
                    {employees.map((emp) => (
                      <div key={emp.id} className="flex items-center gap-2">
                        <Checkbox
                          id={`new-okr-emp-${emp.id}`}
                          checked={selectedEmployeeIds.includes(emp.id)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setSelectedEmployeeIds([...selectedEmployeeIds, emp.id]);
                            } else {
                              setSelectedEmployeeIds(selectedEmployeeIds.filter((id) => id !== emp.id));
                            }
                          }}
                        />
                        <label htmlFor={`new-okr-emp-${emp.id}`} className="text-sm cursor-pointer flex-1">
                          {emp.name}
                        </label>
                      </div>
                    ))}
                  </div>
                )}
                {selectedEmployeeIds.length > 0 && (
                  <p className="text-xs text-muted-foreground">
                    {selectedEmployeeIds.length} funcionário(s) selecionado(s)
                  </p>
                )}
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <Button variant="outline" onClick={() => setShowAddModal(false)}>
                  Cancelar
                </Button>
                <Button onClick={handleAddOKR}>Criar OKR</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* OKRs List */}
      <div className="space-y-4">
        {okrs.length === 0 ? (
          <Card className="p-8 text-center">
            <Target className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="font-medium mb-2">Nenhum OKR cadastrado</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Crie objetivos e resultados-chave para alinhar a equipe
            </p>
            <Button onClick={() => setShowAddModal(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Criar primeiro OKR
            </Button>
          </Card>
        ) : (
          okrs.map((okr) => {
            const progress = calculateOKRProgress(okr);
            return (
              <Card key={okr.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <CardTitle className="text-lg">{okr.title}</CardTitle>
                        <Badge variant={okr.status === "active" ? "default" : "secondary"}>
                          {okr.status === "active" ? "Ativo" : okr.status === "completed" ? "Concluído" : "Arquivado"}
                        </Badge>
                      </div>
                      <CardDescription>{okr.description}</CardDescription>
                      <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {new Date(okr.period_start).toLocaleDateString("pt-BR")} - {new Date(okr.period_end).toLocaleDateString("pt-BR")}
                        </span>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button variant="outline" size="sm" className="h-7 gap-1.5 text-xs">
                              <Users className="w-3.5 h-3.5" />
                              <span>{okr.linked_employee_ids.length}</span>
                              <UserPlus className="w-3.5 h-3.5 text-primary" />
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-72 p-3" align="start">
                            <div className="space-y-3">
                              <h4 className="font-medium text-sm">Vincular Funcionários ao OKR</h4>
                              {employees.length === 0 ? (
                                <p className="text-sm text-muted-foreground">Nenhum funcionário cadastrado</p>
                              ) : (
                                <div className="max-h-48 overflow-y-auto space-y-2">
                                  {employees.map((emp) => (
                                    <div key={emp.id} className="flex items-center gap-2">
                                      <Checkbox
                                        id={`emp-${okr.id}-${emp.id}`}
                                        checked={okr.linked_employee_ids.includes(emp.id)}
                                        onCheckedChange={() => toggleEmployeeForOKR(okr.id, emp.id)}
                                      />
                                      <label
                                        htmlFor={`emp-${okr.id}-${emp.id}`}
                                        className="text-sm cursor-pointer flex-1"
                                      >
                                        {emp.name}
                                      </label>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          </PopoverContent>
                        </Popover>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="text-right mr-4">
                        <p className="text-2xl font-bold text-primary">{progress}%</p>
                        <p className="text-xs text-muted-foreground">Progresso</p>
                      </div>
                      <Button variant="ghost" size="icon" onClick={() => setDeleteOKRId(okr.id)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm mb-2">
                      <span className="font-medium">Key Results</span>
                      <span className="text-muted-foreground">{okr.key_results.length} resultados</span>
                    </div>
                    {okr.key_results.map((kr) => {
                      const krProgress = kr.target_value > 0 ? Math.min((kr.current_value / kr.target_value) * 100, 100) : 0;
                      return (
                        <div key={kr.id} className="p-3 bg-muted/50 rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium">{kr.title}</span>
                            <span className="text-sm">
                              {kr.current_value}/{kr.target_value} {kr.unit}
                            </span>
                          </div>
                          <Progress value={krProgress} className="h-2" />
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>

      <ConfirmDeleteDialog
        open={!!deleteOKRId}
        onOpenChange={() => setDeleteOKRId(null)}
        onConfirm={handleDeleteOKR}
        title="Excluir OKR"
        description="Tem certeza que deseja excluir este OKR? Esta ação não pode ser desfeita."
      />
    </div>
  );
}
