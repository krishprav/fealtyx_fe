'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import Layout from '@/components/Layout';
import { 
  getTasksByAssignee, 
  addTimeEntry, 
  getTimeEntriesByUser,
  initializeData 
} from '@/lib/data';
import { Task, TimeEntry } from '@/types';
import { 
  PlayIcon, 
  StopIcon, 
  ClockIcon,
  PlusIcon
} from '@heroicons/react/24/outline';
import { format } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function TimeTrackerPage() {
  const { user } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [timeEntries, setTimeEntries] = useState<TimeEntry[]>([]);
  const [selectedTask, setSelectedTask] = useState<string>('');
  const [description, setDescription] = useState('');
  const [duration, setDuration] = useState(30); // in minutes
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [timerStart, setTimerStart] = useState<Date | null>(null);
  const [elapsedTime, setElapsedTime] = useState(0);

  useEffect(() => {
    if (user) {
      initializeData();
      loadData();
    }
  }, [user]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isTimerRunning && timerStart) {
      interval = setInterval(() => {
        const now = new Date();
        const elapsed = Math.floor((now.getTime() - timerStart.getTime()) / 1000 / 60); // in minutes
        setElapsedTime(elapsed);
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isTimerRunning, timerStart]);

  const loadData = () => {
    if (!user) return;
    
    const userTasks = getTasksByAssignee(user.id);
    setTasks(userTasks.filter(t => t.status !== 'Closed'));
    
    const userTimeEntries = getTimeEntriesByUser(user.id);
    setTimeEntries(userTimeEntries);
  };

  const startTimer = () => {
    if (!selectedTask) return;
    
    setIsTimerRunning(true);
    setTimerStart(new Date());
    setElapsedTime(0);
  };

  const stopTimer = () => {
    if (!selectedTask || !timerStart) return;
    
    setIsTimerRunning(false);
    
    // Add time entry
    addTimeEntry({
      taskId: selectedTask,
      userId: user!.id,
      date: new Date(),
      duration: elapsedTime || 1, // minimum 1 minute
      description: description || 'Time tracked'
    });
    
    // Reset form
    setDescription('');
    setElapsedTime(0);
    setTimerStart(null);
    
    // Reload data
    loadData();
  };

  const addManualEntry = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTask || !user) return;
    
    addTimeEntry({
      taskId: selectedTask,
      userId: user.id,
      date: new Date(),
      duration,
      description: description || 'Manual entry'
    });
    
    setDescription('');
    setDuration(30);
    loadData();
  };

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  const getTotalTimeToday = () => {
    const today = new Date().toDateString();
    return timeEntries
      .filter(entry => new Date(entry.date).toDateString() === today)
      .reduce((sum, entry) => sum + entry.duration, 0);
  };

  const getTotalTimeThisWeek = () => {
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    
    return timeEntries
      .filter(entry => new Date(entry.date) >= weekAgo)
      .reduce((sum, entry) => sum + entry.duration, 0);
  };

  if (!user) return null;

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
            Time Tracker
          </h1>
          <p className="text-muted-foreground mt-1">Track time spent on your tasks</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
              <Card className="shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-border/50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Today</p>
                  <p className="text-2xl font-bold text-foreground">{formatTime(getTotalTimeToday())}</p>
                </div>
                <div className="w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center">
                  <ClockIcon className="h-6 w-6 text-blue-500" />
                </div>
              </div>
            </CardContent>
          </Card>

              <Card className="shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-border/50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">This Week</p>
                  <p className="text-2xl font-bold text-foreground">{formatTime(getTotalTimeThisWeek())}</p>
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
                  <p className="text-sm font-medium text-muted-foreground">Total</p>
                  <p className="text-2xl font-bold text-foreground">{formatTime(timeEntries.reduce((sum, entry) => sum + entry.duration, 0))}</p>
                </div>
                <div className="w-12 h-12 bg-purple-500/10 rounded-lg flex items-center justify-center">
                  <ClockIcon className="h-6 w-6 text-purple-500" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Timer */}
            <Card className="shadow-md hover:shadow-xl transition-all duration-300 border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ClockIcon className="h-5 w-5" />
              Timer
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Task Selection */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                Select Task
              </label>
              <Select value={selectedTask} onValueChange={setSelectedTask}>
                <SelectTrigger className="h-11">
                  <SelectValue placeholder="Choose a task..." />
                </SelectTrigger>
                <SelectContent>
                  {tasks.map(task => (
                    <SelectItem key={task.id} value={task.id}>
                      {task.title} ({task.priority})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Timer Display */}
            {isTimerRunning && (
              <div className="text-center py-8">
                <div className="text-5xl font-mono font-bold text-primary mb-2">
                  {formatTime(elapsedTime)}
                </div>
                <p className="text-sm text-muted-foreground">Timer is running...</p>
              </div>
            )}

            {/* Description */}
            <div className="space-y-2">
              <label htmlFor="description" className="text-sm font-medium text-foreground">
                Description
              </label>
              <Input
                type="text"
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="What are you working on?"
                className="h-11"
              />
            </div>

            {/* Timer Controls */}
            <div className="flex justify-center">
              {!isTimerRunning ? (
                <Button
                  onClick={startTimer}
                  disabled={!selectedTask}
                  size="lg"
                  className="bg-green-600 hover:bg-green-700 text-white"
                >
                  <PlayIcon className="h-4 w-4 mr-2" />
                  Start Timer
                </Button>
              ) : (
                <Button
                  onClick={stopTimer}
                  size="lg"
                  variant="destructive"
                >
                  <StopIcon className="h-4 w-4 mr-2" />
                  Stop Timer
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Manual Entry */}
            <Card className="shadow-md hover:shadow-xl transition-all duration-300 border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PlusIcon className="h-5 w-5" />
              Manual Entry
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={addManualEntry} className="space-y-6">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">
                    Task
                  </label>
                  <Select value={selectedTask} onValueChange={setSelectedTask}>
                    <SelectTrigger className="h-11">
                      <SelectValue placeholder="Choose a task..." />
                    </SelectTrigger>
                    <SelectContent>
                      {tasks.map(task => (
                        <SelectItem key={task.id} value={task.id}>
                          {task.title} ({task.priority})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label htmlFor="duration" className="text-sm font-medium text-foreground">
                    Duration (minutes)
                  </label>
                  <Input
                    type="number"
                    id="duration"
                    value={duration}
                    onChange={(e) => setDuration(parseInt(e.target.value) || 0)}
                    min="1"
                    className="h-11"
                  />
                </div>

                <div className="flex items-end">
                  <Button
                    type="submit"
                    disabled={!selectedTask || duration <= 0}
                    className="w-full h-11"
                  >
                    <PlusIcon className="h-4 w-4 mr-2" />
                    Add Entry
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="manual-description" className="text-sm font-medium text-foreground">
                  Description
                </label>
                <Input
                  type="text"
                  id="manual-description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="What did you work on?"
                  className="h-11"
                />
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Recent Entries */}
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
                return (
                  <div key={entry.id} className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-accent/50 transition-colors">
                    <div className="flex-1">
                      <p className="text-sm font-medium text-foreground">
                        {task?.title || 'Unknown Task'}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {entry.description} • {format(new Date(entry.date), 'MMM dd, yyyy HH:mm')}
                      </p>
                    </div>
                    <div className="text-sm font-medium text-foreground bg-primary/10 px-3 py-1 rounded-full">
                      {formatTime(entry.duration)}
                    </div>
                  </div>
                );
              })}
              
              {timeEntries.length === 0 && (
                <div className="text-center py-8">
                  <ClockIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No time entries yet</p>
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
