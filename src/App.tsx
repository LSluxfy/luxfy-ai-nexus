
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Suspense } from "react";
import LandingPage from "./pages/LandingPage";
import Login from "./pages/Login";
import Register from "./pages/Register";
import VerifyEmail from "./pages/VerifyEmail";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import { PendingInvoice } from "./pages/PendingInvoice";
import NotFound from "./pages/NotFound";
import PublicTutorialsPage from "./pages/PublicTutorialsPage";
import AccountInactive from "./pages/AccountInactive";
import SelectPlan from "./pages/SelectPlan";
import MigrateUser from "./pages/MigrateUser";
import LoadingSpinner from "./components/LoadingSpinner";
import { AuthProvider } from "./contexts/AuthContext";
import { ThemeProvider } from "./contexts/ThemeContext";
import { LanguageProvider } from "./contexts/LanguageContext";
import { FloatingVideoProvider } from "./contexts/FloatingVideoContext";
import ProtectedRoute from "./components/ProtectedRoute";
import './i18n/config';

// Lazy imports para otimização
import {
  LazyDashboard,
  LazyDashboardLayout,
  LazyAgentPage,
  LazyAgentsPage,
  LazyAnalyticsPage,
  LazyCRMPage,
  LazyCRMSelectionPage,
  LazyChatPage,
  LazyCampanhasPage,
  LazyCampanhasSelectionPage,
  LazySettingsPage,
  LazyAgendaPage,
  LazyFinanceiroPage,
  LazyTutorialsPage
} from "./components/LazyComponents";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <ThemeProvider>
        <LanguageProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <Routes>
              {/* Área pública - sem contextos pesados */}
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<Login />} />
              <Route path="/migrate-user" element={<MigrateUser />} />
              <Route path="/register" element={<Register />} />
              <Route path="/verify-email" element={<VerifyEmail />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/reset-password" element={<ResetPassword />} />
              <Route path="/pending-invoice" element={<PendingInvoice />} />
              <Route path="/account-inactive" element={<AccountInactive />} />
              <Route path="/select-plan" element={<SelectPlan />} />
              <Route path="/tutorials" element={<PublicTutorialsPage />} />
              
              {/* Área do Dashboard - com contextos completos e lazy loading */}
              <Route path="/dashboard" element={
                <AuthProvider>
                  <FloatingVideoProvider>
                    <ProtectedRoute>
                      <Suspense fallback={<LoadingSpinner />}>
                        <LazyDashboardLayout />
                      </Suspense>
                    </ProtectedRoute>
                  </FloatingVideoProvider>
                </AuthProvider>
              }>
                <Route index element={
                  <Suspense fallback={<LoadingSpinner />}>
                    <LazyDashboard />
                  </Suspense>
                } />
                <Route path="agents" element={
                  <Suspense fallback={<LoadingSpinner />}>
                    <LazyAgentsPage />
                  </Suspense>
                } />
                <Route path="agent" element={<Navigate to="agents" replace />} />
                <Route path="agent/:id" element={
                  <Suspense fallback={<LoadingSpinner />}>
                    <LazyAgentPage />
                  </Suspense>
                } />
                <Route path="crm" element={
                  <Suspense fallback={<LoadingSpinner />}>
                    <LazyCRMSelectionPage />
                  </Suspense>
                } />
                <Route path="crm/:agentId" element={
                  <Suspense fallback={<LoadingSpinner />}>
                    <LazyCRMPage />
                  </Suspense>
                } />
                <Route path="chat" element={
                  <Suspense fallback={<LoadingSpinner />}>
                    <LazyChatPage />
                  </Suspense>
                } />
                <Route path="campanhas" element={
                  <Suspense fallback={<LoadingSpinner />}>
                    <LazyCampanhasSelectionPage />
                  </Suspense>
                } />
                <Route path="campanhas/:agentId" element={
                  <Suspense fallback={<LoadingSpinner />}>
                    <LazyCampanhasPage />
                  </Suspense>
                } />
                <Route path="agenda" element={
                  <Suspense fallback={<LoadingSpinner />}>
                    <LazyAgendaPage />
                  </Suspense>
                } />
                <Route path="analytics" element={
                  <Suspense fallback={<LoadingSpinner />}>
                    <LazyAnalyticsPage />
                  </Suspense>
                } />
                <Route path="tutorials" element={
                  <Suspense fallback={<LoadingSpinner />}>
                    <LazyTutorialsPage />
                  </Suspense>
                } />
                <Route path="financeiro" element={
                  <Suspense fallback={<LoadingSpinner />}>
                    <LazyFinanceiroPage />
                  </Suspense>
                } />
                <Route path="settings" element={
                  <Suspense fallback={<LoadingSpinner />}>
                    <LazySettingsPage />
                  </Suspense>
                } />
              </Route>
              
              {/* Rota 404 */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </TooltipProvider>
        </LanguageProvider>
      </ThemeProvider>
    </BrowserRouter>
  </QueryClientProvider>
);

export default App;
