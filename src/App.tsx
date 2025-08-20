
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import UnifiedLogin from "./components/UnifiedLogin";
import AdminDashboard from "./pages/AdminDashboard";
import ClinicaDashboard from "./pages/ClinicaDashboard";
import AdminClinicaPacientes from "./pages/AdminClinicaPacientes";
import PacienteVideos from "./pages/PacienteVideos";
import PacientePublic from "./pages/PacientePublic";
import PrintCard from "./pages/PrintCard";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<UnifiedLogin />} />
          <Route path="/clinica/dashboard" element={<ClinicaDashboard />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/clinica/:clinicaId/pacientes" element={<AdminClinicaPacientes />} />
          <Route path="/paciente/:pacienteId/videos" element={<PacienteVideos />} />
          <Route path="/paciente/:pacienteId" element={<PacientePublic />} />
          <Route path="/print-card/:pacienteId" element={<PrintCard />} />
          <Route path="/home" element={<Index />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
