import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, CheckCircle, Download, Mail, ArrowRight, Sparkles, Target, Brain, Heart } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { z } from "zod";
import Logo from "@/components/Logo";
import { Link } from "react-router-dom";
import ebookCover from "@/assets/ebook-conquistas-cover.png";

const leadSchema = z.object({
  name: z.string().trim().min(2, "Nome deve ter pelo menos 2 caracteres").max(100),
  email: z.string().trim().email("E-mail inválido").max(255),
  phone: z.string().trim().optional(),
});

const Ebook = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const validation = leadSchema.safeParse(formData);
    if (!validation.success) {
      const fieldErrors: Record<string, string> = {};
      validation.error.errors.forEach((err) => {
        if (err.path[0]) {
          fieldErrors[err.path[0] as string] = err.message;
        }
      });
      setErrors(fieldErrors);
      return;
    }

    setIsSubmitting(true);

    try {
      // Generate confirmation token
      const confirmationToken = crypto.randomUUID();

      // Insert lead into database
      const { error: insertError } = await supabase.from("leads").insert({
        name: formData.name.trim(),
        email: formData.email.trim().toLowerCase(),
        phone: formData.phone?.trim() || null,
        source: "ebook",
        confirmation_token: confirmationToken,
      });

      if (insertError) {
        if (insertError.code === "23505") {
          toast.error("Este e-mail já está cadastrado. Verifique sua caixa de entrada.");
          return;
        }
        throw insertError;
      }

      // Send email with download link
      const { error: emailError } = await supabase.functions.invoke("send-ebook-email", {
        body: {
          name: formData.name.trim(),
          email: formData.email.trim().toLowerCase(),
          confirmationToken,
        },
      });

      if (emailError) {
        console.error("Error sending email:", emailError);
        toast.error("Erro ao enviar e-mail. Tente novamente.");
        return;
      }

      setIsSuccess(true);
      toast.success("E-book enviado para seu e-mail!");
    } catch (error) {
      console.error("Error submitting lead:", error);
      toast.error("Erro ao processar sua solicitação. Tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const benefits = [
    {
      icon: Brain,
      title: "Clareza Mental",
      description: "Entenda como seus pensamentos moldam sua realidade",
    },
    {
      icon: Target,
      title: "Foco nos Objetivos",
      description: "Aprenda a tomar decisões alinhadas com seus sonhos",
    },
    {
      icon: Heart,
      title: "Equilíbrio Emocional",
      description: "Desenvolva controle sobre suas emoções e reações",
    },
    {
      icon: Sparkles,
      title: "Transformação Real",
      description: "Comece sua jornada de autodesenvolvimento hoje",
    },
  ];

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 flex items-center justify-center p-4">
        <Card className="max-w-md w-full text-center">
          <CardHeader className="space-y-4">
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle className="w-10 h-10 text-green-600" />
            </div>
            <CardTitle className="text-2xl">E-book enviado!</CardTitle>
            <CardDescription className="text-base">
              Enviamos o link de download para <strong>{formData.email}</strong>. 
              Verifique sua caixa de entrada (e spam) nos próximos minutos.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-muted/50 p-4 rounded-lg">
              <Mail className="w-8 h-8 text-primary mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">
                Ao clicar no link do e-mail, você confirmará seu cadastro e terá acesso ao download do e-book.
              </p>
            </div>
            <Link to="/">
              <Button variant="outline" className="w-full mt-4">
                Voltar ao site
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <Link to="/">
            <Logo size="sm" />
          </Link>
          <Link to="/login">
            <Button variant="ghost" size="sm">
              Já tenho conta
            </Button>
          </Link>
        </div>
      </header>

      <div className="container mx-auto px-4 pt-24 pb-12">
        <div className="grid lg:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
          {/* Left Column - Cover + Benefits */}
          <div className="space-y-8">
            {/* E-book Cover */}
            <div className="flex justify-center lg:justify-start">
              <div className="relative">
                <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full" />
                <img
                  src={ebookCover}
                  alt="Capa do E-book Pequeno Manual para Grandes Conquistas"
                  className="relative w-56 sm:w-64 lg:w-72 h-auto rounded-lg shadow-2xl"
                />
              </div>
            </div>

            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium">
                <BookOpen className="w-4 h-4" />
                Guia de Autodesenvolvimento
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight">
                Pequeno Manual para{" "}
                <span className="text-primary">Grandes Conquistas</span>
              </h1>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Descubra como tomar as rédeas da sua vida e construir o futuro que você merece. 
                Um guia prático de autodesenvolvimento para quem quer sair do piloto automático 
                e viver com propósito.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              {benefits.map((benefit, index) => (
                <div
                  key={index}
                  className="flex items-start gap-3 p-4 bg-card rounded-xl border"
                >
                  <div className="p-2 bg-primary/10 rounded-lg shrink-0">
                    <benefit.icon className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm">{benefit.title}</h3>
                    <p className="text-xs text-muted-foreground mt-1">
                      {benefit.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Download className="w-4 h-4" />
                <span>PDF gratuito</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                <span>Entrega por e-mail</span>
              </div>
            </div>
          </div>

          {/* Right Column - Form */}
          <div className="lg:pl-8">
            <Card className="shadow-xl border-2">
              <CardHeader className="text-center pb-4">
                <CardTitle className="text-xl">Baixe agora gratuitamente</CardTitle>
                <CardDescription>
                  Preencha seus dados e receba o e-book no seu e-mail
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nome completo *</Label>
                    <Input
                      id="name"
                      name="name"
                      type="text"
                      placeholder="Seu nome"
                      value={formData.name}
                      onChange={handleChange}
                      className={errors.name ? "border-destructive" : ""}
                      disabled={isSubmitting}
                    />
                    {errors.name && (
                      <p className="text-xs text-destructive">{errors.name}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">E-mail *</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="seu@email.com"
                      value={formData.email}
                      onChange={handleChange}
                      className={errors.email ? "border-destructive" : ""}
                      disabled={isSubmitting}
                    />
                    {errors.email && (
                      <p className="text-xs text-destructive">{errors.email}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">WhatsApp (opcional)</Label>
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      placeholder="(11) 99999-9999"
                      value={formData.phone}
                      onChange={handleChange}
                      disabled={isSubmitting}
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full"
                    size="lg"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      "Enviando..."
                    ) : (
                      <>
                        Quero meu e-book grátis
                        <ArrowRight className="ml-2 w-4 h-4" />
                      </>
                    )}
                  </Button>

                  <p className="text-xs text-center text-muted-foreground">
                    Ao se cadastrar, você concorda em receber comunicações sobre 
                    desenvolvimento pessoal. Você pode cancelar a qualquer momento.
                  </p>
                </form>
              </CardContent>
            </Card>

            {/* Author Info */}
            <div className="mt-6 p-4 bg-card rounded-xl border text-center">
              <p className="text-sm text-muted-foreground">
                <span className="font-semibold text-foreground">Agostinho Caldeira</span>
                <br />
                Especialista em Desenvolvimento Pessoal e criador do método PDI - Carreira & Vida
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Ebook;
