
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
import ErrorBoundary from "./components/ErrorBoundary";
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
  <ErrorBoundary>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <ThemeProvider>
          <LanguageProvider>
            <AuthProvider>
              <TooltipProvider>
                <Toaster />
                <Sonner />
                <Routes>
                {/* Área pública - agora com AuthProvider disponível */}
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
                  <FloatingVideoProvider>
                    <ProtectedRoute>
                      <ErrorBoundary fallback={<div className="p-4 text-center">Erro ao carregar Layout</div>}>
                        <Suspense fallback={<LoadingSpinner message="Carregando Layout..." />}>
                          <LazyDashboardLayout />
                        </Suspense>
                      </ErrorBoundary>
                    </ProtectedRoute>
                  </FloatingVideoProvider>
                }>
                <Route index element={
                  <ErrorBoundary fallback={<div className="p-4 text-center">Erro ao carregar Dashboard</div>}>
                    <Suspense fallback={<LoadingSpinner message="Carregando Dashboard..." />}>
                      <LazyDashboard />
                    </Suspense>
                  </ErrorBoundary>
                } />
                <Route path="agents" element={
                  <ErrorBoundary fallback={<div className="p-4 text-center">Erro ao carregar Agentes</div>}>
                    <Suspense fallback={<LoadingSpinner message="Carregando Agentes..." />}>
                      <LazyAgentsPage />
                    </Suspense>
                  </ErrorBoundary>
                } />
                <Route path="agent" element={<Navigate to="agents" replace />} />
                <Route path="agent/:id" element={
                  <ErrorBoundary fallback={<div className="p-4 text-center">Erro ao carregar Agente</div>}>
                    <Suspense fallback={<LoadingSpinner message="Carregando Agente..." />}>
                      <LazyAgentPage />
                    </Suspense>
                  </ErrorBoundary>
                } />
                <Route path="crm" element={
                  <ErrorBoundary fallback={<div className="p-4 text-center">Erro ao carregar CRM</div>}>
                    <Suspense fallback={<LoadingSpinner message="Carregando CRM..." />}>
                      <LazyCRMSelectionPage />
                    </Suspense>
                  </ErrorBoundary>
                } />
                <Route path="crm/:agentId" element={
                  <ErrorBoundary fallback={<div className="p-4 text-center">Erro ao carregar CRM</div>}>
                    <Suspense fallback={<LoadingSpinner message="Carregando CRM..." />}>
                      <LazyCRMPage />
                    </Suspense>
                  </ErrorBoundary>
                } />
                <Route path="chat" element={
                  <ErrorBoundary fallback={<div className="p-4 text-center">Erro ao carregar Chat</div>}>
                    <Suspense fallback={<LoadingSpinner message="Carregando Chat..." />}>
                      <LazyChatPage />
                    </Suspense>
                  </ErrorBoundary>
                } />
                <Route path="campanhas" element={
                  <ErrorBoundary fallback={<div className="p-4 text-center">Erro ao carregar Campanhas</div>}>
                    <Suspense fallback={<LoadingSpinner message="Carregando Campanhas..." />}>
                      <LazyCampanhasSelectionPage />
                    </Suspense>
                  </ErrorBoundary>
                } />
                <Route path="campanhas/:agentId" element={
                  <ErrorBoundary fallback={<div className="p-4 text-center">Erro ao carregar Campanhas</div>}>
                    <Suspense fallback={<LoadingSpinner message="Carregando Campanhas..." />}>
                      <LazyCampanhasPage />
                    </Suspense>
                  </ErrorBoundary>
                } />
                <Route path="agenda" element={
                  <ErrorBoundary fallback={<div className="p-4 text-center">Erro ao carregar Agenda</div>}>
                    <Suspense fallback={<LoadingSpinner message="Carregando Agenda..." />}>
                      <LazyAgendaPage />
                    </Suspense>
                  </ErrorBoundary>
                } />
                <Route path="analytics" element={
                  <ErrorBoundary fallback={<div className="p-4 text-center">Erro ao carregar Analytics</div>}>
                    <Suspense fallback={<LoadingSpinner message="Carregando Analytics..." />}>
                      <LazyAnalyticsPage />
                    </Suspense>
                  </ErrorBoundary>
                } />
                <Route path="tutorials" element={
                  <ErrorBoundary fallback={<div className="p-4 text-center">Erro ao carregar Tutoriais</div>}>
                    <Suspense fallback={<LoadingSpinner message="Carregando Tutoriais..." />}>
                      <LazyTutorialsPage />
                    </Suspense>
                  </ErrorBoundary>
                } />
                <Route path="financeiro" element={
                  <ErrorBoundary fallback={<div className="p-4 text-center">Erro ao carregar Financeiro</div>}>
                    <Suspense fallback={<LoadingSpinner message="Carregando Financeiro..." />}>
                      <LazyFinanceiroPage />
                    </Suspense>
                  </ErrorBoundary>
                } />
                <Route path="settings" element={
                  <ErrorBoundary fallback={<div className="p-4 text-center">Erro ao carregar Configurações</div>}>
                    <Suspense fallback={<LoadingSpinner message="Carregando Configurações..." />}>
                      <LazySettingsPage />
                    </Suspense>
                  </ErrorBoundary>
                } />
              </Route>
              
              {/* Rota 404 */}
              <Route path="*" element={<NotFound />} />
            </Routes>
                </TooltipProvider>
              </AuthProvider>
            </LanguageProvider>
          </ThemeProvider>
        </BrowserRouter>
      </QueryClientProvider>
    </ErrorBoundary>
  );

export default App;
