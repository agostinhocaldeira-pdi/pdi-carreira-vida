import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, Download, XCircle, Loader2, BookOpen, ArrowRight } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import Logo from "@/components/Logo";

const EbookDownload = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const [status, setStatus] = useState<"loading" | "success" | "error" | "already_downloaded">("loading");
  const [leadName, setLeadName] = useState("");

  useEffect(() => {
    const confirmAndDownload = async () => {
      if (!token) {
        setStatus("error");
        return;
      }

      try {
        // Call edge function to confirm email and get lead info
        const { data, error } = await supabase.functions.invoke("confirm-ebook-download", {
          body: { token },
        });

        if (error) {
          console.error("Error confirming download:", error);
          setStatus("error");
          return;
        }

        if (data.alreadyDownloaded) {
          setStatus("already_downloaded");
          setLeadName(data.name || "");
        } else {
          setStatus("success");
          setLeadName(data.name || "");
        }
      } catch (error) {
        console.error("Error:", error);
        setStatus("error");
      }
    };

    confirmAndDownload();
  }, [token]);

  const handleDownload = () => {
    window.open("/ebooks/pequeno-manual-grandes-conquistas.pdf", "_blank");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 flex items-center justify-center p-4">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <Link to="/">
            <Logo size="sm" />
          </Link>
        </div>
      </header>

      <Card className="max-w-md w-full text-center mt-16">
        {status === "loading" && (
          <>
            <CardHeader className="space-y-4">
              <div className="mx-auto w-16 h-16 bg-muted rounded-full flex items-center justify-center">
                <Loader2 className="w-10 h-10 text-primary animate-spin" />
              </div>
              <CardTitle className="text-2xl">Confirmando...</CardTitle>
              <CardDescription className="text-base">
                Estamos confirmando seu acesso ao e-book.
              </CardDescription>
            </CardHeader>
          </>
        )}

        {status === "success" && (
          <>
            <CardHeader className="space-y-4">
              <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="w-10 h-10 text-green-600" />
              </div>
              <CardTitle className="text-2xl">
                {leadName ? `Parabéns, ${leadName.split(" ")[0]}!` : "Parabéns!"}
              </CardTitle>
              <CardDescription className="text-base">
                Seu e-mail foi confirmado e seu e-book está pronto para download.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-primary/5 p-6 rounded-xl border-2 border-primary/20">
                <BookOpen className="w-12 h-12 text-primary mx-auto mb-3" />
                <h3 className="font-semibold mb-2">Pequeno Manual para Grandes Conquistas</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Por Agostinho Caldeira
                </p>
                <Button onClick={handleDownload} className="w-full" size="lg">
                  <Download className="mr-2 w-5 h-5" />
                  Baixar E-book (PDF)
                </Button>
              </div>

              <div className="pt-4 border-t space-y-3">
                <p className="text-sm text-muted-foreground">
                  Gostou do conteúdo? Conheça o PDI - Carreira & Vida e leve seu desenvolvimento ao próximo nível!
                </p>
                <Link to="/signup">
                  <Button variant="outline" className="w-full">
                    Conhecer o PDI
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </Link>
              </div>
            </CardContent>
          </>
        )}

        {status === "already_downloaded" && (
          <>
            <CardHeader className="space-y-4">
              <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                <BookOpen className="w-10 h-10 text-blue-600" />
              </div>
              <CardTitle className="text-2xl">
                {leadName ? `Olá, ${leadName.split(" ")[0]}!` : "Olá!"}
              </CardTitle>
              <CardDescription className="text-base">
                Você já baixou este e-book anteriormente, mas pode baixar novamente.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button onClick={handleDownload} className="w-full" size="lg">
                <Download className="mr-2 w-5 h-5" />
                Baixar novamente
              </Button>

              <div className="pt-4 border-t space-y-3">
                <p className="text-sm text-muted-foreground">
                  Já conhece o PDI - Carreira & Vida?
                </p>
                <Link to="/signup">
                  <Button variant="outline" className="w-full">
                    Criar minha conta
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </Link>
              </div>
            </CardContent>
          </>
        )}

        {status === "error" && (
          <>
            <CardHeader className="space-y-4">
              <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                <XCircle className="w-10 h-10 text-red-600" />
              </div>
              <CardTitle className="text-2xl">Link inválido</CardTitle>
              <CardDescription className="text-base">
                Este link de download é inválido ou expirou. Por favor, solicite um novo e-book.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Link to="/ebook">
                <Button className="w-full">
                  Solicitar novo e-book
                </Button>
              </Link>
              <Link to="/">
                <Button variant="outline" className="w-full">
                  Voltar ao site
                </Button>
              </Link>
            </CardContent>
          </>
        )}
      </Card>
    </div>
  );
};

export default EbookDownload;
