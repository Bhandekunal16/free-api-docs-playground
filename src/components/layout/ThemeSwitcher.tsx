import React from 'react';
import { Sun, Moon, Monitor } from 'lucide-react';
import { useTheme, ThemeMode } from '../../context/ThemeContext';

export const ThemeSwitcher: React.FC = () => {
  const { themeMode, resolvedTheme, setThemeMode } = useTheme();

  const options: { mode: ThemeMode; label: string; icon: React.ReactNode }[] = [
    {
      mode: 'light',
      label: 'Light',
      icon: <Sun size={13} className="text-amber-500" />
    },
    {
      mode: 'dark',
      label: 'Dark',
      icon: <Moon size={13} className="text-indigo-400" />
    },
    {
      mode: 'system',
      label: 'System',
      icon: <Monitor size={13} className="text-slate-400" />
    }
  ];

  return (
    <div className="flex items-center bg-slate-100 dark:bg-slate-950 p-0.5 rounded-lg border border-slate-200 dark:border-slate-800 text-xs shadow-2xs">
      {options.map(opt => {
        const isSelected = themeMode === opt.mode;
        return (
          <button
            key={opt.mode}
            onClick={() => setThemeMode(opt.mode)}
            className={`flex items-center space-x-1 px-2.5 py-1 rounded text-xs font-medium transition-all ${
              isSelected
                ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-2xs font-semibold'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-200/50 dark:hover:bg-slate-900'
            }`}
            title={`Switch to ${opt.label} Theme (Current: ${resolvedTheme})`}
            aria-label={`Switch to ${opt.label} theme`}
          >
            {opt.icon}
            <span className="hidden sm:inline">{opt.label}</span>
          </button>
        );
      })}
    </div>
  );
};

