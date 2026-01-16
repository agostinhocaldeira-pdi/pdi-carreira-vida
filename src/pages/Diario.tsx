import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Book, Smile, Frown, Meh, Loader2, MousePointerClick, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import LogoutButton from "@/components/LogoutButton";
import { useRoleProtection } from "@/hooks/useRoleProtection";
import { usePDIStorage } from "@/hooks/usePDIStorage";
import DiaryScientificModal from "@/components/DiaryScientificModal";
import { useActionCelebration } from "@/contexts/ActionCelebrationContext";

const Diario = () => {
  useRoleProtection({ allowedRoles: ["user", "gestor"] });
  const { saveDiarioEntry, getDiarioByDate } = usePDIStorage();
  const { celebrateAction } = useActionCelebration();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isScientificModalOpen, setIsScientificModalOpen] = useState(false);
  
  const today = new Date().toISOString().split("T")[0];
  
  const [entrada, setEntrada] = useState({
    humor: "",
    reflexoes: "",
    avancos: "",
    habitos: "",
    gratidao: "",
    data: today,
  });

  // Load existing entry for today
  useEffect(() => {
    const loadTodayEntry = async () => {
      setIsLoading(true);
      try {
        const existingEntry = await getDiarioByDate(today);
        if (existingEntry) {
          setEntrada({
            humor: existingEntry.humor || "",
            reflexoes: existingEntry.reflexao || "",
            avancos: existingEntry.conquistas || "",
            habitos: Array.isArray(existingEntry.habitos) ? existingEntry.habitos.join(", ") : existingEntry.habitos || "",
            gratidao: existingEntry.gratidao || "",
            data: today,
          });
        }
      } catch (error) {
        console.error("Error loading diary entry:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadTodayEntry();
  }, [getDiarioByDate, today]);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const diarioEntry = {
        id: `${today}-${Date.now()}`,
        data: today,
        humor: entrada.humor,
        reflexao: entrada.reflexoes,
        conquistas: entrada.avancos,
        habitos: entrada.habitos.split(",").map(h => h.trim()).filter(h => h),
        gratidao: entrada.gratidao,
      };
      
      // Save via usePDIStorage (Supabase or localStorage)
      await saveDiarioEntry(diarioEntry);
      
      // Backup to localStorage
      const entradas = JSON.parse(localStorage.getItem("diario") || "[]");
      const existingIndex = entradas.findIndex((e: any) => e.data === today);
      if (existingIndex >= 0) {
        entradas[existingIndex] = { ...diarioEntry, id: entradas[existingIndex].id };
      } else {
        entradas.push(diarioEntry);
      }
      localStorage.setItem("diario", JSON.stringify(entradas));
      
      celebrateAction('diary', 'Registro no Diário');
      toast.success("Entrada do diário salva!");
    } catch (error) {
      console.error("Error saving diary:", error);
      toast.error("Erro ao salvar entrada do diário");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-subtle flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <header className="bg-primary border-b border-primary/80 shadow-elegant">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <Book className="w-6 h-6 text-primary-foreground" />
              <h1 className="text-2xl font-bold text-primary-foreground">Meu Diário</h1>
            </div>
            <LogoutButton />
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <Card className="max-w-3xl mx-auto shadow-large">
          <CardHeader>
            <CardTitle>Registro do Dia</CardTitle>
            <CardDescription className="space-y-2">
              <span className="block">
                Data: {new Date().toLocaleDateString("pt-BR", { 
                  weekday: "long", 
                  year: "numeric", 
                  month: "long", 
                  day: "numeric" 
                })}
              </span>
              <button
                onClick={() => setIsScientificModalOpen(true)}
                className="inline-flex items-center gap-2 text-primary hover:text-primary/80 font-medium text-sm transition-colors underline underline-offset-4"
              >
                <MousePointerClick className="h-5 w-5 sm:h-4 sm:w-4 flex-shrink-0" />
                Clique aqui: Conheça o embasamento científico do Diário
              </button>
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Humor */}
            <div className="space-y-3">
              <Label>Como você está se sentindo hoje?</Label>
              <RadioGroup value={entrada.humor} onValueChange={(value) => setEntrada({ ...entrada, humor: value })}>
                <div className="flex gap-4">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="feliz" id="feliz" />
                    <Label htmlFor="feliz" className="flex items-center gap-2 cursor-pointer">
                      <Smile className="w-5 h-5 text-primary" />
                      Feliz
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="neutro" id="neutro" />
                    <Label htmlFor="neutro" className="flex items-center gap-2 cursor-pointer">
                      <Meh className="w-5 h-5 text-muted-foreground" />
                      Neutro
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="triste" id="triste" />
                    <Label htmlFor="triste" className="flex items-center gap-2 cursor-pointer">
                      <Frown className="w-5 h-5 text-destructive" />
                      Triste
                    </Label>
                  </div>
                </div>
              </RadioGroup>
            </div>

            {/* Reflexões */}
            <div className="space-y-2">
              <Label htmlFor="reflexoes">Reflexões do Dia</Label>
              <Textarea
                id="reflexoes"
                placeholder="O que você aprendeu ou percebeu hoje?"
                value={entrada.reflexoes}
                onChange={(e) => setEntrada({ ...entrada, reflexoes: e.target.value })}
                rows={4}
              />
            </div>

            {/* Avanços */}
            <div className="space-y-2">
              <Label htmlFor="avancos">Avanços e Conquistas</Label>
              <Textarea
                id="avancos"
                placeholder="Quais foram seus avanços em relação ao seu PDI?"
                value={entrada.avancos}
                onChange={(e) => setEntrada({ ...entrada, avancos: e.target.value })}
                rows={3}
              />
            </div>

            {/* Hábitos */}
            <div className="space-y-2">
              <Label htmlFor="habitos">Hábitos Realizados</Label>
              <Textarea
                id="habitos"
                placeholder="Quais hábitos você praticou hoje?"
                value={entrada.habitos}
                onChange={(e) => setEntrada({ ...entrada, habitos: e.target.value })}
                rows={3}
              />
            </div>

            {/* Gratidão */}
            <div className="space-y-2">
              <Label htmlFor="gratidao">Gratidão</Label>
              <Textarea
                id="gratidao"
                placeholder="Pelo que você é grato hoje?"
                value={entrada.gratidao}
                onChange={(e) => setEntrada({ ...entrada, gratidao: e.target.value })}
                rows={3}
              />
            </div>

            <Button onClick={handleSave} variant="cta" className="w-full" size="lg" disabled={isSaving}>
              {isSaving ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Salvando...
                </>
              ) : (
                "Salvar Entrada"
              )}
            </Button>
          </CardContent>
        </Card>
      </main>

      <DiaryScientificModal 
        open={isScientificModalOpen} 
        onOpenChange={setIsScientificModalOpen} 
      />
    </div>
  );
};

export default Diario;
