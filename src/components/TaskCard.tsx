'use client';

import { Task } from '@/types';
import { format } from 'date-fns';
import { 
  CalendarIcon, 
  ClockIcon, 
  UserIcon,
  CheckCircleIcon,
  XCircleIcon,
  ExclamationTriangleIcon,
  PencilIcon,
  TrashIcon,
  CheckIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface TaskCardProps {
  task: Task;
  onEdit?: (task: Task) => void;
  onDelete?: (taskId: string) => void;
  onClose?: (taskId: string) => void;
  onApprove?: (taskId: string) => void;
  onReopen?: (taskId: string) => void;
  showActions?: boolean;
}

export default function TaskCard({ 
  task, 
  onEdit, 
  onDelete, 
  onClose, 
  onApprove, 
  onReopen,
  showActions = true 
}: TaskCardProps) {
  const getPriorityVariant = (priority: string) => {
    switch (priority) {
      case 'High':
        return 'destructive';
      case 'Medium':
        return 'warning';
      case 'Low':
        return 'success';
      default:
        return 'secondary';
    }
  };

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'Open':
        return 'info';
      case 'In Progress':
        return 'default';
      case 'Pending Approval':
        return 'warning';
      case 'Closed':
        return 'success';
      default:
        return 'secondary';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Closed':
        return <CheckCircleIcon className="h-3 w-3" />;
      case 'Pending Approval':
        return <ExclamationTriangleIcon className="h-3 w-3" />;
      default:
        return <XCircleIcon className="h-3 w-3" />;
    }
  };

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && task.status !== 'Closed';

  return (
    <Card className="group shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-l-4 border-l-primary/20 border-border/50">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-foreground mb-2 line-clamp-2 group-hover:text-primary transition-colors">
              {task.title}
            </h3>
            <p className="text-sm text-muted-foreground line-clamp-2">
              {task.description}
            </p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        <div className="flex flex-wrap gap-2 mb-4">
          <Badge 
            variant={getPriorityVariant(task.priority)} 
            className={`text-xs ${
              task.priority === 'High' ? 'glow-destructive' : 
              task.priority === 'Medium' ? 'glow-warning' : 
              'glow-success'
            }`}
          >
            {task.priority}
          </Badge>
          <Badge variant={getStatusVariant(task.status)} className="text-xs flex items-center gap-1">
            {getStatusIcon(task.status)}
            {task.status}
          </Badge>
        </div>

        <div className="grid grid-cols-1 gap-3 text-sm">
          <div className="flex items-center text-muted-foreground">
            <CalendarIcon className="h-4 w-4 mr-2 flex-shrink-0" />
            <span className="truncate">
              Created: {format(new Date(task.createdDate), 'MMM dd, yyyy')}
            </span>
          </div>
          {task.dueDate && (
            <div className="flex items-center text-muted-foreground">
              <CalendarIcon className="h-4 w-4 mr-2 flex-shrink-0" />
              <span className={cn("truncate", isOverdue && "text-destructive font-medium")}>
                Due: {format(new Date(task.dueDate), 'MMM dd, yyyy')}
                {isOverdue && " (Overdue)"}
              </span>
            </div>
          )}
          <div className="flex items-center text-muted-foreground">
            <ClockIcon className="h-4 w-4 mr-2 flex-shrink-0" />
            <span className="truncate">Time: {formatTime(task.timeLogged)}</span>
          </div>
          <div className="flex items-center text-muted-foreground">
            <UserIcon className="h-4 w-4 mr-2 flex-shrink-0" />
            <span className="truncate">Assignee: {task.assignee}</span>
          </div>
        </div>
      </CardContent>

      {showActions && (
        <CardFooter className="pt-0">
          <div className="flex flex-wrap gap-2 w-full">
            {onEdit && task.status !== 'Closed' && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => onEdit(task)}
                className="flex-1 sm:flex-none shadow-sm hover:shadow-md transition-shadow"
              >
                <PencilIcon className="h-3 w-3 mr-1" />
                Edit
              </Button>
            )}
            {onDelete && task.status !== 'Closed' && (
              <Button
                variant="destructive"
                size="sm"
                onClick={() => onDelete(task.id)}
                className="flex-1 sm:flex-none shadow-sm hover:shadow-md transition-shadow"
              >
                <TrashIcon className="h-3 w-3 mr-1" />
                Delete
              </Button>
            )}
            {onClose && task.status === 'In Progress' && (
              <Button
                variant="default"
                size="sm"
                onClick={() => onClose(task.id)}
                className="flex-1 sm:flex-none shadow-sm hover:shadow-md transition-shadow"
              >
                <CheckIcon className="h-3 w-3 mr-1" />
                Close Task
              </Button>
            )}
            {onApprove && task.status === 'Pending Approval' && (
              <Button
                variant="default"
                size="sm"
                onClick={() => onApprove(task.id)}
                className="flex-1 sm:flex-none shadow-sm hover:shadow-md transition-shadow"
              >
                <CheckIcon className="h-3 w-3 mr-1" />
                Approve
              </Button>
            )}
            {onReopen && task.status === 'Pending Approval' && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => onReopen(task.id)}
                className="flex-1 sm:flex-none shadow-sm hover:shadow-md transition-shadow"
              >
                <ArrowPathIcon className="h-3 w-3 mr-1" />
                Reopen
              </Button>
            )}
          </div>
        </CardFooter>
      )}
    </Card>
  );
}
