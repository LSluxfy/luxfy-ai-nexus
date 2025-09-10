import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    mode === 'development' &&
    componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // Ultra-critical vendor chunks
          'react-core': ['react', 'react-dom'],
          'react-router': ['react-router-dom'],
          'ui-core': ['@radix-ui/react-dialog', '@radix-ui/react-alert-dialog'],
          'ui-extended': ['@radix-ui/react-dropdown-menu', '@radix-ui/react-tabs'],
          charts: ['recharts'],
          i18n: ['react-i18next', 'i18next'],
          
          // Ultra-critical landing chunks
          'landing-hero': [
            './src/components/landing/HeroSection.tsx',
            './src/components/landing/HeroSectionOptimized.tsx',
            './src/components/landing/StaticHeroSkeleton.tsx'
          ],
          'landing-core': [
            './src/pages/LandingPage.tsx'
          ],
          'landing-video': [
            './src/components/landing/AnimatedChatMockup.tsx',
            './src/components/PandaVideoPlayer.tsx'
          ],
          'landing-sections': [
            './src/components/landing/LazyRealResults.tsx',
            './src/components/landing/LazyHowItWorks.tsx',
            './src/components/landing/LazyBeforeAfter.tsx'
          ],
          dashboard: [
            './src/pages/Dashboard.tsx',
            './src/components/DashboardLayout.tsx'
          ],
          agents: [
            './src/pages/AgentPage.tsx',
            './src/pages/AgentsPage.tsx'
          ],
          crm: [
            './src/pages/CRMPage.tsx',
            './src/components/crm/CRMKanban.tsx'
          ]
        }
      }
    },
    target: 'esnext',
    minify: 'esbuild',
    cssCodeSplit: false, // Inline critical CSS
    sourcemap: false,
    chunkSizeWarningLimit: 1000
  },
  esbuild: {
    drop: mode === 'production' ? ['console', 'debugger'] : []
  }
}));
