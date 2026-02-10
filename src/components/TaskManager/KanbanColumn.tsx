import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { Task } from '../../types';
import { TaskCard } from './TaskCard';
import { cn } from '../ui/Shared';

interface KanbanColumnProps {
  id: string;
  title: string;
  tasks: Task[];
}

export function KanbanColumn({ id, title, tasks }: KanbanColumnProps) {
  const { setNodeRef, isOver } = useDroppable({ id });

  return (
    <div className="flex flex-col h-full min-w-[300px]">
      <div className="flex items-center justify-between mb-4 px-2">
        <div className="flex items-center gap-2">
          <h3 className="font-bold text-gray-700">{title}</h3>
          <span className="bg-gray-200 text-gray-600 text-xs font-bold px-2 py-0.5 rounded-full">
            {tasks.length}
          </span>
        </div>
      </div>
      
      <div 
        ref={setNodeRef}
        className={cn(
          "flex-1 rounded-xl transition-colors p-2 space-y-4 overflow-y-auto min-h-[150px]",
          isOver ? "bg-indigo-50/50 ring-2 ring-indigo-200 ring-inset" : "bg-gray-50/50"
        )}
      >
        <SortableContext items={tasks.map(t => t.id)} strategy={verticalListSortingStrategy}>
          {tasks.map(task => (
            <TaskCard key={task.id} task={task} />
          ))}
        </SortableContext>
        
        {tasks.length === 0 && !isOver && (
          <div className="h-full flex flex-col items-center justify-center text-gray-400 py-10">
            <p className="text-sm italic">No tasks here</p>
          </div>
        )}
      </div>
    </div>
  );
}