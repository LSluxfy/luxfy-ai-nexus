
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import Login from "./pages/Login";
import Register from "./pages/Register";
import VerifyEmail from "./pages/VerifyEmail";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import { PendingInvoice } from "./pages/PendingInvoice";
import NotFound from "./pages/NotFound";
import DashboardLayout from "./components/DashboardLayout";
import TutorialsPage from "./pages/TutorialsPage";
import PublicTutorialsPage from "./pages/PublicTutorialsPage";
import Dashboard from "./pages/Dashboard";
import AgentPage from "./pages/AgentPage";
import CRMPage from "./pages/CRMPage";
import CRMSelectionPage from "./pages/CRMSelectionPage";
import AgentsPage from "./pages/AgentsPage";
import ChatPage from "./pages/ChatPage";
import CampanhasPage from "./pages/CampanhasPage";
import CampanhasSelectionPage from "./pages/CampanhasSelectionPage";
import AnalyticsPage from "./pages/AnalyticsPage";
import SettingsPage from "./pages/SettingsPage";
import AgendaPage from "./pages/AgendaPage";
import FinanceiroPage from "./pages/FinanceiroPage";
import AccountInactive from "./pages/AccountInactive";
import { AuthProvider } from "./contexts/AuthContext";
import { ThemeProvider } from "./contexts/ThemeContext";
import { LanguageProvider } from "./contexts/LanguageContext";
import { FloatingVideoProvider } from "./contexts/FloatingVideoContext";
import ProtectedRoute from "./components/ProtectedRoute";
import './i18n/config';

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>
          <ThemeProvider>
            <LanguageProvider>
              <FloatingVideoProvider>
                <TooltipProvider>
              <Toaster />
              <Sonner />
              <Routes>
                {/* Área pública */}
                <Route path="/" element={<LandingPage />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/verify-email" element={<VerifyEmail />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/reset-password" element={<ResetPassword />} />
                <Route path="/pending-invoice" element={<PendingInvoice />} />
                <Route path="/account-inactive" element={<AccountInactive />} />
                <Route path="/tutorials" element={<PublicTutorialsPage />} />
                
                {/* Área do Dashboard - Protegida */}
                <Route path="/dashboard" element={
                  <ProtectedRoute>
                    <DashboardLayout />
                  </ProtectedRoute>
                }>
                  <Route index element={<Dashboard />} />
                  <Route path="agents" element={<AgentsPage />} />
                  <Route path="agent" element={<Navigate to="agents" replace />} />
                  <Route path="agent/:id" element={<AgentPage />} />
                  <Route path="crm" element={<CRMSelectionPage />} />
                  <Route path="crm/:agentId" element={<CRMPage />} />
                  <Route path="chat" element={<ChatPage />} />
                  <Route path="campanhas" element={<CampanhasSelectionPage />} />
                  <Route path="campanhas/:agentId" element={<CampanhasPage />} />
                  <Route path="agenda" element={<AgendaPage />} />
                  <Route path="analytics" element={<AnalyticsPage />} />
                  <Route path="tutorials" element={<TutorialsPage />} />
                  <Route path="financeiro" element={<FinanceiroPage />} />
                  <Route path="settings" element={<SettingsPage />} />
                </Route>
                
                {/* Rota 404 */}
                <Route path="*" element={<NotFound />} />
                </Routes>
                </TooltipProvider>
              </FloatingVideoProvider>
            </LanguageProvider>
          </ThemeProvider>
        </AuthProvider>
      </BrowserRouter>
  </QueryClientProvider>
);

export default App;
