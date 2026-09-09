import React, { useState, useRef, useEffect } from 'react';
import {
  User,
  Settings,
  Sliders,
  Sparkles,
  Zap,
  Code2,
  Database,
  Check,
  ChevronDown,
  Keyboard,
  ShieldCheck,
  ExternalLink,
  Sun,
  Moon,
  Laptop
} from 'lucide-react';
import { useApi } from '../../context/ApiContext';
import { useTheme } from '../../context/ThemeContext';
import { Toggle } from '../ui/Toggle';

interface ProfileMenuProps {
  onOpenFullSettings: (tab?: 'profile' | 'settings' | 'shortcuts') => void;
}

export const ProfileMenu: React.FC<ProfileMenuProps> = ({ onOpenFullSettings }) => {
  const { profile, settings, updateSetting, history } = useApi();
  const { themeMode, setThemeMode } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const initials = (profile.name || 'Developer')
    .split(' ')
    .map(n => n[0])
    .filter(Boolean)
    .slice(0, 2)
    .join('')
    .toUpperCase() || 'DV';

  return (
    <div className="relative" ref={menuRef}>
      {/* Profile / Settings Trigger Button */}
      <button
        onClick={() => setIsOpen(prev => !prev)}
        className="flex items-center space-x-2 p-1 pl-1.5 pr-2 rounded-lg bg-slate-100 dark:bg-[#1f1f1f] hover:bg-slate-200 dark:hover:bg-[#292929] border border-slate-200 dark:border-[#383838] transition-colors focus:outline-none focus:ring-2 focus:ring-slate-400 dark:focus:ring-slate-600 shadow-2xs group"
        aria-label="Developer profile and settings"
        aria-expanded={isOpen}
      >
        <div className="w-6 h-6 rounded-md bg-slate-900 dark:bg-[#292929] border border-slate-700 dark:border-[#383838] flex items-center justify-center text-[10px] font-bold text-white shadow-2xs">
          {initials}
        </div>
        <span className="hidden sm:inline-block text-xs font-semibold text-slate-800 dark:text-slate-200 group-hover:text-slate-950 dark:group-hover:text-white max-w-[100px] truncate">
          {profile.name.split(' ')[0]}
        </span>
        <ChevronDown size={12} className={`text-slate-400 transition-transform duration-150 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Profile & Quick Settings Popover */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-[#1f1f1f] border border-slate-200 dark:border-[#383838] rounded-xl shadow-2xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150 text-xs">
          {/* User Info Header */}
          <div className="p-3.5 border-b border-slate-200 dark:border-[#383838] bg-slate-50/80 dark:bg-[#171717]">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-tr from-slate-900 to-slate-700 dark:from-[#292929] dark:to-[#383838] border border-slate-300 dark:border-[#383838] flex items-center justify-center text-white font-bold text-xs shadow-2xs shrink-0">
                {initials}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center space-x-1.5">
                  <span className="font-bold text-slate-900 dark:text-white truncate text-xs">{profile.name}</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" title="Active Sandbox" />
                </div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400 font-mono truncate">{profile.email}</div>
                <div className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5">{profile.role}</div>
              </div>
            </div>
          </div>

          {/* Quick Interactive Toggles */}
          <div className="p-3.5 space-y-3.5 border-b border-slate-200 dark:border-[#383838]">
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center justify-between">
              <span>Quick Toggles</span>
              <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400">Live</span>
            </div>

            <div className="space-y-3">
              {/* Toggle 1: Auto-send presets */}
              <Toggle
                id="popover-auto-send"
                checked={settings.autoSendPreset}
                onChange={val => updateSetting('autoSendPreset', val)}
                label="Auto-execute Presets"
                description="Immediately fire API calls when preset chips are clicked"
              />

              <div className="border-t border-slate-100 dark:border-[#292929]" />

              {/* Toggle 2: Pretty print JSON */}
              <Toggle
                id="popover-pretty-json"
                checked={settings.prettyPrintJson}
                onChange={val => updateSetting('prettyPrintJson', val)}
                label="Pretty JSON Format"
                description="Display formatted interactive JSON trees by default"
              />

              <div className="border-t border-slate-100 dark:border-[#292929]" />

              {/* Toggle 3: Auto-scroll */}
              <Toggle
                id="popover-auto-scroll"
                checked={settings.autoScrollToResponse}
                onChange={val => updateSetting('autoScrollToResponse', val)}
                label="Auto-scroll to Response"
                description="Focus response viewer on request completion"
              />

              <div className="border-t border-slate-100 dark:border-[#292929]" />

              {/* Toggle 4: Save history */}
              <Toggle
                id="popover-save-history"
                checked={settings.saveHistory}
                onChange={val => updateSetting('saveHistory', val)}
                label="Record Request History"
                description="Save API runs to local browser storage"
              />
            </div>
          </div>

          {/* Theme Switcher within Popup */}
          <div className="p-3 border-b border-slate-200 dark:border-[#383838] bg-slate-50/50 dark:bg-[#171717]/50 flex items-center justify-between">
            <span className="text-[11px] font-medium text-slate-700 dark:text-slate-300">Theme</span>
            <div className="flex items-center space-x-1 bg-slate-200/80 dark:bg-[#292929] p-0.5 rounded-lg border border-slate-300 dark:border-[#383838]">
              <button
                onClick={() => setThemeMode('light')}
                className={`px-2 py-0.5 rounded text-[11px] flex items-center space-x-1 transition-colors ${
                  themeMode === 'light'
                    ? 'bg-white text-slate-900 font-semibold shadow-2xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
              >
                <Sun size={11} className="text-amber-500" />
                <span>Light</span>
              </button>
              <button
                onClick={() => setThemeMode('dark')}
                className={`px-2 py-0.5 rounded text-[11px] flex items-center space-x-1 transition-colors ${
                  themeMode === 'dark'
                    ? 'bg-[#171717] text-white font-semibold shadow-2xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
              >
                <Moon size={11} className="text-slate-300" />
                <span>Dark</span>
              </button>
              <button
                onClick={() => setThemeMode('system')}
                className={`px-2 py-0.5 rounded text-[11px] flex items-center space-x-1 transition-colors ${
                  themeMode === 'system'
                    ? 'bg-white dark:bg-[#171717] text-slate-900 dark:text-white font-semibold shadow-2xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
              >
                <Laptop size={11} />
                <span>Auto</span>
              </button>
            </div>
          </div>

          {/* Action Links */}
          <div className="p-2 space-y-1">
            <button
              onClick={() => {
                setIsOpen(false);
                onOpenFullSettings('profile');
              }}
              className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#292929] hover:text-slate-950 dark:hover:text-white transition-colors text-left"
            >
              <div className="flex items-center space-x-2">
                <User size={13} className="text-slate-500" />
                <span>Edit Profile</span>
              </div>
            </button>

            <button
              onClick={() => {
                setIsOpen(false);
                onOpenFullSettings('settings');
              }}
              className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#292929] hover:text-slate-950 dark:hover:text-white transition-colors text-left"
            >
              <div className="flex items-center space-x-2">
                <Sliders size={13} className="text-slate-500" />
                <span>All Settings & Preferences</span>
              </div>
            </button>

            <button
              onClick={() => {
                setIsOpen(false);
                onOpenFullSettings('shortcuts');
              }}
              className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#292929] hover:text-slate-950 dark:hover:text-white transition-colors text-left"
            >
              <div className="flex items-center space-x-2">
                <Keyboard size={13} className="text-slate-500" />
                <span>Keyboard Shortcuts</span>
              </div>
              <kbd className="text-[9px] font-mono bg-slate-100 dark:bg-[#292929] px-1 py-0.5 rounded text-slate-400 border border-slate-200 dark:border-[#383838]">
                ⌘K
              </kbd>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
