"use client";
import React, { useState } from 'react';
import { X } from 'lucide-react';

export function SettingsModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [activeTab, setActiveTab] = useState('General');

  if (!isOpen) return null;

  const tabs = ["General", "Engine", "Data controls", "Usage & billing", "Builder profile"];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl w-full max-w-4xl h-[80vh] max-h-[800px] flex overflow-hidden shadow-2xl relative">
        {/* Left Sidebar */}
        <div className="w-64 bg-slate-50 border-r border-slate-200 p-4 flex flex-col">
          <h2 className="text-lg font-semibold text-slate-800 mb-4 px-2">Settings</h2>
          <div className="flex-1 flex flex-col gap-1 overflow-y-auto">
            {tabs.map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === tab ? 'bg-slate-200 text-slate-900' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'}`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
        
        {/* Right Content */}
        <div className="flex-1 flex flex-col">
          <div className="flex justify-between items-center p-6 border-b border-slate-100">
            <h3 className="text-xl font-semibold text-slate-800">{activeTab}</h3>
            <button onClick={onClose} className="p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600 rounded-full transition-colors">
              <X size={20} />
            </button>
          </div>
          <div className="p-6 overflow-y-auto flex-1">
            <div className="text-slate-500 text-sm">
              Configuration options for {activeTab} will appear here.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
