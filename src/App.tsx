import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  CheckSquare, 
  Settings, 
  Bell, 
  User, 
  LogOut,
  ChevronLeft,
  ChevronRight,
  Search,
  Zap,
  Menu,
  X
} from 'lucide-react';
import { Toaster, toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';
import { TaskManager } from './components/TaskManager/TaskManager';
import { ProductivityDashboard } from './components/ProductivityDashboard/ProductivityDashboard';
import { cn } from './components/ui/Shared';

type ActiveView = 'dashboard' | 'tasks' | 'settings';

export default function App() {
  const [activeView, setActiveView] = useState<ActiveView>('dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navigation = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'tasks', label: 'Task Manager', icon: CheckSquare },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const renderView = () => {
    switch (activeView) {
      case 'dashboard': return <ProductivityDashboard />;
      case 'tasks': return <TaskManager />;
      default: return <div className="p-20 text-center text-gray-400">View coming soon...</div>;
    }
  };

  return (
    <div className="flex h-screen bg-gray-50 text-gray-900 overflow-hidden font-sans">
      <Toaster position="top-right" />

      {/* Mobile Backdrop */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setMobileMenuOpen(false)}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside 
        className={cn(
          "fixed inset-y-0 left-0 z-50 bg-white border-r border-gray-200 transition-all duration-300 lg:static lg:block",
          sidebarCollapsed ? "w-20" : "w-64",
          mobileMenuOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        <div className="flex flex-col h-full">
          {/* Logo Area */}
          <div className="h-16 flex items-center px-6 gap-3 border-b border-gray-50">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center flex-shrink-0">
              <Zap size={20} className="text-white fill-white" />
            </div>
            {!sidebarCollapsed && <span className="font-bold text-xl tracking-tight">FocusFlow</span>}
            <button 
              onClick={() => setMobileMenuOpen(false)}
              className="ml-auto lg:hidden text-gray-400 hover:text-gray-600"
            >
              <X size={20} />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-3 py-6 space-y-1">
            {navigation.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setActiveView(item.id as ActiveView);
                  setMobileMenuOpen(false);
                }}
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all group",
                  activeView === item.id 
                    ? "bg-indigo-50 text-indigo-700" 
                    : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
                )}
              >
                <item.icon 
                  size={20} 
                  className={cn(
                    "transition-colors",
                    activeView === item.id ? "text-indigo-600" : "text-gray-400 group-hover:text-gray-600"
                  )} 
                />
                {!sidebarCollapsed && <span>{item.label}</span>}
                {activeView === item.id && !sidebarCollapsed && (
                  <motion.div 
                    layoutId="active-pill"
                    className="ml-auto w-1.5 h-1.5 rounded-full bg-indigo-600"
                  />
                )}
              </button>
            ))}
          </nav>

          {/* User Section */}
          <div className="p-4 border-t border-gray-100">
            <div className={cn(
              "flex items-center gap-3 p-2 rounded-xl hover:bg-gray-50 transition-all cursor-pointer",
              sidebarCollapsed && "justify-center"
            )}>
              <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                JD
              </div>
              {!sidebarCollapsed && (
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold truncate">John Doe</p>
                  <p className="text-xs text-gray-400 truncate">Pro Account</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        {/* Top Header */}
        <header className="h-16 bg-white/80 backdrop-blur-md border-b border-gray-200 px-4 md:px-8 flex items-center justify-between z-30">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden p-2 text-gray-500 hover:bg-gray-100 rounded-lg"
            >
              <Menu size={20} />
            </button>
            <button 
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="hidden lg:flex p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              {sidebarCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
            </button>
            <div className="hidden md:flex relative group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-indigo-500 transition-colors" size={16} />
              <input 
                type="text" 
                placeholder="Search anything..." 
                className="pl-10 pr-4 py-1.5 bg-gray-50 border-transparent border focus:bg-white focus:border-indigo-200 rounded-lg text-xs w-64 transition-all outline-none"
              />
            </div>
          </div>

          <div className="flex items-center gap-2 md:gap-4">
            <button className="p-2 text-gray-400 hover:text-gray-600 relative">
              <Bell size={20} />
              <span className="absolute top-2 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
            </button>
            <div className="h-8 w-px bg-gray-200 mx-2 hidden sm:block" />
            <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-gray-50 text-sm font-medium text-gray-600">
              <User size={18} />
              <span className="hidden sm:inline">Account</span>
            </button>
          </div>
        </header>

        {/* Scrollable Area */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden">
          <div className="max-w-7xl mx-auto p-4 md:p-8 min-h-full">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeView}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="h-full"
              >
                {renderView()}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </main>
    </div>
  );
}