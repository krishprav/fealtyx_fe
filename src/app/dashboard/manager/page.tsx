'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import Layout from '@/components/Layout';
import TaskCard from '@/components/TaskCard';
import { Task } from '@/types';
import { 
  getTasks, 
  updateTask, 
  getDashboardStats,
  getTrendData,
  initializeData
} from '@/lib/data';
import { 
  UserGroupIcon,
  PlusIcon
} from '@heroicons/react/24/outline';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { useRouter } from 'next/navigation';

export default function ManagerDashboard() {
  const { user } = useAuth();
  const router = useRouter();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filteredTasks, setFilteredTasks] = useState<Task[]>([]);
  const [stats, setStats] = useState<{
    totalTasks: number;
    openTasks: number;
    inProgressTasks: number;
    pendingApprovalTasks: number;
    closedTasks: number;
    totalTimeLogged: number;
    tasksByPriority: { Low: number; Medium: number; High: number };
  } | null>(null);
  const [trendData, setTrendData] = useState<Array<{ date: string; concurrentTasks: number }>>([]);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    if (user) {
      initializeData();
      loadData();
    }
  }, [user]); // eslint-disable-line react-hooks/exhaustive-deps

  const loadData = () => {
    if (!user) return;
    
    const allTasks = getTasks();
    setTasks(allTasks);
    setFilteredTasks(allTasks);
    
    const allStats = getDashboardStats();
    setStats(allStats);
    
    const allTrendData = getTrendData();
    setTrendData(allTrendData);
  };

  const handleFilter = (filterType: string) => {
    setFilter(filterType);
    let filtered = tasks;
    
    switch (filterType) {
      case 'open':
        filtered = tasks.filter(t => t.status === 'Open');
        break;
      case 'in-progress':
        filtered = tasks.filter(t => t.status === 'In Progress');
        break;
      case 'pending':
        filtered = tasks.filter(t => t.status === 'Pending Approval');
        break;
      case 'closed':
        filtered = tasks.filter(t => t.status === 'Closed');
        break;
      case 'high-priority':
        filtered = tasks.filter(t => t.priority === 'High');
        break;
      default:
        filtered = tasks;
    }
    
    setFilteredTasks(filtered);
  };

  const handleApproveTask = (taskId: string) => {
    updateTask(taskId, { status: 'Closed' });
    loadData();
  };

  const handleReopenTask = (taskId: string) => {
    updateTask(taskId, { status: 'Open' });
    loadData();
  };

  const handleEditTask = (task: Task) => {
    router.push(`/tasks/edit/${task.id}`);
  };

  const handleDeleteTask = (taskId: string) => {
    if (confirm('Are you sure you want to delete this task?')) {
      // In a real app, you'd call a delete function
      loadData();
    }
  };

  if (!user) return null;

  const priorityData = [
    { name: 'High', value: stats?.tasksByPriority.High || 0, color: 'hsl(var(--destructive))' },
    { name: 'Medium', value: stats?.tasksByPriority.Medium || 0, color: 'hsl(var(--warning))' },
    { name: 'Low', value: stats?.tasksByPriority.Low || 0, color: 'hsl(var(--success))' },
  ];

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
              Manager Dashboard
            </h1>
            <p className="text-muted-foreground mt-1">Welcome back, {user.name}</p>
          </div>
          <Button
            onClick={() => router.push('/tasks/create')}
            className="w-full sm:w-auto"
          >
            <PlusIcon className="h-4 w-4 mr-2" />
            Create Task
          </Button>
        </div>

        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <Card className="shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-border/50">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Total Tasks</p>
                    <p className="text-2xl font-bold text-foreground">{stats.totalTasks}</p>
                  </div>
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                    <span className="text-primary text-lg font-bold">{stats.totalTasks}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-border/50">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Open Tasks</p>
                    <p className="text-2xl font-bold text-foreground">{stats.openTasks}</p>
                  </div>
                  <div className="w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center">
                    <span className="text-blue-500 text-lg font-bold">{stats.openTasks}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-border/50">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Pending Approval</p>
                    <p className="text-2xl font-bold text-foreground">{stats.pendingApprovalTasks}</p>
                  </div>
                  <div className="w-12 h-12 bg-orange-500/10 rounded-lg flex items-center justify-center">
                    <span className="text-orange-500 text-lg font-bold">{stats.pendingApprovalTasks}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-border/50">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Total Time</p>
                    <p className="text-2xl font-bold text-foreground">{Math.floor(stats.totalTimeLogged / 60)}h</p>
                  </div>
                  <div className="w-12 h-12 bg-green-500/10 rounded-lg flex items-center justify-center">
                    <span className="text-green-500 text-lg font-bold">{Math.floor(stats.totalTimeLogged / 60)}h</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Trend Chart */}
          <Card className="shadow-md hover:shadow-xl transition-all duration-300 border-border/50">
            <CardHeader>
              <CardTitle>Task Trend (Last 30 Days)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={trendData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis
                      dataKey="date"
                      stroke="hsl(var(--muted-foreground))"
                      fontSize={12}
                    />
                    <YAxis
                      stroke="hsl(var(--muted-foreground))"
                      fontSize={12}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'hsl(var(--popover))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '6px',
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="concurrentTasks"
                      stroke="hsl(var(--primary))"
                      strokeWidth={2}
                      dot={{ fill: 'hsl(var(--primary))', strokeWidth: 2, r: 4 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Priority Distribution */}
          <Card className="shadow-md hover:shadow-xl transition-all duration-300 border-border/50">
            <CardHeader>
              <CardTitle>Priority Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64 flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={priorityData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {priorityData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'hsl(var(--popover))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '6px',
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="flex justify-center gap-4 mt-4">
                {priorityData.map((entry) => (
                  <div key={entry.name} className="flex items-center gap-2">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: entry.color }}
                    />
                    <span className="text-sm text-muted-foreground">{entry.name}: {entry.value}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="hover:shadow-lg transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex flex-wrap gap-2">
              <Button
                variant={filter === 'all' ? 'default' : 'outline'}
                size="sm"
                onClick={() => handleFilter('all')}
              >
                All Tasks
              </Button>
              <Button
                variant={filter === 'open' ? 'default' : 'outline'}
                size="sm"
                onClick={() => handleFilter('open')}
              >
                Open
              </Button>
              <Button
                variant={filter === 'in-progress' ? 'default' : 'outline'}
                size="sm"
                onClick={() => handleFilter('in-progress')}
              >
                In Progress
              </Button>
              <Button
                variant={filter === 'pending' ? 'default' : 'outline'}
                size="sm"
                onClick={() => handleFilter('pending')}
              >
                Pending Approval
              </Button>
              <Button
                variant={filter === 'closed' ? 'default' : 'outline'}
                size="sm"
                onClick={() => handleFilter('closed')}
              >
                Closed
              </Button>
              <Button
                variant={filter === 'high-priority' ? 'destructive' : 'outline'}
                size="sm"
                onClick={() => handleFilter('high-priority')}
              >
                High Priority
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Tasks Grid */}
        {filteredTasks.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 xl:grid-cols-3">
            {filteredTasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onEdit={handleEditTask}
                onDelete={handleDeleteTask}
                onApprove={handleApproveTask}
                onReopen={handleReopenTask}
              />
            ))}
          </div>
        ) : (
          <Card className="text-center py-12">
            <CardContent>
              <div className="flex flex-col items-center justify-center space-y-4">
                <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center">
                  <UserGroupIcon className="h-8 w-8 text-muted-foreground" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-foreground">No tasks found</h3>
                  <p className="text-muted-foreground">No tasks match your current filters.</p>
                </div>
                <Button onClick={() => router.push('/tasks/create')} variant="outline">
                  <PlusIcon className="h-4 w-4 mr-2" />
                  Create your first task
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </Layout>
  );
}
