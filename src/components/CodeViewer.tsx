import React, { useState } from 'react';
import { Copy, Check, Download, FileCode2, Terminal, Info } from 'lucide-react';
import { PYTHON_SCRIPTS, CodeSnippet } from '../data/pythonCode';

export const CodeViewer: React.FC = () => {
  const [selectedSnippetId, setSelectedSnippetId] = useState<string>(PYTHON_SCRIPTS[0].id);
  const [copied, setCopied] = useState<boolean>(false);

  const activeSnippet =
    PYTHON_SCRIPTS.find((s) => s.id === selectedSnippetId) || PYTHON_SCRIPTS[0];

  const handleCopy = () => {
    navigator.clipboard.writeText(activeSnippet.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([activeSnippet.code], { type: 'text/x-python;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = activeSnippet.filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const lines = activeSnippet.code.split('\n');

  return (
    <div className="space-y-6">
      {/* Seletor de Arquivos / Abas de Código */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-2">
            {PYTHON_SCRIPTS.map((snippet) => (
              <button
                key={snippet.id}
                onClick={() => setSelectedSnippetId(snippet.id)}
                className={`px-3.5 py-2 text-xs font-semibold rounded-xl transition-all flex items-center gap-2 ${
                  selectedSnippetId === snippet.id
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                <FileCode2 className="w-3.5 h-3.5" />
                <span>{snippet.filename}</span>
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handleCopy}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-500" />
                  <span className="text-emerald-500 font-semibold">Copiado!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copiar Código</span>
                </>
              )}
            </button>

            <button
              onClick={handleDownload}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white bg-slate-900 dark:bg-emerald-600 hover:bg-slate-800 dark:hover:bg-emerald-500 rounded-lg transition-colors shadow-sm"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Baixar {activeSnippet.filename}</span>
            </button>
          </div>
        </div>

        <p className="mt-3 text-xs text-slate-500 dark:text-slate-400">
          {activeSnippet.description}
        </p>
      </div>

      {/* Visualizador de Código com Numeração de Linhas */}
      <div className="bg-slate-950 rounded-2xl border border-slate-800 shadow-xl overflow-hidden font-mono text-xs sm:text-sm">
        {/* Barra Superior do Arquivo */}
        <div className="px-4 py-2.5 bg-slate-900 border-b border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <span className="flex items-center gap-2 font-mono">
            <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
            <span className="text-slate-200 font-semibold">{activeSnippet.filename}</span>
            <span className="text-slate-500">· {lines.length} linhas · Python 3</span>
          </span>
          <span className="hidden sm:inline text-slate-500 text-[11px]">UTF-8 · LF</span>
        </div>

        {/* Bloco de Código */}
        <div className="p-4 sm:p-6 overflow-x-auto max-h-[600px] overflow-y-auto">
          <table className="w-full border-collapse">
            <tbody>
              {lines.map((line, idx) => (
                <tr key={idx} className="hover:bg-slate-900/40">
                  <td className="w-10 pr-4 text-right text-slate-600 select-none tabular-nums text-xs font-mono">
                    {idx + 1}
                  </td>
                  <td className="text-slate-200 font-mono whitespace-pre leading-relaxed">
                    {renderSyntaxHighlight(line)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Dica de Execução Local */}
      <div className="bg-emerald-50/70 dark:bg-emerald-950/20 border border-emerald-200/80 dark:border-emerald-800/50 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-start gap-2.5 text-slate-700 dark:text-slate-300">
          <Terminal className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
          <div>
            <span className="font-semibold text-slate-900 dark:text-white">
              Como rodar no seu computador (Linux, Mac ou Windows):
            </span>
            <p className="text-slate-600 dark:text-slate-400 mt-0.5">
              Baixe o arquivo, abra seu terminal na pasta do arquivo e execute o comando abaixo:
            </p>
          </div>
        </div>
        <code className="px-3 py-1.5 bg-slate-900 text-emerald-400 rounded-lg font-mono font-semibold self-start sm:self-auto shrink-0 shadow-sm">
          python {activeSnippet.filename}
        </code>
      </div>
    </div>
  );
};

// Sintaxe visual simplificada para realce do código Python
function renderSyntaxHighlight(line: string): React.ReactNode {
  // Comentários ou Docstrings
  if (line.trim().startsWith('#')) {
    return <span className="text-slate-500 italic">{line}</span>;
  }
  if (line.includes('"""')) {
    return <span className="text-emerald-400">{line}</span>;
  }

  // Definições de função
  if (line.trim().startsWith('def ')) {
    const parts = line.split(/(def|\(|\)|:)/);
    return (
      <span>
        {parts.map((p, i) => {
          if (p === 'def') return <span key={i} className="text-purple-400 font-bold">{p}</span>;
          if (p === '(' || p === ')' || p === ':') return <span key={i} className="text-slate-400">{p}</span>;
          return <span key={i} className="text-blue-300 font-semibold">{p}</span>;
        })}
      </span>
    );
  }

  // Palavras-chave Python
  const keywords = ['import', 'from', 'class', 'return', 'raise', 'try', 'except', 'while', 'if', 'elif', 'else', 'in', 'break', 'continue', 'as'];
  const regex = new RegExp(`\\b(${keywords.join('|')})\\b`, 'g');

  const parts = line.split(regex);
  return (
    <span>
      {parts.map((part, i) => {
        if (keywords.includes(part)) {
          return <span key={i} className="text-purple-400 font-semibold">{part}</span>;
        }
        if (part.includes('"') || part.includes("'")) {
          return <span key={i} className="text-amber-300">{part}</span>;
        }
        return <span key={i}>{part}</span>;
      })}
    </span>
  );
}
