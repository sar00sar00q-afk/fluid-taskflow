import React, { useState, useEffect } from 'react';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  CheckCircle, 
  Clock, 
  MoreVertical,
  Plus,
  Flame,
  Calendar,
  StickyNote
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip as ChartTooltip 
} from 'recharts';
import { motion } from 'framer-motion';
import { Habit } from '../../types';
import { Button, Card, cn } from '../ui/Shared';

export function ProductivityDashboard() {
  return (
    <div className="h-full relative flex flex-col space-y-8 pb-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Your Dashboard</h1>
          <p className="text-gray-500 text-sm">Welcome back! Here's your focus summary.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="secondary" className="gap-2">
            <Calendar size={18} />
            <span className="hidden sm:inline">Overview</span>
          </Button>
          <Button className="gap-2">
            <Plus size={18} />
            <span>Add Widget</span>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsWidget />
        <PomodoroWidget />
        <HabitTrackerWidget />
        <NotesWidget />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <ActivityChartWidget className="lg:col-span-2" />
        <QuickCaptureWidget />
      </div>
    </div>
  );
}

function StatsWidget() {
  const stats = [
    { label: 'Deep Work', value: '4.5h', icon: Clock, color: 'text-indigo-600', bg: 'bg-indigo-50' },
    { label: 'Tasks Done', value: '12', icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-50' },
    { label: 'Focus Streak', value: '5d', icon: Flame, color: 'text-orange-600', bg: 'bg-orange-50' },
  ];

  return (
    <div className="lg:col-span-1 space-y-4">
      {stats.map((stat, i) => (
        <Card key={i} className="p-4 flex items-center gap-4 hover:shadow-md transition-shadow group">
          <div className={cn("p-2.5 rounded-xl transition-colors", stat.bg)}>
            <stat.icon size={20} className={stat.color} />
          </div>
          <div>
            <p className="text-xs text-gray-500 font-medium">{stat.label}</p>
            <p className="text-xl font-bold text-gray-900">{stat.value}</p>
          </div>
        </Card>
      ))}
    </div>
  );
}

function PomodoroWidget() {
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);
  const [mode, setMode] = useState<'work' | 'break'>('work');

  useEffect(() => {
    let interval: any = null;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => setTimeLeft(t => t - 1), 1000);
    } else if (timeLeft === 0) {
      setIsActive(false);
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const totalTime = mode === 'work' ? 25 * 60 : 5 * 60;
  const progress = (totalTime - timeLeft) / totalTime;

  return (
    <Card className="p-6 flex flex-col items-center justify-center relative overflow-hidden">
      <div className="flex gap-2 mb-6 z-10">
        <button 
          onClick={() => { setMode('work'); setTimeLeft(25 * 60); setIsActive(false); }}
          className={cn("px-3 py-1 rounded-full text-xs font-semibold transition-all", mode === 'work' ? "bg-indigo-600 text-white shadow-lg" : "bg-gray-100 text-gray-500")}
        >
          Work
        </button>
        <button 
          onClick={() => { setMode('break'); setTimeLeft(5 * 60); setIsActive(false); }}
          className={cn("px-3 py-1 rounded-full text-xs font-semibold transition-all", mode === 'break' ? "bg-indigo-600 text-white shadow-lg" : "bg-gray-100 text-gray-500")}
        >
          Break
        </button>
      </div>

      <div className="relative mb-8 flex items-center justify-center">
        <svg className="w-32 h-32 transform -rotate-90">
          <circle
            cx="64" cy="64" r="58"
            stroke="currentColor" strokeWidth="8" fill="transparent"
            className="text-gray-100"
          />
          <circle
            cx="64" cy="64" r="58"
            stroke="currentColor" strokeWidth="8" fill="transparent"
            strokeDasharray={364.42}
            strokeDashoffset={364.42 * (1 - progress)}
            strokeLinecap="round"
            className="text-indigo-600 transition-all duration-1000"
          />
        </svg>
        <div className="absolute text-2xl font-bold text-gray-900 tabular-nums">
          {formatTime(timeLeft)}
        </div>
      </div>

      <div className="flex gap-3 z-10">
        <Button 
          onClick={() => setIsActive(!isActive)}
          variant={isActive ? "secondary" : "primary"}
          className="rounded-full w-10 h-10 p-0"
        >
          {isActive ? <Pause size={20} /> : <Play size={20} className="ml-0.5" />}
        </Button>
        <Button 
          onClick={() => { setTimeLeft(totalTime); setIsActive(false); }}
          variant="secondary"
          className="rounded-full w-10 h-10 p-0"
        >
          <RotateCcw size={18} />
        </Button>
      </div>
    </Card>
  );
}

function HabitTrackerWidget() {
  const habits: Habit[] = [
    { id: '1', name: 'Reading', completedDays: [], goal: 5, color: '#6366f1' },
    { id: '2', name: 'Workouts', completedDays: [], goal: 4, color: '#22c55e' },
  ];

  return (
    <Card className="p-5 flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-gray-800 text-sm flex items-center gap-2">
          <Flame size={16} className="text-orange-500" />
          Habit Streak
        </h3>
        <Button variant="ghost" className="p-1 h-auto"><MoreVertical size={16} /></Button>
      </div>
      <div className="space-y-6">
        {habits.map(habit => (
          <div key={habit.id} className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-gray-700">{habit.name}</span>
              <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">0/{habit.goal} Weekly</span>
            </div>
            <div className="flex justify-between gap-1">
              {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, i) => (
                <button key={i} className={cn(
                  "flex-1 aspect-square rounded-md border flex items-center justify-center text-[10px] font-bold transition-all",
                  i < 3 ? "bg-indigo-50 border-indigo-100 text-indigo-600 ring-2 ring-indigo-500/10" : "bg-gray-50 border-gray-100 text-gray-300 hover:border-indigo-200"
                )}>
                  {day}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}

function NotesWidget() {
  const [note, setNote] = useState('Productivity is about doing the right things, not more things...');
  
  return (
    <Card className="p-5 flex flex-col min-h-[180px]">
      <div className="flex items-center gap-2 mb-3">
        <StickyNote size={16} className="text-yellow-600" />
        <h3 className="font-bold text-gray-800 text-sm">Brain Dump</h3>
      </div>
      <textarea 
        className="flex-1 w-full resize-none text-sm text-gray-600 focus:outline-none bg-transparent placeholder:italic"
        value={note}
        onChange={(e) => setNote(e.target.value)}
        spellCheck={false}
      />
      <div className="mt-2 pt-2 border-t border-gray-50 flex justify-between items-center text-[10px] text-gray-400">
        <span>Draft</span>
        <div className="flex gap-1.5">
          <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse" />
          <span className="uppercase font-bold tracking-tighter">Autosaving</span>
        </div>
      </div>
    </Card>
  );
}

const chartData = [
  { name: 'M', focus: 3.5 },
  { name: 'T', focus: 4.8 },
  { name: 'W', focus: 4.0 },
  { name: 'T', focus: 6.2 },
  { name: 'F', focus: 5.5 },
  { name: 'S', focus: 2.1 },
  { name: 'S', focus: 1.5 },
];

function ActivityChartWidget({ className }: { className?: string }) {
  return (
    <Card className={cn("p-6", className)}>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h3 className="font-bold text-gray-800">Weekly Performance</h3>
          <p className="text-xs text-gray-400">Deep work hours visualization</p>
        </div>
        <div className="flex items-center gap-2 bg-gray-50 p-1 rounded-lg">
          <Button variant="ghost" className="px-2 py-1 text-[10px] h-auto bg-white shadow-sm font-bold uppercase tracking-wider">Week</Button>
          <Button variant="ghost" className="px-2 py-1 text-[10px] h-auto font-bold uppercase tracking-wider">Month</Button>
        </div>
      </div>
      <div className="h-[250px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="colorFocus" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
            <XAxis 
              dataKey="name" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fontSize: 10, fill: '#9ca3af', fontWeight: 600 }} 
              dy={10}
            />
            <YAxis 
              axisLine={false} 
              tickLine={false} 
              tick={{ fontSize: 10, fill: '#9ca3af', fontWeight: 600 }} 
            />
            <ChartTooltip 
              contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', fontSize: '12px' }}
            />
            <Area 
              type="monotone" 
              dataKey="focus" 
              stroke="#6366f1" 
              strokeWidth={3}
              fillOpacity={1} 
              fill="url(#colorFocus)" 
              animationDuration={1500}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}

function QuickCaptureWidget() {
  return (
    <Card className="p-6 bg-indigo-600 text-white relative overflow-hidden group border-none shadow-indigo-200 shadow-lg">
      <div className="relative z-10">
        <h3 className="text-lg font-bold mb-2">Rocket Capture</h3>
        <p className="text-indigo-100 text-sm mb-6 leading-relaxed">Instantly save tasks or ideas before they drift away.</p>
        <div className="space-y-3">
          <input 
            type="text" 
            placeholder="I need to..."
            className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 placeholder:text-indigo-200 text-sm focus:outline-none focus:ring-2 focus:ring-white/50 transition-all"
          />
          <Button variant="secondary" className="w-full bg-white text-indigo-600 hover:bg-indigo-50 border-none font-bold py-3">
            Capture Idea
          </Button>
        </div>
      </div>
      <div className="absolute -right-8 -bottom-8 w-40 h-40 bg-white/10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-1000" />
      <div className="absolute -left-10 -top-10 w-24 h-24 bg-indigo-400/20 rounded-full blur-2xl" />
    </Card>
  );
}