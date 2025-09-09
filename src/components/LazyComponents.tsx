import { lazy } from 'react';

// Lazy loading para componentes pesados do dashboard
export const LazyDashboard = lazy(() => import('../pages/Dashboard').catch(() => ({ default: () => <div>Erro ao carregar Dashboard</div> })));
export const LazyAgentPage = lazy(() => import('../pages/AgentPage').catch(() => ({ default: () => <div>Erro ao carregar Agente</div> })));
export const LazyAgentsPage = lazy(() => import('../pages/AgentsPage').catch(() => ({ default: () => <div>Erro ao carregar Agentes</div> })));
export const LazyAnalyticsPage = lazy(() => import('../pages/AnalyticsPage').catch(() => ({ default: () => <div>Erro ao carregar Analytics</div> })));
export const LazyCRMPage = lazy(() => import('../pages/CRMPage').catch(() => ({ default: () => <div>Erro ao carregar CRM</div> })));
export const LazyCRMSelectionPage = lazy(() => import('../pages/CRMSelectionPage').catch(() => ({ default: () => <div>Erro ao carregar Seleção CRM</div> })));
export const LazyChatPage = lazy(() => import('../pages/ChatPage').catch(() => ({ default: () => <div>Erro ao carregar Chat</div> })));
export const LazyCampanhasPage = lazy(() => import('../pages/CampanhasPage').catch(() => ({ default: () => <div>Erro ao carregar Campanhas</div> })));
export const LazyCampanhasSelectionPage = lazy(() => import('../pages/CampanhasSelectionPage').catch(() => ({ default: () => <div>Erro ao carregar Seleção Campanhas</div> })));
export const LazySettingsPage = lazy(() => import('../pages/SettingsPage').catch(() => ({ default: () => <div>Erro ao carregar Configurações</div> })));
export const LazyAgendaPage = lazy(() => import('../pages/AgendaPage').catch(() => ({ default: () => <div>Erro ao carregar Agenda</div> })));
export const LazyFinanceiroPage = lazy(() => import('../pages/FinanceiroPage').catch(() => ({ default: () => <div>Erro ao carregar Financeiro</div> })));
export const LazyTutorialsPage = lazy(() => import('../pages/TutorialsPage').catch(() => ({ default: () => <div>Erro ao carregar Tutoriais</div> })));

// Layout do dashboard
export const LazyDashboardLayout = lazy(() => import('./DashboardLayout').catch(() => ({ default: () => <div>Erro ao carregar Layout</div> })));

// Componentes pesados da landing page
export const LazyPricingV2 = lazy(() => import('./landing/PricingV2'));
export const LazyROICalculator = lazy(() => import('./landing/ROICalculator'));
export const LazyComparisonTable = lazy(() => import('./landing/ComparisonTable'));
export const LazyTestimonials = lazy(() => import('./landing/Testimonials'));
export const LazyFAQ = lazy(() => import('./landing/FAQ'));