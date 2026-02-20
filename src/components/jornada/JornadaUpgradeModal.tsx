import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Sparkles, Star, Target, CreditCard, Loader2, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: string;
  description?: string;
}

export default function JornadaUpgradeModal({
  open,
  onOpenChange,
  title = "Recurso exclusivo",
  description = "Para usar este recurso, escolha uma das opções abaixo:",
}: Props) {
  const [loading, setLoading] = useState<string | null>(null);

  const handleCheckout = async (type: "basico" | "pdismart" | "avulso") => {
    setLoading(type);
    try {
      if (type === "basico") {
        const { data, error } = await supabase.functions.invoke("create-checkout", {
          body: { price_id: "price_1Sjo293aJLvyiewRDW1gCi39" },
        });
        if (error) throw error;
        if (data?.url) window.location.href = data.url;
      } else if (type === "pdismart") {
        const { data, error } = await supabase.functions.invoke("create-checkout", {
          body: { price_id: "price_1T2X7v3aJLvyiewRo5lRInWO", mode: "payment" },
        });
        if (error) throw error;
        if (data?.url) window.location.href = data.url;
      } else {
        const { data, error } = await supabase.functions.invoke("create-ai-purchase", {
          body: { featureType: "smart", returnPath: "/jornada" },
        });
        if (error) throw error;
        if (data?.url) window.location.href = data.url;
      }
    } catch (err) {
      console.error("Checkout error:", err);
      toast.error("Erro ao iniciar pagamento. Tente novamente.");
    } finally {
      setLoading(null);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-indigo-100 to-purple-100">
            <Sparkles className="h-7 w-7 text-indigo-600" />
          </div>
          <DialogTitle className="text-center text-lg">{title}</DialogTitle>
          <DialogDescription className="text-center pt-1">
            {description}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3 pt-2">
          {/* Option 1: PDI Básico */}
          <button
            onClick={() => handleCheckout("basico")}
            disabled={!!loading}
            className="w-full rounded-xl border-2 border-blue-200 bg-blue-50/50 p-4 text-left hover:border-blue-400 transition-colors disabled:opacity-50"
          >
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center shrink-0">
                <Star className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-slate-800 text-sm">PDI Acesso Completo</span>
                  <span className="text-blue-600 font-bold text-sm">R$ 67<span className="text-xs font-normal">/ano</span></span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  Todas as ferramentas, IA, relatórios, diário e progresso.
                </p>
              </div>
              {loading === "basico" && <Loader2 className="w-4 h-4 animate-spin text-blue-500 mt-1" />}
            </div>
          </button>

          {/* Option 2: PDI Smart */}
          <button
            onClick={() => handleCheckout("pdismart")}
            disabled={!!loading}
            className="w-full rounded-xl border-2 border-emerald-200 bg-emerald-50/50 p-4 text-left hover:border-emerald-400 transition-colors disabled:opacity-50"
          >
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-emerald-500 rounded-lg flex items-center justify-center shrink-0">
                <Target className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-slate-800 text-sm">PDI Smart</span>
                  <span className="text-emerald-600 font-bold text-sm">R$ 47</span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  Acesso completo à Jornada com IA e PDF ilimitados.
                </p>
              </div>
              {loading === "pdismart" && <Loader2 className="w-4 h-4 animate-spin text-emerald-500 mt-1" />}
            </div>
          </button>

          {/* Option 3: Avulso */}
          <button
            onClick={() => handleCheckout("avulso")}
            disabled={!!loading}
            className="w-full rounded-xl border-2 border-slate-200 bg-slate-50/50 p-4 text-left hover:border-slate-400 transition-colors disabled:opacity-50"
          >
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-slate-500 rounded-lg flex items-center justify-center shrink-0">
                <CreditCard className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-slate-800 text-sm">Uso Avulso</span>
                  <span className="text-slate-600 font-bold text-sm">R$ 10</span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  Pagamento único para uso imediato desta funcionalidade.
                </p>
              </div>
              {loading === "avulso" && <Loader2 className="w-4 h-4 animate-spin text-slate-500 mt-1" />}
            </div>
          </button>
        </div>

        <Button variant="ghost" onClick={() => onOpenChange(false)} className="w-full mt-1 text-slate-400">
          <X className="w-4 h-4 mr-1" /> Cancelar
        </Button>
      </DialogContent>
    </Dialog>
  );
}
