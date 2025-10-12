export interface User {
  id: string;
  name: string;
  email: string;
  role: 'Developer' | 'Manager';
}

export interface Task {
  id: string;
  title: string;
  description: string;
  priority: 'Low' | 'Medium' | 'High';
  status: 'Open' | 'In Progress' | 'Pending Approval' | 'Closed';
  assignee: string;
  createdDate: Date;
  dueDate?: Date;
  timeLogged: number; // in minutes
  createdBy: string;
  lastUpdated: Date;
}

export interface TimeEntry {
  id: string;
  taskId: string;
  userId: string;
  date: Date;
  duration: number; // in minutes
  description: string;
}

export interface DashboardStats {
  totalTasks: number;
  openTasks: number;
  inProgressTasks: number;
  pendingApprovalTasks: number;
  closedTasks: number;
  totalTimeLogged: number;
  tasksByPriority: {
    Low: number;
    Medium: number;
    High: number;
  };
}

export interface TrendData {
  date: string;
  concurrentTasks: number;
}
