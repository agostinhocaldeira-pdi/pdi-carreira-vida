import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Rocket } from "lucide-react";
import { toast } from "sonner";

const MaoNaMassa = () => {
  const [meta, setMeta] = useState({
    texto: "",
    dataAlvo: "",
    medicao: "",
    acoes: "",
    inicio: "",
    periodicidade: "",
    passos: "",
  });

  const handleSaveMeta = () => {
    if (!meta.texto || !meta.dataAlvo) {
      toast.error("Preencha pelo menos a meta e a data alvo");
      return;
    }

    const metas = JSON.parse(localStorage.getItem("metas") || "[]");
    metas.push({ ...meta, id: Date.now(), concluida: false });
    localStorage.setItem("metas", JSON.stringify(metas));
    toast.success("Meta cadastrada com sucesso!");
    
    // Reset form
    setMeta({
      texto: "",
      dataAlvo: "",
      medicao: "",
      acoes: "",
      inicio: "",
      periodicidade: "",
      passos: "",
    });
  };

  return (
    <Card className="shadow-medium">
      <CardHeader>
        <CardTitle className="text-2xl flex items-center gap-2">
          <Rocket className="w-6 h-6 text-accent" />
          Mão na Massa
        </CardTitle>
        <CardDescription>Transforme seus objetivos em metas executáveis</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <h3 className="text-lg font-semibold">Minhas Metas</h3>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="meta">Meta</Label>
              <Input
                id="meta"
                placeholder="Ex: Conquistar promoção para cargo de liderança"
                value={meta.texto}
                onChange={(e) => setMeta({ ...meta, texto: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="dataAlvo">Data Alvo</Label>
                <Input
                  id="dataAlvo"
                  type="date"
                  value={meta.dataAlvo}
                  onChange={(e) => setMeta({ ...meta, dataAlvo: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="inicio">Quando Começo</Label>
                <Input
                  id="inicio"
                  type="date"
                  value={meta.inicio}
                  onChange={(e) => setMeta({ ...meta, inicio: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="medicao">Como vou medir</Label>
              <Input
                id="medicao"
                placeholder="Ex: Receber feedback positivo do gestor, assumir projeto importante"
                value={meta.medicao}
                onChange={(e) => setMeta({ ...meta, medicao: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="periodicidade">Periodicidade</Label>
              <Select
                value={meta.periodicidade}
                onValueChange={(value) => setMeta({ ...meta, periodicidade: value })}
              >
                <SelectTrigger id="periodicidade">
                  <SelectValue placeholder="Selecione a frequência" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="diariamente">Diariamente</SelectItem>
                  <SelectItem value="semanalmente">Semanalmente</SelectItem>
                  <SelectItem value="mensalmente">Mensalmente</SelectItem>
                  <SelectItem value="trimestral">Trimestral</SelectItem>
                  <SelectItem value="semestral">Semestral</SelectItem>
                  <SelectItem value="anual">Anual</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="acoes">Ações</Label>
              <Textarea
                id="acoes"
                placeholder="Liste as ações necessárias para alcançar esta meta"
                value={meta.acoes}
                onChange={(e) => setMeta({ ...meta, acoes: e.target.value })}
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="passos">Meus Passos</Label>
              <Textarea
                id="passos"
                placeholder="Descreva o passo a passo detalhado"
                value={meta.passos}
                onChange={(e) => setMeta({ ...meta, passos: e.target.value })}
                rows={4}
              />
            </div>

            <Button onClick={handleSaveMeta} className="w-full" size="lg">
              Cadastrar Meta
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MaoNaMassa;
