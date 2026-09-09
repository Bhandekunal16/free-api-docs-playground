import React, { useState, useEffect } from 'react';
import {
  Server,
  Search,
  History,
  Menu,
  X,
  ExternalLink,
  Code2,
  Columns,
  BookOpen,
  PlaySquare,
  Sparkles,
  Zap,
  Globe
} from 'lucide-react';
import { useApi } from '../../context/ApiContext';
import { BaseUrlModal } from '../modals/BaseUrlModal';
import { HistoryModal } from '../modals/HistoryModal';
import { CommandPalette } from '../modals/CommandPalette';

export const Header: React.FC = () => {
  const {
    baseUrl,
    serverHealth,
    history,
    layoutMode,
    setLayoutMode,
    isMobileMenuOpen,
    setIsMobileMenuOpen
  } = useApi();

  const [isBaseUrlModalOpen, setIsBaseUrlModalOpen] = useState(false);
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);

  // Global shortcut Cmd+K or Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const cleanBaseDisplay = baseUrl.replace(/^https?:\/\//, '');

  return (
    <>
      <header className="sticky top-0 z-40 h-14 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 px-4 flex items-center justify-between">
        {/* Left: Brand & Mobile Toggle */}
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-1.5 text-slate-400 hover:text-white rounded-md hover:bg-slate-800 transition-colors"
            aria-label="Toggle navigation menu"
          >
            {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>

          <div className="flex items-center space-x-2.5">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-tr from-indigo-600 to-sky-500 flex items-center justify-center text-white font-bold shadow-md shadow-indigo-500/20">
              <Zap size={18} className="fill-white text-white" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-bold text-sm tracking-tight text-white">Free API Server</span>
                <span className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 rounded">
                  v1.0 Docs & Playground
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Center: Base URL Switcher & Search */}
        <div className="hidden md:flex items-center space-x-3">
          {/* Base URL Pill Button */}
          <button
            onClick={() => setIsBaseUrlModalOpen(true)}
            className="flex items-center space-x-2 px-3 py-1.5 bg-slate-950/80 hover:bg-slate-950 border border-slate-800 hover:border-slate-700 text-xs rounded-lg transition-all shadow-inner group"
            title="Click to change API Base URL"
          >
            <div className="flex items-center space-x-1.5 text-slate-400">
              <Globe size={13} className="text-slate-500 group-hover:text-indigo-400 transition-colors" />
              <span className="text-slate-500 text-[11px] font-semibold uppercase tracking-wider">Base:</span>
            </div>
            <span className="font-mono text-slate-300 font-medium max-w-[200px] truncate">
              {cleanBaseDisplay}
            </span>
            <span
              className={`w-2 h-2 rounded-full shrink-0 ${
                serverHealth === 'healthy'
                  ? 'bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.8)]'
                  : serverHealth === 'checking'
                  ? 'bg-amber-400 animate-pulse'
                  : 'bg-rose-400'
              }`}
              title={`Status: ${serverHealth}`}
            />
          </button>

          {/* Search / Command palette trigger */}
          <button
            onClick={() => setIsCommandPaletteOpen(true)}
            className="flex items-center space-x-2 px-3 py-1.5 bg-slate-950/60 hover:bg-slate-950 border border-slate-800 text-xs text-slate-400 hover:text-slate-200 rounded-lg transition-all w-52 justify-between"
          >
            <span className="flex items-center space-x-1.5 truncate">
              <Search size={13} />
              <span>Search API docs...</span>
            </span>
            <kbd className="text-[10px] font-mono bg-slate-800 px-1.5 py-0.5 rounded text-slate-400 border border-slate-700">
              ⌘K
            </kbd>
          </button>
        </div>

        {/* Right: Layout Switcher & History */}
        <div className="flex items-center space-x-2">
          {/* Layout Mode (Desktop only) */}
          <div className="hidden xl:flex items-center bg-slate-950 p-0.5 rounded-lg border border-slate-800 text-xs">
            <button
              onClick={() => setLayoutMode('split')}
              className={`flex items-center space-x-1 px-2.5 py-1 rounded text-xs font-medium transition-colors ${
                layoutMode === 'split'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Split View (Documentation + Playground)"
            >
              <Columns size={13} />
              <span>Split</span>
            </button>
            <button
              onClick={() => setLayoutMode('docs')}
              className={`flex items-center space-x-1 px-2.5 py-1 rounded text-xs font-medium transition-colors ${
                layoutMode === 'docs'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Documentation Only"
            >
              <BookOpen size={13} />
              <span>Docs</span>
            </button>
            <button
              onClick={() => setLayoutMode('playground')}
              className={`flex items-center space-x-1 px-2.5 py-1 rounded text-xs font-medium transition-colors ${
                layoutMode === 'playground'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Playground Only"
            >
              <PlaySquare size={13} />
              <span>Playground</span>
            </button>
          </div>

          {/* History Button */}
          <button
            onClick={() => setIsHistoryModalOpen(true)}
            className="flex items-center space-x-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-medium border border-slate-700/80 transition-colors"
            title="View Request History"
          >
            <History size={14} />
            <span className="hidden sm:inline">History</span>
            {history.length > 0 && (
              <span className="ml-1 px-1.5 py-0.2 bg-indigo-600 text-white rounded-full text-[10px] font-bold">
                {history.length}
              </span>
            )}
          </button>

          {/* Mobile search button */}
          <button
            onClick={() => setIsCommandPaletteOpen(true)}
            className="md:hidden p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
          >
            <Search size={18} />
          </button>
        </div>
      </header>

      {/* Modals */}
      <BaseUrlModal
        isOpen={isBaseUrlModalOpen}
        onClose={() => setIsBaseUrlModalOpen(false)}
      />
      <HistoryModal
        isOpen={isHistoryModalOpen}
        onClose={() => setIsHistoryModalOpen(false)}
      />
      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
      />
    </>
  );
};
