import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Check, X, AlertCircle, PartyPopper, HeadphonesIcon, ClipboardCheck, Zap, Target, ListTodo, Footprints, Save } from "lucide-react";
import { usePDIStorage } from "@/hooks/usePDIStorage";
import { useNavigate } from "react-router-dom";

interface CheckoutItem {
  id: string;
  text: string;
  type: 'action' | 'step' | 'expired' | 'priority';
  category: string;
  done: boolean | null;
  originalData?: any;
}

export const DailyCheckout = () => {
  const storage = usePDIStorage();
  const navigate = useNavigate();
  const [items, setItems] = useState<CheckoutItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showHelpModal, setShowHelpModal] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    loadCheckoutItems();
  }, []);

  const loadCheckoutItems = async () => {
    setLoading(true);
    const checkoutItems: CheckoutItem[] = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    try {
      // Load metas and their actions/steps
      const metas = await storage.getMetas() || JSON.parse(localStorage.getItem("metas") || "[]");
      
      // Load objectives
      const objetivos = await storage.getObjetivos() || JSON.parse(localStorage.getItem("objetivos") || "[]");
      
      // Load Eisenhower tasks
      const eisenhowerData = await storage.getEisenhowerTasks() || {
        urgente_importante: [],
        nao_urgente_importante: [],
        urgente_nao_importante: [],
        nao_urgente_nao_importante: []
      };

      // Helper to check if date is expired (not future)
      const isDateExpiredOrToday = (dateStr: string | undefined): boolean => {
        if (!dateStr) return false;
        const [year, month, day] = dateStr.split('-').map(Number);
        if (!year || !month || !day) return false;
        const targetDate = new Date(year, month - 1, day);
        targetDate.setHours(0, 0, 0, 0);
        return targetDate <= today;
      };

      const isDateExpired = (dateStr: string | undefined): boolean => {
        if (!dateStr) return false;
        const [year, month, day] = dateStr.split('-').map(Number);
        if (!year || !month || !day) return false;
        const targetDate = new Date(year, month - 1, day);
        targetDate.setHours(0, 0, 0, 0);
        return targetDate < today;
      };

      // 1. Daily actions (periodicidade = "diária" or "diario")
      metas.forEach((meta: any) => {
        if (meta.acoes && Array.isArray(meta.acoes)) {
          meta.acoes.forEach((acao: any) => {
            const periodicidade = acao.periodicidade?.toLowerCase() || "";
            const status = acao.status?.toLowerCase()?.replace(/\s+/g, '-') || "";
            const isCompleted = status === "concluido" || status === "concluído";
            
            // Daily actions that are not completed
            if ((periodicidade.includes("diária") || periodicidade.includes("diario") || periodicidade.includes("diariamente")) && !isCompleted) {
              checkoutItems.push({
                id: `action-${acao.id || Math.random()}`,
                text: acao.acao || acao.texto || "Ação sem título",
                type: 'action',
                category: 'Ação Diária',
                done: null,
                originalData: acao
              });
            }
          });
        }
      });

      // 2. Steps from actions (passos)
      metas.forEach((meta: any) => {
        if (meta.acoes && Array.isArray(meta.acoes)) {
          meta.acoes.forEach((acao: any) => {
            if (meta.passos && Array.isArray(meta.passos)) {
              meta.passos.forEach((passo: any) => {
                const isCompleted = passo.concluido === true;
                if (!isCompleted) {
                  checkoutItems.push({
                    id: `step-${passo.id || Math.random()}`,
                    text: passo.passo || passo.texto || "Passo sem título",
                    type: 'step',
                    category: 'Passo',
                    done: null,
                    originalData: passo
                  });
                }
              });
            }
          });
        }
      });

      // 3. Expired objectives (not future dates, not completed)
      objetivos.forEach((obj: any) => {
        const dataAlvo = obj.dataAlvo || obj.data_alvo;
        const status = obj.status?.toLowerCase()?.replace(/\s+/g, '-') || "";
        const isCompleted = status === "concluido" || status === "concluído";
        
        if (!isCompleted && isDateExpired(dataAlvo)) {
          checkoutItems.push({
            id: `expired-obj-${obj.id || Math.random()}`,
            text: obj.texto || obj.objetivo || "Objetivo sem título",
            type: 'expired',
            category: 'Objetivo Expirado',
            done: null,
            originalData: obj
          });
        }
      });

      // 4. Expired goals (not future dates, not completed)
      metas.forEach((meta: any) => {
        const dataAlvo = meta.dataAlvo || meta.data_alvo;
        const status = meta.status?.toLowerCase()?.replace(/\s+/g, '-') || "";
        const isCompleted = status === "concluido" || status === "concluído" || meta.concluida === true;
        
        if (!isCompleted && isDateExpired(dataAlvo)) {
          checkoutItems.push({
            id: `expired-goal-${meta.id || Math.random()}`,
            text: meta.texto || "Meta sem título",
            type: 'expired',
            category: 'Meta Expirada',
            done: null,
            originalData: meta
          });
        }
      });

      // 5. Priority tasks from Eisenhower (Q1 - Urgente e Importante)
      if (eisenhowerData.urgente_importante && Array.isArray(eisenhowerData.urgente_importante)) {
        eisenhowerData.urgente_importante.forEach((task: string, idx: number) => {
          if (task && task.trim()) {
            checkoutItems.push({
              id: `priority-q1-${idx}`,
              text: task,
              type: 'priority',
              category: 'Urgente & Importante',
              done: null,
              originalData: { task, quadrant: 'Q1' }
            });
          }
        });
      }

      // Also include Q2 (Important but not urgent) as priorities
      if (eisenhowerData.nao_urgente_importante && Array.isArray(eisenhowerData.nao_urgente_importante)) {
        eisenhowerData.nao_urgente_importante.slice(0, 3).forEach((task: string, idx: number) => {
          if (task && task.trim()) {
            checkoutItems.push({
              id: `priority-q2-${idx}`,
              text: task,
              type: 'priority',
              category: 'Importante',
              done: null,
              originalData: { task, quadrant: 'Q2' }
            });
          }
        });
      }

      setItems(checkoutItems);
    } catch (error) {
      console.error("Error loading checkout items:", error);
    } finally {
      setLoading(false);
    }
  };

  const toggleItemStatus = (id: string, status: boolean) => {
    setItems(prev => prev.map(item => 
      item.id === id ? { ...item, done: item.done === status ? null : status } : item
    ));
    setHasChanges(true);
  };

  const handleSave = () => {
    const allDone = items.every(item => item.done === true);
    const hasUndone = items.some(item => item.done === false);

    if (allDone && items.length > 0) {
      setShowSuccessModal(true);
    } else if (hasUndone || items.length === 0) {
      setShowHelpModal(true);
    } else {
      // Some items without status - show help modal
      setShowHelpModal(true);
    }
    setHasChanges(false);
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'action': return <Zap className="w-4 h-4 text-blue-500" />;
      case 'step': return <Footprints className="w-4 h-4 text-green-500" />;
      case 'expired': return <AlertCircle className="w-4 h-4 text-destructive" />;
      case 'priority': return <Target className="w-4 h-4 text-amber-500" />;
      default: return <ListTodo className="w-4 h-4" />;
    }
  };

  const getTypeBadgeColor = (type: string) => {
    switch (type) {
      case 'action': return 'bg-blue-500/10 text-blue-700 border-blue-500/30';
      case 'step': return 'bg-green-500/10 text-green-700 border-green-500/30';
      case 'expired': return 'bg-destructive/10 text-destructive border-destructive/30';
      case 'priority': return 'bg-amber-500/10 text-amber-700 border-amber-500/30';
      default: return '';
    }
  };

  if (loading) {
    return (
      <Card className="border-dashed">
        <CardContent className="py-6">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <ClipboardCheck className="w-5 h-5 text-primary" />
            Check out do Dia
            {items.length > 0 && (
              <Badge variant="secondary" className="ml-auto">
                {items.filter(i => i.done === true).length}/{items.length}
              </Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {items.length === 0 ? (
            <div className="text-center py-4">
              <PartyPopper className="w-8 h-8 text-amber-500 mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">
                Nenhuma tarefa pendente para hoje!
              </p>
            </div>
          ) : (
            <>
              <ScrollArea className="max-h-[280px] sm:max-h-[320px]">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[50%] text-xs">Atividade</TableHead>
                      <TableHead className="text-xs hidden sm:table-cell">Tipo</TableHead>
                      <TableHead className="text-right text-xs w-[80px]">Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {items.map((item) => (
                      <TableRow key={item.id} className="group">
                        <TableCell className="py-2">
                          <div className="flex items-start gap-2">
                            <span className="mt-0.5 flex-shrink-0 sm:hidden">
                              {getTypeIcon(item.type)}
                            </span>
                            <div className="min-w-0">
                              <p className="text-sm font-medium truncate max-w-[180px] sm:max-w-[220px]">
                                {item.text}
                              </p>
                              <p className="text-xs text-muted-foreground sm:hidden">
                                {item.category}
                              </p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="py-2 hidden sm:table-cell">
                          <Badge variant="outline" className={`text-xs ${getTypeBadgeColor(item.type)}`}>
                            {getTypeIcon(item.type)}
                            <span className="ml-1">{item.category}</span>
                          </Badge>
                        </TableCell>
                        <TableCell className="py-2 text-right">
                          <div className="flex items-center justify-end gap-1">
                            <Button
                              variant={item.done === true ? "default" : "outline"}
                              size="icon"
                              className={`h-7 w-7 ${item.done === true ? 'bg-green-500 hover:bg-green-600' : 'hover:bg-green-500/10 hover:border-green-500'}`}
                              onClick={() => toggleItemStatus(item.id, true)}
                              title="Feito"
                            >
                              <Check className={`w-4 h-4 ${item.done === true ? 'text-white' : 'text-green-600'}`} />
                            </Button>
                            <Button
                              variant={item.done === false ? "default" : "outline"}
                              size="icon"
                              className={`h-7 w-7 ${item.done === false ? 'bg-destructive hover:bg-destructive/90' : 'hover:bg-destructive/10 hover:border-destructive'}`}
                              onClick={() => toggleItemStatus(item.id, false)}
                              title="Não feito"
                            >
                              <X className={`w-4 h-4 ${item.done === false ? 'text-white' : 'text-destructive'}`} />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </ScrollArea>
              
              <Button 
                onClick={handleSave} 
                className="w-full gap-2"
                disabled={!items.some(i => i.done !== null)}
              >
                <Save className="w-4 h-4" />
                Salvar Check out
              </Button>
            </>
          )}
        </CardContent>
      </Card>

      {/* Success Modal */}
      <Dialog open={showSuccessModal} onOpenChange={setShowSuccessModal}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-green-600">
              <PartyPopper className="w-6 h-6" />
              Parabéns!
            </DialogTitle>
            <DialogDescription className="pt-2">
              Você completou todas as atividades do dia! Continue assim e alcance seus objetivos.
            </DialogDescription>
          </DialogHeader>
          <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-lg p-3 mt-2">
            <p className="text-sm text-amber-800 dark:text-amber-200 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
              Lembre-se de atualizar o status das atividades no "Plano de Vida" para manter seu progresso sincronizado.
            </p>
          </div>
          <DialogFooter className="mt-4">
            <Button variant="outline" onClick={() => setShowSuccessModal(false)}>
              Fechar
            </Button>
            <Button onClick={() => {
              setShowSuccessModal(false);
              window.dispatchEvent(new CustomEvent("navigateToPlanoDeVida", { 
                detail: { tab: "como-chegar" } 
              }));
            }}>
              Ir para Plano de Vida
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Help Modal */}
      <Dialog open={showHelpModal} onOpenChange={setShowHelpModal}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <HeadphonesIcon className="w-6 h-6 text-primary" />
              Precisa de ajuda?
            </DialogTitle>
            <DialogDescription className="pt-2">
              Algumas atividades não foram concluídas. Isso é normal! O importante é manter o foco e continuar tentando.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3 mt-2">
            <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
              <p className="text-sm text-blue-800 dark:text-blue-200 flex items-start gap-2">
                <HeadphonesIcon className="w-4 h-4 mt-0.5 flex-shrink-0" />
                Se precisar de apoio, entre em contato com nosso suporte. Estamos aqui para ajudar você a alcançar seus objetivos.
              </p>
            </div>
            <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-lg p-3">
              <p className="text-sm text-amber-800 dark:text-amber-200 flex items-start gap-2">
                <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                Lembre-se de atualizar o status das atividades no "Plano de Vida" para manter seu progresso sincronizado.
              </p>
            </div>
          </div>
          <DialogFooter className="mt-4 flex-col sm:flex-row gap-2">
            <Button variant="outline" onClick={() => setShowHelpModal(false)} className="w-full sm:w-auto">
              Fechar
            </Button>
            <Button 
              variant="secondary"
              onClick={() => {
                setShowHelpModal(false);
                navigate('/suporte');
              }}
              className="w-full sm:w-auto gap-2"
            >
              <HeadphonesIcon className="w-4 h-4" />
              Ir para Suporte
            </Button>
            <Button 
              onClick={() => {
                setShowHelpModal(false);
                window.dispatchEvent(new CustomEvent("navigateToPlanoDeVida", { 
                  detail: { tab: "como-chegar" } 
                }));
              }}
              className="w-full sm:w-auto"
            >
              Ir para Plano de Vida
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
