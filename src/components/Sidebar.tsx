
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { 
  LayoutDashboard, 
  Settings, 
  Shield, 
  CreditCard, 
  Users, 
  Palette,
  UserCheck
} from 'lucide-react';

interface SidebarProps {
  userRole?: 'client' | 'admin';
}

const Sidebar = ({ userRole = 'client' }: SidebarProps) => {
  const location = useLocation();

  const clientNavItems = [
    { icon: LayoutDashboard, label: 'Dashboard', href: '/dashboard' },
    { icon: Palette, label: 'Widgets', href: '/dashboard/widgets' },
    { icon: Shield, label: 'Verification', href: '/dashboard/verification' },
    { icon: CreditCard, label: 'Billing', href: '/dashboard/billing' },
    { icon: Users, label: 'Affiliates', href: '/dashboard/affiliates' },
    { icon: Settings, label: 'Settings', href: '/dashboard/settings' },
  ];

  const adminNavItems = [
    { icon: LayoutDashboard, label: 'Overview', href: '/admin' },
    { icon: Users, label: 'Clients', href: '/admin/clients' },
    { icon: UserCheck, label: 'Verifications', href: '/admin/verifications' },
    { icon: Settings, label: 'Settings', href: '/admin/settings' },
  ];

  const navItems = userRole === 'admin' ? adminNavItems : clientNavItems;

  return (
    <div className="flex h-screen w-64 flex-col bg-white border-r border-gray-200">
      {/* Logo */}
      <div className="flex h-16 items-center px-6 border-b border-gray-200">
        <div className="flex items-center space-x-2">
          <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center">
            <Shield className="h-5 w-5 text-white" />
          </div>
          <span className="text-xl font-bold text-gray-900">Welo</span>
        </div>
      </div>

      {/* Role Badge */}
      <div className="px-6 py-4">
        <div className={cn(
          "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
          userRole === 'admin' 
            ? "bg-purple-100 text-purple-800" 
            : "bg-blue-100 text-blue-800"
        )}>
          {userRole === 'admin' ? 'Admin Panel' : 'Client Dashboard'}
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 space-y-1">
        {navItems.map((item) => {
          const isActive = location.pathname === item.href;
          return (
            <Link
              key={item.href}
              to={item.href}
              className={cn(
                "flex items-center px-3 py-2 text-sm font-medium rounded-xl transition-all duration-200",
                isActive
                  ? "bg-blue-50 text-blue-700 shadow-sm"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
              )}
            >
              <item.icon className="h-5 w-5 mr-3" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* User Section */}
      <div className="px-4 py-4 border-t border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="h-10 w-10 rounded-full bg-gradient-to-br from-gray-200 to-gray-300"></div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">
              {userRole === 'admin' ? 'Admin User' : 'TechCorp Inc.'}
            </p>
            <p className="text-xs text-gray-500 truncate">
              {userRole === 'admin' ? 'admin@welo.com' : 'Verified'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
