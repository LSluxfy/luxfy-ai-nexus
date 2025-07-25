import React from 'react';
import { NavLink } from 'react-router-dom';
import { HomeIcon, BookUserIcon, Users, MessagesSquare, BarChart3, Settings, UserPlus, Calendar, CreditCard, Share, Megaphone } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAgents } from '@/hooks/use-agent';

const DashboardSidebar = () => {
  const { userPlan, agents } = useAgents();

  const links = [
    {
      label: "Dashboard",
      href: "/dashboard",
      icon: <HomeIcon className="h-5 w-5" />,
    },
    {
      label: "Agentes",
      href: "/dashboard/agents",
      icon: <UserPlus className="h-5 w-5" />,
      badge: userPlan ? `${agents.length}/${userPlan.max_agents}` : '0/1'
    },
    {
      label: "CRM",
      href: "/dashboard/crm",
      icon: <Users className="h-5 w-5" />,
    },
    {
      label: "Chat",
      href: "/dashboard/chat",
      icon: <MessagesSquare className="h-5 w-5" />,
    },
    {
      label: "Campanhas",
      href: "/dashboard/campanhas",
      icon: <Megaphone className="h-5 w-5" />,
    },
    {
      label: "Agenda",
      href: "/dashboard/agenda",
      icon: <Calendar className="h-5 w-5" />,
    },
    {
      label: "Análises",
      href: "/dashboard/analytics",
      icon: <BarChart3 className="h-5 w-5" />,
    },
    {
      label: "Financeiro",
      href: "/dashboard/financeiro",
      icon: <CreditCard className="h-5 w-5" />,
    },
    {
      label: "Configurações",
      href: "/dashboard/settings",
      icon: <Settings className="h-5 w-5" />,
    }
  ];

  return (
    <aside className="w-64 border-r shrink-0 hidden md:block dark:border-gray-700 dark:bg-gray-800">
      <div className="flex flex-col h-full">
        <div className="py-4 px-4 border-b dark:border-gray-700">
          <div className="flex items-center">
            <h2 className="text-2xl font-bold text-luxfy-blue">Luxfy</h2>
          </div>
        </div>
        <nav className="flex-1 overflow-y-auto p-2">
          <ul className="space-y-1">
            {links.map((link) => (
              <li key={link.href}>
                <NavLink
                  to={link.href}
                  className={({ isActive }) =>
                    cn(
                      "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all",
                      isActive
                        ? "bg-luxfy-blue text-white"
                        : "text-luxfy-dark hover:bg-luxfy-blue/10 dark:text-gray-200 dark:hover:bg-gray-700"
                    )
                  }
                >
                  {link.icon}
                  <span>{link.label}</span>
                  {link.badge && (
                    <span className="ml-auto bg-background text-foreground text-xs py-0.5 px-1.5 rounded-full dark:bg-gray-700 dark:text-gray-200">
                      {link.badge}
                    </span>
                  )}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </aside>
  );
};

export default DashboardSidebar;
