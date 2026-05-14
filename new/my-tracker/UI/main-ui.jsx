"use client";
import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { Play, Pause, Square, Coffee, CheckCircle, Plus, BarChart2, ListTodo, Timer } from 'lucide-react';

export default function ProductivityTracker() {
  // Navigation State
  const [activeTab, setActiveTab] = useState('main'); // 'main', 'insights', 'tasks'

  // Data State
  const [tasks, setTasks] = useState([]);
  const [newTaskName, setNewTaskName] = useState('');
  const [activeTaskId, setActiveTaskId] = useState(null);

  // Timer State
  const [timerState, setTimerState] = useState('idle'); // 'idle', 'running', 'break'
  const [sessionTime, setSessionTime] = useState(0);
  const [breakTime, setBreakTime] = useState(0);

  // Prompts State
  const [showBreakPrompt, setShowBreakPrompt] = useState(false);
  const [showFiveHourPrompt, setShowFiveHourPrompt] = useState(false);
  const [notification, setNotification] = useState('');

  // --- Timer Engine ---
  useEffect(() => {
    let interval;

    if (timerState === 'running') {
      interval = setInterval(() => {
        setSessionTime((prev) => {
          const newTime = prev + 1;
          
          // 1 Hour (3600 seconds) - Break Recommendation
          if (newTime === 3600) {
            setShowBreakPrompt(true);
          }
          // 5 Hours (18000 seconds) - Task Completion Check
          if (newTime === 18000) {
            setShowFiveHourPrompt(true);
          }
          return newTime;
        });

        // Update the active task's total time
        setTasks((prevTasks) => 
          prevTasks.map(task => 
            task.id === activeTaskId 
              ? { ...task, timeSpent: task.timeSpent + 1 } 
              : task
          )
        );
      }, 1000);
    } else if (timerState === 'break') {
      interval = setInterval(() => {
        setBreakTime((prev) => {
          const newBreak = prev + 1;
          // 10 Minutes (600 seconds) - Auto Resume
          if (newBreak >= 600) {
            setTimerState('running');
            triggerNotification("Break's over! Timer auto-resumed.");
            return 0; // Reset break time
          }
          return newBreak;
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [timerState, activeTaskId]);

  // --- Helpers ---
  const formatTime = (seconds) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const triggerNotification = (msg) => {
    setNotification(msg);
    setTimeout(() => setNotification(''), 4000);
  };

  // --- Task Management ---
  const handleAddTask = (e) => {
    e.preventDefault();
    if (!newTaskName.trim()) return;
    
    const newTask = {
      id: Date.now(),
      name: newTaskName,
      status: 'pending',
      timeSpent: 0,
    };
    
    setTasks([...tasks, newTask]);
    setNewTaskName('');
    if (!activeTaskId) setActiveTaskId(newTask.id);
  };

  const markTaskComplete = (taskId) => {
    setTasks(tasks.map(t => t.id === taskId ? { ...t, status: 'completed' } : t));
    if (activeTaskId === taskId) {
      setTimerState('idle');
      setSessionTime(0);
      setActiveTaskId(null);
    }
    setShowFiveHourPrompt(false);
  };

  const startTask = (taskId) => {
    setActiveTaskId(taskId);
    setTimerState('running');
    setSessionTime(0); // Reset session for new start
    setActiveTab('main');
  };

  // --- Derived Data for Insights ---
  const completedTasks = tasks.filter(t => t.status === 'completed').length;
  const completionRate = tasks.length > 0 ? Math.round((completedTasks / tasks.length) * 100) : 0;
  
  const chartData = tasks.map(t => ({
    name: t.name.substring(0, 10) + (t.name.length > 10 ? '...' : ''),
    minutes: parseFloat((t.timeSpent / 60).toFixed(1))
  }));

  const activeTaskObj = tasks.find(t => t.id === activeTaskId);

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans flex flex-col items-center py-10">
      
      {/* Toast Notification */}
      {notification && (
        <div className="fixed top-5 right-5 bg-blue-600 text-white px-6 py-3 rounded-lg shadow-lg transition-opacity z-50">
          {notification}
        </div>
      )}

      <div className="w-full max-w-4xl bg-white rounded-2xl shadow-xl overflow-hidden">
        
        {/* Navigation Tabs */}
        <div className="flex border-b bg-gray-100">
          <button 
            onClick={() => setActiveTab('main')}
            className={`flex-1 py-4 flex items-center justify-center gap-2 font-semibold transition-colors ${activeTab === 'main' ? 'bg-white text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:bg-gray-200'}`}
          >
            <Timer size={20} /> Tracker
          </button>
          <button 
            onClick={() => setActiveTab('insights')}
            className={`flex-1 py-4 flex items-center justify-center gap-2 font-semibold transition-colors ${activeTab === 'insights' ? 'bg-white text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:bg-gray-200'}`}
          >
            <BarChart2 size={20} /> Insights
          </button>
          <button 
            onClick={() => setActiveTab('tasks')}
            className={`flex-1 py-4 flex items-center justify-center gap-2 font-semibold transition-colors ${activeTab === 'tasks' ? 'bg-white text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:bg-gray-200'}`}
          >
            <ListTodo size={20} /> Tasks Setup
          </button>
        </div>

        {/* --- Tab 1: Main Tracker --- */}
        {activeTab === 'main' && (
          <div className="p-8 flex flex-col items-center">
            
            {showBreakPrompt && (
              <div className="w-full bg-yellow-100 border border-yellow-400 text-yellow-800 px-4 py-3 rounded mb-6 flex justify-between items-center">
                <span>You've been working for 1 hour. Time for a quick break?</span>
                <button onClick={() => setShowBreakPrompt(false)} className="font-bold">✕</button>
              </div>
            )}

            {showFiveHourPrompt && (
              <div className="w-full bg-red-100 border border-red-400 text-red-800 px-4 py-5 rounded mb-6 text-center">
                <h3 className="font-bold text-lg mb-2">5 Hour Check-in!</h3>
                <p className="mb-4">You've been on this task for 5 hours. Is it completed?</p>
                <div className="flex justify-center gap-4">
                  <button onClick={() => markTaskComplete(activeTaskId)} className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">Yes, Mark Complete</button>
                  <button onClick={() => setShowFiveHourPrompt(false)} className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600">No, Keep Going</button>
                </div>
              </div>
            )}

            <h2 className="text-2xl font-bold mb-2">
              {activeTaskObj ? activeTaskObj.name : 'No Active Task'}
            </h2>
            <p className="text-gray-500 mb-8">
              {timerState === 'break' ? 'Currently on a break...' : 'Focus session active'}
            </p>

            {/* Big Timer Display */}
            <div className={`text-7xl font-mono mb-10 transition-colors ${timerState === 'break' ? 'text-yellow-500' : timerState === 'running' ? 'text-blue-600' : 'text-gray-800'}`}>
              {timerState === 'break' ? formatTime(breakTime) : formatTime(sessionTime)}
            </div>

            {/* Controls */}
            <div className="flex gap-4">
              {timerState !== 'running' && (
                <button 
                  disabled={!activeTaskId}
                  onClick={() => setTimerState('running')} 
                  className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-full hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md"
                >
                  <Play size={20} /> Start
                </button>
              )}
              
              {timerState === 'running' && (
                <button 
                  onClick={() => setTimerState('idle')} 
                  className="flex items-center gap-2 bg-gray-600 text-white px-6 py-3 rounded-full hover:bg-gray-700 transition-all shadow-md"
                >
                  <Pause size={20} /> Pause
                </button>
              )}

              <button 
                disabled={timerState !== 'running'}
                onClick={() => {
                  setTimerState('break');
                  setBreakTime(0);
                  setShowBreakPrompt(false);
                }} 
                className="flex items-center gap-2 bg-yellow-500 text-white px-6 py-3 rounded-full hover:bg-yellow-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md"
              >
                <Coffee size={20} /> Take Break
              </button>

              <button 
                disabled={!activeTaskId}
                onClick={() => {
                  setTimerState('idle');
                  markTaskComplete(activeTaskId);
                }} 
                className="flex items-center gap-2 bg-green-600 text-white px-6 py-3 rounded-full hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md"
              >
                <CheckCircle size={20} /> Complete Task
              </button>
            </div>
          </div>
        )}

        {/* --- Tab 2: Insights --- */}
        {activeTab === 'insights' && (
          <div className="p-8">
            <h2 className="text-2xl font-bold mb-6">Productivity Insights</h2>
            
            <div className="grid grid-cols-2 gap-6 mb-10">
              <div className="bg-blue-50 p-6 rounded-xl border border-blue-100">
                <p className="text-blue-600 font-semibold mb-1">Completion Rate</p>
                <p className="text-4xl font-bold text-blue-900">{completionRate}%</p>
                <p className="text-sm text-blue-700 mt-2">{completedTasks} of {tasks.length} tasks completed</p>
              </div>
              <div className="bg-green-50 p-6 rounded-xl border border-green-100">
                <p className="text-green-600 font-semibold mb-1">Total Time Tracked</p>
                <p className="text-4xl font-bold text-green-900">
                  {formatTime(tasks.reduce((acc, task) => acc + task.timeSpent, 0))}
                </p>
              </div>
            </div>

            <h3 className="text-xl font-bold mb-4">Time Spent per Task (Minutes)</h3>
            <div className="h-64 w-full">
              {tasks.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip cursor={{fill: 'transparent'}} />
                    <Bar dataKey="minutes" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-gray-400">
                  No data to display yet.
                </div>
              )}
            </div>
          </div>
        )}

        {/* --- Tab 3: Tasks Setup --- */}
        {activeTab === 'tasks' && (
          <div className="p-8">
            <h2 className="text-2xl font-bold mb-6">Manage Tasks</h2>
            
            <form onSubmit={handleAddTask} className="flex gap-4 mb-8">
              <input 
                type="text" 
                value={newTaskName}
                onChange={(e) => setNewTaskName(e.target.value)}
                placeholder="What are you working on?" 
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button type="submit" className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 flex items-center gap-2">
                <Plus size={20} /> Add Task
              </button>
            </form>

            <div className="space-y-4">
              {tasks.length === 0 ? (
                <p className="text-center text-gray-500 py-10">No tasks created yet. Add one above!</p>
              ) : (
                tasks.map(task => (
                  <div key={task.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:shadow-sm transition-shadow">
                    <div>
                      <h4 className={`font-semibold ${task.status === 'completed' ? 'line-through text-gray-400' : 'text-gray-800'}`}>
                        {task.name}
                      </h4>
                      <p className="text-sm text-gray-500">Tracked: {formatTime(task.timeSpent)}</p>
                    </div>
                    <div className="flex gap-3">
                      {task.status !== 'completed' && (
                        <>
                          <button 
                            onClick={() => startTask(task.id)}
                            className="text-blue-600 hover:text-blue-800 px-3 py-1 rounded border border-blue-200 hover:bg-blue-50 transition-colors"
                          >
                            Select & Start
                          </button>
                          <button 
                            onClick={() => markTaskComplete(task.id)}
                            className="text-green-600 hover:text-green-800 px-3 py-1 rounded border border-green-200 hover:bg-green-50 transition-colors"
                          >
                            Mark Done
                          </button>
                        </>
                      )}
                      {task.status === 'completed' && (
                        <span className="flex items-center gap-1 text-green-600 font-medium">
                          <CheckCircle size={16} /> Completed
                        </span>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}