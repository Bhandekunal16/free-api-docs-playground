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
import { ProfileMenu } from './ProfileMenu';
import { BaseUrlModal } from '../modals/BaseUrlModal';
import { HistoryModal } from '../modals/HistoryModal';
import { CommandPalette } from '../modals/CommandPalette';
import { ProfileSettingsModal } from '../modals/ProfileSettingsModal';

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
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [profileModalTab, setProfileModalTab] = useState<'profile' | 'settings' | 'shortcuts'>('profile');

  const handleOpenSettingsModal = (tab: 'profile' | 'settings' | 'shortcuts' = 'profile') => {
    setProfileModalTab(tab);
    setIsProfileModalOpen(true);
  };

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
      <header className="sticky top-0 z-40 h-14 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 px-4 flex items-center justify-between transition-colors duration-150">
        {/* Left: Brand & Mobile Toggle */}
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-1.5 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            aria-label="Toggle navigation menu"
          >
            {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>

          <div className="flex items-center space-x-2.5">
            <div className="h-8 w-8 rounded-lg bg-slate-900 dark:bg-slate-100 flex items-center justify-center text-white dark:text-slate-900 font-bold shadow-sm">
              <Zap size={18} className="fill-current" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-bold text-sm tracking-tight text-slate-900 dark:text-white">Free API Server</span>
              </div>
            </div>
          </div>
        </div>

        {/* Center: Base URL Switcher & Search */}
        <div className="hidden md:flex items-center space-x-3">
          {/* Base URL Pill Button */}
          <button
            onClick={() => setIsBaseUrlModalOpen(true)}
            className="flex items-center space-x-2 px-3 py-1.5 min-h-[36px] bg-slate-100 dark:bg-slate-950/80 hover:bg-slate-200 dark:hover:bg-slate-950 border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 text-xs rounded-lg transition-all shadow-sm group"
            title="Click to change API Base URL"
          >
            <div className="flex items-center space-x-1.5 text-slate-500 dark:text-slate-400">
              <Globe size={13} className="text-slate-500 dark:text-slate-500 group-hover:text-slate-900 dark:group-hover:text-slate-200 transition-colors" />
              <span className="text-slate-500 text-[11px] font-semibold uppercase tracking-wider">Base:</span>
            </div>
            <span className="font-mono text-slate-700 dark:text-slate-300 font-medium max-w-[200px] truncate">
              {cleanBaseDisplay}
            </span>
            <span
              className={`w-2 h-2 rounded-full shrink-0 ${
                serverHealth === 'healthy'
                  ? 'bg-emerald-500 dark:bg-emerald-400'
                  : serverHealth === 'checking'
                  ? 'bg-amber-500 dark:bg-amber-400 animate-pulse'
                  : 'bg-rose-500 dark:bg-rose-400'
              }`}
              title={`Status: ${serverHealth}`}
            />
          </button>

          {/* Search / Command palette trigger */}
          <button
            onClick={() => setIsCommandPaletteOpen(true)}
            className="flex items-center space-x-2 px-3 py-1.5 min-h-[36px] bg-slate-100/80 dark:bg-slate-950/60 hover:bg-slate-100 dark:hover:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 rounded-lg transition-all w-52 justify-between"
          >
            <span className="flex items-center space-x-1.5 truncate">
              <Search size={13} />
              <span>Search API docs...</span>
            </span>
            <kbd className="text-[10px] font-mono bg-white dark:bg-slate-800 px-1.5 py-0.5 rounded text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-700 shadow-2xs">
              ⌘K
            </kbd>
          </button>
        </div>

        {/* Right: Layout Switcher, Theme Switcher & History */}
        <div className="flex items-center space-x-2">
          {/* Layout Mode Switcher (Visible on md screens and up) */}
          <div className="hidden md:flex items-center bg-slate-100 dark:bg-slate-950 p-1 rounded-lg border border-slate-200 dark:border-slate-800 text-xs">
            <button
              onClick={() => setLayoutMode('split')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 min-h-[32px] rounded-md text-xs font-semibold transition-colors ${
                layoutMode === 'split'
                  ? 'bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 shadow-2xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
              title="Split View (Documentation + Playground)"
            >
              <Columns size={13} />
              <span className="hidden lg:inline">Split</span>
            </button>
            <button
              onClick={() => setLayoutMode('docs')}
              className={`flex items-center space-x-1.5 px-2.5 py-1.5 min-h-[32px] rounded-md text-xs font-medium transition-colors ${
                layoutMode === 'docs'
                  ? 'bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 font-semibold shadow-2xs'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
              title="Documentation Only"
            >
              <BookOpen size={13} />
              <span className="hidden lg:inline">Docs</span>
            </button>
            <button
              onClick={() => setLayoutMode('playground')}
              className={`flex items-center space-x-1.5 px-2.5 py-1.5 min-h-[32px] rounded-md text-xs font-medium transition-colors ${
                layoutMode === 'playground'
                  ? 'bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 font-semibold shadow-2xs'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
              title="Playground Only"
            >
              <PlaySquare size={13} />
              <span className="hidden lg:inline">Playground</span>
            </button>
          </div>

          {/* History Button */}
          <button
            onClick={() => setIsHistoryModalOpen(true)}
            className="flex items-center space-x-1.5 px-3 py-1.5 min-h-[36px] bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-lg text-xs font-medium border border-slate-200 dark:border-slate-700/80 transition-colors shadow-sm"
            title="View Request History"
          >
            <History size={14} />
            <span className="hidden sm:inline">History</span>
            {history.length > 0 && (
              <span className="ml-1 px-1.5 py-0.2 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 rounded-full text-[10px] font-bold">
                {history.length}
              </span>
            )}
          </button>

          {/* Profile & Settings Menu Dropdown */}
          <ProfileMenu onOpenFullSettings={handleOpenSettingsModal} />

          {/* Mobile search button */}
          <button
            onClick={() => setIsCommandPaletteOpen(true)}
            className="md:hidden p-2 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
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
      <ProfileSettingsModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        initialTab={profileModalTab}
      />
    </>
  );
};

