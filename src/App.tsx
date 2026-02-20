import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { UnsavedChangesProvider } from "@/contexts/UnsavedChangesContext";
import { SubscriptionProvider } from "@/contexts/SubscriptionContext";
import { ActionCelebrationProvider } from "@/contexts/ActionCelebrationContext";
import ScrollToTop from "@/components/ScrollToTop";
import { usePageTracking } from "@/hooks/usePageTracking";
import { identifyUser, resetPostHog } from "@/lib/posthog";
import { supabase } from "@/integrations/supabase/client";
import { useEffect } from "react";
import Index from "./pages/Index";
import SubscriberLanding from "./pages/SubscriberLanding";
import NotFound from "./pages/NotFound";
import Landing from "./pages/Landing";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Onboarding from "./pages/Onboarding";
import Home from "./pages/Home";
import ControlPanel from "./pages/ControlPanel";
import Diario from "./pages/Diario";
import ConstrucaoGuiada from "./pages/ConstrucaoGuiada";
import Ferramentas from "./pages/Ferramentas";
import Suporte from "./pages/Suporte";
import Admin from "./pages/Admin";
import AdminUsuarios from "./pages/AdminUsuarios";
import AdminViewPDI from "./pages/AdminViewPDI";
import RodaDaVida from "./pages/RodaDaVida";
import Valores from "./pages/Valores";
import MatrizEisenhower from "./pages/MatrizEisenhower";
import Crencas from "./pages/Crencas";
import AnaliseSwot from "./pages/AnaliseSwot";
import MetodoSmart from "./pages/MetodoSmart";
import MetodoVvd from "./pages/MetodoVvd";
import Autoavaliacao360 from "./pages/Autoavaliacao360";
import Integracoes from "./pages/Integracoes";
import CadastrarEmpresa from "./pages/CadastrarEmpresa";
import DashboardEmpresa from "./pages/DashboardEmpresa";
import GestaoPDIs from "./pages/GestaoPDIs";
import Perfil from "./pages/Perfil";
import FAQ from "./pages/FAQ";
import Empresas from "./pages/Empresas";
import Ebook from "./pages/Ebook";
import EbookDownload from "./pages/EbookDownload";
import EbookBancario from "./pages/EbookBancario";
import EbookBancarioDownload from "./pages/EbookBancarioDownload";
import Tutorial from "./pages/Tutorial";
import TutorialEmpresa from "./pages/TutorialEmpresa";
import Sobre from "./pages/Sobre";
import Relatorios from "./pages/Relatorios";
import PaymentSuccess from "./pages/PaymentSuccess";
import PlanoVidaQuemSou from "./pages/PlanoVidaQuemSou";
import PlanoVidaParaOnde from "./pages/PlanoVidaParaOnde";
import PlanoVidaComoChegar from "./pages/PlanoVidaComoChegar";
import Reflexao from "./pages/Reflexao";
import Progresso from "./pages/Progresso";
import ListaPendencias from "./pages/ListaPendencias";
import LandingNova from "./pages/LandingNova";
import Quiz from "./pages/Quiz";
import DesafioCodigo from "./pages/DesafioCodigo";
import CheckoutDireto from "./pages/CheckoutDireto";
import ExperienciaNarrativa from "./pages/ExperienciaNarrativa";
import ExperienciaTest from "./pages/ExperienciaTest";
import Jornada from "./pages/Jornada";
import JornadaFinalPreview from "./pages/JornadaFinalPreview";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      gcTime: 1000 * 60 * 30,
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

const PageTracker = () => {
  usePageTracking();
  return null;
};

