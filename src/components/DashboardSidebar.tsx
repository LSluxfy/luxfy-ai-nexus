import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { HomeIcon, BookUserIcon, Users, MessagesSquare, BarChart3, Settings, UserPlus, Calendar, CreditCard, Megaphone, BookOpen } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAgents } from '@/hooks/use-agent';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar';

const DashboardSidebar = () => {
  const { userPlan, agents } = useAgents();
  const { open, setOpen } = useSidebar();
  const location = useLocation();
  const [isHovering, setIsHovering] = useState(false);

  const links = [
    {
      label: "Dashboard",
      href: "/dashboard",
      icon: HomeIcon,
    },
    {
      label: "Agentes",
      href: "/dashboard/agents",
      icon: UserPlus,
      badge: userPlan ? `${agents.length}/${userPlan.max_agents}` : '0/1'
    },
    // Só mostrar "Agente" se há agentes criados
    ...(agents.length > 0 ? [{
      label: "Agente",
      href: "/dashboard/agent",
      icon: BookUserIcon,
    }] : []),
    {
      label: "CRM",
      href: "/dashboard/crm",
      icon: Users,
    },
    {
      label: "Chat",
      href: "/dashboard/chat",
      icon: MessagesSquare,
    },
    {
      label: "Campanhas",
      href: "/dashboard/campanhas",
      icon: Megaphone,
    },
    {
      label: "Agenda",
      href: "/dashboard/agenda",
      icon: Calendar,
    },
    {
      label: "Análises",
      href: "/dashboard/analytics",
      icon: BarChart3,
    },
    {
      label: "Tutoriais",
      href: "/dashboard/tutorials",
      icon: BookOpen,
    },
    {
      label: "Financeiro",
      href: "/dashboard/financeiro",
      icon: CreditCard,
    },
    {
      label: "Configurações",
      href: "/dashboard/settings",
      icon: Settings,
    }
  ];

  const currentPath = location.pathname;
  const isActive = (path: string) => currentPath === path || (path !== '/dashboard' && currentPath.startsWith(path));
  const hasActiveRoute = links.some(link => isActive(link.href));

  // Auto-hover functionality
  const handleMouseEnter = () => {
    setIsHovering(true);
    if (!open) {
      setOpen(true);
    }
  };

  const handleMouseLeave = () => {
    setIsHovering(false);
    // Delay to close sidebar when not hovering
    setTimeout(() => {
      if (!isHovering) {
        setOpen(false);
      }
    }, 300);
  };

  return (
    <Sidebar
      collapsible="icon"
      className={cn(
        "transition-all duration-300",
        open ? "w-64" : "w-14"
      )}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <SidebarContent>
        {/* Logo Section */}
        <div className="py-4 px-4 border-b border-sidebar-border">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-lg overflow-hidden flex-shrink-0">
              <img 
                src="/lovable-uploads/c0e6c735-5382-4c0e-81ee-5c39577c240d.png" 
                alt="Luxfy Logo" 
                className="w-full h-full object-cover" 
              />
            </div>
            {open && (
              <h2 className="text-2xl font-bold text-sidebar-primary">Luxfy</h2>
            )}
          </div>
        </div>

        {/* Navigation */}
        <SidebarGroup>
          {open && <SidebarGroupLabel>Menu</SidebarGroupLabel>}
          
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {links.map((link) => (
                <SidebarMenuItem key={link.href}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={link.href}
                      className={({ isActive: navActive }) =>
                        cn(
                          "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all w-full",
                          navActive || isActive(link.href)
                            ? "bg-sidebar-primary text-sidebar-primary-foreground font-medium"
                            : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                        )
                      }
                    >
                      <link.icon className="h-5 w-5 flex-shrink-0" />
                      {open && (
                        <>
                          <span className="flex-1">{link.label}</span>
                          {link.badge && (
                            <span className="bg-sidebar-accent text-sidebar-accent-foreground text-xs py-0.5 px-1.5 rounded-full">
                              {link.badge}
                            </span>
                          )}
                        </>
                      )}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
};

export default DashboardSidebar;