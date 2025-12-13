import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DollarSign, TrendingUp, TrendingDown, Plus, Trash2, Edit2, Save, X } from "lucide-react";
import { toast } from "sonner";
import ConfirmDeleteDialog from "@/components/ConfirmDeleteDialog";

interface ManualExpense {
  id: string;
  category: string;
  description: string;
  amount: number;
  month: string; // YYYY-MM format
}

interface MonthlyFinancials {
  month: string;
  subscriptionRevenue: number;
  lovableCost: number;
  resendCost: number;
  stripeCost: number;
  supabaseCost: number;
  manualExpenses: ManualExpense[];
}

const EXPENSE_CATEGORIES = [
  "Marketing",
  "Despesas Fixas",
  "Impostos",
  "Pessoal",
  "Infraestrutura",
  "Outros"
];

const MONTHS = [
  { value: "2025-01", label: "Janeiro 2025" },
  { value: "2025-02", label: "Fevereiro 2025" },
  { value: "2025-03", label: "Março 2025" },
  { value: "2025-04", label: "Abril 2025" },
  { value: "2025-05", label: "Maio 2025" },
  { value: "2025-06", label: "Junho 2025" },
  { value: "2025-07", label: "Julho 2025" },
  { value: "2025-08", label: "Agosto 2025" },
  { value: "2025-09", label: "Setembro 2025" },
  { value: "2025-10", label: "Outubro 2025" },
  { value: "2025-11", label: "Novembro 2025" },
  { value: "2025-12", label: "Dezembro 2025" },
];

const STORAGE_KEY = "admin_financial_data";

