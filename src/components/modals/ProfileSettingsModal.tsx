import React, { useState, useEffect } from 'react';
import {
  X,
  User,
  Settings,
  Sliders,
  Code2,
  Database,
  Check,
  RotateCcw,
  Trash2,
  Keyboard,
  ShieldCheck,
  Zap,
  Terminal,
  Sun,
  Moon,
  Laptop
} from 'lucide-react';
import { useApi } from '../../context/ApiContext';
import { useTheme } from '../../context/ThemeContext';
import { Toggle } from '../ui/Toggle';

interface ProfileSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: 'profile' | 'settings';
}

export const ProfileSettingsModal: React.FC<ProfileSettingsModalProps> = ({
  isOpen,
  onClose,
  initialTab = 'profile'
}) => {
  const {
    settings,
    updateSetting,
    resetSettings,
    profile,
    updateProfile,
    clearHistory,
    history
  } = useApi();

  const { themeMode, setThemeMode } = useTheme();

  const [activeTab, setActiveTab] = useState<'profile' | 'settings' | 'shortcuts'>(initialTab);
  const [nameInput, setNameInput] = useState(profile.name);
  const [emailInput, setEmailInput] = useState(profile.email);
  const [roleInput, setRoleInput] = useState(profile.role);
  const [isSavedNotice, setIsSavedNotice] = useState(false);
  const [isClearedNotice, setIsClearedNotice] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setActiveTab(initialTab);
      setNameInput(profile.name);
      setEmailInput(profile.email);
      setRoleInput(profile.role);
    }
  }, [isOpen, initialTab, profile]);

  // Handle ESC to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({
      name: nameInput.trim() || 'Developer',
      email: emailInput.trim() || 'developer@sandbox.local',
      role: roleInput.trim() || 'API Engineer'
    });
    setIsSavedNotice(true);
    setTimeout(() => setIsSavedNotice(false), 2000);
  };

  const handleClearHistory = () => {
    clearHistory();
    setIsClearedNotice(true);
    setTimeout(() => setIsClearedNotice(false), 2000);
  };

  // Get user initials for avatar
  const initials = (profile.name || 'Developer')
    .split(' ')
    .map(n => n[0])
    .filter(Boolean)
    .slice(0, 2)
    .join('')
    .toUpperCase() || 'DV';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-150">
      <div
        className="relative w-full max-w-xl bg-white dark:bg-[#1f1f1f] rounded-xl border border-slate-200 dark:border-[#383838] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        onClick={e => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="px-5 py-4 border-b border-slate-200 dark:border-[#383838] flex items-center justify-between bg-slate-50/70 dark:bg-[#171717]">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-lg bg-slate-900 dark:bg-[#292929] border border-slate-800 dark:border-[#383838] flex items-center justify-center text-slate-100 font-bold text-xs shadow-xs">
              <Settings size={16} className="text-slate-200" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900 dark:text-white">Developer Preferences</h2>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">Configure profile, interactive toggles, and playground behaviors</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-lg hover:bg-slate-200/60 dark:hover:bg-[#292929] transition-colors"
            aria-label="Close dialog"
          >
            <X size={16} />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="px-5 border-b border-slate-200 dark:border-[#383838] bg-white dark:bg-[#1f1f1f] flex space-x-2">
          <button
            onClick={() => setActiveTab('profile')}
            className={`flex items-center space-x-2 py-3 px-3 border-b-2 text-xs font-semibold transition-colors ${
              activeTab === 'profile'
                ? 'border-slate-900 dark:border-slate-100 text-slate-900 dark:text-white'
                : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <User size={14} />
            <span>Profile</span>
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className={`flex items-center space-x-2 py-3 px-3 border-b-2 text-xs font-semibold transition-colors ${
              activeTab === 'settings'
                ? 'border-slate-900 dark:border-slate-100 text-slate-900 dark:text-white'
                : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <Sliders size={14} />
            <span>Playground Toggles</span>
          </button>

          <button
            onClick={() => setActiveTab('shortcuts')}
            className={`flex items-center space-x-2 py-3 px-3 border-b-2 text-xs font-semibold transition-colors ${
              activeTab === 'shortcuts'
                ? 'border-slate-900 dark:border-slate-100 text-slate-900 dark:text-white'
                : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <Keyboard size={14} />
            <span>Shortcuts</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 overflow-y-auto space-y-6 flex-1 text-xs">
          {/* TAB 1: PROFILE */}
          {activeTab === 'profile' && (
            <div className="space-y-5">
              {/* Profile Card Summary */}
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#171717] border border-slate-200 dark:border-[#383838] flex items-center space-x-4">
                <div className="w-13 h-13 rounded-full bg-gradient-to-tr from-slate-800 to-slate-600 dark:from-[#292929] dark:to-[#383838] border border-slate-300 dark:border-[#383838] flex items-center justify-center text-white font-bold text-sm shadow-xs shrink-0">
                  {initials}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-sm text-slate-900 dark:text-white truncate">{profile.name}</span>
                    <span className="px-1.5 py-0.5 text-[10px] font-medium bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/40 rounded flex items-center space-x-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 dark:bg-emerald-400" />
                      <span>Sandbox Active</span>
                    </span>
                  </div>
                  <div className="text-slate-500 dark:text-slate-400 text-xs font-mono truncate">{profile.email}</div>
                  <div className="text-[11px] text-slate-400 dark:text-slate-500 mt-0.5">{profile.role}</div>
                </div>
              </div>

              {/* Edit Profile Form */}
              <form onSubmit={handleSaveProfile} className="space-y-3.5">
                <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Edit Profile Information
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Display Name
                  </label>
                  <input
                    type="text"
                    value={nameInput}
                    onChange={e => setNameInput(e.target.value)}
                    placeholder="e.g. Developer Name"
                    className="w-full px-3 py-2 bg-slate-100 dark:bg-[#171717] border border-slate-200 dark:border-[#383838] rounded-lg text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-slate-400 dark:focus:border-slate-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Email / Developer Identifier
                  </label>
                  <input
                    type="email"
                    value={emailInput}
                    onChange={e => setEmailInput(e.target.value)}
                    placeholder="e.g. developer@company.com"
                    className="w-full px-3 py-2 bg-slate-100 dark:bg-[#171717] border border-slate-200 dark:border-[#383838] rounded-lg text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-slate-400 dark:focus:border-slate-500 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Role / Specialization
                  </label>
                  <input
                    type="text"
                    value={roleInput}
                    onChange={e => setRoleInput(e.target.value)}
                    placeholder="e.g. API Engineer, Full-Stack Developer"
                    className="w-full px-3 py-2 bg-slate-100 dark:bg-[#171717] border border-slate-200 dark:border-[#383838] rounded-lg text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-slate-400 dark:focus:border-slate-500"
                  />
                </div>

                <div className="pt-2 flex items-center justify-between">
                  <span className="text-[11px] text-slate-500">Profiles are saved locally to this workspace session.</span>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 rounded-lg text-xs font-semibold hover:bg-slate-800 dark:hover:bg-white transition-colors flex items-center space-x-1.5 shadow-sm"
                  >
                    {isSavedNotice ? (
                      <>
                        <Check size={14} className="text-emerald-500 dark:text-emerald-600" />
                        <span>Saved!</span>
                      </>
                    ) : (
                      <span>Save Profile</span>
                    )}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* TAB 2: SETTINGS & TOGGLES */}
          {activeTab === 'settings' && (
            <div className="space-y-6">
              {/* SECTION: Request Execution Toggles */}
              <div className="space-y-3">
                <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center space-x-1.5">
                  <Zap size={13} className="text-slate-400" />
                  <span>Request Execution Behavior</span>
                </div>

                <div className="p-3.5 bg-slate-50 dark:bg-[#171717] border border-slate-200 dark:border-[#383838] rounded-xl space-y-4">
                  <Toggle
                    id="toggle-auto-send"
                    checked={settings.autoSendPreset}
                    onChange={val => updateSetting('autoSendPreset', val)}
                    label="Auto-execute on Preset Select"
                    description="Automatically fire the API call as soon as a contextual preset chip (e.g. Limit & Sort) is clicked."
                  />

                  <div className="border-t border-slate-200/80 dark:border-[#383838]" />

                  <Toggle
                    id="toggle-auto-scroll"
                    checked={settings.autoScrollToResponse}
                    onChange={val => updateSetting('autoScrollToResponse', val)}
                    label="Auto-scroll to Response Inspector"
                    description="Smoothly focus and scroll down to the response area upon successful or failed execution."
                  />

                  <div className="border-t border-slate-200/80 dark:border-[#383838]" />

                  <Toggle
                    id="toggle-timing"
                    checked={settings.showTimingBreakdown}
                    onChange={val => updateSetting('showTimingBreakdown', val)}
                    label="Show Detailed Timing Metrics"
                    description="Display round-trip latency, timestamp markers, and payload size metrics in the status toolbar."
                  />
                </div>
              </div>

              {/* SECTION: Response & Code View Toggles */}
              <div className="space-y-3">
                <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center space-x-1.5">
                  <Code2 size={13} className="text-slate-400" />
                  <span>Code & Payload Formatting</span>
                </div>

                <div className="p-3.5 bg-slate-50 dark:bg-[#171717] border border-slate-200 dark:border-[#383838] rounded-xl space-y-4">
                  <Toggle
                    id="toggle-pretty-json"
                    checked={settings.prettyPrintJson}
                    onChange={val => updateSetting('prettyPrintJson', val)}
                    label="Pretty Print JSON Trees"
                    description="Render collapsible interactive JSON tree nodes with syntax coloring and key counts by default."
                  />

                  <div className="border-t border-slate-200/80 dark:border-[#383838]" />

                  <Toggle
                    id="toggle-wrap-lines"
                    checked={settings.wrapLines}
                    onChange={val => updateSetting('wrapLines', val)}
                    label="Wrap Long Lines in Code Blocks"
                    description="Wrap long query strings, URLs, and code snippets instead of forcing horizontal scrolling."
                  />

                  <div className="border-t border-slate-200/80 dark:border-[#383838]" />

                  {/* Default Code Snippet Language */}
                  <div>
                    <div className="text-xs font-semibold text-slate-900 dark:text-slate-100 mb-1.5">
                      Default Code Snippet Language
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {[
                        { id: 'curl', label: 'cURL' },
                        { id: 'fetch', label: 'JavaScript' },
                        { id: 'axios', label: 'Node.js' },
                        { id: 'python', label: 'Python' }
                      ].map(lang => (
                        <button
                          key={lang.id}
                          type="button"
                          onClick={() => updateSetting('defaultSnippetLang', lang.id as any)}
                          className={`px-2.5 py-1.5 rounded-lg text-xs font-mono transition-colors border text-center ${
                            settings.defaultSnippetLang === lang.id
                              ? 'bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 border-slate-900 dark:border-slate-100 font-semibold shadow-2xs'
                              : 'bg-white dark:bg-[#292929] text-slate-600 dark:text-slate-400 border-slate-200 dark:border-[#383838] hover:bg-slate-100 dark:hover:bg-[#383838]'
                          }`}
                        >
                          {lang.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* SECTION: Theme & Storage Toggles */}
              <div className="space-y-3">
                <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center space-x-1.5">
                  <Database size={13} className="text-slate-400" />
                  <span>Theme & Data Retention</span>
                </div>

                <div className="p-3.5 bg-slate-50 dark:bg-[#171717] border border-slate-200 dark:border-[#383838] rounded-xl space-y-4">
                  {/* Theme Switcher in Settings */}
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-xs font-semibold text-slate-900 dark:text-slate-100">Interface Theme</div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400">Select your preferred color scheme</div>
                    </div>
                    <div className="flex items-center space-x-1 bg-slate-200/80 dark:bg-[#292929] p-0.5 rounded-lg border border-slate-300 dark:border-[#383838]">
                      <button
                        onClick={() => setThemeMode('light')}
                        className={`px-2 py-1 rounded text-xs flex items-center space-x-1 transition-colors ${
                          themeMode === 'light'
                            ? 'bg-white text-slate-900 font-semibold shadow-2xs'
                            : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                        }`}
                        title="Light Theme"
                      >
                        <Sun size={12} className="text-amber-500" />
                        <span className="text-[11px]">Light</span>
                      </button>
                      <button
                        onClick={() => setThemeMode('dark')}
                        className={`px-2 py-1 rounded text-xs flex items-center space-x-1 transition-colors ${
                          themeMode === 'dark'
                            ? 'bg-[#171717] text-white font-semibold shadow-2xs'
                            : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                        }`}
                        title="Dark Theme"
                      >
                        <Moon size={12} className="text-slate-300" />
                        <span className="text-[11px]">Dark</span>
                      </button>
                      <button
                        onClick={() => setThemeMode('system')}
                        className={`px-2 py-1 rounded text-xs flex items-center space-x-1 transition-colors ${
                          themeMode === 'system'
                            ? 'bg-white dark:bg-[#171717] text-slate-900 dark:text-white font-semibold shadow-2xs'
                            : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                        }`}
                        title="System Theme"
                      >
                        <Laptop size={12} />
                        <span className="text-[11px]">Auto</span>
                      </button>
                    </div>
                  </div>

                  <div className="border-t border-slate-200/80 dark:border-[#383838]" />

                  <Toggle
                    id="toggle-save-history"
                    checked={settings.saveHistory}
                    onChange={val => updateSetting('saveHistory', val)}
                    label="Save Request History"
                    description="Automatically record executed requests and responses into local browser storage."
                  />

                  <div className="border-t border-slate-200/80 dark:border-[#383838]" />

                  <div className="flex items-center justify-between pt-1">
                    <div>
                      <div className="text-xs font-semibold text-slate-900 dark:text-slate-100">History Log Size</div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400">{history.length} request(s) stored</div>
                    </div>
                    <button
                      type="button"
                      onClick={handleClearHistory}
                      disabled={history.length === 0}
                      className="px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-[#383838] bg-white dark:bg-[#292929] hover:bg-rose-50 dark:hover:bg-rose-950/30 hover:border-rose-300 dark:hover:border-rose-800 text-slate-700 dark:text-slate-300 hover:text-rose-600 dark:hover:text-rose-400 text-xs font-medium transition-colors flex items-center space-x-1.5 disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      {isClearedNotice ? (
                        <>
                          <Check size={12} className="text-emerald-500" />
                          <span>Cleared</span>
                        </>
                      ) : (
                        <>
                          <Trash2 size={12} />
                          <span>Clear History</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>

              {/* Reset to defaults button */}
              <div className="pt-2 flex justify-end">
                <button
                  type="button"
                  onClick={resetSettings}
                  className="px-3 py-1.5 rounded-lg text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-[#292929] text-xs transition-colors flex items-center space-x-1.5"
                >
                  <RotateCcw size={12} />
                  <span>Reset All Settings to Defaults</span>
                </button>
              </div>
            </div>
          )}

          {/* TAB 3: KEYBOARD SHORTCUTS */}
          {activeTab === 'shortcuts' && (
            <div className="space-y-4">
              <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center space-x-1.5">
                <Keyboard size={13} className="text-slate-400" />
                <span>Global Developer Shortcuts</span>
              </div>

              <div className="divide-y divide-slate-200 dark:divide-[#383838] border border-slate-200 dark:border-[#383838] rounded-xl overflow-hidden bg-slate-50 dark:bg-[#171717]">
                <div className="p-3 flex items-center justify-between">
                  <div className="text-xs font-medium text-slate-800 dark:text-slate-200">Send API Request</div>
                  <div className="flex items-center space-x-1 font-mono text-[11px]">
                    <kbd className="px-2 py-0.5 bg-white dark:bg-[#292929] border border-slate-300 dark:border-[#383838] rounded shadow-2xs text-slate-700 dark:text-slate-300">⌘ + Enter</kbd>
                    <span className="text-slate-400 text-xs">or</span>
                    <kbd className="px-2 py-0.5 bg-white dark:bg-[#292929] border border-slate-300 dark:border-[#383838] rounded shadow-2xs text-slate-700 dark:text-slate-300">Ctrl + Enter</kbd>
                  </div>
                </div>

                <div className="p-3 flex items-center justify-between">
                  <div className="text-xs font-medium text-slate-800 dark:text-slate-200">Open Command Palette</div>
                  <div className="flex items-center space-x-1 font-mono text-[11px]">
                    <kbd className="px-2 py-0.5 bg-white dark:bg-[#292929] border border-slate-300 dark:border-[#383838] rounded shadow-2xs text-slate-700 dark:text-slate-300">⌘ + K</kbd>
                    <span className="text-slate-400 text-xs">or</span>
                    <kbd className="px-2 py-0.5 bg-white dark:bg-[#292929] border border-slate-300 dark:border-[#383838] rounded shadow-2xs text-slate-700 dark:text-slate-300">Ctrl + K</kbd>
                  </div>
                </div>

                <div className="p-3 flex items-center justify-between">
                  <div className="text-xs font-medium text-slate-800 dark:text-slate-200">Close Modals & Drawers</div>
                  <div className="font-mono text-[11px]">
                    <kbd className="px-2 py-0.5 bg-white dark:bg-[#292929] border border-slate-300 dark:border-[#383838] rounded shadow-2xs text-slate-700 dark:text-slate-300">Esc</kbd>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-5 py-3 border-t border-slate-200 dark:border-[#383838] bg-slate-50/70 dark:bg-[#171717] flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
          <div className="flex items-center space-x-1.5">
            <ShieldCheck size={13} className="text-emerald-600 dark:text-emerald-400" />
            <span>Local sandbox settings</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-200 hover:bg-slate-300 dark:bg-[#292929] dark:hover:bg-[#383838] text-slate-800 dark:text-slate-200 rounded-lg text-xs font-semibold transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
