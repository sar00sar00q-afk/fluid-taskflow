import React, { useState, useMemo } from 'react';
import { 
  DndContext, 
  DragOverlay, 
  closestCorners, 
  KeyboardSensor, 
  PointerSensor, 
  useSensor, 
  useSensors,
  DragStartEvent,
  DragOverEvent,
  DragEndEvent,
  defaultDropAnimationSideEffects
} from '@dnd-kit/core';
import { 
  arrayMove, 
  SortableContext, 
  sortableKeyboardCoordinates, 
  verticalListSortingStrategy 
} from '@dnd-kit/sortable';
import { 
  Search, 
  Filter, 
  Plus, 
  LayoutGrid, 
  List as ListIcon, 
} from 'lucide-react';
import { toast } from 'sonner';
import { Task, TaskStatus } from '../../types';
import { Button, cn } from '../ui/Shared';
import { TaskCard } from './TaskCard';
import { KanbanColumn } from './KanbanColumn';
import { Modal } from '../ui/Modal';

const INITIAL_TASKS: Task[] = [
  { id: '1', title: 'Design System Update', description: 'Update the primary brand colors in Figma', priority: 'high', status: 'todo', dueDate: '2023-12-24', tags: ['design'] },
  { id: '2', title: 'API Integration', description: 'Connect the frontend to the new GraphQL endpoint', priority: 'medium', status: 'in-progress', dueDate: '2023-12-25', tags: ['dev'] },
  { id: '3', title: 'User Research', description: 'Conduct interviews with 5 potential users', priority: 'low', status: 'done', dueDate: '2023-12-22', tags: ['research'] },
];

