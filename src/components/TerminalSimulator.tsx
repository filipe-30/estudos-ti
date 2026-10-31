import React, { useState, useRef, useEffect } from 'react';
import {
  Terminal,
  Play,
  RotateCcw,
  Send,
  HelpCircle,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';
import { somar, subtrair, multiplicar, dividir, formatPythonNumber, evaluatePythonExpression } from '../utils/calculatorLogic';

interface TerminalLine {
  id: string;
  type: 'system' | 'prompt' | 'input' | 'output' | 'error' | 'menu';
  content: string;
}

export const TerminalSimulator: React.FC = () => {
  const [mode, setMode] = useState<'script' | 'repl'>('script');

  // Script Mode state machine
  // step: 'menu' | 'num1' | 'num2' | 'finished'
  const [scriptStep, setScriptStep] = useState<'menu' | 'num1' | 'num2' | 'finished'>('menu');
  const [selectedOp, setSelectedOp] = useState<string | null>(null);
  const [firstNum, setFirstNum] = useState<number | null>(null);

  const [inputVal, setInputVal] = useState<string>('');
  const [lines, setLines] = useState<TerminalLine[]>(() => [
    {
      id: 'init-1',
      type: 'system',
      content: 'Python 3.12.0 (main, Oct 2026) [GCC 11.2.0] on linux',
    },
    {
      id: 'init-2',
      type: 'system',
      content: 'Digite os comandos ou use os botões rápidos abaixo.',
    },
    {
      id: 'init-3',
      type: 'menu',
      content:
`================================
      CALCULADORA EM PYTHON
================================
1. Soma (+)
2. Subtração (-)
3. Multiplicação (*)
4. Divisão (/)
0. Sair
================================`,
    },
    {
      id: 'init-4',
      type: 'prompt',
      content: 'Escolha uma operação (0-4):',
    },
  ]);

  const terminalEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [lines]);

  const restartScript = () => {
    setScriptStep('menu');
    setSelectedOp(null);
    setFirstNum(null);
    setInputVal('');
    setLines([
      {
        id: Date.now().toString() + '-sys',
        type: 'system',
        content: '$ python calculadora.py',
      },
      {
        id: Date.now().toString() + '-menu',
        type: 'menu',
        content:
`================================
      CALCULADORA EM PYTHON
================================
1. Soma (+)
2. Subtração (-)
3. Multiplicação (*)
4. Divisão (/)
0. Sair
================================`,
      },
      {
        id: Date.now().toString() + '-prompt',
        type: 'prompt',
        content: 'Escolha uma operação (0-4):',
      },
    ]);
  };

  const handleScriptSubmit = (val: string) => {
    const trimmed = val.trim();
    if (!trimmed) return;

    // Log the user's input
    const userLine: TerminalLine = {
      id: Date.now().toString() + '-inp',
      type: 'input',
      content: trimmed,
    };

    if (scriptStep === 'menu') {
      if (trimmed === '0') {
        setLines((prev) => [
          ...prev,
          userLine,
          {
            id: Date.now().toString(),
            type: 'output',
            content: 'Encerrando a calculadora. Até mais!',
          },
        ]);
        setScriptStep('finished');
        return;
      }

      if (!['1', '2', '3', '4'].includes(trimmed)) {
        setLines((prev) => [
          ...prev,
          userLine,
          {
            id: Date.now().toString(),
            type: 'error',
            content: 'Opção inválida! Escolha um número entre 0 e 4.',
          },
          {
            id: Date.now().toString() + '-p',
            type: 'prompt',
            content: 'Escolha uma operação (0-4):',
          },
        ]);
        return;
      }

      const opNames: Record<string, string> = {
        '1': 'Soma (+)',
        '2': 'Subtração (-)',
        '3': 'Multiplicação (*)',
        '4': 'Divisão (/)',
      };

      setSelectedOp(trimmed);
      setScriptStep('num1');
      setLines((prev) => [
        ...prev,
        userLine,
        {
          id: Date.now().toString(),
          type: 'system',
          content: `-> Operação selecionada: ${opNames[trimmed]}`,
        },
        {
          id: Date.now().toString() + '-p1',
          type: 'prompt',
          content: 'Digite o primeiro número: ',
        },
      ]);
    } else if (scriptStep === 'num1') {
      const n1 = parseFloat(trimmed);
      if (isNaN(n1)) {
        setLines((prev) => [
          ...prev,
          userLine,
          {
            id: Date.now().toString(),
            type: 'error',
            content: 'Entrada inválida! Digite um número real válido.',
          },
          {
            id: Date.now().toString() + '-p1-retry',
            type: 'prompt',
            content: 'Digite o primeiro número: ',
          },
        ]);
        return;
      }

      setFirstNum(n1);
      setScriptStep('num2');
      setLines((prev) => [
        ...prev,
        userLine,
        {
          id: Date.now().toString() + '-p2',
          type: 'prompt',
          content: 'Digite o segundo número: ',
        },
      ]);
    } else if (scriptStep === 'num2') {
      const n2 = parseFloat(trimmed);
      if (isNaN(n2)) {
        setLines((prev) => [
          ...prev,
          userLine,
          {
            id: Date.now().toString(),
            type: 'error',
            content: 'Entrada inválida! Digite um número real válido.',
          },
          {
            id: Date.now().toString() + '-p2-retry',
            type: 'prompt',
            content: 'Digite o segundo número: ',
          },
        ]);
        return;
      }

      const n1 = firstNum!;
      const currentOp = selectedOp!;

      try {
        let res = 0;
        let symbol = '+';
        let funcName = 'somar';

        if (currentOp === '1') {
          res = somar(n1, n2);
          symbol = '+';
          funcName = 'somar';
        } else if (currentOp === '2') {
          res = subtrair(n1, n2);
          symbol = '-';
          funcName = 'subtrair';
        } else if (currentOp === '3') {
          res = multiplicar(n1, n2);
          symbol = '*';
          funcName = 'multiplicar';
        } else if (currentOp === '4') {
          res = dividir(n1, n2);
          symbol = '/';
          funcName = 'dividir';
        }

        const formatted = formatPythonNumber(res);
        setLines((prev) => [
          ...prev,
          userLine,
          {
            id: Date.now().toString() + '-sep',
            type: 'system',
            content: '--------------------------------',
          },
          {
            id: Date.now().toString() + '-res',
            type: 'output',
            content: `>>> Resultado: ${n1} ${symbol} ${n2} = ${formatted}`,
          },
          {
            id: Date.now().toString() + '-fn',
            type: 'system',
            content: `[Python call]: ${funcName}(${n1}, ${n2}) -> ${formatted}`,
          },
          {
            id: Date.now().toString() + '-sep2',
            type: 'system',
            content: '--------------------------------',
          },
          {
            id: Date.now().toString() + '-menu-again',
            type: 'menu',
            content:
`================================
      CALCULADORA EM PYTHON
================================
1. Soma (+)
2. Subtração (-)
3. Multiplicação (*)
4. Divisão (/)
0. Sair
================================`,
          },
          {
            id: Date.now().toString() + '-p-next',
            type: 'prompt',
            content: 'Escolha uma operação (0-4):',
          },
        ]);

        setScriptStep('menu');
        setSelectedOp(null);
        setFirstNum(null);
      } catch (err: unknown) {
        const errorMsg = err instanceof Error ? err.message : String(err);
        setLines((prev) => [
          ...prev,
          userLine,
          {
            id: Date.now().toString() + '-err',
            type: 'error',
            content: `[ERRO MATEMÁTICO] ${errorMsg}`,
          },
          {
            id: Date.now().toString() + '-menu-again',
            type: 'menu',
            content:
`================================
      CALCULADORA EM PYTHON
================================
1. Soma (+)
2. Subtração (-)
3. Multiplicação (*)
4. Divisão (/)
0. Sair
================================`,
          },
          {
            id: Date.now().toString() + '-p-next',
            type: 'prompt',
            content: 'Escolha uma operação (0-4):',
          },
        ]);
        setScriptStep('menu');
        setSelectedOp(null);
        setFirstNum(null);
      }
    }
  };

  const handleReplSubmit = (val: string) => {
    const trimmed = val.trim();
    if (!trimmed) return;

    const userLine: TerminalLine = {
      id: Date.now().toString() + '-repl-in',
      type: 'input',
      content: `>>> ${trimmed}`,
    };

    // Suporte especial para chamadas de função Python como somar(10, 5)
    const funcMatch = trimmed.match(/^(somar|subtrair|multiplicar|dividir)\s*\(\s*(-?[0-9.]+)\s*,\s*(-?[0-9.]+)\s*\)$/i);
    if (funcMatch) {
      const fn = funcMatch[1].toLowerCase();
      const a = parseFloat(funcMatch[2]);
      const b = parseFloat(funcMatch[3]);

      try {
        let res = 0;
        if (fn === 'somar') res = somar(a, b);
        else if (fn === 'subtrair') res = subtrair(a, b);
        else if (fn === 'multiplicar') res = multiplicar(a, b);
        else if (fn === 'dividir') res = dividir(a, b);

        setLines((prev) => [
          ...prev,
          userLine,
          {
            id: Date.now().toString() + '-repl-out',
            type: 'output',
            content: formatPythonNumber(res),
          },
        ]);
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : String(err);
        setLines((prev) => [
          ...prev,
          userLine,
          {
            id: Date.now().toString() + '-repl-err',
            type: 'error',
            content: msg,
          },
        ]);
      }
      return;
    }

    // Expressão regular
    const evalRes = evaluatePythonExpression(trimmed);
    const resVal = evalRes.result;
    if (evalRes.error) {
      setLines((prev) => [
        ...prev,
        userLine,
        {
          id: Date.now().toString() + '-repl-err',
          type: 'error',
          content: evalRes.error!,
        },
      ]);
    } else if (resVal !== null && resVal !== undefined) {
      setLines((prev) => [
        ...prev,
        userLine,
        {
          id: Date.now().toString() + '-repl-out',
          type: 'output',
          content: formatPythonNumber(resVal),
        },
      ]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputVal.trim()) return;
    const current = inputVal;
    setInputVal('');

    if (mode === 'script') {
      handleScriptSubmit(current);
    } else {
      handleReplSubmit(current);
    }
  };

  const handleQuickOption = (opt: string) => {
    if (mode === 'script' && scriptStep === 'menu') {
      handleScriptSubmit(opt);
    }
  };

  return (
    <div className="space-y-6">
      {/* Controles de Modo e Ações Rápidas */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-lg">
            <button
              onClick={() => {
                setMode('script');
                restartScript();
              }}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
                mode === 'script'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
              }`}
            >
              Modo Script CLI (calculadora.py)
            </button>
            <button
              onClick={() => {
                setMode('repl');
                setLines([
                  {
                    id: Date.now().toString() + '-sys',
                    type: 'system',
                    content: 'Python 3.12 Interactive Console (REPL)',
                  },
                  {
                    id: Date.now().toString() + '-hint',
                    type: 'system',
                    content: 'Dica: Digite expressões como "somar(50, 25)", "10 * 8" ou "dividir(10, 0)"',
                  },
                ]);
              }}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
                mode === 'repl'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
              }`}
            >
              Modo Console REPL (&gt;&gt;&gt;)
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={restartScript}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reiniciar Execução</span>
          </button>
        </div>
      </div>

      {/* Janela do Terminal */}
      <div className="bg-slate-950 rounded-2xl border border-slate-800 shadow-xl overflow-hidden font-mono text-sm">
        {/* Barra de Título do Terminal */}
        <div className="px-4 py-3 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-rose-500/80 inline-block" />
            <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block" />
            <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block" />
            <span className="text-xs text-slate-400 font-mono ml-2">
              bash - python3 calculadora.py
            </span>
          </div>
          <span className="text-[11px] text-slate-500 flex items-center gap-1">
            <Terminal className="w-3.5 h-3.5" />
            <span>Python Terminal v3.12</span>
          </span>
        </div>

        {/* Corpo de Saída do Terminal */}
        <div className="p-4 sm:p-6 min-h-[380px] max-h-[520px] overflow-y-auto space-y-2 text-slate-200 leading-relaxed">
          {lines.map((line) => {
            if (line.type === 'system') {
              return (
                <div key={line.id} className="text-slate-500 text-xs italic">
                  {line.content}
                </div>
              );
            }
            if (line.type === 'menu') {
              return (
                <pre key={line.id} className="text-emerald-400 text-xs sm:text-sm font-mono whitespace-pre-wrap my-2">
                  {line.content}
                </pre>
              );
            }
            if (line.type === 'prompt') {
              return (
                <div key={line.id} className="text-amber-300 font-semibold text-xs sm:text-sm mt-2">
                  {line.content}
                </div>
              );
            }
            if (line.type === 'input') {
              return (
                <div key={line.id} className="text-white font-bold flex items-center gap-2">
                  <span className="text-emerald-400">&gt;</span>
                  <span>{line.content}</span>
                </div>
              );
            }
            if (line.type === 'output') {
              return (
                <div key={line.id} className="text-emerald-300 font-bold bg-emerald-950/30 p-2 rounded border border-emerald-800/40">
                  {line.content}
                </div>
              );
            }
            if (line.type === 'error') {
              return (
                <div key={line.id} className="text-rose-400 bg-rose-950/40 p-2 rounded border border-rose-900/60 flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{line.content}</span>
                </div>
              );
            }
            return null;
          })}
          <div ref={terminalEndRef} />
        </div>

        {/* Botões de Acesso Rápido para Opções do Menu */}
        {mode === 'script' && scriptStep === 'menu' && (
          <div className="px-4 py-2.5 bg-slate-900/60 border-t border-slate-800 flex flex-wrap items-center gap-2 text-xs">
            <span className="text-slate-400">Atalhos do Menu:</span>
            <button
              onClick={() => handleQuickOption('1')}
              className="px-2.5 py-1 bg-emerald-900/40 hover:bg-emerald-800/50 text-emerald-300 rounded border border-emerald-700/40 transition-colors"
            >
              1. Soma (+)
            </button>
            <button
              onClick={() => handleQuickOption('2')}
              className="px-2.5 py-1 bg-emerald-900/40 hover:bg-emerald-800/50 text-emerald-300 rounded border border-emerald-700/40 transition-colors"
            >
              2. Subtração (-)
            </button>
            <button
              onClick={() => handleQuickOption('3')}
              className="px-2.5 py-1 bg-emerald-900/40 hover:bg-emerald-800/50 text-emerald-300 rounded border border-emerald-700/40 transition-colors"
            >
              3. Multiplicação (*)
            </button>
            <button
              onClick={() => handleQuickOption('4')}
              className="px-2.5 py-1 bg-emerald-900/40 hover:bg-emerald-800/50 text-emerald-300 rounded border border-emerald-700/40 transition-colors"
            >
              4. Divisão (/)
            </button>
            <button
              onClick={() => handleQuickOption('0')}
              className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded border border-slate-700 transition-colors"
            >
              0. Sair
            </button>
          </div>
        )}

        {/* Input de Linha de Comando */}
        <form
          onSubmit={handleSubmit}
          className="p-3 bg-slate-900 border-t border-slate-800 flex items-center gap-3"
        >
          <span className="text-emerald-400 font-bold pl-2">
            {mode === 'repl' ? '>>>' : '$'}
          </span>
          <input
            ref={inputRef}
            type="text"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            placeholder={
              mode === 'script'
                ? scriptStep === 'menu'
                  ? 'Digite 1, 2, 3, 4 ou 0...'
                  : 'Digite o número e pressione Enter...'
                : 'Digite expressão Python (ex: somar(10, 5) ou 12 * 4)...'
            }
            className="flex-1 bg-transparent text-white placeholder:text-slate-500 font-mono text-sm focus:outline-none"
            autoFocus
          />
          <button
            type="submit"
            className="px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-xs flex items-center gap-1.5 transition-colors"
          >
            <span>Enviar</span>
            <Send className="w-3.5 h-3.5" />
          </button>
        </form>
      </div>
    </div>
  );
};
