import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Calendar, Clock, Tag, MoreHorizontal } from 'lucide-react';
import { Task } from '../../types';
import { Badge, Card, cn } from '../ui/Shared';

interface TaskCardProps {
  task: Task;
  layout?: 'kanban' | 'list';
  isOverlay?: boolean;
}

export function TaskCard({ task, layout = 'kanban', isOverlay }: TaskCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ 
    id: task.id,
    data: {
      type: 'Task',
      task,
    }
  });

  const style = {
    transform: CSS.Translate.toString(transform),
    transition,
  };

  if (isDragging) {
    return (
      <div 
        ref={setNodeRef} 
        style={style} 
        className="opacity-30 h-[120px] rounded-xl border-2 border-dashed border-indigo-200 bg-indigo-50"
      />
    );
  }

  const content = (
    <div className={cn(
      "group relative p-4 bg-white hover:border-indigo-200 transition-all cursor-grab active:cursor-grabbing",
      layout === 'list' ? "flex items-center gap-6" : "space-y-3"
    )}>
      {layout === 'list' && (
        <div className="flex-shrink-0">
          {task.status === 'done' ? (
            <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center">
              <div className="w-2.5 h-2.5 rounded-full bg-green-500" />
            </div>
          ) : (
            <div className="w-5 h-5 rounded-full border-2 border-gray-200 group-hover:border-indigo-400" />
          )}
        </div>
      )}

      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between mb-1">
          <h4 className="text-sm font-semibold text-gray-900 truncate">{task.title}</h4>
          <button className="text-gray-400 hover:text-gray-600 focus:outline-none">
            <MoreHorizontal size={16} />
          </button>
        </div>
        <p className="text-xs text-gray-500 line-clamp-2 mb-3">{task.description}</p>
        
        <div className="flex flex-wrap items-center gap-3">
          <Badge variant={task.priority}>
            {task.priority.toUpperCase()}
          </Badge>
          <div className="flex items-center text-[11px] text-gray-400 gap-1">
            <Calendar size={12} />
            {task.dueDate}
          </div>
          {task.tags.map(tag => (
            <div key={tag} className="flex items-center text-[11px] text-indigo-500 font-medium px-1.5 py-0.5 bg-indigo-50 rounded">
              <Tag size={10} className="mr-1" />
              {tag}
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <Card 
      ref={setNodeRef} 
      style={style} 
      {...attributes} 
      {...listeners}
      className={cn(
        "touch-none focus-within:ring-2 focus-within:ring-indigo-500",
        isOverlay && "shadow-xl border-indigo-300 rotate-2 scale-105"
      )}
    >
      {content}
    </Card>
  );
}