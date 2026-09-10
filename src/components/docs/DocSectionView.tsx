import React, { useState } from 'react';
import { BookOpen, ShieldAlert, AlertTriangle, UtensilsCrossed, Copy, Check, ArrowRight, Play, ExternalLink } from 'lucide-react';
import { DOC_ARTICLES } from '../../data/docSections';
import { useApi } from '../../context/ApiContext';

interface DocSectionViewProps {
  docId: string;
}

export const DocSectionView: React.FC<DocSectionViewProps> = ({ docId }) => {
  const { setActiveSelection } = useApi();
  const article = DOC_ARTICLES[docId] || DOC_ARTICLES.overview;
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const handleCopy = (key: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const getIcon = () => {
    switch (article.icon) {
      case 'ShieldAlert':
        return <ShieldAlert size={24} className="text-amber-500" />;
      case 'AlertTriangle':
        return <AlertTriangle size={24} className="text-rose-500" />;
      case 'UtensilsCrossed':
        return <UtensilsCrossed size={24} className="text-emerald-500" />;
      default:
        return <BookOpen size={24} className="text-slate-700 dark:text-slate-300" />;
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-6 px-4 sm:px-6 lg:px-8 space-y-8 animate-in fade-in duration-200">
      {/* Header Banner */}
      <div className="border-b border-slate-200 dark:border-slate-800 pb-6">
        <div className="flex items-center space-x-3 mb-3">
          <div className="p-2.5 bg-slate-100 dark:bg-slate-800/80 rounded-xl border border-slate-200 dark:border-slate-700/80 shadow-sm">
            {getIcon()}
          </div>
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Developer Reference
            </span>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">{article.title}</h1>
          </div>
        </div>
        <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed max-w-2xl">{article.shortDescription}</p>
      </div>

      {/* Article Sections */}
      <div className="space-y-8">
        {article.sections.map((sec, secIdx) => (
          <div key={secIdx} className="space-y-4">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100 flex items-center space-x-2">
              <span className="w-1.5 h-1.5 rounded-full bg-slate-600 dark:bg-slate-400" />
              <span>{sec.heading}</span>
            </h2>

            <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">{sec.content}</p>

            {sec.subsections && (
              <div className="grid grid-cols-1 gap-4 mt-4">
                {sec.subsections.map((sub, subIdx) => {
                  const copyKey = `code_${secIdx}_${subIdx}`;
                  return (
                    <div
                      key={subIdx}
                      className="p-4 bg-white dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800/90 rounded-xl space-y-2.5 shadow-sm"
                    >
                      <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-200 flex items-center justify-between">
                        <span>{sub.title}</span>
                      </h3>
                      <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">{sub.body}</p>

                      {sub.codeBlock && (
                        <div className="relative group mt-3">
                          <div className="flex items-center justify-between px-3 py-1.5 bg-slate-100 dark:bg-slate-900 border-t border-x border-slate-200 dark:border-slate-800 rounded-t-lg text-[11px] text-slate-600 dark:text-slate-400 font-mono">
                            <span>{sub.codeBlock.language}</span>
                            <button
                              onClick={() => handleCopy(copyKey, sub.codeBlock!.code)}
                              className="flex items-center space-x-1 hover:text-slate-900 dark:hover:text-white transition-colors"
                            >
                              {copiedKey === copyKey ? (
                                <>
                                  <Check size={12} className="text-emerald-500 dark:text-emerald-400" />
                                  <span className="text-emerald-600 dark:text-emerald-400 font-medium">Copied</span>
                                </>
                              ) : (
                                <>
                                  <Copy size={12} />
                                  <span>Copy</span>
                                </>
                              )}
                            </button>
                          </div>
                          <pre className="p-3 bg-slate-900 border border-slate-800 rounded-b-lg overflow-x-auto text-xs font-mono text-slate-200 leading-relaxed">
                            {sub.codeBlock.code}
                          </pre>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Quick Links Footer - Solid Clean Background, No Gradients */}
      <div className="p-5 bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-1">
          <h4 className="text-sm font-semibold text-slate-900 dark:text-white">Ready to test endpoints?</h4>
          <p className="text-xs text-slate-600 dark:text-slate-400">
            {docId === 'open-food-facts'
              ? 'Open the interactive playground to test Open Food Facts barcode lookups and searches.'
              : 'Open the interactive playground to test fake collections, weather models, and country lookups.'}
          </p>
        </div>
        <button
          onClick={() =>
            setActiveSelection({
              type: 'endpoint',
              id: docId === 'open-food-facts' ? 'open-food-facts' : 'fake-collection'
            })
          }
          className="inline-flex items-center space-x-2 px-4 py-2 bg-slate-900 hover:bg-slate-800 dark:bg-slate-100 dark:hover:bg-white text-white dark:text-slate-900 rounded-lg text-xs font-semibold transition-colors shadow-sm shrink-0"
        >
          <span>{docId === 'open-food-facts' ? 'Try Open Food Facts' : 'Try Fake API'}</span>
          <ArrowRight size={14} />
        </button>
      </div>
    </div>
  );
};
