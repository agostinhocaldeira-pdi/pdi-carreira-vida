import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Sun, Clock, Moon, HelpCircle, Lightbulb } from "lucide-react";
import { Link } from "react-router-dom";

export function ProductivityTipsSection() {
  return (
    <Card className="shadow-medium border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
      <CardHeader className="pb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center shadow-lg">
            <Lightbulb className="w-6 h-6 text-primary-foreground" />
          </div>
          <div>
            <CardTitle className="text-xl sm:text-2xl">Dicas de Eficiência, Produtividade e Clareza</CardTitle>
            <CardDescription>Maximize seu potencial com uma rotina estruturada</CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* De manhã */}
        <div className="rounded-lg border bg-card p-4 space-y-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
              <Sun className="w-4 h-4 text-amber-600 dark:text-amber-400" />
            </div>
            <h3 className="font-semibold text-base">De manhã</h3>
          </div>
          
          <ul className="space-y-3 text-sm text-muted-foreground">
            <li className="flex gap-2">
              <span className="text-primary font-bold">•</span>
              <div>
                <strong className="text-foreground">Inicie pela reflexão estóica</strong>
                <p className="mt-0.5">
                  Clique no menu em{" "}
                  <Link to="/reflexao" className="text-primary hover:underline font-medium">
                    Reflexão → Iniciar Reflexão
                  </Link>
                  . É uma excelente forma de começar o dia com conteúdo relevante.
                </p>
              </div>
            </li>
            <li className="flex gap-2">
              <span className="text-primary font-bold">•</span>
              <div>
                <strong className="text-foreground">Estude sua agenda do dia</strong>
                <p className="mt-0.5">E comece a execução. <span className="font-semibold text-primary">"Mãos à obra!"</span></p>
              </div>
            </li>
          </ul>
        </div>

        {/* À tarde */}
        <div className="rounded-lg border bg-card p-4 space-y-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center">
              <Clock className="w-4 h-4 text-orange-600 dark:text-orange-400" />
            </div>
            <h3 className="font-semibold text-base">À tarde</h3>
          </div>
          
          <ul className="space-y-3 text-sm text-muted-foreground">
            <li className="flex gap-2">
              <span className="text-primary font-bold">•</span>
              <div>
                <strong className="text-foreground">Continue com sua agenda do dia</strong>
                <p className="mt-0.5">Faça anotações para incluir no diário.</p>
              </div>
            </li>
          </ul>
        </div>

        {/* À noite */}
        <div className="rounded-lg border bg-card p-4 space-y-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center">
              <Moon className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            </div>
            <h3 className="font-semibold text-base">À noite</h3>
          </div>
          
          <ul className="space-y-3 text-sm text-muted-foreground">
            <li className="flex gap-2">
              <span className="text-primary font-bold">•</span>
              <div>
                <strong className="text-foreground">Atualize seu Plano de Vida</strong>
                <p className="mt-0.5">
                  Clique no menu em{" "}
                  <Link to="/plano-vida/como-chegar" className="text-primary hover:underline font-medium">
                    "Como Chegar Lá"
                  </Link>
                  . Conclua, inclua ou ajuste as metas, ações e passos.
                </p>
              </div>
            </li>
            <li className="flex gap-2">
              <span className="text-primary font-bold">•</span>
              <div>
                <strong className="text-foreground">Preencha seu Diário</strong>
                <p className="mt-0.5">
                  Registre suas{" "}
                  <Link to="/diario" className="text-primary hover:underline font-medium">
                    reflexões do dia
                  </Link>
                  .
                </p>
              </div>
            </li>
          </ul>
        </div>

        {/* Suporte */}
        <div className="rounded-lg border border-dashed border-primary/30 bg-primary/5 p-4">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center flex-shrink-0">
              <HelpCircle className="w-4 h-4 text-primary" />
            </div>
            <p className="text-sm text-muted-foreground">
              Dúvidas, pedidos de mentoria e outros assuntos? Entre em contato comigo através do{" "}
              <Link to="/suporte" className="text-primary hover:underline font-medium">
                Suporte
              </Link>
              .
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
