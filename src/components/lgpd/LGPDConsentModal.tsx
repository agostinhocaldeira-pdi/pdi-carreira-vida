import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Shield, FileText, Lock } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface LGPDConsentModalProps {
  open: boolean;
  onAccept: () => void;
  onDecline?: () => void;
}

export const LGPDConsentModal = ({ open, onAccept, onDecline }: LGPDConsentModalProps) => {
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [privacyAccepted, setPrivacyAccepted] = useState(false);
  const [dataProcessingAccepted, setDataProcessingAccepted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const allAccepted = termsAccepted && privacyAccepted && dataProcessingAccepted;

  const handleAccept = async () => {
    if (!allAccepted) return;

    setIsLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        // Registrar consentimentos no banco
        const consents = [
          { user_id: user.id, consent_type: 'terms_of_service' },
          { user_id: user.id, consent_type: 'privacy_policy' },
          { user_id: user.id, consent_type: 'data_processing' },
        ];

        const { error } = await supabase
          .from('user_consents')
          .upsert(consents, { onConflict: 'user_id,consent_type' });

        if (error) {
          console.error('Erro ao salvar consentimento:', error);
          toast.error('Erro ao salvar consentimento');
          return;
        }
      }

      // Salvar localmente também
      localStorage.setItem('lgpd_consent_accepted', 'true');
      localStorage.setItem('lgpd_consent_date', new Date().toISOString());
      
      toast.success('Consentimento registrado com sucesso!');
      onAccept();
    } catch (error) {
      console.error('Erro:', error);
      toast.error('Erro ao processar consentimento');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={() => {}}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary" />
            Termos de Uso e Política de Privacidade
          </DialogTitle>
          <DialogDescription>
            Em conformidade com a Lei Geral de Proteção de Dados (LGPD), precisamos do seu consentimento.
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="h-[300px] pr-4">
          <div className="space-y-6">
            <section>
              <h3 className="font-semibold flex items-center gap-2 mb-2">
                <FileText className="h-4 w-4" />
                Termos de Uso
              </h3>
              <p className="text-sm text-muted-foreground">
                Ao utilizar o PDI - Carreira & Vida, você concorda com nossos termos de uso, 
                incluindo as regras de conduta, limitações de responsabilidade e direitos de 
                propriedade intelectual. O serviço é fornecido "como está" e nos reservamos 
                o direito de modificar ou descontinuar funcionalidades com aviso prévio.
              </p>
            </section>

            <section>
              <h3 className="font-semibold flex items-center gap-2 mb-2">
                <Lock className="h-4 w-4" />
                Política de Privacidade (LGPD)
              </h3>
              <p className="text-sm text-muted-foreground mb-2">
                Coletamos e processamos seus dados pessoais para:
              </p>
              <ul className="text-sm text-muted-foreground list-disc pl-5 space-y-1">
                <li>Fornecer e melhorar nossos serviços de desenvolvimento pessoal</li>
                <li>Personalizar sua experiência com insights e recomendações</li>
                <li>Comunicar atualizações importantes e novidades</li>
                <li>Garantir a segurança da plataforma</li>
              </ul>
            </section>

            <section>
              <h3 className="font-semibold mb-2">Seus Direitos (LGPD Art. 18)</h3>
              <ul className="text-sm text-muted-foreground list-disc pl-5 space-y-1">
                <li><strong>Acesso:</strong> Você pode solicitar uma cópia de todos os seus dados</li>
                <li><strong>Correção:</strong> Você pode corrigir dados incompletos ou incorretos</li>
                <li><strong>Exclusão:</strong> Você pode solicitar a exclusão de seus dados</li>
                <li><strong>Portabilidade:</strong> Você pode exportar seus dados em formato legível</li>
                <li><strong>Revogação:</strong> Você pode revogar seu consentimento a qualquer momento</li>
              </ul>
            </section>

            <section>
              <h3 className="font-semibold mb-2">Proteção de Dados</h3>
              <p className="text-sm text-muted-foreground">
                Utilizamos criptografia, controle de acesso e monitoramento para proteger 
                seus dados. Não compartilhamos informações pessoais com terceiros sem seu 
                consentimento explícito, exceto quando exigido por lei.
              </p>
            </section>
          </div>
        </ScrollArea>

        <div className="space-y-3 border-t pt-4">
          <div className="flex items-start space-x-2">
            <Checkbox 
              id="terms" 
              checked={termsAccepted} 
              onCheckedChange={(checked) => setTermsAccepted(checked === true)}
            />
            <label htmlFor="terms" className="text-sm cursor-pointer">
              Li e aceito os <strong>Termos de Uso</strong>
            </label>
          </div>

          <div className="flex items-start space-x-2">
            <Checkbox 
              id="privacy" 
              checked={privacyAccepted} 
              onCheckedChange={(checked) => setPrivacyAccepted(checked === true)}
            />
            <label htmlFor="privacy" className="text-sm cursor-pointer">
              Li e aceito a <strong>Política de Privacidade</strong>
            </label>
          </div>

          <div className="flex items-start space-x-2">
            <Checkbox 
              id="data" 
              checked={dataProcessingAccepted} 
              onCheckedChange={(checked) => setDataProcessingAccepted(checked === true)}
            />
            <label htmlFor="data" className="text-sm cursor-pointer">
              Autorizo o <strong>processamento dos meus dados pessoais</strong> conforme descrito
            </label>
          </div>
        </div>

        <DialogFooter className="gap-2">
          {onDecline && (
            <Button variant="outline" onClick={onDecline}>
              Não aceito
            </Button>
          )}
          <Button 
            onClick={handleAccept} 
            disabled={!allAccepted || isLoading}
          >
            {isLoading ? "Processando..." : "Aceito os termos"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
