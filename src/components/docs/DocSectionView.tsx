import React, { useState } from 'react';
import { BookOpen, ShieldAlert, AlertTriangle, Copy, Check, ArrowRight, Play, ExternalLink } from 'lucide-react';
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
        return <ShieldAlert size={24} className="text-amber-400" />;
      case 'AlertTriangle':
        return <AlertTriangle size={24} className="text-rose-400" />;
      default:
        return <BookOpen size={24} className="text-indigo-400" />;
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-6 px-4 sm:px-6 lg:px-8 space-y-8 animate-in fade-in duration-200">
      {/* Header Banner */}
      <div className="border-b border-slate-800 pb-6">
        <div className="flex items-center space-x-3 mb-3">
          <div className="p-2.5 bg-slate-800/80 rounded-xl border border-slate-700/80 shadow-sm">
            {getIcon()}
          </div>
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-400">
              Developer Reference
            </span>
            <h1 className="text-2xl font-bold text-white tracking-tight">{article.title}</h1>
          </div>
        </div>
        <p className="text-sm text-slate-400 leading-relaxed max-w-2xl">{article.shortDescription}</p>
      </div>

      {/* Article Sections */}
      <div className="space-y-8">
        {article.sections.map((sec, secIdx) => (
          <div key={secIdx} className="space-y-4">
            <h2 className="text-lg font-semibold text-slate-100 flex items-center space-x-2">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
              <span>{sec.heading}</span>
            </h2>

            <p className="text-sm text-slate-300 leading-relaxed">{sec.content}</p>

            {sec.subsections && (
              <div className="grid grid-cols-1 gap-4 mt-4">
                {sec.subsections.map((sub, subIdx) => {
                  const copyKey = `code_${secIdx}_${subIdx}`;
                  return (
                    <div
                      key={subIdx}
                      className="p-4 bg-slate-950/60 border border-slate-800/90 rounded-xl space-y-2.5 shadow-sm"
                    >
                      <h3 className="text-sm font-semibold text-slate-200 flex items-center justify-between">
                        <span>{sub.title}</span>
                      </h3>
                      <p className="text-xs text-slate-400 leading-relaxed">{sub.body}</p>

                      {sub.codeBlock && (
                        <div className="relative group mt-3">
                          <div className="flex items-center justify-between px-3 py-1.5 bg-slate-900 border-t border-x border-slate-800 rounded-t-lg text-[11px] text-slate-400 font-mono">
                            <span>{sub.codeBlock.language}</span>
                            <button
                              onClick={() => handleCopy(copyKey, sub.codeBlock!.code)}
                              className="flex items-center space-x-1 hover:text-white transition-colors"
                            >
                              {copiedKey === copyKey ? (
                                <>
                                  <Check size={12} className="text-emerald-400" />
                                  <span className="text-emerald-400">Copied</span>
                                </>
                              ) : (
                                <>
                                  <Copy size={12} />
                                  <span>Copy</span>
                                </>
                              )}
                            </button>
                          </div>
                          <pre className="p-3 bg-slate-950 border border-slate-800 rounded-b-lg overflow-x-auto text-xs font-mono text-slate-200 leading-relaxed">
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

      {/* Quick Links Footer */}
      <div className="p-5 bg-gradient-to-r from-indigo-950/40 to-slate-900 border border-indigo-500/20 rounded-xl flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-1">
          <h4 className="text-sm font-semibold text-white">Ready to test endpoints?</h4>
          <p className="text-xs text-slate-400">
            Open the interactive playground to test fake collections, weather models, and country lookups.
          </p>
        </div>
        <button
          onClick={() => setActiveSelection({ type: 'endpoint', id: 'fake-collection' })}
          className="inline-flex items-center space-x-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold transition-colors shadow-md shadow-indigo-600/20 shrink-0"
        >
          <span>Try Fake API</span>
          <ArrowRight size={14} />
        </button>
      </div>
    </div>
  );
};