const FinancialDashboard = () => {
  const [selectedMonth, setSelectedMonth] = useState(() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  });
  
  const [financialData, setFinancialData] = useState<MonthlyFinancials[]>([]);
  const [manualExpenses, setManualExpenses] = useState<ManualExpense[]>([]);
  const [editingExpense, setEditingExpense] = useState<string | null>(null);
  const [deleteExpenseId, setDeleteExpenseId] = useState<string | null>(null);
  
  const [newExpense, setNewExpense] = useState({
    category: "",
    description: "",
    amount: ""
  });

  const [editForm, setEditForm] = useState({
    category: "",
    description: "",
    amount: ""
  });

  // Custos fixos reais - valores a serem atualizados manualmente ou via integração futura
  const getAutomaticCosts = () => ({
    subscriptionRevenue: 0, // Será integrado com Stripe API
    lovableCost: 99, // Custo fixo do plano Lovable
    resendCost: 0, // Free tier
    stripeCost: 0, // Será calculado baseado nas transações reais
    supabaseCost: 0, // Free tier (Lovable Cloud)
  });

  useEffect(() => {
    // Load saved data
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      setManualExpenses(parsed.manualExpenses || []);
    }
  }, []);

  const saveData = (expenses: ManualExpense[]) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ manualExpenses: expenses }));
  };

  const currentMonthExpenses = manualExpenses.filter(e => e.month === selectedMonth);
  const automaticCosts = getAutomaticCosts();

  const totalManualExpenses = currentMonthExpenses.reduce((sum, e) => sum + e.amount, 0);
  const totalAutomaticCosts = automaticCosts.lovableCost + automaticCosts.resendCost + 
                              automaticCosts.stripeCost + automaticCosts.supabaseCost;
  const totalExpenses = totalManualExpenses + totalAutomaticCosts;
  const netResult = automaticCosts.subscriptionRevenue - totalExpenses;

  const handleAddExpense = () => {
    if (!newExpense.category || !newExpense.description || !newExpense.amount) {
      toast.error("Preencha todos os campos");
      return;
    }

    const expense: ManualExpense = {
      id: Date.now().toString(),
      category: newExpense.category,
      description: newExpense.description,
      amount: parseFloat(newExpense.amount),
      month: selectedMonth
    };

    const updated = [...manualExpenses, expense];
    setManualExpenses(updated);
    saveData(updated);
    setNewExpense({ category: "", description: "", amount: "" });
    toast.success("Despesa adicionada");
  };

  const handleStartEdit = (expense: ManualExpense) => {
    setEditingExpense(expense.id);
    setEditForm({
      category: expense.category,
      description: expense.description,
      amount: expense.amount.toString()
    });
  };

  const handleSaveEdit = (id: string) => {
    const updated = manualExpenses.map(e => 
      e.id === id 
        ? { ...e, category: editForm.category, description: editForm.description, amount: parseFloat(editForm.amount) }
        : e
    );
    setManualExpenses(updated);
    saveData(updated);
    setEditingExpense(null);
    toast.success("Despesa atualizada");
  };

  const handleDeleteExpense = () => {
    if (deleteExpenseId) {
      const updated = manualExpenses.filter(e => e.id !== deleteExpenseId);
      setManualExpenses(updated);
      saveData(updated);
      setDeleteExpenseId(null);
      toast.success("Despesa removida");
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
  };

  const getMonthLabel = (value: string) => {
    return MONTHS.find(m => m.value === value)?.label || value;
  };

  return (
    <Card className="shadow-medium">
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <CardTitle className="text-lg flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-primary" />
              Painel Financeiro
            </CardTitle>
            <CardDescription>
              Visão mensal de receitas e despesas
            </CardDescription>
          </div>
          <Select value={selectedMonth} onValueChange={setSelectedMonth}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Selecione o mês" />
            </SelectTrigger>
            <SelectContent>
              {MONTHS.map(month => (
                <SelectItem key={month.value} value={month.value}>
                  {month.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-5 h-5 text-green-600" />
              <span className="text-sm font-medium text-green-700">Receitas</span>
            </div>
            <p className="text-2xl font-bold text-green-600">
              {formatCurrency(automaticCosts.subscriptionRevenue)}
            </p>
            <p className="text-xs text-muted-foreground mt-1">Assinaturas</p>
          </div>

          <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <TrendingDown className="w-5 h-5 text-red-600" />
              <span className="text-sm font-medium text-red-700">Despesas</span>
            </div>
            <p className="text-2xl font-bold text-red-600">
              {formatCurrency(totalExpenses)}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Auto: {formatCurrency(totalAutomaticCosts)} | Manual: {formatCurrency(totalManualExpenses)}
            </p>
          </div>

          <div className={`p-4 rounded-lg ${netResult >= 0 ? 'bg-primary/10 border border-primary/20' : 'bg-destructive/10 border border-destructive/20'}`}>
            <div className="flex items-center gap-2 mb-2">
              <DollarSign className={`w-5 h-5 ${netResult >= 0 ? 'text-primary' : 'text-destructive'}`} />
              <span className={`text-sm font-medium ${netResult >= 0 ? 'text-primary' : 'text-destructive'}`}>
                Resultado
              </span>
            </div>
            <p className={`text-2xl font-bold ${netResult >= 0 ? 'text-primary' : 'text-destructive'}`}>
              {formatCurrency(netResult)}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              {netResult >= 0 ? 'Lucro' : 'Prejuízo'}
            </p>
          </div>
        </div>

        {/* Revenue Table */}
        <div>
          <h3 className="font-semibold mb-3 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-green-600" />
            Receitas - {getMonthLabel(selectedMonth)}
          </h3>
          <div className="border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Descrição</TableHead>
                  <TableHead className="text-right">Valor</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell>
                    <Badge variant="default">Assinaturas</Badge>
                  </TableCell>
                  <TableCell>Receita de assinaturas Stripe</TableCell>
                  <TableCell className="text-right font-medium text-green-600">
                    {formatCurrency(automaticCosts.subscriptionRevenue)}
                  </TableCell>
                </TableRow>
                <TableRow className="bg-muted/50">
                  <TableCell colSpan={2} className="font-semibold">Total Receitas</TableCell>
                  <TableCell className="text-right font-bold text-green-600">
                    {formatCurrency(automaticCosts.subscriptionRevenue)}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </div>

        {/* Automatic Expenses */}
        <div>
          <h3 className="font-semibold mb-3 flex items-center gap-2">
            <TrendingDown className="w-4 h-4 text-blue-600" />
            Despesas Automáticas (Serviços Integrados)
          </h3>
          <div className="border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Serviço</TableHead>
                  <TableHead>Descrição</TableHead>
                  <TableHead className="text-right">Valor</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell>
                    <Badge variant="secondary">Lovable</Badge>
                  </TableCell>
                  <TableCell>Plataforma de desenvolvimento</TableCell>
                  <TableCell className="text-right font-medium text-red-600">
                    {formatCurrency(automaticCosts.lovableCost)}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <Badge variant="secondary">Stripe</Badge>
                  </TableCell>
                  <TableCell>Taxas de processamento (2.9% + R$0.39)</TableCell>
                  <TableCell className="text-right font-medium text-red-600">
                    {formatCurrency(automaticCosts.stripeCost)}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <Badge variant="secondary">Resend</Badge>
                  </TableCell>
                  <TableCell>Envio de e-mails (Free tier)</TableCell>
                  <TableCell className="text-right font-medium text-red-600">
                    {formatCurrency(automaticCosts.resendCost)}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <Badge variant="secondary">Supabase</Badge>
                  </TableCell>
                  <TableCell>Backend/Database (Free tier)</TableCell>
                  <TableCell className="text-right font-medium text-red-600">
                    {formatCurrency(automaticCosts.supabaseCost)}
                  </TableCell>
                </TableRow>
                <TableRow className="bg-muted/50">
                  <TableCell colSpan={2} className="font-semibold">Subtotal Automático</TableCell>
                  <TableCell className="text-right font-bold text-red-600">
                    {formatCurrency(totalAutomaticCosts)}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </div>

        {/* Manual Expenses */}
        <div>
          <h3 className="font-semibold mb-3 flex items-center gap-2">
            <TrendingDown className="w-4 h-4 text-orange-600" />
            Despesas Manuais (Custos Operacionais)
          </h3>
          
          {/* Add Expense Form */}
          <div className="bg-muted/30 p-4 rounded-lg mb-4">
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
              <div>
                <Label className="text-xs">Categoria</Label>
                <Select 
                  value={newExpense.category} 
                  onValueChange={(v) => setNewExpense({...newExpense, category: v})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    {EXPENSE_CATEGORIES.map(cat => (
                      <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-xs">Descrição</Label>
                <Input
                  placeholder="Ex: Google Ads"
                  value={newExpense.description}
                  onChange={(e) => setNewExpense({...newExpense, description: e.target.value})}
                />
              </div>
              <div>
                <Label className="text-xs">Valor (R$)</Label>
                <Input
                  type="number"
                  step="0.01"
                  placeholder="0,00"
                  value={newExpense.amount}
                  onChange={(e) => setNewExpense({...newExpense, amount: e.target.value})}
                />
              </div>
              <div className="flex items-end">
                <Button onClick={handleAddExpense} className="w-full gap-2">
                  <Plus className="w-4 h-4" />
                  Adicionar
                </Button>
              </div>
            </div>
          </div>

          {/* Manual Expenses Table */}
          <div className="border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Categoria</TableHead>
                  <TableHead>Descrição</TableHead>
                  <TableHead className="text-right">Valor</TableHead>
                  <TableHead className="w-[100px]">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentMonthExpenses.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center text-muted-foreground py-8">
                      Nenhuma despesa manual cadastrada para {getMonthLabel(selectedMonth)}
                    </TableCell>
                  </TableRow>
                ) : (
                  currentMonthExpenses.map(expense => (
                    <TableRow key={expense.id}>
                      {editingExpense === expense.id ? (
                        <>
                          <TableCell>
                            <Select 
                              value={editForm.category} 
                              onValueChange={(v) => setEditForm({...editForm, category: v})}
                            >
                              <SelectTrigger className="h-8">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {EXPENSE_CATEGORIES.map(cat => (
                                  <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </TableCell>
                          <TableCell>
                            <Input
                              className="h-8"
                              value={editForm.description}
                              onChange={(e) => setEditForm({...editForm, description: e.target.value})}
                            />
                          </TableCell>
                          <TableCell>
                            <Input
                              className="h-8 text-right"
                              type="number"
                              step="0.01"
                              value={editForm.amount}
                              onChange={(e) => setEditForm({...editForm, amount: e.target.value})}
                            />
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-1">
                              <Button 
                                size="icon" 
                                variant="ghost" 
                                className="h-8 w-8"
                                onClick={() => handleSaveEdit(expense.id)}
                              >
                                <Save className="w-4 h-4 text-green-600" />
                              </Button>
                              <Button 
                                size="icon" 
                                variant="ghost" 
                                className="h-8 w-8"
                                onClick={() => setEditingExpense(null)}
                              >
                                <X className="w-4 h-4 text-muted-foreground" />
                              </Button>
                            </div>
                          </TableCell>
                        </>
                      ) : (
                        <>
                          <TableCell>
                            <Badge variant="outline">{expense.category}</Badge>
                          </TableCell>
                          <TableCell>{expense.description}</TableCell>
                          <TableCell className="text-right font-medium text-red-600">
                            {formatCurrency(expense.amount)}
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-1">
                              <Button 
                                size="icon" 
                                variant="ghost" 
                                className="h-8 w-8"
                                onClick={() => handleStartEdit(expense)}
                              >
                                <Edit2 className="w-4 h-4 text-muted-foreground" />
                              </Button>
                              <Button 
                                size="icon" 
                                variant="ghost" 
                                className="h-8 w-8"
                                onClick={() => setDeleteExpenseId(expense.id)}
                              >
                                <Trash2 className="w-4 h-4 text-destructive" />
                              </Button>
                            </div>
                          </TableCell>
                        </>
                      )}
                    </TableRow>
                  ))
                )}
                {currentMonthExpenses.length > 0 && (
                  <TableRow className="bg-muted/50">
                    <TableCell colSpan={2} className="font-semibold">Subtotal Manual</TableCell>
                    <TableCell className="text-right font-bold text-red-600">
                      {formatCurrency(totalManualExpenses)}
                    </TableCell>
                    <TableCell />
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>

        {/* Total Summary */}
        <div className="border-t pt-4">
          <div className="bg-muted/30 rounded-lg p-4">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-sm text-muted-foreground">Total Receitas</p>
                <p className="text-lg font-bold text-green-600">
                  {formatCurrency(automaticCosts.subscriptionRevenue)}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Despesas</p>
                <p className="text-lg font-bold text-red-600">
                  {formatCurrency(totalExpenses)}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Resultado</p>
                <p className={`text-lg font-bold ${netResult >= 0 ? 'text-primary' : 'text-destructive'}`}>
                  {formatCurrency(netResult)}
                </p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>

      <ConfirmDeleteDialog
        open={deleteExpenseId !== null}
        onOpenChange={() => setDeleteExpenseId(null)}
        onConfirm={handleDeleteExpense}
        title="Excluir Despesa"
        description="Tem certeza que deseja excluir esta despesa? Esta ação não pode ser desfeita."
      />
    </Card>
  );
};

export default FinancialDashboard;
