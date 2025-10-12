'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import Layout from '@/components/Layout';
import { 
  getAllTimeEntries,
  getTasks,
  getDashboardStats,
  initializeData 
} from '@/lib/data';
import { TimeEntry, Task } from '@/types';
import { 
  ChartBarIcon,
  ClockIcon,
  UserIcon,
  CalendarIcon
} from '@heroicons/react/24/outline';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { format, startOfWeek, endOfWeek, eachDayOfInterval, subWeeks } from 'date-fns';

export default function ReportsPage() {
  const { user } = useAuth();
  const [timeEntries, setTimeEntries] = useState<TimeEntry[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [stats, setStats] = useState<{
    totalTasks: number;
    openTasks: number;
    inProgressTasks: number;
    pendingApprovalTasks: number;
    closedTasks: number;
    totalTimeLogged: number;
    tasksByPriority: { Low: number; Medium: number; High: number };
  } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      initializeData();
      loadData();
    }
  }, [user]); // eslint-disable-line react-hooks/exhaustive-deps

  const loadData = () => {
    if (!user) return;
    
    const allTimeEntries = getAllTimeEntries();
    const allTasks = getTasks();
    const allStats = getDashboardStats();
    
    setTimeEntries(allTimeEntries);
    setTasks(allTasks);
    setStats(allStats);
    setLoading(false);
  };

  const getWeeklyTimeData = () => {
    const last4Weeks = Array.from({ length: 4 }, (_, i) => {
      const weekStart = startOfWeek(subWeeks(new Date(), 3 - i), { weekStartsOn: 1 });
      const weekEnd = endOfWeek(subWeeks(new Date(), 3 - i), { weekStartsOn: 1 });
      
      const weekEntries = timeEntries.filter(entry => {
        const entryDate = new Date(entry.date);
        return entryDate >= weekStart && entryDate <= weekEnd;
      });
      
      const totalTime = weekEntries.reduce((sum, entry) => sum + entry.duration, 0);
      
      return {
        week: format(weekStart, 'MMM dd'),
        totalTime: Math.round(totalTime / 60), // Convert to hours
        entries: weekEntries.length
      };
    });
    
    return last4Weeks;
  };

  const getTaskStatusData = () => {
    const statusCounts = tasks.reduce((acc, task) => {
      acc[task.status] = (acc[task.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    return Object.entries(statusCounts).map(([status, count]) => ({
      status,
      count,
      color: getStatusColor(status)
    }));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Open': return '#3b82f6';
      case 'In Progress': return '#8b5cf6';
      case 'Pending Approval': return '#f59e0b';
      case 'Closed': return '#10b981';
      default: return '#6b7280';
    }
  };

  const getDailyTimeData = () => {
    const last7Days = eachDayOfInterval({
      start: subWeeks(new Date(), 1),
      end: new Date()
    });
    
    return last7Days.map(day => {
      const dayEntries = timeEntries.filter(entry => {
        return format(new Date(entry.date), 'yyyy-MM-dd') === format(day, 'yyyy-MM-dd');
      });
      
      const totalTime = dayEntries.reduce((sum, entry) => sum + entry.duration, 0);
      
      return {
        day: format(day, 'MMM dd'),
        hours: Math.round(totalTime / 60 * 10) / 10, // Convert to hours with 1 decimal
        entries: dayEntries.length
      };
    });
  };

  const getTopTasksByTime = () => {
    const taskTimeMap = timeEntries.reduce((acc, entry) => {
      acc[entry.taskId] = (acc[entry.taskId] || 0) + entry.duration;
      return acc;
    }, {} as Record<string, number>);
    
    return Object.entries(taskTimeMap)
      .map(([taskId, totalTime]) => {
        const task = tasks.find(t => t.id === taskId);
        return {
          taskTitle: task?.title || 'Unknown Task',
          hours: Math.round(totalTime / 60 * 10) / 10
        };
      })
      .sort((a, b) => b.hours - a.hours)
      .slice(0, 5);
  };

  if (!user || loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-64">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
            Reports & Analytics
          </h1>
          <p className="text-muted-foreground mt-1">Comprehensive insights into team performance and time tracking</p>
        </div>

        {/* Stats Overview */}
        {stats && (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                <Card className="shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-border/50">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Total Tasks</p>
                    <p className="text-2xl font-bold text-foreground">{stats.totalTasks}</p>
                  </div>
                  <div className="w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center">
                    <ChartBarIcon className="h-6 w-6 text-blue-500" />
                  </div>
                </div>
              </CardContent>
            </Card>

                <Card className="shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-border/50">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Total Time</p>
                    <p className="text-2xl font-bold text-foreground">{Math.round(stats.totalTimeLogged / 60)}h</p>
                  </div>
                  <div className="w-12 h-12 bg-green-500/10 rounded-lg flex items-center justify-center">
                    <ClockIcon className="h-6 w-6 text-green-500" />
                  </div>
                </div>
              </CardContent>
            </Card>

                <Card className="shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-border/50">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Time Entries</p>
                    <p className="text-2xl font-bold text-foreground">{timeEntries.length}</p>
                  </div>
                  <div className="w-12 h-12 bg-purple-500/10 rounded-lg flex items-center justify-center">
                    <UserIcon className="h-6 w-6 text-purple-500" />
                  </div>
                </div>
              </CardContent>
            </Card>

                <Card className="shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-border/50">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Avg Time/Task</p>
                    <p className="text-2xl font-bold text-foreground">
                      {stats.totalTasks > 0 ? Math.round(stats.totalTimeLogged / stats.totalTasks / 60 * 10) / 10 : 0}h
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-orange-500/10 rounded-lg flex items-center justify-center">
                    <CalendarIcon className="h-6 w-6 text-orange-500" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Weekly Time Tracking */}
              <Card className="shadow-md hover:shadow-xl transition-all duration-300 border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ChartBarIcon className="h-5 w-5" />
                Weekly Time Tracking (Last 4 Weeks)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={getWeeklyTimeData()}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis 
                      dataKey="week" 
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
                      formatter={(value, name) => [
                        name === 'totalTime' ? `${value}h` : value,
                        name === 'totalTime' ? 'Hours' : 'Entries'
                      ]}
                    />
                    <Bar dataKey="totalTime" fill="hsl(var(--primary))" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Task Status Distribution */}
              <Card className="shadow-md hover:shadow-xl transition-all duration-300 border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ChartBarIcon className="h-5 w-5" />
                Task Status Distribution
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64 flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={getTaskStatusData()}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="count"
                    >
                      {getTaskStatusData().map((entry, index) => (
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
                {getTaskStatusData().map((entry) => (
                  <div key={entry.status} className="flex items-center gap-2">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: entry.color }}
                    />
                    <span className="text-sm text-muted-foreground">{entry.status}: {entry.count}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Daily Time Tracking */}
              <Card className="shadow-md hover:shadow-xl transition-all duration-300 border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ClockIcon className="h-5 w-5" />
              Daily Time Tracking (Last 7 Days)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={getDailyTimeData()}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis 
                    dataKey="day" 
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
                    formatter={(value, name) => [
                      name === 'hours' ? `${value}h` : value,
                      name === 'hours' ? 'Hours' : 'Entries'
                    ]}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="hours" 
                    stroke="hsl(var(--primary))" 
                    strokeWidth={2}
                    dot={{ fill: 'hsl(var(--primary))', strokeWidth: 2, r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Top Tasks by Time */}
              <Card className="shadow-md hover:shadow-xl transition-all duration-300 border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ChartBarIcon className="h-5 w-5" />
              Top 5 Tasks by Time Spent
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {getTopTasksByTime().map((task, index) => (
                <div key={index} className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-accent/50 transition-colors">
                  <div className="flex items-center">
                    <span className="text-sm font-medium text-muted-foreground mr-3">#{index + 1}</span>
                    <span className="text-sm font-medium text-foreground">{task.taskTitle}</span>
                  </div>
                  <span className="text-sm font-medium text-foreground bg-primary/10 px-3 py-1 rounded-full">{task.hours}h</span>
                </div>
              ))}
              
              {getTopTasksByTime().length === 0 && (
                <div className="text-center py-8">
                  <ChartBarIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No time entries found</p>
                  <p className="text-sm text-muted-foreground mt-1">Start tracking time to see your top tasks here</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Recent Time Entries */}
              <Card className="shadow-md hover:shadow-xl transition-all duration-300 border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ClockIcon className="h-5 w-5" />
              Recent Time Entries
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {timeEntries.slice(0, 10).map(entry => {
                const task = tasks.find(t => t.id === entry.taskId);
                const user = task?.assignee || 'Unknown';
                
                return (
                  <div key={entry.id} className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-accent/50 transition-colors">
                    <div className="flex-1">
                      <p className="text-sm font-medium text-foreground">
                        {task?.title || 'Unknown Task'}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {entry.description} • {user} • {format(new Date(entry.date), 'MMM dd, yyyy HH:mm')}
                      </p>
                    </div>
                    <div className="text-sm font-medium text-foreground bg-primary/10 px-3 py-1 rounded-full">
                      {Math.round(entry.duration / 60 * 10) / 10}h
                    </div>
                  </div>
                );
              })}
              
              {timeEntries.length === 0 && (
                <div className="text-center py-8">
                  <ClockIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No time entries found</p>
                  <p className="text-sm text-muted-foreground mt-1">Start tracking time to see your entries here</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
