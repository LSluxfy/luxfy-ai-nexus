
import React from 'react';
import { Outlet } from 'react-router-dom';
import DashboardSidebar from './DashboardSidebar';
import FloatingVideoPlayer from './FloatingVideoPlayer';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { Button } from './ui/button';
import { LogOut, User, Moon, Sun } from 'lucide-react';
import { SidebarProvider, SidebarTrigger } from './ui/sidebar';
import LanguageSelector from './LanguageSelector';

const DashboardLayout = () => {
  const { user, signOut } = useAuth();
  const { isDarkMode, toggleDarkMode } = useTheme();

  return (
    <SidebarProvider defaultOpen={false}>
      <div className={`flex min-h-screen w-full ${isDarkMode ? 'dark' : ''}`}>
        <DashboardSidebar />
        
        <div className="flex-1 flex flex-col">
          <header className="bg-sidebar-background border-b border-sidebar-border p-4 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <SidebarTrigger />
              <h1 className="text-xl font-bold text-sidebar-foreground">Dashboard</h1>
            </div>
            
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleDarkMode}
                className="text-sidebar-foreground"
              >
                {isDarkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              </Button>
              <LanguageSelector />
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-full bg-sidebar-primary/20 flex items-center justify-center">
                  <User className="h-4 w-4 text-sidebar-primary" />
                </div>
                <div className="text-sm">
                  <div className="font-medium text-sidebar-foreground">{user?.name} {user?.lastName}</div>
                  <div className="text-xs text-sidebar-foreground/60">{user?.email}</div>
                </div>
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={signOut} 
                className="flex items-center gap-1 text-sidebar-foreground border-sidebar-border hover:bg-sidebar-accent"
              >
                <LogOut className="h-4 w-4" />
                Sair
              </Button>
            </div>
          </header>
          
          <div className="flex-1 p-6 bg-background text-foreground">
            <Outlet />
          </div>
        </div>
        
        {/* Floating Video Player */}
        <FloatingVideoPlayer />
      </div>
    </SidebarProvider>
  );
};

export default DashboardLayout;
