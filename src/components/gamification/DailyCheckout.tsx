import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Check, X, AlertCircle, PartyPopper, HeadphonesIcon, ClipboardCheck, Zap, Target, ListTodo, Footprints, Save, Plus, Sparkles } from "lucide-react";
import { PDILoader } from "@/components/ui/pdi-loader";
import { usePDIStorage } from "@/hooks/usePDIStorage";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

interface CheckoutItem {
  id: string;
  text: string;
  type: 'action' | 'step' | 'expired' | 'priority' | 'extra';
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
  const [showExtraModal, setShowExtraModal] = useState(false);
  const [extraActivity, setExtraActivity] = useState("");

  // Load saved checkout status from localStorage on mount
  useEffect(() => {
    loadCheckoutItems();
  }, []);

  // Get today's date key for localStorage
  const getTodayKey = () => {
    const today = new Date();
    return `checkout-${today.toISOString().split('T')[0]}`;
  };

  // Load saved status from localStorage
  const loadSavedStatus = (loadedItems: CheckoutItem[]): CheckoutItem[] => {
    const savedData = localStorage.getItem(getTodayKey());
    if (!savedData) return loadedItems;
    
    try {
      const savedStatuses: Record<string, boolean | null> = JSON.parse(savedData);
      return loadedItems.map(item => ({
        ...item,
        done: savedStatuses[item.id] !== undefined ? savedStatuses[item.id] : null
      }));
    } catch {
      return loadedItems;
    }
  };

  // Get today's extras key for localStorage
  const getTodayExtrasKey = () => {
    const today = new Date();
    return `checkout-extras-${today.toISOString().split('T')[0]}`;
  };

  // Load extra activities from localStorage
  const loadExtraActivities = (): CheckoutItem[] => {
    const savedExtras = localStorage.getItem(getTodayExtrasKey());
    if (!savedExtras) return [];
    
    try {
      const extras: { id: string; text: string }[] = JSON.parse(savedExtras);
      return extras.map(extra => ({
        id: extra.id,
        text: extra.text,
        type: 'extra' as const,
        category: 'Extra',
        done: null,
        originalData: extra
      }));
    } catch {
      return [];
    }
  };

  // Save extra activity
  const saveExtraActivity = (text: string) => {
    const savedExtras = localStorage.getItem(getTodayExtrasKey());
    let extras: { id: string; text: string }[] = [];
    
    try {
      if (savedExtras) {
        extras = JSON.parse(savedExtras);
      }
    } catch {}
    
    const newExtra = {
      id: `extra-${Date.now()}`,
      text: text.trim()
    };
    
    extras.push(newExtra);
    localStorage.setItem(getTodayExtrasKey(), JSON.stringify(extras));
    
    return newExtra;
  };

  const handleAddExtraActivity = () => {
    if (!extraActivity.trim()) return;
    
    const newExtra = saveExtraActivity(extraActivity);
    
    const newItem: CheckoutItem = {
      id: newExtra.id,
      text: newExtra.text,
      type: 'extra',
      category: 'Extra',
      done: null,
      originalData: newExtra
    };
    
    setItems(prev => [...prev, newItem]);
    setExtraActivity("");
    setShowExtraModal(false);
  };

