'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import Layout from '@/components/Layout';
import { createTask } from '@/lib/data';
import { mockUsers } from '@/lib/auth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuRadioGroup, DropdownMenuRadioItem } from '@/components/ui/dropdown-menu';
import { ArrowLeftIcon, PlusIcon } from '@heroicons/react/24/outline';

export default function CreateTaskPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'Medium' as 'Low' | 'Medium' | 'High',
    assignee: '',
    dueDate: ''
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    try {
      const taskData = {
        title: formData.title,
        description: formData.description,
        priority: formData.priority,
        status: 'Open' as const,
        assignee: formData.assignee || user.id,
        dueDate: formData.dueDate ? new Date(formData.dueDate) : undefined,
        createdBy: user.id
      };

      createTask(taskData);
      router.push('/dashboard/developer');
    } catch (error) {
      console.error('Error creating task:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  if (!user) return null;

  return (
    <Layout>
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.back()}
            className="flex items-center gap-2"
          >
            <ArrowLeftIcon className="h-4 w-4" />
            Back
          </Button>
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
              Create New Task
            </h1>
            <p className="text-muted-foreground mt-1">Fill out the details below to create a new task</p>
          </div>
        </div>

            <Card className="shadow-md hover:shadow-xl transition-all duration-300 border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PlusIcon className="h-5 w-5" />
              Task Details
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Title */}
              <div className="space-y-2">
                <label htmlFor="title" className="text-sm font-medium text-foreground">
                  Task Title *
                </label>
                <Input
                  type="text"
                  name="title"
                  id="title"
                  required
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="Enter task title"
                  className="h-11"
                />
              </div>

              {/* Description */}
              <div className="space-y-2">
                <label htmlFor="description" className="text-sm font-medium text-foreground">
                  Description *
                </label>
                <Textarea
                  name="description"
                  id="description"
                  rows={4}
                  required
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Describe the task in detail"
                />
              </div>

              {/* Priority */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">
                  Priority
                </label>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="h-11 w-full justify-between">
                      {formData.priority}
                      <svg className="h-4 w-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-full">
                    <DropdownMenuRadioGroup value={formData.priority} onValueChange={(value) => handleSelectChange('priority', value)}>
                      <DropdownMenuRadioItem value="Low">Low</DropdownMenuRadioItem>
                      <DropdownMenuRadioItem value="Medium">Medium</DropdownMenuRadioItem>
                      <DropdownMenuRadioItem value="High">High</DropdownMenuRadioItem>
                    </DropdownMenuRadioGroup>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              {/* Assignee */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">
                  Assignee
                </label>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="h-11 w-full justify-between">
                      {formData.assignee ? 
                        (formData.assignee === user.id ? 'Assign to myself' : 
                         mockUsers.find(u => u.id === formData.assignee)?.name + ' (Developer)') : 
                        'Select assignee'
                      }
                      <svg className="h-4 w-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-full">
                    <DropdownMenuRadioGroup value={formData.assignee} onValueChange={(value) => handleSelectChange('assignee', value)}>
                      <DropdownMenuRadioItem value={user.id}>Assign to myself</DropdownMenuRadioItem>
                      {mockUsers
                        .filter(u => u.id !== user.id && u.role === 'Developer')
                        .map(u => (
                          <DropdownMenuRadioItem key={u.id} value={u.id}>
                            {u.name} ({u.role})
                          </DropdownMenuRadioItem>
                        ))}
                    </DropdownMenuRadioGroup>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              {/* Due Date */}
              <div className="space-y-2">
                <label htmlFor="dueDate" className="text-sm font-medium text-foreground">
                  Due Date
                </label>
                <Input
                  type="date"
                  name="dueDate"
                  id="dueDate"
                  value={formData.dueDate}
                  onChange={handleInputChange}
                  className="h-11"
                />
              </div>

              {/* Actions */}
              <div className="flex justify-end space-x-3 pt-6">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.back()}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={loading}
                >
                  {loading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
                      Creating...
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <PlusIcon className="h-4 w-4" />
                      Create Task
                    </div>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
