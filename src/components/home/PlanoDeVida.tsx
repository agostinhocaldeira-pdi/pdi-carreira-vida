import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Compass, Heart, Target, Lightbulb, ChevronDown, ArrowRight, Edit, Sparkles, Loader2, ExternalLink, Plus, Trash2, Pencil, Check, X, Building2, Monitor, Smartphone } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { PDILoader } from "@/components/ui/pdi-loader";
import { toast } from "sonner";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import ConfirmDeleteDialog from "@/components/ConfirmDeleteDialog";
import { OKRLinkSection, CompanyOKRsOverview } from "@/components/home/OKRLinkSection";
import MaoNaMassa from "@/components/home/MaoNaMassa";
import { useQueryClient } from "@tanstack/react-query";
import { usePDIStorage } from "@/hooks/usePDIStorage";
import { PDI_QUERY_KEYS, usePDIData } from "@/hooks/usePDIQueries";
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Legend, ResponsiveContainer } from "recharts";
import { useAIUsage } from "@/hooks/useAIUsage";
import { AIUsageLimitModal } from "@/components/AIUsageLimitModal";

interface PlanoDeVidaProps {
  onTabChange?: (tab: string) => void;
  onOpenChange?: (isOpen: boolean) => void;
  forcedTab?: string;
  forcedOpen?: boolean;
}

