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
          // Vendor chunks
          react: ['react', 'react-dom'],
          router: ['react-router-dom'],
          ui: ['@radix-ui/react-dialog', '@radix-ui/react-dropdown-menu', '@radix-ui/react-tabs'],
          charts: ['recharts'],
          
          // App chunks
          landing: [
            './src/pages/LandingPage.tsx',
            './src/components/landing/HeroSection.tsx',
            './src/components/landing/AnimatedChatMockup.tsx'
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
    cssCodeSplit: true,
    sourcemap: false
  },
  esbuild: {
    drop: mode === 'production' ? ['console', 'debugger'] : []
  }
}));