const PostHogIdentifier = () => {
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user) {
        identifyUser(session.user.id, { email: session.user.email });
      } else if (event === 'SIGNED_OUT') {
        resetPostHog();
      }
    });
    return () => subscription.unsubscribe();
  }, []);
  return null;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <LanguageProvider>
      <UnsavedChangesProvider>
        <SubscriptionProvider>
          <ActionCelebrationProvider>
            <TooltipProvider>
              <Toaster />
              <Sonner />
              <BrowserRouter>
              <ScrollToTop />
              <PageTracker />
              <PostHogIdentifier />
              <Routes>
                <Route path="/" element={<LandingNova />} />
                <Route path="/news" element={<SubscriberLanding />} />
                <Route path="/leadp2" element={<Index />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/onboarding" element={<Onboarding />} />
                <Route path="/home" element={<Home />} />
                <Route path="/control-panel" element={<ControlPanel />} />
                <Route path="/diario" element={<Diario />} />
                <Route path="/construcao-guiada" element={<ConstrucaoGuiada />} />
                <Route path="/ferramentas" element={<Ferramentas />} />
                <Route path="/suporte" element={<Suporte />} />
                <Route path="/admin" element={<Admin />} />
                <Route path="/admin/usuarios" element={<AdminUsuarios />} />
                <Route path="/admin/pdi/:userId" element={<AdminViewPDI />} />
                <Route path="/roda-da-vida" element={<RodaDaVida />} />
                <Route path="/ferramentas/valores" element={<Valores />} />
                <Route path="/ferramentas/eisenhower" element={<MatrizEisenhower />} />
                <Route path="/ferramentas/crencas" element={<Crencas />} />
                <Route path="/ferramentas/swot" element={<AnaliseSwot />} />
                <Route path="/ferramentas/smart" element={<MetodoSmart />} />
                <Route path="/ferramentas/metodo-vvd" element={<MetodoVvd />} />
                <Route path="/ferramentas/autoavaliacao-360" element={<Autoavaliacao360 />} />
                <Route path="/ferramentas/lista-pendencias" element={<ListaPendencias />} />
                <Route path="/integracoes" element={<Integracoes />} />
                <Route path="/cadastrar-empresa" element={<CadastrarEmpresa />} />
                <Route path="/dashboard-empresa" element={<DashboardEmpresa />} />
                <Route path="/gestao-pdis" element={<GestaoPDIs />} />
                <Route path="/perfil" element={<Perfil />} />
                <Route path="/faq" element={<FAQ />} />
                <Route path="/empresas" element={<Empresas />} />
                <Route path="/ebook" element={<Ebook />} />
                <Route path="/ebook-download" element={<EbookDownload />} />
                <Route path="/ebook-bancario" element={<EbookBancario />} />
                <Route path="/ebook-bancario-download" element={<EbookBancarioDownload />} />
                <Route path="/tutorial" element={<Tutorial />} />
                <Route path="/tutorial-empresa" element={<TutorialEmpresa />} />
                <Route path="/sobre" element={<Sobre />} />
                <Route path="/relatorios" element={<Relatorios />} />
                <Route path="/payment-success" element={<PaymentSuccess />} />
                <Route path="/plano-vida/quem-sou" element={<PlanoVidaQuemSou />} />
                <Route path="/plano-vida/para-onde" element={<PlanoVidaParaOnde />} />
                <Route path="/plano-vida/como-chegar" element={<PlanoVidaComoChegar />} />
                <Route path="/reflexao" element={<Reflexao />} />
                <Route path="/progresso" element={<Progresso />} />
                <Route path="/quiz" element={<Quiz />} />
                <Route path="/desafio-30-dias" element={<DesafioCodigo />} />
                <Route path="/checkout-direto" element={<CheckoutDireto />} />
                <Route path="/experiencia" element={<ExperienciaNarrativa />} />
                <Route path="/experiencia-test" element={<ExperienciaTest />} />
                <Route path="/jornada" element={<Jornada />} />
                <Route path="/jornada-final-preview" element={<JornadaFinalPreview />} />
                <Route path="/comecar" element={<SubscriberLanding />} />
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>
              </BrowserRouter>
            </TooltipProvider>
          </ActionCelebrationProvider>
        </SubscriptionProvider>
      </UnsavedChangesProvider>
    </LanguageProvider>
  </QueryClientProvider>
);

export default App;
