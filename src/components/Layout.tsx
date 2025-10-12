'use client';

import { ReactNode } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { 
  HomeIcon, 
  PlusIcon, 
  ClockIcon, 
  ChartBarIcon,
  UserIcon,
  ArrowRightOnRectangleIcon,
  Bars3Icon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ThemeToggle } from '@/components/theme-toggle';

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  if (!user) return null;

  const navigation = [
    {
      name: 'Dashboard',
      href: user.role === 'Developer' ? '/dashboard/developer' : '/dashboard/manager',
      icon: HomeIcon,
    },
    ...(user.role === 'Developer' ? [
      {
        name: 'Create Task',
        href: '/tasks/create',
        icon: PlusIcon,
      },
      {
        name: 'Time Tracker',
        href: '/time-tracker',
        icon: ClockIcon,
      },
    ] : []),
    {
      name: 'Reports',
      href: '/reports',
      icon: ChartBarIcon,
    },
  ];

  return (
    <div className="min-h-screen bg-background">
          {/* Navigation */}
          <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <h1 className="text-xl font-bold text-foreground">
                  FealtyX
                </h1>
              </div>
              <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                {navigation.map((item) => {
                  const Icon = item.icon;
                  return (
                    <a
                      key={item.name}
                      href={item.href}
                      className="border-transparent text-muted-foreground hover:border-primary/50 hover:text-foreground inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors"
                    >
                      <Icon className="h-4 w-4 mr-2" />
                      {item.name}
                    </a>
                  );
                })}
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="hidden sm:flex items-center space-x-3">
                <UserIcon className="h-5 w-5 text-muted-foreground" />
                <span className="text-sm font-medium text-foreground">{user.name}</span>
                <Badge variant={user.role === 'Manager' ? 'success' : 'info'}>
                  {user.role}
                </Badge>
              </div>
              <ThemeToggle />
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLogout}
                className="hidden sm:inline-flex"
              >
                <ArrowRightOnRectangleIcon className="h-4 w-4 mr-1" />
                Logout
              </Button>
              
              {/* Mobile menu button */}
              <Button
                variant="ghost"
                size="sm"
                className="sm:hidden shadow-sm hover:shadow-md transition-shadow"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? (
                  <XMarkIcon className="h-5 w-5" />
                ) : (
                  <Bars3Icon className="h-5 w-5" />
                )}
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="sm:hidden border-t bg-background/95 backdrop-blur shadow-lg">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navigation.map((item) => {
                const Icon = item.icon;
                return (
                  <a
                    key={item.name}
                    href={item.href}
                    className="text-muted-foreground hover:text-foreground hover:bg-accent block px-3 py-2 rounded-md text-base font-medium transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <div className="flex items-center">
                      <Icon className="h-4 w-4 mr-2" />
                      {item.name}
                    </div>
                  </a>
                );
              })}
              <div className="border-t pt-3 mt-3">
                <div className="flex items-center px-3 py-2">
                  <UserIcon className="h-5 w-5 text-muted-foreground mr-2" />
                  <span className="text-sm font-medium text-foreground">{user.name}</span>
                  <Badge variant={user.role === 'Manager' ? 'success' : 'info'} className="ml-2">
                    {user.role}
                  </Badge>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleLogout}
                  className="w-full justify-start mt-2"
                >
                  <ArrowRightOnRectangleIcon className="h-4 w-4 mr-2" />
                  Logout
                </Button>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Main content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="animate-fade-in">
          {children}
        </div>
      </main>
    </div>
  );
}
