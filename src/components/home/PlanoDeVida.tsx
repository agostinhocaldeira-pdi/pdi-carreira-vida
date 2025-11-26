import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Compass, Heart, Target, Lightbulb } from "lucide-react";
import { toast } from "sonner";

const PlanoDeVida = () => {
  const [vvd, setVvd] = useState("");
  const [valores, setValores] = useState("");
  const [objetivo, setObjetivo] = useState({
    texto: "",
    dataAlvo: "",
    conexaoVvd: "",
  });

  const handleSaveVvd = () => {
    localStorage.setItem("vvd", vvd);
    toast.success("Visão de Vida Desejada salva!");
  };

  const handleSaveObjetivo = () => {
    const objetivos = JSON.parse(localStorage.getItem("objetivos") || "[]");
    objetivos.push(objetivo);
    localStorage.setItem("objetivos", JSON.stringify(objetivos));
    toast.success("Objetivo cadastrado!");
    setObjetivo({ texto: "", dataAlvo: "", conexaoVvd: "" });
  };

  return (
    <Card className="shadow-medium">
      <CardHeader>
        <CardTitle className="text-2xl flex items-center gap-2">
          <Compass className="w-6 h-6 text-primary" />
          Plano de Vida
        </CardTitle>
        <CardDescription>Construa sua visão e defina seus objetivos</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="quem-sou" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="quem-sou">Quem sou Eu</TabsTrigger>
            <TabsTrigger value="para-onde">Para onde vou</TabsTrigger>
            <TabsTrigger value="como-chegar">Como chegar lá</TabsTrigger>
          </TabsList>

          {/* Quem sou Eu */}
          <TabsContent value="quem-sou" className="space-y-6 mt-6">
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <Heart className="w-5 h-5 text-primary" />
                <h3 className="text-lg font-semibold">Minha Essência</h3>
              </div>

              {/* VVD */}
              <div className="space-y-2">
                <Label htmlFor="vvd">Minha Visão de Vida Desejada</Label>
                <Textarea
                  id="vvd"
                  placeholder="Descreva como você imagina sua vida ideal em todos os aspectos..."
                  value={vvd}
                  onChange={(e) => setVvd(e.target.value)}
                  rows={4}
                />
                <Button onClick={handleSaveVvd} size="sm" variant="outline">
                  Cadastrar VVD
                </Button>
              </div>

              {/* Valores */}
              <div className="space-y-2">
                <Label htmlFor="valores">Meus Valores</Label>
                <Textarea
                  id="valores"
                  placeholder="Liste seus principais valores (ex: família, honestidade, crescimento...)"
                  value={valores}
                  onChange={(e) => setValores(e.target.value)}
                  rows={3}
                />
              </div>

              {/* Áreas da Vida */}
              <div className="space-y-3">
                <Label>Áreas da Vida</Label>
                <div className="rounded-lg border">
                  <table className="w-full">
                    <thead className="bg-muted/50">
                      <tr>
                        <th className="p-3 text-left text-sm font-medium">Área</th>
                        <th className="p-3 text-left text-sm font-medium">Nota Atual</th>
                        <th className="p-3 text-left text-sm font-medium">Nota Desejada</th>
                      </tr>
                    </thead>
                    <tbody>
                      {["Carreira", "Saúde", "Relacionamentos", "Finanças", "Lazer"].map((area) => (
                        <tr key={area} className="border-t">
                          <td className="p-3 text-sm">{area}</td>
                          <td className="p-3">
                            <Input type="number" min="0" max="10" className="w-20" placeholder="0-10" />
                          </td>
                          <td className="p-3">
                            <Input type="number" min="0" max="10" className="w-20" placeholder="0-10" />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Para onde vou */}
          <TabsContent value="para-onde" className="space-y-6 mt-6">
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <Target className="w-5 h-5 text-primary" />
                <h3 className="text-lg font-semibold">Meus Objetivos</h3>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="objetivo">Objetivo em Foco</Label>
                  <Input
                    id="objetivo"
                    placeholder="Descreva seu objetivo principal"
                    value={objetivo.texto}
                    onChange={(e) => setObjetivo({ ...objetivo, texto: e.target.value })}
                  />
                </div>

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
                  <Label htmlFor="conexaoVvd">Conexão com o VVD</Label>
                  <Textarea
                    id="conexaoVvd"
                    placeholder="Como este objetivo se conecta com sua visão de vida?"
                    value={objetivo.conexaoVvd}
                    onChange={(e) => setObjetivo({ ...objetivo, conexaoVvd: e.target.value })}
                    rows={3}
                  />
                </div>

                <Button onClick={handleSaveObjetivo} className="w-full">
                  Cadastrar Objetivo
                </Button>
              </div>
            </div>
          </TabsContent>

          {/* Como chegar lá */}
          <TabsContent value="como-chegar" className="space-y-6 mt-6">
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <Lightbulb className="w-5 h-5 text-primary" />
                <h3 className="text-lg font-semibold">Desenvolvimento</h3>
              </div>

              <div className="space-y-2">
                <Label>Habilidades a Desenvolver</Label>
                <Textarea
                  placeholder="Liste as habilidades que você precisa desenvolver..."
                  rows={4}
                />
              </div>

              <Button variant="outline" className="w-full">
                Criar Análise FF (Forças e Fraquezas)
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default PlanoDeVida;
