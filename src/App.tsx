import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { UnsavedChangesProvider } from "@/contexts/UnsavedChangesContext";
import { SubscriptionProvider } from "@/contexts/SubscriptionContext";
import ScrollToTop from "@/components/ScrollToTop";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Landing from "./pages/Landing";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Onboarding from "./pages/Onboarding";
import Home from "./pages/Home";
import Diario from "./pages/Diario";
import ConstrucaoGuiada from "./pages/ConstrucaoGuiada";
import Ferramentas from "./pages/Ferramentas";
import Suporte from "./pages/Suporte";
import Admin from "./pages/Admin";
import AdminUsuarios from "./pages/AdminUsuarios";
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

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutos
      gcTime: 1000 * 60 * 30, // 30 minutos (cacheTime)
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <LanguageProvider>
      <UnsavedChangesProvider>
        <SubscriptionProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
            <ScrollToTop />
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/leadp" element={<Landing />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/onboarding" element={<Onboarding />} />
              <Route path="/home" element={<Home />} />
              <Route path="/diario" element={<Diario />} />
              <Route path="/construcao-guiada" element={<ConstrucaoGuiada />} />
              <Route path="/ferramentas" element={<Ferramentas />} />
              <Route path="/suporte" element={<Suporte />} />
              <Route path="/admin" element={<Admin />} />
              <Route path="/admin/usuarios" element={<AdminUsuarios />} />
              <Route path="/roda-da-vida" element={<RodaDaVida />} />
              <Route path="/ferramentas/valores" element={<Valores />} />
              <Route path="/ferramentas/eisenhower" element={<MatrizEisenhower />} />
              <Route path="/ferramentas/crencas" element={<Crencas />} />
              <Route path="/ferramentas/swot" element={<AnaliseSwot />} />
              <Route path="/ferramentas/smart" element={<MetodoSmart />} />
              <Route path="/ferramentas/metodo-vvd" element={<MetodoVvd />} />
              <Route path="/ferramentas/autoavaliacao-360" element={<Autoavaliacao360 />} />
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
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
            </BrowserRouter>
          </TooltipProvider>
        </SubscriptionProvider>
      </UnsavedChangesProvider>
    </LanguageProvider>
  </QueryClientProvider>
);

export default App;