const PlanoDeVida = ({ onTabChange, onOpenChange, forcedTab, forcedOpen }: PlanoDeVidaProps) => {
  const storage = usePDIStorage();
  const queryClient = useQueryClient();
  const isMobile = useIsMobile();
  
  // AI Usage hook for insight purchases
  const aiUsage = useAIUsage('insight');
  const [showAILimitModal, setShowAILimitModal] = useState(false);
  
  // React Query hook for cached data with localStorage-first pattern
  const { data: pdiData, isLoading: isQueryLoading } = usePDIData();
  
  // Estados para cards expansíveis - Passo 1 inicia minimizado
  const [quemSouOpen, setQuemSouOpen] = useState(false);
  const [paraOndeOpen, setParaOndeOpen] = useState(false);
  const [comoChegarOpen, setComoChegarOpen] = useState(false);
  
  const [showMobileWarning, setShowMobileWarning] = useState(false);
  const [pendingSection, setPendingSection] = useState<string | null>(null);
  
  const [vvd, setVvd] = useState("");
  const [isEditingVvd, setIsEditingVvd] = useState(true);
  const [valores, setValores] = useState<string[]>(Array(6).fill(""));
  const [isEditingValores, setIsEditingValores] = useState(true);
  const [areasVida, setAreasVida] = useState<Array<{
    area: string;
    notaAtual: string | number;
    notaDesejada: string | number;
  }>>([]);
  const [isEditingAreas, setIsEditingAreas] = useState(true);
  const [insight, setInsight] = useState("");
  const [isGeneratingInsight, setIsGeneratingInsight] = useState(false);
  const [lastInsightDate, setLastInsightDate] = useState<string | null>(null);
  const [canGenerateInsight, setCanGenerateInsight] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [objetivo, setObjetivo] = useState({
    texto: "",
    dataAlvo: "",
    conexaoVvd: "",
    status: "em-andamento",
  });

  const [objetivos, setObjetivos] = useState<Array<{
    id: number;
    texto: string;
    dataAlvo: string;
    conexaoVvd: string;
    status: string;
  }>>([]);

  const [editandoObjetivoId, setEditandoObjetivoId] = useState<number | null>(null);
  const [objetivoEditado, setObjetivoEditado] = useState<{
    texto: string;
    dataAlvo: string;
    conexaoVvd: string;
    status: string;
  } | null>(null);

  // Estado para modal de cadastro de meta
  const [showMetaModal, setShowMetaModal] = useState(false);
  const [objetivoRecemCriado, setObjetivoRecemCriado] = useState<number | null>(null);

  // Estados para confirmação de exclusão
  const [deleteObjetivoId, setDeleteObjetivoId] = useState<string | number | null>(null);
  const [deleteHabilidadeId, setDeleteHabilidadeId] = useState<number | null>(null);

  // Estados para Habilidades
  const [novaHabilidade, setNovaHabilidade] = useState("");
  const [habilidades, setHabilidades] = useState<Array<{ id: number; tipo: 'forte' | 'fraco'; texto: string }>>([]);
  const [editandoHabilidadeId, setEditandoHabilidadeId] = useState<number | null>(null);
  const [habilidadeEditada, setHabilidadeEditada] = useState("");

  // Sincronizar com props externas (para navegação via eventos)
  // Obs: não deve abrir automaticamente ao carregar a Home (mobile/desktop).
  useEffect(() => {
    if (forcedTab === undefined) return;

    // Se o pai controla a abertura, só forçar quando estiver explicitamente "aberto".
    if (forcedOpen !== undefined && !forcedOpen) return;

    if (forcedTab === "quem-sou") {
      setQuemSouOpen(true);
      setParaOndeOpen(false);
      setComoChegarOpen(false);
    } else if (forcedTab === "para-onde") {
      setQuemSouOpen(false);
      setParaOndeOpen(true);
      setComoChegarOpen(false);
    } else if (forcedTab === "como-chegar") {
      setQuemSouOpen(false);
      setParaOndeOpen(false);
      setComoChegarOpen(true);
    }
  }, [forcedTab, forcedOpen]);

  useEffect(() => {
    if (forcedOpen !== undefined) {
      if (forcedOpen && forcedTab) {
        if (forcedTab === "quem-sou") setQuemSouOpen(true);
        else if (forcedTab === "para-onde") setParaOndeOpen(true);
        else if (forcedTab === "como-chegar") setComoChegarOpen(true);
      }
    }
  }, [forcedOpen, forcedTab]);

  // Sincronizar insight entre seções
  useEffect(() => {
    const syncInsight = () => {
      const savedInsight = localStorage.getItem("userInsight");
      if (savedInsight) {
        setInsight(savedInsight);
      }
    };

    // Carregar insight inicial
    syncInsight();

    // Escutar mudanças no localStorage
    window.addEventListener("storage", syncInsight);
    
    // Evento customizado para sincronizar na mesma aba
    window.addEventListener("insightUpdated", syncInsight);

    return () => {
      window.removeEventListener("storage", syncInsight);
      window.removeEventListener("insightUpdated", syncInsight);
    };
  }, []);

  // Sincronizar valores com a página de exercício
  useEffect(() => {
    const syncValores = () => {
      const savedMeusValores = localStorage.getItem("meus_valores");
      if (savedMeusValores) {
        const meusValores = JSON.parse(savedMeusValores);
        // Preencher com os 6 valores
        const valoresCompletos = [...meusValores.slice(0, 6), ...Array(Math.max(0, 6 - meusValores.length)).fill("")];
        setValores(valoresCompletos);
      }
    };

    syncValores();
    window.addEventListener("valoresUpdated", syncValores);

    return () => {
      window.removeEventListener("valoresUpdated", syncValores);
    };
  }, []);

  // Sincronizar VVD com a ferramenta Método VVD
  useEffect(() => {
    const syncVvd = () => {
      const savedVvd = localStorage.getItem("vvd");
      if (savedVvd) {
        setVvd(savedVvd);
        setIsEditingVvd(false);
      }
    };

    syncVvd();
    window.addEventListener("vvdUpdated", syncVvd);

    return () => {
      window.removeEventListener("vvdUpdated", syncVvd);
    };
  }, []);

  // Sincronizar habilidades com a ferramenta SWOT e carregar do Supabase
  useEffect(() => {
    const loadHabilidades = async () => {
      try {
        const savedHabilidades = await storage.getHabilidades();
        if (savedHabilidades && savedHabilidades.length > 0) {
          setHabilidades(savedHabilidades.map((h: any) => ({
            id: h.id || Date.now(),
            tipo: h.tipo || 'fraco' as const,
            texto: h.texto
          })));
        } else {
          // Fallback para localStorage
          const localHabilidades = localStorage.getItem("habilidades");
          if (localHabilidades) {
            const parsed = JSON.parse(localHabilidades);
            setHabilidades(parsed.map((h: any) => ({
              id: h.id || Date.now(),
              tipo: h.tipo || 'fraco' as const,
              texto: h.texto
            })));
          }
        }
      } catch (error) {
        console.error("Erro ao carregar habilidades:", error);
      }
    };

    loadHabilidades();
    
    const syncHabilidades = () => {
      loadHabilidades();
    };
    
    window.addEventListener("habilidadesUpdated", syncHabilidades);

    return () => {
      window.removeEventListener("habilidadesUpdated", syncHabilidades);
    };
  }, [storage]);

  // Carregar dados salvos
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        // VVD
        const savedVvd = await storage.getVvd();
        if (savedVvd) {
          setVvd(savedVvd);
          setIsEditingVvd(false);
        } else {
          const localVvd = localStorage.getItem("vvd");
          if (localVvd) {
            setVvd(localVvd);
            setIsEditingVvd(false);
          }
        }

        // Valores - limitado a 6 campos
        const savedValores = await storage.getValores();
        if (savedValores && savedValores.length > 0) {
          const limitedValores = savedValores.slice(0, 6);
          const valoresCompletos = [...limitedValores, ...Array(Math.max(0, 6 - limitedValores.length)).fill("")];
          setValores(valoresCompletos);
          setIsEditingValores(false);
        } else {
          const localValores = localStorage.getItem("valores");
          if (localValores) {
            const parsed = JSON.parse(localValores);
            const limitedValores = parsed.slice(0, 6);
            const valoresCompletos = [...limitedValores, ...Array(Math.max(0, 6 - limitedValores.length)).fill("")];
            setValores(valoresCompletos);
            setIsEditingValores(false);
          }
        }

        // Áreas da Vida
        const savedAreas = await storage.getAreasVida();
        if (savedAreas && savedAreas.length > 0) {
          const normalizedAreas = savedAreas.map((area: any) => ({
            area: area.area,
            notaAtual: String(area.nota_atual ?? area.notaAtual ?? ""),
            notaDesejada: String(area.nota_desejada ?? area.notaDesejada ?? "")
          }));
          setAreasVida(normalizedAreas);
          setIsEditingAreas(false);
        } else {
          const localAreas = localStorage.getItem("areasVida");
          if (localAreas) {
            const loadedAreas = JSON.parse(localAreas);
            const normalizedAreas = loadedAreas.map((area: any) => ({
              ...area,
              notaAtual: String(area.notaAtual ?? ""),
              notaDesejada: String(area.notaDesejada ?? "")
            }));
            setAreasVida(normalizedAreas);
            setIsEditingAreas(false);
          }
        }

        // Objetivos
        const savedObjetivos = await storage.getObjetivos();
        if (savedObjetivos && savedObjetivos.length > 0) {
          setObjetivos(savedObjetivos.map((obj: any) => ({
            id: obj.id,
            texto: obj.texto,
            dataAlvo: obj.data_alvo || obj.dataAlvo || "",
            conexaoVvd: obj.conexao_vvd || obj.conexaoVvd || "",
            status: obj.status || "em-andamento",
          })));
        } else {
          const localObjetivos = localStorage.getItem("objetivos");
          if (localObjetivos) {
            setObjetivos(JSON.parse(localObjetivos));
          }
        }

        // Insights
        const savedInsight = await storage.getUserInsight();
        if (savedInsight) {
          setInsight(savedInsight.insight);
          setLastInsightDate(savedInsight.date);
          if (savedInsight.date) {
            const lastDate = new Date(savedInsight.date);
            const today = new Date();
            const diffDays = Math.ceil(Math.abs(today.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24));
            setCanGenerateInsight(diffDays >= 30);
          }
        } else {
          const localInsight = localStorage.getItem("userInsight");
          if (localInsight) setInsight(localInsight);
        }

        // Verificar admin via server-side RPC (secure)
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user?.id) {
          const { data: isAdminResult } = await supabase.rpc('has_role', {
            _user_id: session.user.id,
            _role: 'admin'
          });
          setIsAdmin(!!isAdminResult);
          if (isAdminResult) setCanGenerateInsight(true);
        }
      } catch (error) {
        console.error("Error loading data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [storage.isAuthenticated]);

  // Listen for valores updates from the Valores tool
  useEffect(() => {
    const handleValoresUpdated = async () => {
      try {
        const savedValores = await storage.getValores();
        if (savedValores && savedValores.length > 0) {
          const limitedValores = savedValores.slice(0, 6);
          const valoresCompletos = [...limitedValores, ...Array(Math.max(0, 6 - limitedValores.length)).fill("")];
          setValores(valoresCompletos);
          setIsEditingValores(false);
        }
      } catch (error) {
        console.error("Error reloading valores:", error);
      }
    };

    window.addEventListener("valoresUpdated", handleValoresUpdated);
    return () => window.removeEventListener("valoresUpdated", handleValoresUpdated);
  }, [storage]);

  // Sync objetivos from React Query cache (for instant loading)
  useEffect(() => {
    if (pdiData?.objetivos) {
      setObjetivos(
        pdiData.objetivos.map((obj: any) => ({
          id: obj.id,
          texto: obj.texto,
          dataAlvo: obj.data_alvo || obj.dataAlvo || "",
          conexaoVvd: obj.conexao_vvd || obj.conexaoVvd || "",
          status: obj.status || "em-andamento",
        }))
      );
    }
  }, [pdiData?.objetivos]);

  const handleSaveVvd = () => {
    // OPTIMIZATION: Update UI immediately, save in background
    localStorage.setItem("vvd", vvd);
    setIsEditingVvd(false);
    toast.success("Visão de Vida Desejada salva!");
    
    if (typeof window !== 'undefined' && (window as any).markSectionCompleted) {
      (window as any).markSectionCompleted("Visão de Vida Desejada (VVD)");
    }
    
    // Save to Supabase in background (non-blocking)
    storage.saveVvd(vvd).catch(error => {
      console.error("Background VVD sync error:", error);
    });
  };

  const handleEditVvd = () => {
    setIsEditingVvd(true);
  };

  const handleSaveValores = () => {
    // OPTIMIZATION: Update UI immediately, save in background
    const filteredValores = valores.filter(v => v.trim() !== "");
    localStorage.setItem("valores", JSON.stringify(valores));
    setIsEditingValores(false);
    toast.success("Valores salvos!");
    
    if (typeof window !== 'undefined' && (window as any).markSectionCompleted) {
      (window as any).markSectionCompleted("Meus Valores");
    }
    
    // Save to Supabase in background (non-blocking)
    storage.saveValores(filteredValores).catch(error => {
      console.error("Background valores sync error:", error);
    });
  };

  const handleEditValores = () => {
    setIsEditingValores(true);
  };

  const updateValor = (index: number, value: string) => {
    const newValores = [...valores];
    newValores[index] = value;
    setValores(newValores);
  };

  const isValoresComplete = valores.some((valor) => valor.trim() !== "");

  const handleSaveAreas = () => {
    // OPTIMIZATION: Update UI immediately, save in background
    const areasToSave = areasVida.map((area, index) => ({
      id: index + 1,
      area: area.area,
      nota_atual: parseInt(String(area.notaAtual)) || 0,
      nota_desejada: parseInt(String(area.notaDesejada)) || 0,
    }));
    
    localStorage.setItem("areasVida", JSON.stringify(areasVida));
    setIsEditingAreas(false);
    toast.success("Áreas da Vida salvas!");
    
    if (typeof window !== 'undefined' && (window as any).markSectionCompleted) {
      (window as any).markSectionCompleted("Áreas da Vida");
    }
    
    // Save to Supabase in background (non-blocking)
    storage.saveAreasVida(areasToSave).catch(error => {
      console.error("Background areas sync error:", error);
    });
  };

  const handleEditAreas = () => {
    setIsEditingAreas(true);
  };

  const updateArea = (index: number, field: 'notaAtual' | 'notaDesejada', value: string) => {
    const newAreas = [...areasVida];
    newAreas[index] = {
      ...newAreas[index],
      [field]: value
    };
    setAreasVida(newAreas);
  };

  const isAreasComplete = areasVida.length > 0 && areasVida.every(
    (area) => String(area.notaAtual).trim() !== "" && String(area.notaDesejada).trim() !== ""
  );

  const handleGenerateInsight = async (fromPurchase = false) => {
    // Administradores não têm limite
    if (!isAdmin && !canGenerateInsight && !fromPurchase && !aiUsage.hasAvailablePurchase) {
      // Mostrar modal de compra avulsa
      setShowAILimitModal(true);
      return;
    }

    // Se estiver usando uma compra paga, consumir primeiro
    if (!isAdmin && !canGenerateInsight && !fromPurchase && aiUsage.hasAvailablePurchase) {
      const consumed = await aiUsage.consumePurchase();
      if (!consumed) {
        toast.error("Erro ao processar sua compra. Tente novamente.");
        return;
      }
    }

    // Validar requisitos mínimos para gerar insight
    const missingItems: string[] = [];
    
    if (!vvd || vvd.trim() === "") {
      missingItems.push("VVD (Visão de Vida Desejada)");
    }
    
    if (!isValoresComplete) {
      missingItems.push("Valores pessoais");
    }
    
    if (!isAreasComplete) {
      missingItems.push("Roda da Vida (Áreas da Vida)");
    }
    
    if (objetivos.length === 0) {
      missingItems.push("Ao menos 1 objetivo");
    }
    
    // Verificar metas e ações
    try {
      const metas = await storage.getMetas();
      if (metas.length === 0) {
        missingItems.push("Ao menos 1 meta");
      }
      
      // Verificar se há ao menos uma ação em alguma meta
      const hasAcoes = metas.some(meta => meta.acoes && meta.acoes.length > 0);
      if (!hasAcoes) {
        missingItems.push("Ao menos 1 ação");
      }
    } catch (error) {
      console.error("Error checking metas/acoes:", error);
    }
    
    if (missingItems.length > 0) {
      toast.error(
        `Para gerar insights, preencha: ${missingItems.join(", ")}`,
        { duration: 6000 }
      );
      return;
    }

    setIsGeneratingInsight(true);
    
    try {
      // Buscar dados da pesquisa e onboarding
      const surveyData = JSON.parse(localStorage.getItem("userSurvey") || "{}");
      const onboardingData = JSON.parse(localStorage.getItem("onboarding") || "{}");
      
      const { data, error } = await supabase.functions.invoke('generate-insight', {
        body: { vvd, valores, areasVida, surveyData, onboardingData }
      });

      if (error) {
        console.error("Error generating insight:", error);
        toast.error(error.message || "Erro ao gerar insight");
        return;
      }

      if (data?.insight) {
        setInsight(data.insight);
        localStorage.setItem("userInsight", data.insight);
        await storage.saveUserInsight(data.insight);
        
        // Disparar evento para sincronizar em outras seções
        window.dispatchEvent(new Event("insightUpdated"));
        
        // Salvar data da geração apenas para não-admins
        if (!isAdmin) {
          const today = new Date().toISOString();
          localStorage.setItem("lastInsightDate", today);
          setLastInsightDate(today);
          setCanGenerateInsight(false);
        }
        
        toast.success("Insight gerado com sucesso!");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Erro ao gerar insight");
    } finally {
      setIsGeneratingInsight(false);
    }
  };

  const handlePurchaseAI = async () => {
    const url = await aiUsage.createPurchase('/home');
    if (url) {
      window.open(url, '_blank');
    }
  };

  const getNextInsightDate = () => {
    if (!lastInsightDate) return null;
    const lastDate = new Date(lastInsightDate);
    const nextDate = new Date(lastDate);
    nextDate.setDate(nextDate.getDate() + 30);
    return nextDate.toLocaleDateString('pt-BR');
  };

  const handleSaveObjetivo = async () => {
    if (!objetivo.texto || !objetivo.dataAlvo) {
      toast.error("Preencha pelo menos o objetivo e a data alvo");
      return;
    }

    const novoObjetivo = { ...objetivo, id: Date.now() };
    const novosObjetivos = [...objetivos, novoObjetivo];
    setObjetivos(novosObjetivos);
    
    // OPTIMIZATION: Save to localStorage first, show success immediately
    localStorage.setItem("objetivos", JSON.stringify(novosObjetivos));
    toast.success("Objetivo cadastrado!");
    
    // Salvar em Supabase em background (non-blocking)
    const objetivosToSave = novosObjetivos.map(obj => ({
      id: obj.id,
      texto: obj.texto,
      data_alvo: obj.dataAlvo,
      conexao_vvd: obj.conexaoVvd,
      status: obj.status?.replace('-', ' ') || 'a fazer',
    }));
    storage.saveObjetivos(objetivosToSave as any).catch(error => {
      console.error("Background objetivos sync error:", error);
    });
    setObjetivo({ texto: "", dataAlvo: "", conexaoVvd: "", status: "em-andamento" });
    
    // Guardar ID do objetivo recém criado e mostrar modal
    setObjetivoRecemCriado(novoObjetivo.id);
    setShowMetaModal(true);
    
    // Disparar pesquisa de satisfação
    if (typeof window !== 'undefined' && (window as any).markSectionCompleted) {
      (window as any).markSectionCompleted("Meus Objetivos");
    }
  };

  const handleMetaModalConfirm = () => {
    setShowMetaModal(false);
    
    // Primeiro, mudar para a aba "como-chegar" para que MaoNaMassa seja renderizado
    setComoChegarOpen(true);
    setQuemSouOpen(false);
    setParaOndeOpen(false);
    if (onTabChange) {
      onTabChange("como-chegar");
    }
    if (onOpenChange) {
      onOpenChange(true);
    }
    
    // Aguardar o componente MaoNaMassa montar antes de disparar o evento
    setTimeout(() => {
      if (objetivoRecemCriado) {
        window.dispatchEvent(new CustomEvent('openMetaForm', { 
          detail: { objetivoId: objetivoRecemCriado.toString() } 
        }));
      }
      setObjetivoRecemCriado(null);
    }, 300);
  };

  const handleMetaModalCancel = () => {
    setShowMetaModal(false);
    setObjetivoRecemCriado(null);
  };

  const handleRemoveObjetivo = (id: string | number) => {
    setDeleteObjetivoId(id);
  };

  const confirmRemoveObjetivo = () => {
    if (deleteObjetivoId == null) return;

    const prevObjetivos = objetivos;
    const novosObjetivos = prevObjetivos.filter((obj) => String(obj.id) !== String(deleteObjetivoId));
    setObjetivos(novosObjetivos);
    localStorage.setItem("objetivos", JSON.stringify(novosObjetivos));
    toast.success("Objetivo removido!");
    setDeleteObjetivoId(null);

    // Save in background (non-blocking)
    const objetivosToSave = novosObjetivos.map((obj) => ({
      id: obj.id,
      texto: obj.texto,
      data_alvo: obj.dataAlvo,
      conexao_vvd: obj.conexaoVvd,
      status: obj.status || 'a fazer',
    }));
    storage.saveObjetivos(objetivosToSave as any).then(() => {
      queryClient.invalidateQueries({ queryKey: PDI_QUERY_KEYS.pdiData() });
    }).catch(error => {
      console.error("Background objetivos sync error:", error);
    });
  };

  const handleStartEditObjetivo = (obj: any) => {
    setEditandoObjetivoId(obj.id);
    setObjetivoEditado({
      texto: obj.texto,
      dataAlvo: obj.dataAlvo,
      conexaoVvd: obj.conexaoVvd,
      status: obj.status,
    });
  };

  const handleCancelEditObjetivo = () => {
    setEditandoObjetivoId(null);
    setObjetivoEditado(null);
  };

  const handleSaveEditObjetivo = (id: number) => {
    if (!objetivoEditado) return;

    const novosObjetivos = objetivos.map((obj) => 
      obj.id === id ? { ...obj, ...objetivoEditado } : obj
    );
    setObjetivos(novosObjetivos);
    localStorage.setItem("objetivos", JSON.stringify(novosObjetivos));
    setEditandoObjetivoId(null);
    setObjetivoEditado(null);
    toast.success("Objetivo atualizado!");
    
    // Disparar pesquisa de satisfação
    if (typeof window !== 'undefined' && (window as any).markSectionCompleted) {
      (window as any).markSectionCompleted("Meus Objetivos");
    }
  };

  // Funções para gerenciar habilidades
  const handleAddHabilidade = () => {
    if (!novaHabilidade.trim()) {
      toast.error("Digite uma habilidade para adicionar");
      return;
    }

    const novaHab = { id: Date.now(), tipo: 'fraco' as const, texto: novaHabilidade };
    const novasHabilidades = [...habilidades, novaHab];
    setHabilidades(novasHabilidades);
    setNovaHabilidade("");
    toast.success("Habilidade adicionada!");
    
    // Save in background (non-blocking)
    storage.saveHabilidades(novasHabilidades).catch(error => {
      console.error("Background habilidades sync error:", error);
    });
  };

  const handleRemoveHabilidade = (id: number) => {
    setDeleteHabilidadeId(id);
  };

  const confirmRemoveHabilidade = () => {
    if (deleteHabilidadeId) {
      const novasHabilidades = habilidades.filter((hab) => hab.id !== deleteHabilidadeId);
      setHabilidades(novasHabilidades);
      toast.success("Habilidade removida!");
      setDeleteHabilidadeId(null);
      
      // Save in background (non-blocking)
      storage.saveHabilidades(novasHabilidades).catch(error => {
        console.error("Background habilidades sync error:", error);
      });
    }
  };

  const handleStartEditHabilidade = (habilidade: { id: number; tipo: 'forte' | 'fraco'; texto: string }) => {
    setEditandoHabilidadeId(habilidade.id);
    setHabilidadeEditada(habilidade.texto);
  };

  const handleCancelEditHabilidade = () => {
    setEditandoHabilidadeId(null);
    setHabilidadeEditada("");
  };

  const handleSaveEditHabilidade = async (id: number) => {
    if (!habilidadeEditada.trim()) {
      toast.error("A habilidade não pode estar vazia");
      return;
    }

    const novasHabilidades = habilidades.map((hab) =>
      hab.id === id ? { ...hab, texto: habilidadeEditada } : hab
    );
    setHabilidades(novasHabilidades);
    
    try {
      await storage.saveHabilidades(novasHabilidades);
    } catch (error) {
      console.error("Erro ao atualizar habilidade:", error);
    }
    
    setEditandoHabilidadeId(null);
    setHabilidadeEditada("");
    toast.success("Habilidade atualizada!");
  };

  const handleSectionOpen = (section: string, open: boolean) => {
    // Se estiver abrindo no mobile, mostrar aviso apenas na primeira vez para cada passo
    if (open && isMobile) {
      const storageKey = `pdi_mobile_tip_seen_${section}`;
      const alreadySeen = localStorage.getItem(storageKey);
      
      if (!alreadySeen) {
        setPendingSection(section);
        setShowMobileWarning(true);
        return;
      }
    }
    
    if (section === "quem-sou") {
      setQuemSouOpen(open);
      if (open) {
        setParaOndeOpen(false);
        setComoChegarOpen(false);
        onTabChange?.("quem-sou");
        onOpenChange?.(true);
      }
    } else if (section === "para-onde") {
      setParaOndeOpen(open);
      if (open) {
        setQuemSouOpen(false);
        setComoChegarOpen(false);
        onTabChange?.("para-onde");
        onOpenChange?.(true);
      }
    } else if (section === "como-chegar") {
      setComoChegarOpen(open);
      if (open) {
        setQuemSouOpen(false);
        setParaOndeOpen(false);
        onTabChange?.("como-chegar");
        onOpenChange?.(true);
      }
    }
  };

  const handleConfirmMobileOpen = () => {
    setShowMobileWarning(false);
    if (pendingSection) {
      // Salva no localStorage que o usuário já viu a dica para este passo
      const storageKey = `pdi_mobile_tip_seen_${pendingSection}`;
      localStorage.setItem(storageKey, 'true');
      
      if (pendingSection === "quem-sou") {
        setQuemSouOpen(true);
        setParaOndeOpen(false);
        setComoChegarOpen(false);
        onTabChange?.("quem-sou");
      } else if (pendingSection === "para-onde") {
        setParaOndeOpen(true);
        setQuemSouOpen(false);
        setComoChegarOpen(false);
        onTabChange?.("para-onde");
      } else if (pendingSection === "como-chegar") {
        setComoChegarOpen(true);
        setQuemSouOpen(false);
        setParaOndeOpen(false);
        onTabChange?.("como-chegar");
      }
      onOpenChange?.(true);
      setPendingSection(null);
    }
  };

  // Calcular progresso de cada seção
  const quemSouProgress = () => {
    let count = 0;
    if (vvd && vvd.trim()) count++;
    if (isValoresComplete) count++;
    if (isAreasComplete) count++;
    return Math.round((count / 3) * 100);
  };

  const paraOndeProgress = () => {
    return objetivos.length > 0 ? 100 : 0;
  };

  const comoChecarProgress = () => {
    return habilidades.length > 0 ? 100 : 0;
  };

  return (
    <>
      {/* Modal de aviso para usuários mobile */}
      <Dialog open={showMobileWarning} onOpenChange={setShowMobileWarning}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Monitor className="w-5 h-5 text-primary" />
              Dica de Experiência
            </DialogTitle>
            <DialogDescription className="text-left pt-2">
              <div className="flex items-start gap-3 mb-4">
                <Smartphone className="w-8 h-8 text-muted-foreground flex-shrink-0 mt-1" />
                <p className="text-sm">
                  O <strong>Plano de Vida</strong> possui muitas informações e funcionalidades. 
                  Para uma <strong>melhor experiência de preenchimento</strong>, recomendamos utilizar um <strong>computador</strong>.
                </p>
              </div>
              <p className="text-xs text-muted-foreground">
                Você ainda pode continuar no celular, mas algumas funcionalidades podem ser mais difíceis de usar.
              </p>
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex-col gap-2 sm:flex-row">
            <Button variant="outline" onClick={() => { setShowMobileWarning(false); setPendingSection(null); }} className="w-full sm:w-auto">
              Voltar
            </Button>
            <Button onClick={handleConfirmMobileOpen} className="w-full sm:w-auto">
              Continuar mesmo assim
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Card className="shadow-medium overflow-hidden max-w-full w-full box-border">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center shadow-lg">
              <Compass className="w-6 h-6 text-primary-foreground" />
            </div>
            <div>
              <CardTitle className="text-xl sm:text-2xl">Plano de Vida</CardTitle>
              <CardDescription>Construa sua visão e defina seus objetivos</CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-4 overflow-hidden w-full px-3 sm:px-6">
          {/* Step Cards */}
          <div className="grid gap-3 w-full overflow-hidden box-border">
            {/* Passo 1 - Quem sou Eu */}
            <Collapsible open={quemSouOpen} onOpenChange={(open) => handleSectionOpen("quem-sou", open)}>
              <div className={`rounded-xl border-2 transition-all duration-300 overflow-hidden w-full box-border ${quemSouOpen ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50 hover:bg-muted/30'}`}>
                <CollapsibleTrigger asChild>
                  <button className="w-full p-4 flex items-center justify-between text-left group">
                    <div className="flex items-center gap-3 sm:gap-4 flex-1 min-w-0">
                      <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center flex-shrink-0 transition-all duration-300 ${quemSouOpen ? 'bg-primary text-primary-foreground shadow-lg scale-105' : 'bg-primary/10 text-primary group-hover:bg-primary/20'}`}>
                        <Heart className="w-5 h-5 sm:w-6 sm:h-6" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                          <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-primary">Passo 1</span>
                          {quemSouProgress() === 100 && (
                            <span className="w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-green-500 flex items-center justify-center">
                              <Check className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-white" />
                            </span>
                          )}
                        </div>
                        <h3 className="font-semibold text-sm sm:text-base truncate">Quem sou Eu</h3>
                        <p className="text-[10px] sm:text-xs text-muted-foreground hidden sm:block">VVD, Valores e Roda da Vida</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
                      <div className="hidden sm:flex items-center gap-2 bg-muted/50 rounded-full px-3 py-1">
                        <div className="w-16 h-1.5 bg-muted rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-primary rounded-full transition-all duration-500" 
                            style={{ width: `${quemSouProgress()}%` }}
                          />
                        </div>
                        <span className="text-xs font-medium text-muted-foreground">{quemSouProgress()}%</span>
                      </div>
                      <ChevronDown className={`w-5 h-5 text-muted-foreground transition-transform duration-300 ${quemSouOpen ? 'rotate-180' : ''}`} />
                    </div>
                  </button>
                </CollapsibleTrigger>
                
                <CollapsibleContent>
                  <div className="px-3 sm:px-4 pb-4 pt-2 space-y-6 border-t border-border/50 overflow-hidden w-full box-border">
                    {/* VVD */}
                    <div className="space-y-2">
                      <Label htmlFor="vvd">Minha Visão de Vida Desejada</Label>
                      <Textarea
                        id="vvd"
                        placeholder="Clique no link abaixo para fazer seu VVD"
                        value={vvd}
                        onChange={(e) => setVvd(e.target.value)}
                        rows={4}
                        disabled
                        spellCheck="true"
                      />
                      <Link 
                        to="/ferramentas/metodo-vvd" 
                        className="flex items-center gap-2 text-sm text-primary hover:underline"
                      >
                        Como criar seu VVD
                        <ArrowRight className="w-4 h-4" />
                      </Link>
                    </div>

                    {/* Valores */}
                    <div className="space-y-3">
                      <Label>Meus Valores</Label>
                      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-3">
                        {valores.map((valor, index) => (
                          <Input
                            key={index}
                            placeholder={`Valor ${index + 1}`}
                            value={valor}
                            onChange={(e) => updateValor(index, e.target.value)}
                            disabled={!isEditingValores}
                            className="text-sm"
                            spellCheck="true"
                          />
                        ))}
                      </div>
                      <div className="flex items-center justify-between gap-4">
                        <Link 
                          to="/ferramentas/valores" 
                          className="flex items-center gap-2 text-sm text-primary hover:underline"
                        >
                          Descobrir meus valores
                          <ArrowRight className="w-4 h-4" />
                        </Link>
                        
                        <div className="flex gap-2">
                          {!isEditingValores && (
                            <Button onClick={handleEditValores} size="sm" variant="outline">
                              <Edit className="w-4 h-4 mr-2" />
                              Editar
                            </Button>
                          )}
                          <Button 
                            onClick={handleSaveValores} 
                            size="sm" 
                            variant="outline"
                            disabled={!isValoresComplete || !isEditingValores}
                          >
                            Salvar
                          </Button>
                        </div>
                      </div>
                    </div>

                    {/* Áreas da Vida */}
                    <div className="space-y-3">
                      <Label>Áreas da Vida</Label>
                      
                      {/* Gráfico Radar - Roda da Vida */}
                      {areasVida.length > 0 ? (
                        <div className="rounded-lg border p-4 bg-card">
                          <ResponsiveContainer width="100%" height={300}>
                            <RadarChart data={areasVida.map(area => ({
                              area: area.area,
                              atual: Number(area.notaAtual) || 0,
                              desejada: Number(area.notaDesejada) || 0
                            }))}>
                              <PolarGrid stroke="hsl(var(--border))" />
                              <PolarAngleAxis
                                dataKey="area"
                                tick={{ fill: "hsl(var(--foreground))", fontSize: 10 }}
                              />
                              <PolarRadiusAxis
                                angle={90}
                                domain={[0, 10]}
                                tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 10 }}
                              />
                              <Radar
                                name="Nota Atual"
                                dataKey="atual"
                                stroke="hsl(var(--primary))"
                                fill="hsl(var(--primary))"
                                fillOpacity={0.3}
                              />
                              <Radar
                                name="Nota Desejada"
                                dataKey="desejada"
                                stroke="hsl(var(--accent))"
                                fill="hsl(var(--accent))"
                                fillOpacity={0.3}
                              />
                              <Legend />
                            </RadarChart>
                          </ResponsiveContainer>
                        </div>
                      ) : (
                        <div className="rounded-lg border p-6 bg-muted/20 text-center">
                          <p className="text-sm text-muted-foreground">
                            Nenhuma área da vida cadastrada. Acesse a Roda da Vida para configurar.
                          </p>
                        </div>
                      )}

                      <div className="flex items-center justify-start gap-4">
                        <Link 
                          to="/roda-da-vida" 
                          className="flex items-center gap-2 text-sm text-primary hover:underline"
                        >
                          Acessar a Roda da Vida para editar
                          <ArrowRight className="w-4 h-4" />
                        </Link>
                      </div>
                    </div>
                  </div>
                </CollapsibleContent>
              </div>
            </Collapsible>

            {/* Passo 2 - Para onde vou */}
            <Collapsible open={paraOndeOpen} onOpenChange={(open) => handleSectionOpen("para-onde", open)}>
              <div className={`rounded-xl border-2 transition-all duration-300 overflow-hidden w-full box-border ${paraOndeOpen ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50 hover:bg-muted/30'}`}>
                <CollapsibleTrigger asChild>
                  <button className="w-full p-4 flex items-center justify-between text-left group">
                    <div className="flex items-center gap-3 sm:gap-4 flex-1 min-w-0">
                      <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center flex-shrink-0 transition-all duration-300 ${paraOndeOpen ? 'bg-primary text-primary-foreground shadow-lg scale-105' : 'bg-primary/10 text-primary group-hover:bg-primary/20'}`}>
                        <Target className="w-5 h-5 sm:w-6 sm:h-6" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                          <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-primary">Passo 2</span>
                          {paraOndeProgress() === 100 && (
                            <span className="w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-green-500 flex items-center justify-center">
                              <Check className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-white" />
                            </span>
                          )}
                        </div>
                        <h3 className="font-semibold text-sm sm:text-base truncate">Para onde vou</h3>
                        <p className="text-[10px] sm:text-xs text-muted-foreground hidden sm:block">Defina seus objetivos</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
                      <div className="hidden sm:flex items-center gap-2 bg-muted/50 rounded-full px-3 py-1">
                        <div className="w-16 h-1.5 bg-muted rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-primary rounded-full transition-all duration-500" 
                            style={{ width: `${paraOndeProgress()}%` }}
                          />
                        </div>
                        <span className="text-xs font-medium text-muted-foreground">{paraOndeProgress()}%</span>
                      </div>
                      <ChevronDown className={`w-5 h-5 text-muted-foreground transition-transform duration-300 ${paraOndeOpen ? 'rotate-180' : ''}`} />
                    </div>
                  </button>
                </CollapsibleTrigger>
                
                <CollapsibleContent>
                  <div className="px-3 sm:px-4 pb-4 pt-2 space-y-4 border-t border-border/50 overflow-hidden w-full box-border">
                    {/* Overview de OKRs da empresa */}
                    <CompanyOKRsOverview />
                    
                    <div className="space-y-4">
                      <div className="flex items-center gap-2 mb-4">
                        <Target className="w-5 h-5 text-primary" />
                        <h3 className="text-lg font-semibold">Meus Objetivos</h3>
                      </div>

                      {/* Formulário de cadastro */}
                      <div className="space-y-4 p-4 border rounded-lg bg-muted/30">
                        <h4 className="font-medium text-sm">"Quem muito quer, pouco consegue"</h4>
                        <p className="text-xs text-muted-foreground">Sugestão: Tenha um único grande objetivo, quebrado em metas e ações!</p>
                        
                        <div className="space-y-2">
                          <Label htmlFor="objetivo">Objetivo em Foco</Label>
                          <Input
                            id="objetivo"
                            placeholder="Descreva seu objetivo principal"
                            value={objetivo.texto}
                            onChange={(e) => setObjetivo({ ...objetivo, texto: e.target.value })}
                            spellCheck="true"
                          />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="dataAlvo">Data Alvo</Label>
                            <Input
                              id="dataAlvo"
                              type="date"
                              value={objetivo.dataAlvo}
                              onChange={(e) => setObjetivo({ ...objetivo, dataAlvo: e.target.value })}
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="status">Status</Label>
                            <Select
                              value={objetivo.status}
                              onValueChange={(value) => setObjetivo({ ...objetivo, status: value })}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Selecione o status" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="a-iniciar">A iniciar</SelectItem>
                                <SelectItem value="em-andamento">Em andamento</SelectItem>
                                <SelectItem value="concluido">Concluído</SelectItem>
                                <SelectItem value="pendente">Pendente</SelectItem>
                                <SelectItem value="pausado">Pausado</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="conexaoVvd">Conexão com o VVD</Label>
                          <Textarea
                            id="conexaoVvd"
                            placeholder="Como este objetivo se conecta com sua visão de vida?"
                            value={objetivo.conexaoVvd}
                            onChange={(e) => setObjetivo({ ...objetivo, conexaoVvd: e.target.value })}
                            rows={3}
                            spellCheck="true"
                          />
                        </div>

                        <Button onClick={handleSaveObjetivo} className="w-full">
                          <Plus className="w-4 h-4 mr-2" />
                          Cadastrar Objetivo
                        </Button>
                      </div>

                      {/* Lista de objetivos cadastrados */}
                      {isLoading ? (
                        <div className="py-6">
                          <PDILoader 
                            text="Carregando seus objetivos..." 
                            size="md" 
                            variant="target" 
                          />
                        </div>
                      ) : objetivos.length > 0 ? (
                        <div className="space-y-3 max-w-full overflow-hidden">
                          <h4 className="font-medium text-sm">Objetivos Cadastrados</h4>
                          <div className="rounded-lg border overflow-x-auto max-w-full">
                            <Table>
                              <TableHeader>
                                <TableRow>
                                  <TableHead className="text-xs sm:text-sm">Objetivo</TableHead>
                                  <TableHead className="text-xs sm:text-sm">Data Alvo</TableHead>
                                  <TableHead className="text-xs sm:text-sm">Status</TableHead>
                                  <TableHead className="text-xs sm:text-sm">Conexão VVD</TableHead>
                                  <TableHead className="text-xs sm:text-sm text-right">Ações</TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                {objetivos.map((obj) => (
                                  <TableRow key={obj.id}>
                                    <TableCell className="text-xs sm:text-sm">
                                      {editandoObjetivoId === obj.id ? (
                                        <Input
                                          value={objetivoEditado?.texto || ""}
                                          onChange={(e) =>
                                            setObjetivoEditado({ ...objetivoEditado!, texto: e.target.value })
                                          }
                                          className="text-xs sm:text-sm"
                                        />
                                      ) : (
                                        <div>
                                          <div>{obj.texto}</div>
                                          <OKRLinkSection 
                                            objetivoId={obj.id.toString()} 
                                            objetivoTexto={obj.texto}
                                          />
                                        </div>
                                      )}
                                    </TableCell>
                                    <TableCell className="text-xs sm:text-sm">
                                      {editandoObjetivoId === obj.id ? (
                                        <Input
                                          type="date"
                                          value={objetivoEditado?.dataAlvo || ""}
                                          onChange={(e) =>
                                            setObjetivoEditado({ ...objetivoEditado!, dataAlvo: e.target.value })
                                          }
                                          className="text-xs sm:text-sm"
                                        />
                                      ) : (
                                        new Date(obj.dataAlvo).toLocaleDateString("pt-BR")
                                      )}
                                    </TableCell>
                                    <TableCell className="text-xs sm:text-sm">
                                      {editandoObjetivoId === obj.id ? (
                                        <Select
                                          value={objetivoEditado?.status || "em-andamento"}
                                          onValueChange={(value) =>
                                            setObjetivoEditado({ ...objetivoEditado!, status: value })
                                          }
                                        >
                                          <SelectTrigger className="text-xs sm:text-sm">
                                            <SelectValue />
                                          </SelectTrigger>
                                          <SelectContent>
                                            <SelectItem value="a-iniciar">A iniciar</SelectItem>
                                            <SelectItem value="em-andamento">Em andamento</SelectItem>
                                            <SelectItem value="concluido">Concluído</SelectItem>
                                            <SelectItem value="pendente">Pendente</SelectItem>
                                            <SelectItem value="pausado">Pausado</SelectItem>
                                          </SelectContent>
                                        </Select>
                                      ) : (
                                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                                          obj.status === "concluido" ? "bg-success/15 text-success" :
                                          obj.status === "em-andamento" ? "bg-primary/15 text-primary" :
                                          obj.status === "pausado" ? "bg-warning/15 text-warning" :
                                          obj.status === "a-iniciar" ? "bg-secondary/20 text-secondary" :
                                          "bg-muted text-muted-foreground"
                                        }`}>
                                          {obj.status === "em-andamento" ? "Em andamento" :
                                           obj.status === "concluido" ? "Concluído" :
                                           obj.status === "pausado" ? "Pausado" :
                                           obj.status === "a-iniciar" ? "A iniciar" : "Pendente"}
                                        </span>
                                      )}
                                    </TableCell>
                                    <TableCell className="text-xs sm:text-sm">
                                      {editandoObjetivoId === obj.id ? (
                                        <Textarea
                                          value={objetivoEditado?.conexaoVvd || ""}
                                          onChange={(e) =>
                                            setObjetivoEditado({ ...objetivoEditado!, conexaoVvd: e.target.value })
                                          }
                                          rows={2}
                                          className="text-xs sm:text-sm"
                                        />
                                      ) : obj.conexaoVvd ? (
                                        <TooltipProvider>
                                          <Tooltip>
                                            <TooltipTrigger asChild>
                                              <span className="line-clamp-2 cursor-help max-w-[180px] block">
                                                {obj.conexaoVvd}
                                              </span>
                                            </TooltipTrigger>
                                            <TooltipContent side="top" className="max-w-xs">
                                              <p className="text-sm whitespace-pre-wrap">{obj.conexaoVvd}</p>
                                            </TooltipContent>
                                          </Tooltip>
                                        </TooltipProvider>
                                      ) : (
                                        <span className="text-muted-foreground italic">-</span>
                                      )}
                                    </TableCell>
                                    <TableCell className="text-right">
                                      <div className="flex items-center justify-end gap-1 sm:gap-2">
                                        {editandoObjetivoId === obj.id ? (
                                          <>
                                            <Button
                                              variant="ghost"
                                              size="sm"
                                              onClick={() => handleSaveEditObjetivo(obj.id)}
                                            >
                                              <Check className="w-4 h-4 text-green-600" />
                                            </Button>
                                            <Button
                                              variant="ghost"
                                              size="sm"
                                              onClick={handleCancelEditObjetivo}
                                            >
                                              <X className="w-4 h-4 text-red-600" />
                                            </Button>
                                          </>
                                        ) : (
                                          <>
                                            <Button
                                              variant="ghost"
                                              size="sm"
                                              onClick={() => handleStartEditObjetivo(obj)}
                                            >
                                              <Pencil className="w-4 h-4" />
                                            </Button>
                                            <Button
                                              variant="ghost"
                                              size="sm"
                                              onClick={() => handleRemoveObjetivo(obj.id)}
                                            >
                                              <Trash2 className="w-4 h-4 text-red-600" />
                                            </Button>
                                          </>
                                        )}
                                      </div>
                                    </TableCell>
                                  </TableRow>
                                ))}
                              </TableBody>
                            </Table>
                          </div>
                        </div>
                      ) : null}
                    </div>
                  </div>
                </CollapsibleContent>
              </div>
            </Collapsible>

            {/* Passo 3 - Como chegar lá */}
            <Collapsible open={comoChegarOpen} onOpenChange={(open) => handleSectionOpen("como-chegar", open)}>
              <div className={`rounded-xl border-2 transition-all duration-300 overflow-hidden w-full box-border ${comoChegarOpen ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50 hover:bg-muted/30'}`}>
                <CollapsibleTrigger asChild>
                  <button className="w-full p-4 flex items-center justify-between text-left group">
                    <div className="flex items-center gap-3 sm:gap-4 flex-1 min-w-0">
                      <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center flex-shrink-0 transition-all duration-300 ${comoChegarOpen ? 'bg-primary text-primary-foreground shadow-lg scale-105' : 'bg-primary/10 text-primary group-hover:bg-primary/20'}`}>
                        <Lightbulb className="w-5 h-5 sm:w-6 sm:h-6" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                          <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-primary">Passo 3</span>
                          {comoChecarProgress() === 100 && (
                            <span className="w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-green-500 flex items-center justify-center">
                              <Check className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-white" />
                            </span>
                          )}
                        </div>
                        <h3 className="font-semibold text-sm sm:text-base truncate">Como chegar lá</h3>
                        <p className="text-[10px] sm:text-xs text-muted-foreground hidden sm:block">Habilidades e desenvolvimento</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
                      <div className="hidden sm:flex items-center gap-2 bg-muted/50 rounded-full px-3 py-1">
                        <div className="w-16 h-1.5 bg-muted rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-primary rounded-full transition-all duration-500" 
                            style={{ width: `${comoChecarProgress()}%` }}
                          />
                        </div>
                        <span className="text-xs font-medium text-muted-foreground">{comoChecarProgress()}%</span>
                      </div>
                      <ChevronDown className={`w-5 h-5 text-muted-foreground transition-transform duration-300 ${comoChegarOpen ? 'rotate-180' : ''}`} />
                    </div>
                  </button>
                </CollapsibleTrigger>
                
                <CollapsibleContent>
                  <div className="px-3 sm:px-4 pb-4 pt-2 space-y-4 border-t border-border/50 overflow-hidden w-full box-border">
                    <div className="space-y-4 w-full overflow-hidden">
                      <div className="flex items-center gap-2 mb-4">
                        <Lightbulb className="w-5 h-5 text-primary" />
                        <h3 className="text-lg font-semibold">Desenvolvimento</h3>
                      </div>

                      <div className="space-y-3">
                        <Label>Habilidades a Desenvolver</Label>

                        <div className="flex gap-2 p-3 sm:p-4 bg-muted/30 rounded-lg min-w-0 max-w-full overflow-hidden">
                          <Input
                            placeholder="Digite uma habilidade"
                            value={novaHabilidade}
                            onChange={(e) => setNovaHabilidade(e.target.value)}
                            spellCheck="true"
                            className="min-w-0"
                            onKeyPress={(e) => {
                              if (e.key === 'Enter') {
                                handleAddHabilidade();
                              }
                            }}
                          />
                        </div>

                        <Button 
                          type="button" 
                          variant="outline" 
                          size="sm"
                          onClick={handleAddHabilidade}
                          className="mt-2"
                        >
                          <Plus className="w-4 h-4 mr-2" />
                          Adicionar Habilidade
                        </Button>

                        {habilidades.length > 0 && (
                          <div className="rounded-lg border overflow-x-auto">
                            <Table>
                              <TableHeader>
                                <TableRow>
                                  <TableHead className="text-xs sm:text-sm">Habilidade</TableHead>
                                  <TableHead className="w-[80px] sm:w-[100px] text-xs sm:text-sm">Ações</TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                {habilidades.map((habilidade) => {
                                  const isEditing = editandoHabilidadeId === habilidade.id;
                                  
                                  return (
                                    <TableRow key={habilidade.id}>
                                      <TableCell>
                                        {isEditing ? (
                                          <Input
                                            value={habilidadeEditada}
                                            onChange={(e) => setHabilidadeEditada(e.target.value)}
                                            spellCheck="true"
                                          />
                                        ) : (
                                          habilidade.texto
                                        )}
                                      </TableCell>
                                      <TableCell>
                                        <div className="flex gap-1">
                                          {isEditing ? (
                                            <>
                                              <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => handleSaveEditHabilidade(habilidade.id)}
                                              >
                                                <Check className="w-4 h-4 text-green-600" />
                                              </Button>
                                              <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={handleCancelEditHabilidade}
                                              >
                                                <X className="w-4 h-4 text-destructive" />
                                              </Button>
                                            </>
                                          ) : (
                                            <>
                                              <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => handleStartEditHabilidade(habilidade)}
                                              >
                                                <Pencil className="w-4 h-4" />
                                              </Button>
                                              <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => handleRemoveHabilidade(habilidade.id)}
                                              >
                                                <Trash2 className="w-4 h-4 text-destructive" />
                                              </Button>
                                            </>
                                          )}
                                        </div>
                                      </TableCell>
                                    </TableRow>
                                  );
                                })}
                              </TableBody>
                            </Table>
                          </div>
                        )}

                        <Link 
                          to="/ferramentas" 
                          className="flex items-center gap-2 text-sm text-primary hover:underline mt-2"
                        >
                          Ferramenta de Habilidades (FF)
                          <ExternalLink className="w-4 h-4" />
                        </Link>
                      </div>
                    </div>

                    {/* Mão na Massa - dentro de Como chegar lá */}
                    <div className="pt-4 border-t border-border/50 max-w-full overflow-hidden w-full box-border">
                      <MaoNaMassa embedded />
                    </div>
                  </div>
                </CollapsibleContent>
              </div>
            </Collapsible>
          </div>

          {/* Insight Card - Sempre visível */}
          <div className="rounded-xl border-2 border-primary/30 bg-gradient-to-br from-primary/5 to-primary/10 p-4 sm:p-6 mt-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center shadow-lg">
                <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-primary-foreground" />
              </div>
              <div>
                <h3 className="text-lg font-semibold">Insight Personalizado</h3>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  Análise baseada no seu Plano de Vida
                </p>
              </div>
            </div>
            
            {!isAdmin && !canGenerateInsight && !aiUsage.hasAvailablePurchase && (
              <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded-lg p-3 mb-4">
                <p className="text-xs sm:text-sm text-amber-900 dark:text-amber-200">
                  <strong>Limite mensal atingido.</strong> Você poderá gerar um novo insight em {getNextInsightDate()}, ou{' '}
                  <button 
                    onClick={() => setShowAILimitModal(true)}
                    className="underline font-semibold hover:text-amber-700 dark:hover:text-amber-300"
                  >
                    compre um insight avulso por R$ 10,00
                  </button>.
                </p>
              </div>
            )}
            
            {!isAdmin && aiUsage.hasAvailablePurchase && (
              <div className="bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 rounded-lg p-3 mb-4">
                <p className="text-xs sm:text-sm text-green-900 dark:text-green-200">
                  <strong>Você tem 1 insight disponível!</strong> Clique no botão abaixo para gerar seu insight personalizado.
                </p>
              </div>
            )}
            
            {isAdmin && (
              <div className="bg-primary/10 border border-primary/20 rounded-lg p-3 mb-4">
                <p className="text-xs sm:text-sm text-primary">
                  <strong>Acesso Admin:</strong> Você tem insights ilimitados como administrador.
                </p>
              </div>
            )}
            
            {insight ? (
              <div className="space-y-4">
                <div className="bg-card rounded-lg p-4 border shadow-sm">
                  <div className="prose prose-sm max-w-none whitespace-pre-line text-sm">
                    {insight}
                  </div>
                </div>
                <Button 
                  onClick={() => handleGenerateInsight()} 
                  size="sm" 
                  variant="outline"
                  disabled={isGeneratingInsight}
                  className="w-full sm:w-auto"
                >
                  {isGeneratingInsight ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Gerando novo insight...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 mr-2" />
                      Gerar novo insight
                    </>
                  )}
                </Button>
              </div>
            ) : (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="inline-block w-full">
                      <Button 
                        onClick={() => handleGenerateInsight()} 
                        disabled={isGeneratingInsight || (!vvd && !isValoresComplete && !isAreasComplete)}
                        className="w-full"
                        size="lg"
                      >
                        {isGeneratingInsight ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Gerando insight...
                          </>
                        ) : (
                          <>
                            <Sparkles className="w-4 h-4 mr-2" />
                            Gerar Insight
                          </>
                        )}
                      </Button>
                    </div>
                  </TooltipTrigger>
                  {(!vvd || !isValoresComplete || !isAreasComplete || objetivos.length === 0) && (
                    <TooltipContent>
                      <p className="text-sm">
                        Para gerar insights, preencha:<br />
                        VVD, Valores, Roda da Vida,<br />
                        ao menos 1 objetivo, 1 meta e 1 ação
                      </p>
                    </TooltipContent>
                  )}
                  {!isAdmin && !canGenerateInsight && (vvd || isValoresComplete || isAreasComplete) && (
                    <TooltipContent>
                      <p className="text-sm">
                        Limite mensal atingido.<br />
                        Próxima geração disponível em {getNextInsightDate()}
                      </p>
                    </TooltipContent>
                  )}
                </Tooltip>
              </TooltipProvider>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Modal para perguntar se quer cadastrar meta */}
      <Dialog open={showMetaModal} onOpenChange={setShowMetaModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Objetivo cadastrado com sucesso!</DialogTitle>
            <DialogDescription>
              Deseja cadastrar uma meta agora para este objetivo?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex gap-2 sm:gap-0">
            <Button variant="outline" onClick={handleMetaModalCancel}>
              Não, depois
            </Button>
            <Button onClick={handleMetaModalConfirm}>
              Sim, cadastrar meta
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialogs de Confirmação de Exclusão */}
      <ConfirmDeleteDialog
        open={deleteObjetivoId !== null}
        onOpenChange={() => setDeleteObjetivoId(null)}
        onConfirm={confirmRemoveObjetivo}
        title="Excluir Objetivo"
        description="Tem certeza que deseja excluir este objetivo? Esta ação não pode ser desfeita."
      />

      <ConfirmDeleteDialog
        open={deleteHabilidadeId !== null}
        onOpenChange={() => setDeleteHabilidadeId(null)}
        onConfirm={confirmRemoveHabilidade}
        title="Excluir Habilidade"
        description="Tem certeza que deseja excluir esta habilidade?"
      />

      <AIUsageLimitModal
        isOpen={showAILimitModal}
        onClose={() => setShowAILimitModal(false)}
        onPurchase={handlePurchaseAI}
        isLoading={aiUsage.isLoading}
        featureType="insight"
        featureName="Insights Personalizados"
      />
    </>
  );
};

export default PlanoDeVida;
