import { User } from '@/types';

// Mock users for authentication
export const mockUsers: User[] = [
  {
    id: '1',
    name: 'John Developer',
    email: 'john@example.com',
    role: 'Developer'
  },
  {
    id: '2',
    name: 'Jane Manager',
    email: 'jane@example.com',
    role: 'Manager'
  },
  {
    id: '3',
    name: 'Bob Developer',
    email: 'bob@example.com',
    role: 'Developer'
  }
];

// Mock authentication function
export function authenticateUser(email: string): User | null {
  // In a real app, you'd validate the password
  const user = mockUsers.find(u => u.email === email);
  return user || null;
}

// Get user by ID
export function getUserById(id: string): User | null {
  return mockUsers.find(u => u.id === id) || null;
}

// Check if user is authenticated (for client-side)
export function isAuthenticated(): boolean {
  if (typeof window === 'undefined') return false;
  return !!localStorage.getItem('user');
}

// Get current user from localStorage
export function getCurrentUser(): User | null {
  if (typeof window === 'undefined') return null;
  const userStr = localStorage.getItem('user');
  return userStr ? JSON.parse(userStr) : null;
}

// Set user in localStorage
export function setCurrentUser(user: User): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem('user', JSON.stringify(user));
}

// Clear user from localStorage
export function clearCurrentUser(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('user');
}
