'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { authenticateUser, mockUsers } from '@/lib/auth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ThemeToggle } from '@/components/theme-toggle';
import { AlertCircle, Code, Users } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Simulate loading
    await new Promise(resolve => setTimeout(resolve, 500));

    const user = authenticateUser(email);
    if (user) {
      login(user);
      router.push(user.role === 'Developer' ? '/dashboard/developer' : '/dashboard/manager');
    } else {
      setError('Invalid credentials');
    }
    setIsLoading(false);
  };

  const handleDemoLogin = async (role: 'Developer' | 'Manager') => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const user = mockUsers.find(u => u.role === role);
    if (user) {
      login(user);
      router.push(role === 'Developer' ? '/dashboard/developer' : '/dashboard/manager');
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 flex items-center justify-center p-4">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>
      
      <div className="w-full max-w-md space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            FealtyX
          </h1>
          <p className="text-muted-foreground">Bug & Task Tracker</p>
        </div>

            <Card className="backdrop-blur-sm bg-card/80 border-border/50 shadow-2xl hover:shadow-3xl transition-shadow duration-300">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center">Welcome back</CardTitle>
            <CardDescription className="text-center">
              Enter your credentials to access your dashboard
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-4">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="h-11"
                />
              </div>
              
              <div className="space-y-2">
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="h-11"
                />
              </div>

              {error && (
                <div className="flex items-center gap-2 text-destructive text-sm bg-destructive/10 p-3 rounded-md">
                  <AlertCircle className="h-4 w-4" />
                  {error}
                </div>
              )}

              <Button type="submit" className="w-full h-11" disabled={isLoading}>
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
                    Signing in...
                  </div>
                ) : (
                  'Sign in'
                )}
              </Button>
            </form>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground">Or try demo accounts</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Button
                variant="outline"
                onClick={() => handleDemoLogin('Developer')}
                disabled={isLoading}
                className="h-11 flex-col gap-1"
              >
                <Code className="h-4 w-4" />
                <span className="text-xs">Developer</span>
              </Button>
              <Button
                variant="outline"
                onClick={() => handleDemoLogin('Manager')}
                disabled={isLoading}
                className="h-11 flex-col gap-1"
              >
                <Users className="h-4 w-4" />
                <span className="text-xs">Manager</span>
              </Button>
            </div>

            <div className="text-center space-y-2 pt-4 border-t border-border">
              <p className="text-xs text-muted-foreground">Demo credentials</p>
              <div className="flex justify-center gap-2">
                <Badge variant="outline" className="text-xs">
                  john@example.com
                </Badge>
                <Badge variant="outline" className="text-xs">
                  jane@example.com
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

      </div>
    </div>
  );
}
