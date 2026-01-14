import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, Mail } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { z } from "zod";
import { Link } from "react-router-dom";
import ebookCover from "@/assets/ebook-conquistas-cover.png";

const leadSchema = z.object({
  name: z.string().trim().min(2, "Nome deve ter pelo menos 2 caracteres").max(100),
  email: z.string().trim().email("E-mail inválido").max(255),
});

const EBOOK_NAME = "Pequeno Manual para Grandes Conquistas";

const Ebook = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
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
      const confirmationToken = crypto.randomUUID();

      const { error: insertError } = await supabase.from("leads").insert({
        name: formData.name.trim(),
        email: formData.email.trim().toLowerCase(),
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

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="max-w-md w-full text-center">
          <CardHeader className="space-y-4">
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle className="w-10 h-10 text-green-600" />
            </div>
            <CardTitle className="text-2xl">E-book enviado!</CardTitle>
            <p className="text-muted-foreground">
              Enviamos o link de download para <strong>{formData.email}</strong>. 
              Verifique sua caixa de entrada (e spam).
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-muted/50 p-4 rounded-lg">
              <Mail className="w-8 h-8 text-primary mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">
                Clique no link do e-mail para baixar o e-book.
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
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-sm space-y-6">
        {/* E-book Cover */}
        <div className="flex justify-center">
          <img
            src={ebookCover}
            alt={`Capa do E-book ${EBOOK_NAME}`}
            className="w-48 h-auto rounded-lg shadow-xl"
          />
        </div>

        {/* Form */}
        <Card>
          <CardHeader className="text-center pb-4">
            <CardTitle className="text-lg font-medium">
              Informe seu e-mail para receber o <span className="text-primary">{EBOOK_NAME}</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nome</Label>
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
                <Label htmlFor="email">E-mail</Label>
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

              <Button
                type="submit"
                className="w-full"
                size="lg"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Enviando..." : "Receber E-book"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Ebook;
