import React, { useState, useRef, useEffect } from 'react';
import { Sun, Moon, Monitor, Check } from 'lucide-react';
import { useTheme, ThemeMode } from '../../context/ThemeContext';

export const ThemeSwitcher: React.FC = () => {
  const { themeMode, resolvedTheme, setThemeMode } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const options: { mode: ThemeMode; label: string; icon: React.ReactNode }[] = [
    {
      mode: 'light',
      label: 'Light',
      icon: <Sun size={14} className="text-amber-500" />
    },
    {
      mode: 'dark',
      label: 'Dark',
      icon: <Moon size={14} className="text-indigo-400" />
    },
    {
      mode: 'system',
      label: 'System',
      icon: <Monitor size={14} className="text-slate-400" />
    }
  ];

  const getActiveIcon = () => {
    if (themeMode === 'system') {
      return <Monitor size={14} className="text-slate-500 dark:text-slate-400" />;
    }
    if (themeMode === 'light') {
      return <Sun size={14} className="text-amber-600 dark:text-amber-400" />;
    }
    return <Moon size={14} className="text-indigo-600 dark:text-indigo-400" />;
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-1.5 px-2.5 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-lg text-xs font-medium border border-slate-200 dark:border-slate-700/80 transition-colors shadow-sm"
        title={`Current Theme: ${themeMode} (${resolvedTheme})`}
        aria-label="Select theme mode"
      >
        {getActiveIcon()}
        <span className="capitalize hidden sm:inline text-xs font-medium">{themeMode}</span>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-1.5 w-36 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg shadow-xl py-1 z-50 animate-in fade-in zoom-in-95 duration-100">
          <div className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 border-b border-slate-100 dark:border-slate-800 mb-0.5">
            Theme Mode
          </div>
          {options.map(opt => {
            const isSelected = themeMode === opt.mode;
            return (
              <button
                key={opt.mode}
                onClick={() => {
                  setThemeMode(opt.mode);
                  setIsOpen(false);
                }}
                className={`w-full flex items-center justify-between px-2.5 py-1.5 text-xs text-left transition-colors ${
                  isSelected
                    ? 'bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-300 font-semibold'
                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/80'
                }`}
              >
                <div className="flex items-center space-x-2">
                  {opt.icon}
                  <span>{opt.label}</span>
                </div>
                {isSelected && <Check size={13} className="text-indigo-600 dark:text-indigo-400" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};
