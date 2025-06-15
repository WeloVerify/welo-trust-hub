
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { 
  Home, 
  Widget, 
  Shield, 
  BarChart3, 
  CreditCard, 
  Settings,
  LogOut
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import LogoHeader from './LogoHeader';

interface SidebarProps {
  userRole: 'admin' | 'client';
}

const Sidebar = ({ userRole }: SidebarProps) => {
  const location = useLocation();
  const { signOut } = useAuth();

  const clientNavItems = [
    { icon: Home, label: 'Dashboard', href: '/dashboard' },
    { icon: Widget, label: 'Widget', href: '/dashboard/widgets' },
    { icon: Shield, label: 'Verifica', href: '/dashboard/verification' },
    { icon: BarChart3, label: 'Statistiche', href: '/dashboard/statistics' },
    { icon: CreditCard, label: 'Fatturazione', href: '/dashboard/billing' },
    { icon: Settings, label: 'Impostazioni', href: '/dashboard/settings' },
  ];

  const navItems = userRole === 'client' ? clientNavItems : [];

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <div className="w-64 bg-white border-r border-gray-200 flex flex-col h-screen">
      <div className="p-6 border-b border-gray-200">
        <LogoHeader />
      </div>
      
      <nav className="flex-1 p-4 space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.href;
          
          return (
            <Link
              key={item.href}
              to={item.href}
              className={cn(
                'flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                isActive
                  ? 'bg-blue-50 text-blue-700 border border-blue-200'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              )}
            >
              <Icon className="w-5 h-5" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-gray-200">
        <button
          onClick={handleSignOut}
          className="flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 w-full transition-colors"
        >
          <LogOut className="w-5 h-5" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
