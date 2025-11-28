import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { LanguageProvider } from "@/contexts/LanguageContext";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Signup from "./pages/Signup";
import Onboarding from "./pages/Onboarding";
import Home from "./pages/Home";
import Diario from "./pages/Diario";
import ConstrucaoGuiada from "./pages/ConstrucaoGuiada";
import Ferramentas from "./pages/Ferramentas";
import Suporte from "./pages/Suporte";
import Admin from "./pages/Admin";
import RodaDaVida from "./pages/RodaDaVida";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <LanguageProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Navigate to="/signup" replace />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/onboarding" element={<Onboarding />} />
            <Route path="/home" element={<Home />} />
            <Route path="/diario" element={<Diario />} />
            <Route path="/construcao-guiada" element={<ConstrucaoGuiada />} />
            <Route path="/ferramentas" element={<Ferramentas />} />
            <Route path="/suporte" element={<Suporte />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/roda-da-vida" element={<RodaDaVida />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </LanguageProvider>
  </QueryClientProvider>
);

export default App;
