import { Task, TimeEntry } from '@/types';
import { v4 as uuidv4 } from 'uuid';

// localStorage keys
const TASKS_STORAGE_KEY = 'fealtyx_tasks';
const TIME_ENTRIES_STORAGE_KEY = 'fealtyx_time_entries';

// Mock data storage
let tasks: Task[] = [];
let timeEntries: TimeEntry[] = [];

// Helper functions for localStorage operations
function saveTasksToStorage() {
  try {
    localStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify(tasks));
  } catch (error) {
    console.error('Failed to save tasks to localStorage:', error);
  }
}

function saveTimeEntriesToStorage() {
  try {
    localStorage.setItem(TIME_ENTRIES_STORAGE_KEY, JSON.stringify(timeEntries));
  } catch (error) {
    console.error('Failed to save time entries to localStorage:', error);
  }
}

function loadTasksFromStorage(): Task[] {
  try {
    const stored = localStorage.getItem(TASKS_STORAGE_KEY);
    if (stored) {
      const parsedTasks = JSON.parse(stored);
      // Convert date strings back to Date objects
      return parsedTasks.map((task: any) => ({
        ...task,
        createdDate: new Date(task.createdDate),
        dueDate: task.dueDate ? new Date(task.dueDate) : undefined,
        lastUpdated: new Date(task.lastUpdated)
      }));
    }
  } catch (error) {
    console.error('Failed to load tasks from localStorage:', error);
  }
  return [];
}

function loadTimeEntriesFromStorage(): TimeEntry[] {
  try {
    const stored = localStorage.getItem(TIME_ENTRIES_STORAGE_KEY);
    if (stored) {
      const parsedEntries = JSON.parse(stored);
      // Convert date strings back to Date objects
      return parsedEntries.map((entry: any) => ({
        ...entry,
        date: new Date(entry.date)
      }));
    }
  } catch (error) {
    console.error('Failed to load time entries from localStorage:', error);
  }
  return [];
}

// Initialize with sample data only if localStorage is empty (first visit)
export function initializeData() {
  // Load existing data from localStorage
  tasks = loadTasksFromStorage();
  timeEntries = loadTimeEntriesFromStorage();

  // Only load sample data if no data exists (first visit)
  if (tasks.length === 0) {
    const sampleTasks: Task[] = [
      {
        id: '1',
        title: 'Fix login button styling',
        description: 'The login button needs better styling and hover effects',
        priority: 'High',
        status: 'Open',
        assignee: '1',
        createdDate: new Date('2025-10-15'),
        dueDate: new Date('2025-10-20'),
        timeLogged: 120,
        createdBy: '1',
        lastUpdated: new Date('2025-10-15')
      },
      {
        id: '2',
        title: 'Implement user dashboard',
        description: 'Create a comprehensive dashboard for users to view their tasks',
        priority: 'Medium',
        status: 'In Progress',
        assignee: '1',
        createdDate: new Date('2025-10-12'),
        dueDate: new Date('2025-10-25'),
        timeLogged: 240,
        createdBy: '2',
        lastUpdated: new Date('2025-10-18')
      },
      {
        id: '3',
        title: 'Add data validation',
        description: 'Implement proper validation for all form inputs',
        priority: 'Low',
        status: 'Closed',
        assignee: '3',
        createdDate: new Date('2025-10-10'),
        dueDate: new Date('2025-10-22'),
        timeLogged: 180,
        createdBy: '2',
        lastUpdated: new Date('2025-10-20')
      },
      {
        id: '4',
        title: 'Optimize database queries',
        description: 'Review and optimize slow database queries for better performance',
        priority: 'Medium',
        status: 'Open',
        assignee: '2',
        createdDate: new Date('2025-10-15'),
        dueDate: new Date('2025-10-28'),
        timeLogged: 0,
        createdBy: '1',
        lastUpdated: new Date('2025-10-15')
      }
    ];

    const sampleTimeEntries: TimeEntry[] = [
      {
        id: '1',
        taskId: '1',
        userId: '1',
        date: new Date('2025-10-15'),
        duration: 120,
        description: 'Worked on button styling and hover effects'
      },
      {
        id: '2',
        taskId: '2',
        userId: '1',
        date: new Date('2025-10-18'),
        duration: 240,
        description: 'Implemented dashboard layout and components'
      },
      {
        id: '3',
        taskId: '3',
        userId: '3',
        date: new Date('2025-10-20'),
        duration: 180,
        description: 'Added validation for all forms'
      }
    ];

    tasks = sampleTasks;
    timeEntries = sampleTimeEntries;
    
    // Save sample data to localStorage
    saveTasksToStorage();
    saveTimeEntriesToStorage();
  }
}

