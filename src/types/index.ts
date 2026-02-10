export type Priority = 'low' | 'medium' | 'high';
export type TaskStatus = 'todo' | 'in-progress' | 'done';

export interface Task {
  id: string;
  title: string;
  description: string;
  priority: Priority;
  status: TaskStatus;
  dueDate: string;
  tags: string[];
}

export interface Widget {
  id: string;
  type: 'pomodoro' | 'habits' | 'notes' | 'stats';
  title: string;
  w: number;
  h: number;
}

export interface Habit {
  id: string;
  name: string;
  completedDays: string[]; // ISO dates
  goal: number; // days per week
  color: string;
}