import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";

const CheckoutDireto = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = searchParams.get("token");
    
    if (!token) {
      setError("Link inválido. Por favor, use o link do e-mail.");
      return;
    }

    // Redirect to edge function which will validate and redirect to Stripe
    const edgeFunctionUrl = `https://zlclwweeyrvrgxuukdhl.supabase.co/functions/v1/checkout-direto?token=${encodeURIComponent(token)}`;
    window.location.href = edgeFunctionUrl;
  }, [searchParams]);

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="text-center space-y-4">
          <p className="text-destructive text-lg">{error}</p>
          <button
            onClick={() => navigate("/")}
            className="text-primary underline"
          >
            Voltar para a página inicial
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center space-y-4">
        <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto" />
        <p className="text-muted-foreground">Preparando seu checkout...</p>
      </div>
    </div>
  );
};

export default CheckoutDireto;
