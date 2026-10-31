import React from 'react';
import { Download, Code2 } from 'lucide-react';
import { PYTHON_SCRIPTS } from '../data/pythonCode';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ activeTab, setActiveTab }) => {
  const handleDownloadMainScript = () => {
    const mainScript = PYTHON_SCRIPTS[0];
    const blob = new Blob([mainScript.code], { type: 'text/x-python;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'calculadora.py';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Brand wordmark single element */}
        <button
          onClick={() => setActiveTab('calculator')}
          className="flex items-center gap-2.5 text-left group shrink-0 focus-visible:outline-none"
        >
          <div className="w-9 h-9 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-bold text-lg shadow-sm group-hover:bg-emerald-700 transition-colors">
            <Code2 className="w-5 h-5" />
          </div>
          <span className="text-lg font-bold tracking-tight text-slate-900 dark:text-slate-100 whitespace-nowrap">
            PyCalc <span className="text-emerald-600 dark:text-emerald-400 font-semibold text-sm">3.12</span>
          </span>
        </button>

        {/* Zone 2: Navigation links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600 dark:text-slate-300">
          <button
            onClick={() => setActiveTab('calculator')}
            className={`transition-colors whitespace-nowrap shrink-0 hover:text-slate-900 dark:hover:text-white ${
              activeTab === 'calculator'
                ? 'text-emerald-600 dark:text-emerald-400 font-semibold'
                : ''
            }`}
          >
            Calculadora Visual
          </button>
          <button
            onClick={() => setActiveTab('terminal')}
            className={`transition-colors whitespace-nowrap shrink-0 hover:text-slate-900 dark:hover:text-white ${
              activeTab === 'terminal'
                ? 'text-emerald-600 dark:text-emerald-400 font-semibold'
                : ''
            }`}
          >
            Terminal Interativo CLI
          </button>
          <button
            onClick={() => setActiveTab('functions')}
            className={`transition-colors whitespace-nowrap shrink-0 hover:text-slate-900 dark:hover:text-white ${
              activeTab === 'functions'
                ? 'text-emerald-600 dark:text-emerald-400 font-semibold'
                : ''
            }`}
          >
            Laboratório de Funções
          </button>
          <button
            onClick={() => setActiveTab('code')}
            className={`transition-colors whitespace-nowrap shrink-0 hover:text-slate-900 dark:hover:text-white ${
              activeTab === 'code'
                ? 'text-emerald-600 dark:text-emerald-400 font-semibold'
                : ''
            }`}
          >
            Código Python (.py)
          </button>
          <button
            onClick={() => setActiveTab('guide')}
            className={`transition-colors whitespace-nowrap shrink-0 hover:text-slate-900 dark:hover:text-white ${
              activeTab === 'guide'
                ? 'text-emerald-600 dark:text-emerald-400 font-semibold'
                : ''
            }`}
          >
            Guia Didático
          </button>
        </nav>

        {/* Zone 3: 1 primary action */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={handleDownloadMainScript}
            className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-slate-900 dark:bg-emerald-600 rounded-lg hover:bg-slate-800 dark:hover:bg-emerald-500 transition-colors shadow-sm whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Baixar calculadora.py</span>
          </button>
        </div>
      </div>
    </header>
  );
};
