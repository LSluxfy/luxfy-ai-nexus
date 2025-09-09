import { lazy } from 'react';

// Lazy loading para componentes pesados do dashboard
export const LazyDashboard = lazy(() => import('../pages/Dashboard'));
export const LazyAgentPage = lazy(() => import('../pages/AgentPage'));
export const LazyAgentsPage = lazy(() => import('../pages/AgentsPage'));
export const LazyAnalyticsPage = lazy(() => import('../pages/AnalyticsPage'));
export const LazyCRMPage = lazy(() => import('../pages/CRMPage'));
export const LazyCRMSelectionPage = lazy(() => import('../pages/CRMSelectionPage'));
export const LazyChatPage = lazy(() => import('../pages/ChatPage'));
export const LazyCampanhasPage = lazy(() => import('../pages/CampanhasPage'));
export const LazyCampanhasSelectionPage = lazy(() => import('../pages/CampanhasSelectionPage'));
export const LazySettingsPage = lazy(() => import('../pages/SettingsPage'));
export const LazyAgendaPage = lazy(() => import('../pages/AgendaPage'));
export const LazyFinanceiroPage = lazy(() => import('../pages/FinanceiroPage'));
export const LazyTutorialsPage = lazy(() => import('../pages/TutorialsPage'));

// Layout do dashboard
export const LazyDashboardLayout = lazy(() => import('./DashboardLayout'));

// Componentes pesados da landing page
export const LazyPricingV2 = lazy(() => import('./landing/PricingV2'));
export const LazyROICalculator = lazy(() => import('./landing/ROICalculator'));
export const LazyComparisonTable = lazy(() => import('./landing/ComparisonTable'));
export const LazyTestimonials = lazy(() => import('./landing/Testimonials'));
export const LazyFAQ = lazy(() => import('./landing/FAQ'));