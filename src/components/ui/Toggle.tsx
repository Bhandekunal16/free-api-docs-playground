import React from 'react';

interface ToggleProps {
  id?: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  label?: string;
  description?: string;
}

export const Toggle: React.FC<ToggleProps> = ({
  id,
  checked,
  onChange,
  disabled = false,
  label,
  description
}) => {
  return (
    <label
      htmlFor={id}
      className={`flex items-start justify-between gap-3 cursor-pointer select-none group ${
        disabled ? 'opacity-50 cursor-not-allowed' : ''
      }`}
    >
      {(label || description) && (
        <div className="flex-1 min-w-0 pr-2">
          {label && (
            <div className="text-xs font-semibold text-slate-900 dark:text-slate-100 group-hover:text-slate-950 dark:group-hover:text-white transition-colors">
              {label}
            </div>
          )}
          {description && (
            <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">
              {description}
            </div>
          )}
        </div>
      )}

      <button
        id={id}
        type="button"
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        onClick={() => onChange(!checked)}
        className={`relative inline-flex h-5 w-9 shrink-0 items-center rounded-full transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 dark:focus-visible:ring-slate-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-slate-900 ${
          checked
            ? 'bg-slate-900 dark:bg-emerald-500'
            : 'bg-slate-300 dark:bg-slate-700'
        }`}
      >
        <span
          className={`pointer-events-none inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow-xs transition duration-200 ease-in-out ${
            checked ? 'translate-x-4.5' : 'translate-x-0.5'
          }`}
        />
      </button>
    </label>
  );
};