export function TaskManager() {
  const [tasks, setTasks] = useState<Task[]>(INITIAL_TASKS);
  const [view, setView] = useState<'kanban' | 'list'>('kanban');
  const [search, setSearch] = useState('');
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTask, setNewTask] = useState<Partial<Task>>({ 
    title: '', 
    description: '', 
    priority: 'medium', 
    status: 'todo',
    dueDate: new Date().toISOString().split('T')[0]
  });

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const filteredTasks = useMemo(() => {
    return tasks.filter(t => 
      t.title.toLowerCase().includes(search.toLowerCase()) ||
      t.description.toLowerCase().includes(search.toLowerCase())
    );
  }, [tasks, search]);

  const onDragStart = (event: DragStartEvent) => {
    const { active } = event;
    setActiveTask(tasks.find(t => t.id === active.id) || null);
  };

  const onDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    if (activeId === overId) return;

    const isActiveTask = tasks.find(t => t.id === activeId);
    const isOverTask = tasks.find(t => t.id === overId);

    if (isActiveTask && isOverTask && isActiveTask.status !== isOverTask.status) {
      setTasks(prev => {
        const activeIndex = prev.findIndex(t => t.id === activeId);
        const overIndex = prev.findIndex(t => t.id === overId);
        const newTasks = [...prev];
        newTasks[activeIndex] = { ...newTasks[activeIndex], status: isOverTask.status };
        return arrayMove(newTasks, activeIndex, overIndex);
      });
    }
    
    const isOverColumn = ['todo', 'in-progress', 'done'].includes(overId as string);
    if (isActiveTask && isOverColumn && isActiveTask.status !== overId) {
      setTasks(prev => {
        const activeIndex = prev.findIndex(t => t.id === activeId);
        const newTasks = [...prev];
        newTasks[activeIndex] = { ...newTasks[activeIndex], status: overId as TaskStatus };
        return arrayMove(newTasks, activeIndex, activeIndex);
      });
    }
  };

  const onDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;
    const activeId = active.id;
    const overId = over.id;
    if (activeId !== overId) {
      setTasks((prev) => {
        const activeIndex = prev.findIndex((t) => t.id === activeId);
        const overIndex = prev.findIndex((t) => t.id === overId);
        return arrayMove(prev, activeIndex, overIndex);
      });
    }
    setActiveTask(null);
  };

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTask.title) return toast.error('Title is required');
    
    const task: Task = {
      ...newTask as Task,
      id: Math.random().toString(36).substr(2, 9),
      tags: [],
    };
    
    setTasks([...tasks, task]);
    setIsModalOpen(false);
    setNewTask({ title: '', description: '', priority: 'medium', status: 'todo', dueDate: new Date().toISOString().split('T')[0] });
    toast.success('Task created successfully!');
  };

  return (
    <div className="h-full flex flex-col space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Task Manager</h1>
          <p className="text-gray-500 text-sm">Organize and track your team's progress</p>
        </div>
        
        <div className="flex items-center gap-2">
          <div className="bg-gray-100 p-1 rounded-lg flex">
            <button 
              onClick={() => setView('kanban')}
              className={cn("p-1.5 rounded-md transition-all", view === 'kanban' ? "bg-white shadow-sm text-indigo-600" : "text-gray-500 hover:text-gray-700")}
              aria-label="Kanban view"
            >
              <LayoutGrid size={18} />
            </button>
            <button 
              onClick={() => setView('list')}
              className={cn("p-1.5 rounded-md transition-all", view === 'list' ? "bg-white shadow-sm text-indigo-600" : "text-gray-500 hover:text-gray-700")}
              aria-label="List view"
            >
              <ListIcon size={18} />
            </button>
          </div>
          <Button className="gap-2" onClick={() => setIsModalOpen(true)}>
            <Plus size={18} />
            New Task
          </Button>
        </div>
      </div>

      <div className="flex items-center gap-4 bg-white p-3 rounded-xl border border-gray-100 shadow-sm">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input 
            type="text"
            placeholder="Search tasks..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-50 border-transparent focus:bg-white focus:border-indigo-300 rounded-lg text-sm transition-all outline-none"
          />
        </div>
        <Button variant="secondary" className="gap-2 px-3">
          <Filter size={18} />
          <span className="hidden sm:inline">Filters</span>
        </Button>
      </div>

      <div className="flex-1 min-h-0">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCorners}
          onDragStart={onDragStart}
          onDragOver={onDragOver}
          onDragEnd={onDragEnd}
        >
          {view === 'kanban' ? (
            <div className="flex gap-6 h-full pb-6 overflow-x-auto snap-x">
              {(['todo', 'in-progress', 'done'] as TaskStatus[]).map(status => (
                <KanbanColumn 
                  key={status} 
                  id={status} 
                  title={status === 'in-progress' ? 'In Progress' : status.charAt(0).toUpperCase() + status.slice(1)}
                  tasks={filteredTasks.filter(t => t.status === status)}
                />
              ))}
            </div>
          ) : (
            <div className="space-y-3 pb-6">
              {filteredTasks.map(task => (
                <TaskCard key={task.id} task={task} layout="list" />
              ))}
            </div>
          )}

          <DragOverlay dropAnimation={{
            sideEffects: defaultDropAnimationSideEffects({
              styles: {
                active: {
                  opacity: '0.5',
                },
              },
            }),
          }}>
            {activeTask ? <TaskCard task={activeTask} isOverlay /> : null}
          </DragOverlay>
        </DndContext>
      </div>

      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title="Create New Task"
      >
        <form onSubmit={handleCreateTask} className="space-y-4">
          <div className="space-y-1">
            <label className="text-sm font-semibold text-gray-700">Task Title</label>
            <input 
              required
              value={newTask.title}
              onChange={e => setNewTask({...newTask, title: e.target.value})}
              className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
              placeholder="e.g. Design new landing page"
            />
          </div>
          <div className="space-y-1">
            <label className="text-sm font-semibold text-gray-700">Description</label>
            <textarea 
              rows={3}
              value={newTask.description}
              onChange={e => setNewTask({...newTask, description: e.target.value})}
              className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
              placeholder="Describe the task details..."
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-sm font-semibold text-gray-700">Priority</label>
              <select 
                value={newTask.priority}
                onChange={e => setNewTask({...newTask, priority: e.target.value as any})}
                className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-sm font-semibold text-gray-700">Due Date</label>
              <input 
                type="date"
                value={newTask.dueDate}
                onChange={e => setNewTask({...newTask, dueDate: e.target.value})}
                className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>
          </div>
          <div className="pt-4 flex gap-3">
            <Button type="button" variant="secondary" className="flex-1" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button type="submit" className="flex-1">Create Task</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}