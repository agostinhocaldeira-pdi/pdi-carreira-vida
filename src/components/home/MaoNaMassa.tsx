import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Rocket, Plus, Trash2, Pencil, Check, X } from "lucide-react";
import { toast } from "sonner";

const MaoNaMassa = () => {
  const [objetivoSelecionado, setObjetivoSelecionado] = useState("");
  const [objetivosDisponiveis, setObjetivosDisponiveis] = useState<Array<{
    id: number;
    texto: string;
  }>>([]);

  const [meta, setMeta] = useState({
    objetivoId: "",
    texto: "",
    dataAlvo: "",
    medicao: "",
    inicio: "",
    periodicidade: "",
    passos: "",
  });

  const [acoes, setAcoes] = useState<Array<{
    id: number;
    acao: string;
    periodicidade: string;
    status: string;
  }>>([]);

  const [novaAcao, setNovaAcao] = useState({
    acao: "",
    periodicidade: "",
    status: "a-fazer",
  });

  const [editandoId, setEditandoId] = useState<number | null>(null);
  const [acaoEditada, setAcaoEditada] = useState<{
    acao: string;
    periodicidade: string;
    status: string;
  } | null>(null);

  const [passos, setPassos] = useState<Array<{
    id: number;
    passo: string;
  }>>([]);

  const [novoPasso, setNovoPasso] = useState("");
  const [editandoPassoId, setEditandoPassoId] = useState<number | null>(null);
  const [passoEditado, setPassoEditado] = useState("");

  useEffect(() => {
    const objetivosSalvos = JSON.parse(localStorage.getItem("objetivos") || "[]");
    setObjetivosDisponiveis(objetivosSalvos);
  }, []);

  const handleAddAcao = () => {
    if (!novaAcao.acao) {
      toast.error("Preencha a ação");
      return;
    }

    setAcoes([...acoes, { ...novaAcao, id: Date.now() }]);
    setNovaAcao({ acao: "", periodicidade: "", status: "a-fazer" });
    toast.success("Ação adicionada!");
  };

  const handleRemoveAcao = (id: number) => {
    setAcoes(acoes.filter((acao) => acao.id !== id));
    toast.success("Ação removida!");
  };

  const handleStartEdit = (acao: any) => {
    setEditandoId(acao.id);
    setAcaoEditada({
      acao: acao.acao,
      periodicidade: acao.periodicidade,
      status: acao.status,
    });
  };

  const handleCancelEdit = () => {
    setEditandoId(null);
    setAcaoEditada(null);
  };

  const handleSaveEdit = (id: number) => {
    if (!acaoEditada) return;

    setAcoes(acoes.map((acao) => 
      acao.id === id ? { ...acao, ...acaoEditada } : acao
    ));
    setEditandoId(null);
    setAcaoEditada(null);
    toast.success("Ação atualizada!");
  };

  const handleAddPasso = () => {
    if (!novoPasso.trim()) {
      toast.error("Preencha o passo");
      return;
    }

    setPassos([...passos, { id: Date.now(), passo: novoPasso }]);
    setNovoPasso("");
    toast.success("Passo adicionado!");
  };

  const handleRemovePasso = (id: number) => {
    setPassos(passos.filter((passo) => passo.id !== id));
    toast.success("Passo removido!");
  };

  const handleStartEditPasso = (passo: any) => {
    setEditandoPassoId(passo.id);
    setPassoEditado(passo.passo);
  };

  const handleCancelEditPasso = () => {
    setEditandoPassoId(null);
    setPassoEditado("");
  };

  const handleSaveEditPasso = (id: number) => {
    if (!passoEditado.trim()) return;

    setPassos(passos.map((passo) => 
      passo.id === id ? { ...passo, passo: passoEditado } : passo
    ));
    setEditandoPassoId(null);
    setPassoEditado("");
    toast.success("Passo atualizado!");
  };

  const handleSaveMeta = () => {
    if (!objetivoSelecionado) {
      toast.error("Selecione um objetivo primeiro");
      return;
    }
    
    if (!meta.texto || !meta.dataAlvo) {
      toast.error("Preencha pelo menos a meta e a data alvo");
      return;
    }

    const metas = JSON.parse(localStorage.getItem("metas") || "[]");
    metas.push({ ...meta, objetivoId: objetivoSelecionado, acoes, passos, id: Date.now(), concluida: false });
    localStorage.setItem("metas", JSON.stringify(metas));
    toast.success("Meta cadastrada com sucesso!");
    
    // Reset form
    setObjetivoSelecionado("");
    setMeta({
      objetivoId: "",
      texto: "",
      dataAlvo: "",
      medicao: "",
      inicio: "",
      periodicidade: "",
      passos: "",
    });
    setAcoes([]);
    setPassos([]);
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
              <Label htmlFor="objetivo">Objetivo</Label>
              <Select
                value={objetivoSelecionado}
                onValueChange={(value) => {
                  setObjetivoSelecionado(value);
                  setMeta({ ...meta, objetivoId: value });
                }}
              >
                <SelectTrigger id="objetivo">
                  <SelectValue placeholder="Selecione um objetivo" />
                </SelectTrigger>
                <SelectContent>
                  {objetivosDisponiveis.length === 0 ? (
                    <SelectItem value="none" disabled>Nenhum objetivo cadastrado</SelectItem>
                  ) : (
                    objetivosDisponiveis.map((obj) => (
                      <SelectItem key={obj.id} value={obj.id.toString()}>
                        {obj.texto}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="meta">Meta</Label>
              <Input
                id="meta"
                placeholder="Ex: Conquistar promoção para cargo de liderança"
                value={meta.texto}
                onChange={(e) => setMeta({ ...meta, texto: e.target.value })}
                disabled={!objetivoSelecionado}
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
                  disabled={!objetivoSelecionado}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="inicio">Quando Começo</Label>
                <Input
                  id="inicio"
                  type="date"
                  value={meta.inicio}
                  onChange={(e) => setMeta({ ...meta, inicio: e.target.value })}
                  disabled={!objetivoSelecionado}
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
                disabled={!objetivoSelecionado}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="periodicidade">Periodicidade</Label>
              <Select
                value={meta.periodicidade}
                onValueChange={(value) => setMeta({ ...meta, periodicidade: value })}
                disabled={!objetivoSelecionado}
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

            <div className="space-y-3">
              <Label>Ações</Label>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 p-3 sm:p-4 bg-muted/30 rounded-lg">
                <div className="space-y-2">
                  <Label htmlFor="nova-acao" className="text-xs">Nova Ação</Label>
                  <Input
                    id="nova-acao"
                    placeholder="Descreva a ação"
                    value={novaAcao.acao}
                    onChange={(e) => setNovaAcao({ ...novaAcao, acao: e.target.value })}
                    className="text-sm"
                    disabled={!objetivoSelecionado}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="nova-periodicidade" className="text-xs">Periodicidade</Label>
                  <Select
                    value={novaAcao.periodicidade}
                    onValueChange={(value) => setNovaAcao({ ...novaAcao, periodicidade: value })}
                    disabled={!objetivoSelecionado}
                  >
                    <SelectTrigger id="nova-periodicidade" className="text-sm">
                      <SelectValue placeholder="Selecione" />
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

                <div className="space-y-2 sm:col-span-2 lg:col-span-1">
                  <Label htmlFor="novo-status" className="text-xs">Status</Label>
                  <Select
                    value={novaAcao.status}
                    onValueChange={(value) => setNovaAcao({ ...novaAcao, status: value })}
                    disabled={!objetivoSelecionado}
                  >
                    <SelectTrigger id="novo-status" className="text-sm">
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="a-fazer">A fazer</SelectItem>
                      <SelectItem value="pendente">Pendente</SelectItem>
                      <SelectItem value="em-andamento">Em andamento</SelectItem>
                      <SelectItem value="concluido">Concluído</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {acoes.length > 0 && (
                <div className="rounded-lg border overflow-x-auto">
                  <Table className="min-w-[600px]">
                    <TableHeader>
                      <TableRow>
                        <TableHead className="text-xs sm:text-sm">Ação</TableHead>
                        <TableHead className="text-xs sm:text-sm">Periodicidade</TableHead>
                        <TableHead className="text-xs sm:text-sm">Status</TableHead>
                        <TableHead className="w-[80px] sm:w-[100px] text-xs sm:text-sm">Ações</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {acoes.map((acao) => {
                        const isEditing = editandoId === acao.id;
                        
                        return (
                          <TableRow key={acao.id}>
                            <TableCell>
                              {isEditing ? (
                                <Input
                                  value={acaoEditada?.acao || ""}
                                  onChange={(e) => setAcaoEditada({ ...acaoEditada!, acao: e.target.value })}
                                />
                              ) : (
                                acao.acao
                              )}
                            </TableCell>
                            <TableCell>
                              {isEditing ? (
                                <Select
                                  value={acaoEditada?.periodicidade || ""}
                                  onValueChange={(value) => setAcaoEditada({ ...acaoEditada!, periodicidade: value })}
                                >
                                  <SelectTrigger>
                                    <SelectValue />
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
                              ) : (
                                <span className="capitalize">{acao.periodicidade}</span>
                              )}
                            </TableCell>
                            <TableCell>
                              {isEditing ? (
                                <Select
                                  value={acaoEditada?.status || ""}
                                  onValueChange={(value) => setAcaoEditada({ ...acaoEditada!, status: value })}
                                >
                                  <SelectTrigger>
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="a-fazer">A fazer</SelectItem>
                                    <SelectItem value="pendente">Pendente</SelectItem>
                                    <SelectItem value="em-andamento">Em andamento</SelectItem>
                                    <SelectItem value="concluido">Concluído</SelectItem>
                                  </SelectContent>
                                </Select>
                              ) : (
                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                  acao.status === "concluido" 
                                    ? "bg-green-100 text-green-800" 
                                    : acao.status === "pendente"
                                    ? "bg-yellow-100 text-yellow-800"
                                    : acao.status === "em-andamento"
                                    ? "bg-purple-100 text-purple-800"
                                    : "bg-blue-100 text-blue-800"
                                }`}>
                                  {acao.status === "concluido" ? "Concluído" 
                                    : acao.status === "pendente" ? "Pendente" 
                                    : acao.status === "em-andamento" ? "Em andamento"
                                    : "A fazer"}
                                </span>
                              )}
                            </TableCell>
                            <TableCell>
                              <div className="flex gap-1">
                                {isEditing ? (
                                  <>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => handleSaveEdit(acao.id)}
                                    >
                                      <Check className="w-4 h-4 text-green-600" />
                                    </Button>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={handleCancelEdit}
                                    >
                                      <X className="w-4 h-4 text-destructive" />
                                    </Button>
                                  </>
                                ) : (
                                  <>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => handleStartEdit(acao)}
                                    >
                                      <Pencil className="w-4 h-4" />
                                    </Button>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => handleRemoveAcao(acao.id)}
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

              <Button 
                type="button" 
                variant="outline" 
                size="sm"
                onClick={handleAddAcao}
                disabled={!objetivoSelecionado}
                className="mt-2"
              >
                <Plus className="w-4 h-4 mr-2" />
                Adicionar Ação
              </Button>
            </div>

            <div className="space-y-3">
              <Label>Passos</Label>

              <div className="flex gap-2 p-3 sm:p-4 bg-muted/30 rounded-lg">
                <Input
                  placeholder="Descreva o passo"
                  value={novoPasso}
                  onChange={(e) => setNovoPasso(e.target.value)}
                  disabled={!objetivoSelecionado}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      handleAddPasso();
                    }
                  }}
                />
              </div>

              {passos.length > 0 && (
                <div className="rounded-lg border overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="text-xs sm:text-sm">Passo</TableHead>
                        <TableHead className="w-[80px] sm:w-[100px] text-xs sm:text-sm">Ações</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {passos.map((passo) => {
                        const isEditing = editandoPassoId === passo.id;
                        
                        return (
                          <TableRow key={passo.id}>
                            <TableCell>
                              {isEditing ? (
                                <Input
                                  value={passoEditado}
                                  onChange={(e) => setPassoEditado(e.target.value)}
                                />
                              ) : (
                                passo.passo
                              )}
                            </TableCell>
                            <TableCell>
                              <div className="flex gap-1">
                                {isEditing ? (
                                  <>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => handleSaveEditPasso(passo.id)}
                                    >
                                      <Check className="w-4 h-4 text-green-600" />
                                    </Button>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={handleCancelEditPasso}
                                    >
                                      <X className="w-4 h-4 text-destructive" />
                                    </Button>
                                  </>
                                ) : (
                                  <>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => handleStartEditPasso(passo)}
                                    >
                                      <Pencil className="w-4 h-4" />
                                    </Button>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => handleRemovePasso(passo.id)}
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

              <Button 
                type="button" 
                variant="outline" 
                size="sm"
                onClick={handleAddPasso}
                disabled={!objetivoSelecionado}
                className="mt-2"
              >
                <Plus className="w-4 h-4 mr-2" />
                Cadastrar Mais Passos
              </Button>
            </div>

            <Button onClick={handleSaveMeta} className="w-full" size="lg" disabled={!objetivoSelecionado}>
              Cadastrar Meta
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MaoNaMassa;