  const loadCheckoutItems = async () => {
    setLoading(true);
    const checkoutItems: CheckoutItem[] = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    try {
      // OPTIMIZATION: Load from localStorage FIRST for instant display
      const metas = JSON.parse(localStorage.getItem("metas") || "[]");
      const objetivos = JSON.parse(localStorage.getItem("objetivos") || "[]");
      const eisenhowerData = JSON.parse(localStorage.getItem("eisenhower_tasks") || "{}") || {
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
      metas.forEach((meta: any, metaIdx: number) => {
        if (meta.acoes && Array.isArray(meta.acoes)) {
          meta.acoes.forEach((acao: any, acaoIdx: number) => {
            const periodicidade = acao.periodicidade?.toLowerCase() || "";
            const status = acao.status?.toLowerCase()?.replace(/\s+/g, '-') || "";
            const isCompleted = status === "concluido" || status === "concluído";
            
            // Daily actions that are not completed
            if ((periodicidade.includes("diária") || periodicidade.includes("diario") || periodicidade.includes("diariamente")) && !isCompleted) {
              checkoutItems.push({
                id: `action-${meta.id || metaIdx}-${acao.id || acaoIdx}`,
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

      // 2. Steps from metas (passos) - Fix: iterate passos directly from meta, not nested in acoes
      metas.forEach((meta: any, metaIdx: number) => {
        if (meta.passos && Array.isArray(meta.passos)) {
          meta.passos.forEach((passo: any, passoIdx: number) => {
            const isCompleted = passo.concluido === true;
            if (!isCompleted) {
              checkoutItems.push({
                id: `step-${meta.id || metaIdx}-${passo.id || passoIdx}`,
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

      // 3. Expired objectives (not future dates, not completed)
      objetivos.forEach((obj: any, objIdx: number) => {
        const dataAlvo = obj.dataAlvo || obj.data_alvo;
        const status = obj.status?.toLowerCase()?.replace(/\s+/g, '-') || "";
        const isCompleted = status === "concluido" || status === "concluído";
        
        if (!isCompleted && isDateExpired(dataAlvo)) {
          checkoutItems.push({
            id: `expired-obj-${obj.id || objIdx}`,
            text: obj.texto || obj.objetivo || "Objetivo sem título",
            type: 'expired',
            category: 'Objetivo Expirado',
            done: null,
            originalData: obj
          });
        }
      });

      // 4. Expired goals (not future dates, not completed)
      metas.forEach((meta: any, metaIdx: number) => {
        const dataAlvo = meta.dataAlvo || meta.data_alvo;
        const status = meta.status?.toLowerCase()?.replace(/\s+/g, '-') || "";
        const isCompleted = status === "concluido" || status === "concluído" || meta.concluida === true;
        
        if (!isCompleted && isDateExpired(dataAlvo)) {
          checkoutItems.push({
            id: `expired-goal-${meta.id || metaIdx}`,
            text: meta.texto || "Meta sem título",
            type: 'expired',
            category: 'Meta Expirada',
            done: null,
            originalData: meta
          });
        }
      });

      // 5. Priority tasks from Eisenhower - Fetch from Supabase
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: eisenhowerTasks } = await supabase
          .from('user_eisenhower_tasks')
          .select('*')
          .eq('user_id', user.id)
          .in('quadrant', ['urgent-important', 'not-urgent-important']);

        if (eisenhowerTasks && eisenhowerTasks.length > 0) {
          eisenhowerTasks.forEach((task, idx) => {
            if (task.task_text && task.task_text.trim()) {
              const isUrgent = task.quadrant === 'urgent-important';
              checkoutItems.push({
                id: `priority-${task.quadrant}-${task.id}`,
                text: task.task_text,
                type: 'priority',
                category: isUrgent ? 'Urgente e Importante' : 'Importante, Não Urgente',
                done: null,
                originalData: { task: task.task_text, quadrant: task.quadrant, id: task.id }
              });
            }
          });
        }
      }

      // 6. Load extra activities from localStorage
      const extraActivities = loadExtraActivities();
      checkoutItems.push(...extraActivities);

      // Apply saved status from localStorage
      const itemsWithSavedStatus = loadSavedStatus(checkoutItems);
      setItems(itemsWithSavedStatus);
    } catch (error) {
      console.error("Error loading checkout items:", error);
    } finally {
      setLoading(false);
    }
  };

  const toggleItemStatus = (id: string, status: boolean) => {
    setItems(prev => {
      const updated = prev.map(item => 
        item.id === id ? { ...item, done: item.done === status ? null : status } : item
      );
      // Save to localStorage immediately on toggle
      saveCheckoutStatus(updated);
      return updated;
    });
    setHasChanges(true);
  };

  // Save checkout status to localStorage
  const saveCheckoutStatus = (currentItems: CheckoutItem[]) => {
    const statuses: Record<string, boolean | null> = {};
    currentItems.forEach(item => {
      statuses[item.id] = item.done;
    });
    localStorage.setItem(getTodayKey(), JSON.stringify(statuses));
  };

  const handleSave = () => {
    // Save status to localStorage
    saveCheckoutStatus(items);
    
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
      case 'extra': return <Sparkles className="w-4 h-4 text-purple-500" />;
      default: return <ListTodo className="w-4 h-4" />;
    }
  };

  const getTypeBadgeColor = (type: string) => {
    switch (type) {
      case 'action': return 'bg-blue-500/10 text-blue-700 border-blue-500/30';
      case 'step': return 'bg-green-500/10 text-green-700 border-green-500/30';
      case 'expired': return 'bg-destructive/10 text-destructive border-destructive/30';
      case 'priority': return 'bg-amber-500/10 text-amber-700 border-amber-500/30';
      case 'extra': return 'bg-purple-500/10 text-purple-700 border-purple-500/30';
      default: return '';
    }
  };

  if (loading) {
    return (
      <Card className="border-dashed">
        <CardContent className="py-6">
          <PDILoader 
            text="Preparando suas tarefas..." 
            size="sm" 
            variant="target" 
          />
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
            <div className="text-center py-6 space-y-4">
              <div className="w-12 h-12 rounded-full bg-purple-500/10 flex items-center justify-center mx-auto">
                <Sparkles className="w-6 h-6 text-purple-500" />
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-foreground">
                  Nenhuma tarefa pendente para hoje!
                </p>
                <p className="text-xs text-muted-foreground">
                  Que tal criar uma atividade extra?
                </p>
              </div>
              <Button 
                onClick={() => setShowExtraModal(true)}
                variant="outline"
                className="gap-2"
              >
                <Plus className="w-4 h-4" />
                Criar ação para hoje
              </Button>
            </div>
          ) : (
            <>
              <ScrollArea className="h-[280px] sm:h-[320px]">
                <div className="min-w-0">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="text-xs">Atividade</TableHead>
                        <TableHead className="text-xs hidden sm:table-cell">Tipo</TableHead>
                        <TableHead className="text-right text-xs whitespace-nowrap">Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {items.map((item) => (
                        <TableRow key={item.id} className="group">
                          <TableCell className="py-2 pr-2">
                            <div className="flex items-start gap-2">
                              <span className="mt-0.5 flex-shrink-0 sm:hidden">
                                {getTypeIcon(item.type)}
                              </span>
                              <div className="min-w-0 flex-1">
                                <p className="text-sm font-medium line-clamp-2">
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
                          <TableCell className="py-2 pl-2">
                            <div className="flex items-center justify-end gap-1.5">
                              <Button
                                variant={item.done === true ? "default" : "outline"}
                                size="icon"
                                className={`h-8 w-8 flex-shrink-0 ${item.done === true ? 'bg-green-500 hover:bg-green-600' : 'hover:bg-green-500/10 hover:border-green-500'}`}
                                onClick={() => toggleItemStatus(item.id, true)}
                                title="Feito"
                              >
                                <Check className={`w-4 h-4 ${item.done === true ? 'text-white' : 'text-green-600'}`} />
                              </Button>
                              <Button
                                variant={item.done === false ? "default" : "outline"}
                                size="icon"
                                className={`h-8 w-8 flex-shrink-0 ${item.done === false ? 'bg-destructive hover:bg-destructive/90' : 'hover:bg-destructive/10 hover:border-destructive'}`}
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
                </div>
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
        <DialogContent className="max-w-md w-[95vw] sm:w-full">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-green-600">
              <PartyPopper className="w-6 h-6 flex-shrink-0" />
              Parabéns!
            </DialogTitle>
            <DialogDescription className="pt-2 text-sm">
              Você completou todas as atividades do dia! Continue assim.
            </DialogDescription>
          </DialogHeader>
          <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-lg p-3 mt-2">
            <p className="text-sm text-amber-800 dark:text-amber-200 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <span>Atualize o status das atividades no "Plano de Vida".</span>
            </p>
          </div>
          <DialogFooter className="mt-4 flex-col sm:flex-row gap-2">
            <Button variant="outline" onClick={() => setShowSuccessModal(false)} className="w-full sm:w-auto">
              Fechar
            </Button>
            <Button 
              onClick={() => {
                setShowSuccessModal(false);
                window.dispatchEvent(new CustomEvent("navigateToPlanoDeVida", { 
                  detail: { tab: "como-chegar" } 
                }));
              }}
              className="w-full sm:w-auto"
            >
              Plano de Vida
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Help Modal */}
      <Dialog open={showHelpModal} onOpenChange={setShowHelpModal}>
        <DialogContent className="max-w-md w-[95vw] sm:w-full">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <HeadphonesIcon className="w-6 h-6 text-primary flex-shrink-0" />
              Precisa de ajuda?
            </DialogTitle>
            <DialogDescription className="pt-2 text-sm">
              Algumas atividades não foram concluídas. Isso é normal! O importante é manter o foco e continuar tentando.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3 mt-2">
            <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
              <p className="text-sm text-blue-800 dark:text-blue-200 flex items-start gap-2">
                <HeadphonesIcon className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <span>Se precisar de apoio, entre em contato com nosso suporte.</span>
              </p>
            </div>
            <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-lg p-3">
              <p className="text-sm text-amber-800 dark:text-amber-200 flex items-start gap-2">
                <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <span>Atualize o status das atividades no "Plano de Vida".</span>
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
              Suporte
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
              Plano de Vida
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Extra Activity Modal */}
      <Dialog open={showExtraModal} onOpenChange={setShowExtraModal}>
        <DialogContent className="max-w-md w-[95vw] sm:w-full">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-purple-500 flex-shrink-0" />
              Crie uma ação para hoje
            </DialogTitle>
            <DialogDescription className="pt-2 text-sm">
              O que você pode fazer hoje, que te aproxima do seu objetivo?
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="extra-activity">Atividade</Label>
              <Input
                id="extra-activity"
                placeholder="Ex: Ler 10 páginas de um livro sobre liderança"
                value={extraActivity}
                onChange={(e) => setExtraActivity(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && extraActivity.trim()) {
                    handleAddExtraActivity();
                  }
                }}
              />
            </div>
          </div>
          <DialogFooter className="flex-col sm:flex-row gap-2">
            <Button 
              variant="outline" 
              onClick={() => {
                setShowExtraModal(false);
                setExtraActivity("");
              }}
              className="w-full sm:w-auto"
            >
              Cancelar
            </Button>
            <Button 
              onClick={handleAddExtraActivity}
              disabled={!extraActivity.trim()}
              className="w-full sm:w-auto gap-2"
            >
              <Plus className="w-4 h-4" />
              Adicionar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
