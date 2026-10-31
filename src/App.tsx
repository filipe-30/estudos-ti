/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  Calculator as CalcIcon,
  Terminal,
  Code2,
  BookOpen,
  FlaskConical,
  Download,
  CheckCircle2,
  Plus,
  Minus,
  X,
  Divide
} from 'lucide-react';
import { Header } from './components/Header';
import { VisualCalculator } from './components/VisualCalculator';
import { TerminalSimulator } from './components/TerminalSimulator';
import { CodeViewer } from './components/CodeViewer';
import { FunctionTester } from './components/FunctionTester';
import { GuideSection } from './components/GuideSection';
import { PYTHON_SCRIPTS } from './data/pythonCode';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('calculator');

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
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans selection:bg-emerald-500 selection:text-white">
      {/* Barra de Navegação Superior (Top Bar Contract) */}
      <Header activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Conteúdo Principal */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        {/* Seção Hero / Cabeçalho do App */}
        <section className="mb-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-slate-200 dark:border-slate-800">
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold text-emerald-600 dark:text-emerald-400 mb-2">
                <span>Linguagem Python 3</span>
                <span aria-hidden="true">·</span>
                <span>4 Operações Básicas</span>
                <span aria-hidden="true">·</span>
                <span>Tratamento de Exceções</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white" style={{ textWrap: 'balance' }}>
                Calculadora em Python
              </h1>
              <p className="mt-2 text-sm sm:text-base text-slate-600 dark:text-slate-300 max-w-2xl leading-relaxed">
                Calculadora com as operações básicas de soma (+), subtração (-), multiplicação (*) e divisão (/) com tratamento contra divisão por zero, interface gráfica, terminal CLI interativo e código fonte pronto para download.
              </p>
            </div>

            {/* Badges Rápidas das 4 Operações */}
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5 p-1.5 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm text-xs font-mono font-bold text-slate-700 dark:text-slate-300">
                <span className="w-7 h-7 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                  +
                </span>
                <span className="w-7 h-7 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                  −
                </span>
                <span className="w-7 h-7 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                  ×
                </span>
                <span className="w-7 h-7 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                  ÷
                </span>
              </div>
            </div>
          </div>

          {/* Abas de Navegação das Funcionalidades */}
          <div className="flex items-center gap-1.5 mt-6 overflow-x-auto pb-2 scrollbar-none">
            <button
              onClick={() => setActiveTab('calculator')}
              className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-xl whitespace-nowrap transition-all ${
                activeTab === 'calculator'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800'
              }`}
            >
              <CalcIcon className="w-4 h-4" />
              <span>Calculadora Visual</span>
            </button>

            <button
              onClick={() => setActiveTab('terminal')}
              className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-xl whitespace-nowrap transition-all ${
                activeTab === 'terminal'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800'
              }`}
            >
              <Terminal className="w-4 h-4" />
              <span>Terminal Interativo CLI</span>
            </button>

            <button
              onClick={() => setActiveTab('functions')}
              className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-xl whitespace-nowrap transition-all ${
                activeTab === 'functions'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800'
              }`}
            >
              <FlaskConical className="w-4 h-4" />
              <span>Laboratório de Funções</span>
            </button>

            <button
              onClick={() => setActiveTab('code')}
              className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-xl whitespace-nowrap transition-all ${
                activeTab === 'code'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800'
              }`}
            >
              <Code2 className="w-4 h-4" />
              <span>Código Python (.py)</span>
            </button>

            <button
              onClick={() => setActiveTab('guide')}
              className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-xl whitespace-nowrap transition-all ${
                activeTab === 'guide'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span>Guia Didático</span>
            </button>
          </div>
        </section>

        {/* Renderização Condicional da Aba Ativa */}
        <section>
          {activeTab === 'calculator' && <VisualCalculator />}
          {activeTab === 'terminal' && <TerminalSimulator />}
          {activeTab === 'functions' && <FunctionTester />}
          {activeTab === 'code' && <CodeViewer />}
          {activeTab === 'guide' && <GuideSection />}
        </section>
      </main>

      {/* Rodapé Minimalista */}
      <footer className="mt-auto border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 py-6 text-xs text-slate-500 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-800 dark:text-slate-200">
              Calculadora em Python
            </span>
            <span aria-hidden="true">·</span>
            <span>Soma, Subtração, Multiplicação e Divisão</span>
          </div>

          <div className="flex items-center gap-4 text-slate-600 dark:text-slate-400">
            <button
              onClick={() => setActiveTab('code')}
              className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
            >
              Ver Código Fonte
            </button>
            <button
              onClick={handleDownloadMainScript}
              className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors flex items-center gap-1"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Baixar Script</span>
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