// Task management functions
export function getTasks(): Task[] {
  return [...tasks];
}

export function getTaskById(id: string): Task | null {
  return tasks.find(task => task.id === id) || null;
}

export function getTasksByAssignee(assigneeId: string): Task[] {
  return tasks.filter(task => task.assignee === assigneeId);
}

export function createTask(taskData: Omit<Task, 'id' | 'createdDate' | 'lastUpdated' | 'timeLogged'>): Task {
  const newTask: Task = {
    ...taskData,
    id: uuidv4(),
    createdDate: new Date(),
    lastUpdated: new Date(),
    timeLogged: 0
  };
  
  tasks.push(newTask);
  saveTasksToStorage();
  return newTask;
}

export function updateTask(id: string, updates: Partial<Task>): Task | null {
  const taskIndex = tasks.findIndex(task => task.id === id);
  if (taskIndex === -1) return null;

  tasks[taskIndex] = {
    ...tasks[taskIndex],
    ...updates,
    lastUpdated: new Date()
  };

  saveTasksToStorage();
  return tasks[taskIndex];
}

export function deleteTask(id: string): boolean {
  const taskIndex = tasks.findIndex(task => task.id === id);
  if (taskIndex === -1) return false;

  tasks.splice(taskIndex, 1);
  
  // Also remove associated time entries
  timeEntries = timeEntries.filter(entry => entry.taskId !== id);
  
  saveTasksToStorage();
  saveTimeEntriesToStorage();
  return true;
}

// Time tracking functions
export function getTimeEntriesByTask(taskId: string): TimeEntry[] {
  return timeEntries.filter(entry => entry.taskId === taskId);
}

export function getTimeEntriesByUser(userId: string): TimeEntry[] {
  return timeEntries.filter(entry => entry.userId === userId);
}

export function addTimeEntry(entryData: Omit<TimeEntry, 'id'>): TimeEntry {
  const newEntry: TimeEntry = {
    ...entryData,
    id: uuidv4()
  };
  
  timeEntries.push(newEntry);
  
  // Update task's total time logged
  const task = tasks.find(t => t.id === entryData.taskId);
  if (task) {
    task.timeLogged += entryData.duration;
    task.lastUpdated = new Date();
  }
  
  saveTimeEntriesToStorage();
  saveTasksToStorage();
  return newEntry;
}

export function getAllTimeEntries(): TimeEntry[] {
  return [...timeEntries];
}

// Dashboard statistics
export function getDashboardStats(userId?: string): {
  totalTasks: number;
  openTasks: number;
  inProgressTasks: number;
  pendingApprovalTasks: number;
  closedTasks: number;
  totalTimeLogged: number;
  tasksByPriority: { Low: number; Medium: number; High: number };
} {
  let filteredTasks = tasks;
  
  if (userId) {
    filteredTasks = tasks.filter(task => task.assignee === userId);
  }

  const stats = {
    totalTasks: filteredTasks.length,
    openTasks: filteredTasks.filter(t => t.status === 'Open').length,
    inProgressTasks: filteredTasks.filter(t => t.status === 'In Progress').length,
    pendingApprovalTasks: filteredTasks.filter(t => t.status === 'Pending Approval').length,
    closedTasks: filteredTasks.filter(t => t.status === 'Closed').length,
    totalTimeLogged: filteredTasks.reduce((sum, task) => sum + task.timeLogged, 0),
    tasksByPriority: {
      Low: filteredTasks.filter(t => t.priority === 'Low').length,
      Medium: filteredTasks.filter(t => t.priority === 'Medium').length,
      High: filteredTasks.filter(t => t.priority === 'High').length
    }
  };

  return stats;
}

// Trend data for charts
export function getTrendData(userId?: string): Array<{ date: string; concurrentTasks: number }> {
  const last30Days = Array.from({ length: 30 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (29 - i));
    return date.toISOString().split('T')[0];
  });

  return last30Days.map(date => {
    const dayEnd = new Date(date);
    dayEnd.setHours(23, 59, 59, 999);

    const filteredTasks = tasks.filter(task => {
      if (userId && task.assignee !== userId) return false;
      return task.createdDate <= dayEnd && 
             (task.status === 'Open' || task.status === 'In Progress' || 
              (task.status === 'Pending Approval' && task.lastUpdated <= dayEnd));
    });

    return {
      date,
      concurrentTasks: filteredTasks.length
    };
  });
}
