import React from 'react';
import { ApiProvider, useApi } from './context/ApiContext';
import { ThemeProvider } from './context/ThemeContext';
import { Header } from './components/layout/Header';
import { Sidebar } from './components/layout/Sidebar';
import { EndpointDocView } from './components/docs/EndpointDocView';
import { DocSectionView } from './components/docs/DocSectionView';
import { PlaygroundPanel } from './components/playground/PlaygroundPanel';

const MainLayout: React.FC = () => {
  const { activeSelection, activeEndpoint, layoutMode } = useApi();

  const isDocSection = activeSelection.type === 'doc';

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 flex flex-col font-sans selection:bg-indigo-500 selection:text-white transition-colors duration-150">
      {/* Top Header */}
      <Header />

      <div className="flex-1 flex overflow-hidden">
        {/* Left Sticky Sidebar */}
        <Sidebar />

        {/* Main Content Area (Offset by sidebar width on lg screens) */}
        <main className="flex-1 lg:pl-72 flex flex-col min-w-0 overflow-y-auto bg-slate-50 dark:bg-slate-900">
          {isDocSection ? (
            /* Documentation Guide View (Full-width centered article) */
            <div className="flex-1 p-4 sm:p-6 lg:p-8">
              <DocSectionView docId={activeSelection.id} />
            </div>
          ) : activeEndpoint ? (
            /* Endpoint View: Split or Single View */
            <div className="flex-1 flex flex-col 2xl:flex-row min-w-0 divide-y 2xl:divide-y-0 2xl:divide-x divide-slate-200 dark:divide-slate-800">
              {/* Center / Left Pane: API Documentation */}
              {(layoutMode === 'split' || layoutMode === 'docs') && (
                <div
                  className={`flex-1 overflow-y-auto bg-white dark:bg-slate-900 ${
                    layoutMode === 'split' ? '2xl:max-w-[50%]' : 'w-full'
                  }`}
                >
                  <EndpointDocView endpoint={activeEndpoint} />
                </div>
              )}

              {/* Right Pane: API Playground */}
              {(layoutMode === 'split' || layoutMode === 'playground') && (
                <div
                  className={`flex-1 overflow-y-auto bg-slate-50 dark:bg-slate-950/40 ${
                    layoutMode === 'split' ? '2xl:max-w-[50%]' : 'w-full'
                  }`}
                >
                  <PlaygroundPanel endpoint={activeEndpoint} />
                </div>
              )}
            </div>
          ) : null}
        </main>
      </div>
    </div>
  );
};

export default function App() {
  return (
    <ThemeProvider>
      <ApiProvider>
        <MainLayout />
      </ApiProvider>
    </ThemeProvider>
  );
}

