import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Shield, FileText, Lock, CheckCircle } from "lucide-react";

interface LGPDConsentModalProps {
  open: boolean;
  onClose: () => void;
}

export const LGPDConsentModal = ({ open, onClose }: LGPDConsentModalProps) => {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[550px] max-h-[90vh]">
        <DialogHeader className="text-center pb-2">
          <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-3">
            <Shield className="h-6 w-6 text-primary" />
          </div>
          <DialogTitle className="text-xl">
            Termos de Uso e Política de Privacidade
          </DialogTitle>
          <DialogDescription className="text-center">
            Em conformidade com a Lei Geral de Proteção de Dados (LGPD)
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="h-[320px] pr-4">
          <div className="space-y-5">
            <section className="bg-muted/50 rounded-lg p-4">
              <h3 className="font-semibold flex items-center gap-2 mb-2 text-sm">
                <FileText className="h-4 w-4 text-primary" />
                Termos de Uso
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Ao utilizar o PDI - Carreira & Vida, você concorda com nossos termos de uso, 
                incluindo as regras de conduta, limitações de responsabilidade e direitos de 
                propriedade intelectual.
              </p>
            </section>

            <section className="bg-muted/50 rounded-lg p-4">
              <h3 className="font-semibold flex items-center gap-2 mb-2 text-sm">
                <Lock className="h-4 w-4 text-primary" />
                Política de Privacidade
              </h3>
              <p className="text-sm text-muted-foreground mb-2 leading-relaxed">
                Coletamos e processamos seus dados para:
              </p>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-3.5 w-3.5 text-primary mt-0.5 shrink-0" />
                  <span>Fornecer e melhorar nossos serviços</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-3.5 w-3.5 text-primary mt-0.5 shrink-0" />
                  <span>Personalizar sua experiência</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-3.5 w-3.5 text-primary mt-0.5 shrink-0" />
                  <span>Garantir a segurança da plataforma</span>
                </li>
              </ul>
            </section>

            <section className="bg-muted/50 rounded-lg p-4">
              <h3 className="font-semibold mb-2 text-sm">Seus Direitos (LGPD Art. 18)</h3>
              <div className="grid grid-cols-2 gap-2 text-sm text-muted-foreground">
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 bg-primary rounded-full" />
                  Acesso aos dados
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 bg-primary rounded-full" />
                  Correção
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 bg-primary rounded-full" />
                  Exclusão
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 bg-primary rounded-full" />
                  Portabilidade
                </div>
              </div>
            </section>

            <p className="text-xs text-muted-foreground text-center px-4">
              Ao selecionar "Li e aceito" no formulário de cadastro, você concorda com os Termos de Uso, 
              Política de Privacidade e autoriza o processamento dos seus dados pessoais conforme descrito acima.
            </p>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};
