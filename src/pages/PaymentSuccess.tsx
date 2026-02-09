import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, CheckCircle, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

type PaymentStatus = "verifying" | "success" | "error";

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState<PaymentStatus>("verifying");
  const [errorMessage, setErrorMessage] = useState<string>("");

  const sessionId = searchParams.get("session_id");
  const featureType = searchParams.get("feature");

  // Track Meta Purchase event with Advanced Matching
  const trackMetaPurchase = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user && typeof window !== 'undefined' && (window as any).fbq) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('full_name')
          .eq('id', user.id)
          .maybeSingle();

        // Re-init pixel with Advanced Matching data
        const firstName = profile?.full_name?.split(' ')[0]?.toLowerCase() || '';
        const lastName = profile?.full_name?.split(' ').slice(1).join(' ')?.toLowerCase() || '';
        
        (window as any).fbq('init', '896077476134553', {
          em: user.email?.toLowerCase(),
          fn: firstName,
          ln: lastName,
        });

        // Fire Purchase event
        (window as any).fbq('track', 'Purchase', {
          value: 67.00,
          currency: 'BRL',
        });

        console.log('[Meta Pixel] Purchase event fired with Advanced Matching');
      }
    } catch (err) {
      console.error('[Meta Pixel] Error tracking purchase:', err);
    }
  };

  useEffect(() => {
    const verifyPayment = async () => {
      if (!sessionId || !featureType) {
        setStatus("error");
        setErrorMessage("Parâmetros de pagamento ausentes");
        return;
      }

      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
          setStatus("error");
          setErrorMessage("Sessão expirada. Por favor, faça login novamente.");
          return;
        }

        // Verify the purchase with backend
        const { data, error } = await supabase.functions.invoke("verify-ai-purchase", {
          body: { sessionId, featureType },
        });

        if (error) {
          console.error("Error verifying payment:", error);
          setStatus("error");
          setErrorMessage("Erro ao verificar pagamento. Tente novamente.");
          return;
        }

        if (data?.verified) {
          setStatus("success");
          await trackMetaPurchase();
          setTimeout(() => {
            navigateToFeature();
          }, 2000);
        } else {
          await new Promise(resolve => setTimeout(resolve, 3000));
          
          const { data: purchase } = await supabase
            .from("user_ai_purchases")
            .select("status")
            .eq("stripe_session_id", sessionId)
            .maybeSingle();

          if (purchase?.status === "paid") {
            setStatus("success");
            await trackMetaPurchase();
            setTimeout(() => {
              navigateToFeature();
            }, 2000);
          } else {
            setStatus("success");
            await trackMetaPurchase();
            setTimeout(() => {
              navigateToFeature();
            }, 2000);
          }
        }
      } catch (err) {
        console.error("Payment verification error:", err);
        setStatus("error");
        setErrorMessage("Erro inesperado. Por favor, tente novamente.");
      }
    };

    verifyPayment();
  }, [sessionId, featureType]);

  const navigateToFeature = () => {
    // Map feature types to their routes
    const featureRoutes: Record<string, string> = {
      insight: "/home",
      vvd: "/metodo-vvd",
      smart: "/metodo-smart",
    };

    const route = featureRoutes[featureType || ""] || "/home";
    navigate(route, { replace: true });
  };

  const getFeatureLabel = () => {
    const labels: Record<string, string> = {
      insight: "Insight com IA",
      vvd: "VVD com IA",
      smart: "SMART com IA",
    };
    return labels[featureType || ""] || "Recurso de IA";
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          {status === "verifying" && (
            <>
              <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
              <CardTitle>Verificando pagamento...</CardTitle>
              <CardDescription>
                Por favor, aguarde enquanto confirmamos seu pagamento.
              </CardDescription>
            </>
          )}

          {status === "success" && (
            <>
              <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
              <CardTitle className="text-green-600">Pagamento confirmado!</CardTitle>
              <CardDescription>
                Seu acesso ao {getFeatureLabel()} foi liberado.
              </CardDescription>
            </>
          )}

          {status === "error" && (
            <>
              <XCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
              <CardTitle className="text-destructive">Erro no pagamento</CardTitle>
              <CardDescription>{errorMessage}</CardDescription>
            </>
          )}
        </CardHeader>

        <CardContent className="text-center">
          {status === "success" && (
            <p className="text-sm text-muted-foreground mb-4">
              Você será redirecionado automaticamente...
            </p>
          )}

          {status === "error" && (
            <div className="space-y-2">
              <Button onClick={() => navigate("/home")} className="w-full">
                Voltar para o início
              </Button>
              <Button variant="outline" onClick={() => window.location.reload()} className="w-full">
                Tentar novamente
              </Button>
            </div>
          )}

          {status === "verifying" && (
            <p className="text-sm text-muted-foreground">
              Isso pode levar alguns segundos...
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default PaymentSuccess;
