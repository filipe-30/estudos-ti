import React, { useState, useEffect, useCallback } from 'react';
import {
  Trash2,
  RotateCcw,
  Clock,
  AlertCircle,
  Copy,
  Check,
  Equal
} from 'lucide-react';
import {
  evaluatePythonExpression,
  formatPythonNumber,
  CalculationRecord
} from '../utils/calculatorLogic';

export const VisualCalculator: React.FC = () => {
  const [expression, setExpression] = useState<string>('0');
  const [history, setHistory] = useState<CalculationRecord[]>(() => [
    {
      id: 'demo-1',
      expression: '125 + 75',
      result: '200',
      pythonCall: 'somar(125, 75)',
      timestamp: '10:42',
    },
    {
      id: 'demo-2',
      expression: '500 - 180',
      result: '320',
      pythonCall: 'subtrair(500, 180)',
      timestamp: '10:40',
    },
    {
      id: 'demo-3',
      expression: '12 * 8',
      result: '96',
      pythonCall: 'multiplicar(12, 8)',
      timestamp: '10:38',
    },
    {
      id: 'demo-4',
      expression: '150 / 4',
      result: '37.5',
      pythonCall: 'dividir(150, 4)',
      timestamp: '10:35',
    },
  ]);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [lastPythonCode, setLastPythonCode] = useState<string>('somar(125, 75)');
  const [activeOperationNote, setActiveOperationNote] = useState<string>('Pronta para calcular');

  // Evaluates live expression preview
  const evaluation = evaluatePythonExpression(expression);

  const handleDigit = (digit: string) => {
    setExpression((prev) => {
      if (prev === '0' || prev === 'Erro' || prev.startsWith('ZeroDivisionError')) {
        return digit;
      }
      return prev + digit;
    });
  };

  const handleOperator = (op: string, noteName: string) => {
    setActiveOperationNote(noteName);
    setExpression((prev) => {
      if (prev === 'Erro' || prev.startsWith('ZeroDivisionError')) {
        return '0 ' + op + ' ';
      }
      const trimmed = prev.trim();
      const lastChar = trimmed.slice(-1);
      // Se último caractere já for operador, substitui
      if (['+', '-', '*', '/', '%'].includes(lastChar)) {
        return trimmed.slice(0, -1).trim() + ' ' + op + ' ';
      }
      return trimmed + ' ' + op + ' ';
    });
  };

  const handleClear = () => {
    setExpression('0');
    setActiveOperationNote('Limpo');
  };

  const handleDelete = () => {
    setExpression((prev) => {
      if (prev.length <= 1 || prev === 'Erro' || prev.startsWith('ZeroDivisionError')) {
        return '0';
      }
      // Se termina com espaço e operador
      if (prev.endsWith(' ')) {
        return prev.trim().slice(0, -1).trim();
      }
      return prev.slice(0, -1);
    });
  };

  const handleToggleSign = () => {
    setExpression((prev) => {
      if (prev === '0') return prev;
      if (prev.startsWith('-')) {
        return prev.slice(1);
      }
      return '-' + prev;
    });
  };

  const handleCalculate = useCallback(() => {
    if (!expression || expression === '0') return;

    const res = evaluatePythonExpression(expression);

    // Identificar chamada python correspondente para operações simples
    let pyFunc = `eval("${res.pythonEquivalent}")`;
    const simpleMatch = expression.trim().match(/^([0-9.]+)\s*([+\-*/])\s*([0-9.]+)$/);
    if (simpleMatch) {
      const a = simpleMatch[1];
      const op = simpleMatch[2];
      const b = simpleMatch[3];
      if (op === '+') pyFunc = `somar(${a}, ${b})`;
      else if (op === '-') pyFunc = `subtrair(${a}, ${b})`;
      else if (op === '*') pyFunc = `multiplicar(${a}, ${b})`;
      else if (op === '/') pyFunc = `dividir(${a}, ${b})`;
    }

    if (res.error) {
      const newRecord: CalculationRecord = {
        id: Date.now().toString(),
        expression,
        result: res.error,
        pythonCall: pyFunc,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isError: true,
      };
      setHistory((prev) => [newRecord, ...prev]);
      setExpression(res.error);
      setLastPythonCode(
        `try:\n    ${pyFunc}\nexcept ZeroDivisionError as err:\n    print(f"Erro: {err}")`
      );
      setActiveOperationNote('Exceção capturada em Python');
    } else if (res.result !== null) {
      const formatted = formatPythonNumber(res.result);
      const newRecord: CalculationRecord = {
        id: Date.now().toString(),
        expression,
        result: formatted,
        pythonCall: pyFunc,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setHistory((prev) => [newRecord, ...prev.slice(0, 24)]);
      setExpression(formatted);
      setLastPythonCode(`${pyFunc}  # -> ${formatted}`);
      setActiveOperationNote(`Calculado via Python (${formatted})`);
    }
  }, [expression]);

  // Teclado físico
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }
      if (/[0-9]/.test(e.key)) {
        handleDigit(e.key);
      } else if (e.key === '+') {
        handleOperator('+', 'Operação: Soma (+) def somar(a, b)');
      } else if (e.key === '-') {
        handleOperator('-', 'Operação: Subtração (-) def subtrair(a, b)');
      } else if (e.key === '*') {
        handleOperator('*', 'Operação: Multiplicação (*) def multiplicar(a, b)');
      } else if (e.key === '/') {
        e.preventDefault();
        handleOperator('/', 'Operação: Divisão (/) def dividir(a, b)');
      } else if (e.key === 'Enter' || e.key === '=') {
        e.preventDefault();
        handleCalculate();
      } else if (e.key === 'Backspace') {
        handleDelete();
      } else if (e.key === 'Escape') {
        handleClear();
      } else if (e.key === '.') {
        handleDigit('.');
      } else if (e.key === '(' || e.key === ')') {
        handleDigit(e.key);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleCalculate]);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      {/* Coluna Principal: Calculadora Visual e Código Python correspondente */}
      <div className="lg:col-span-7 space-y-6">
        {/* Painel de Operações Rápidas em Destaque */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <button
            onClick={() => handleOperator('+', 'Operação: Soma (+)')}
            className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-left hover:border-emerald-500 hover:shadow-sm transition-all group"
          >
            <div className="flex items-center justify-between">
              <span className="text-xl font-bold text-emerald-600 dark:text-emerald-400 font-mono">+</span>
              <span className="text-[11px] font-mono text-slate-400 dark:text-slate-500">somar(a, b)</span>
            </div>
            <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 mt-1">Soma</p>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">Adição de valores</p>
          </button>

          <button
            onClick={() => handleOperator('-', 'Operação: Subtração (-)')}
            className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-left hover:border-emerald-500 hover:shadow-sm transition-all group"
          >
            <div className="flex items-center justify-between">
              <span className="text-xl font-bold text-emerald-600 dark:text-emerald-400 font-mono">-</span>
              <span className="text-[11px] font-mono text-slate-400 dark:text-slate-500">subtrair(a, b)</span>
            </div>
            <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 mt-1">Subtração</p>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">Diferença matemática</p>
          </button>

          <button
            onClick={() => handleOperator('*', 'Operação: Multiplicação (*)')}
            className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-left hover:border-emerald-500 hover:shadow-sm transition-all group"
          >
            <div className="flex items-center justify-between">
              <span className="text-xl font-bold text-emerald-600 dark:text-emerald-400 font-mono">×</span>
              <span className="text-[11px] font-mono text-slate-400 dark:text-slate-500">multiplicar(a, b)</span>
            </div>
            <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 mt-1">Multiplicação</p>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">Produto de fatores</p>
          </button>

          <button
            onClick={() => handleOperator('/', 'Operação: Divisão (/)')}
            className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-left hover:border-emerald-500 hover:shadow-sm transition-all group"
          >
            <div className="flex items-center justify-between">
              <span className="text-xl font-bold text-emerald-600 dark:text-emerald-400 font-mono">÷</span>
              <span className="text-[11px] font-mono text-slate-400 dark:text-slate-500">dividir(a, b)</span>
            </div>
            <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 mt-1">Divisão</p>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">Com ZeroDivisionError</p>
          </button>
        </div>

        {/* Corpo da Calculadora */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
          {/* Display da Calculadora */}
          <div className="bg-slate-950 text-white rounded-xl p-5 mb-5 shadow-inner relative overflow-hidden">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
              <span className="font-mono flex items-center gap-1.5">
                <span className="text-emerald-400 font-bold">&gt;&gt;&gt;</span>
                {activeOperationNote}
              </span>
              {evaluation.result !== null && !evaluation.error && (
                <span className="text-emerald-400 font-mono tabular-nums">
                  ≈ {formatPythonNumber(evaluation.result)}
                </span>
              )}
            </div>

            {/* Linha da Expressão */}
            <div className="text-right font-mono text-sm text-slate-400 min-h-[1.5rem] tracking-wide break-all">
              {expression.length > 30 ? '...' + expression.slice(-30) : expression}
            </div>

            {/* Número Principal / Erro */}
            <div className="text-right mt-1">
              {expression.startsWith('ZeroDivisionError') ? (
                <div className="text-rose-400 text-base sm:text-lg font-mono font-medium flex items-center justify-end gap-2 text-wrap">
                  <AlertCircle className="w-5 h-5 shrink-0" />
                  <span>ZeroDivisionError: divisão por zero não permitida</span>
                </div>
              ) : (
                <div className="text-3xl sm:text-4xl font-mono font-bold tracking-tight text-white tabular-nums break-all">
                  {expression}
                </div>
              )}
            </div>
          </div>

          {/* Teclado Físico da Calculadora */}
          <div className="grid grid-cols-4 gap-2.5 sm:gap-3">
            {/* Linha 1 */}
            <button
              onClick={handleClear}
              className="py-3.5 px-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-rose-600 dark:text-rose-400 font-mono font-bold text-sm sm:text-base transition-colors"
              title="Limpar (C)"
            >
              C
            </button>
            <button
              onClick={handleDelete}
              className="py-3.5 px-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-mono font-semibold text-sm sm:text-base transition-colors"
              title="Apagar último dígito"
            >
              ⌫
            </button>
            <button
              onClick={() => handleDigit('(')}
              className="py-3.5 px-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-mono font-semibold text-sm sm:text-base transition-colors"
            >
              (
            </button>
            <button
              onClick={() => handleDigit(')')}
              className="py-3.5 px-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-mono font-semibold text-sm sm:text-base transition-colors"
            >
              )
            </button>

            {/* Linha 2 */}
            <button
              onClick={() => handleDigit('7')}
              className="py-3.5 px-2 rounded-xl bg-slate-50 hover:bg-slate-100 dark:bg-slate-800/60 dark:hover:bg-slate-800 text-slate-900 dark:text-slate-100 font-mono font-bold text-lg sm:text-xl transition-colors border border-slate-200/60 dark:border-slate-800"
            >
              7
            </button>
            <button
              onClick={() => handleDigit('8')}
              className="py-3.5 px-2 rounded-xl bg-slate-50 hover:bg-slate-100 dark:bg-slate-800/60 dark:hover:bg-slate-800 text-slate-900 dark:text-slate-100 font-mono font-bold text-lg sm:text-xl transition-colors border border-slate-200/60 dark:border-slate-800"
            >
              8
            </button>
            <button
              onClick={() => handleDigit('9')}
              className="py-3.5 px-2 rounded-xl bg-slate-50 hover:bg-slate-100 dark:bg-slate-800/60 dark:hover:bg-slate-800 text-slate-900 dark:text-slate-100 font-mono font-bold text-lg sm:text-xl transition-colors border border-slate-200/60 dark:border-slate-800"
            >
              9
            </button>
            <button
              onClick={() => handleOperator('/', 'Operação: Divisão (/)')}
              className="py-3.5 px-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/50 dark:hover:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300 font-mono font-bold text-lg sm:text-xl transition-colors border border-emerald-200 dark:border-emerald-800/60"
              title="Divisão (/)"
            >
              ÷
            </button>

            {/* Linha 3 */}
            <button
              onClick={() => handleDigit('4')}
              className="py-3.5 px-2 rounded-xl bg-slate-50 hover:bg-slate-100 dark:bg-slate-800/60 dark:hover:bg-slate-800 text-slate-900 dark:text-slate-100 font-mono font-bold text-lg sm:text-xl transition-colors border border-slate-200/60 dark:border-slate-800"
            >
              4
            </button>
            <button
              onClick={() => handleDigit('5')}
              className="py-3.5 px-2 rounded-xl bg-slate-50 hover:bg-slate-100 dark:bg-slate-800/60 dark:hover:bg-slate-800 text-slate-900 dark:text-slate-100 font-mono font-bold text-lg sm:text-xl transition-colors border border-slate-200/60 dark:border-slate-800"
            >
              5
            </button>
            <button
              onClick={() => handleDigit('6')}
              className="py-3.5 px-2 rounded-xl bg-slate-50 hover:bg-slate-100 dark:bg-slate-800/60 dark:hover:bg-slate-800 text-slate-900 dark:text-slate-100 font-mono font-bold text-lg sm:text-xl transition-colors border border-slate-200/60 dark:border-slate-800"
            >
              6
            </button>
            <button
              onClick={() => handleOperator('*', 'Operação: Multiplicação (*)')}
              className="py-3.5 px-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/50 dark:hover:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300 font-mono font-bold text-lg sm:text-xl transition-colors border border-emerald-200 dark:border-emerald-800/60"
              title="Multiplicação (*)"
            >
              ×
            </button>

            {/* Linha 4 */}
            <button
              onClick={() => handleDigit('1')}
              className="py-3.5 px-2 rounded-xl bg-slate-50 hover:bg-slate-100 dark:bg-slate-800/60 dark:hover:bg-slate-800 text-slate-900 dark:text-slate-100 font-mono font-bold text-lg sm:text-xl transition-colors border border-slate-200/60 dark:border-slate-800"
            >
              1
            </button>
            <button
              onClick={() => handleDigit('2')}
              className="py-3.5 px-2 rounded-xl bg-slate-50 hover:bg-slate-100 dark:bg-slate-800/60 dark:hover:bg-slate-800 text-slate-900 dark:text-slate-100 font-mono font-bold text-lg sm:text-xl transition-colors border border-slate-200/60 dark:border-slate-800"
            >
              2
            </button>
            <button
              onClick={() => handleDigit('3')}
              className="py-3.5 px-2 rounded-xl bg-slate-50 hover:bg-slate-100 dark:bg-slate-800/60 dark:hover:bg-slate-800 text-slate-900 dark:text-slate-100 font-mono font-bold text-lg sm:text-xl transition-colors border border-slate-200/60 dark:border-slate-800"
            >
              3
            </button>
            <button
              onClick={() => handleOperator('-', 'Operação: Subtração (-)')}
              className="py-3.5 px-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/50 dark:hover:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300 font-mono font-bold text-lg sm:text-xl transition-colors border border-emerald-200 dark:border-emerald-800/60"
              title="Subtração (-)"
            >
              −
            </button>

            {/* Linha 5 */}
            <button
              onClick={handleToggleSign}
              className="py-3.5 px-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-mono font-bold text-base transition-colors"
              title="Inverter Sinal (±)"
            >
              ±
            </button>
            <button
              onClick={() => handleDigit('0')}
              className="py-3.5 px-2 rounded-xl bg-slate-50 hover:bg-slate-100 dark:bg-slate-800/60 dark:hover:bg-slate-800 text-slate-900 dark:text-slate-100 font-mono font-bold text-lg sm:text-xl transition-colors border border-slate-200/60 dark:border-slate-800"
            >
              0
            </button>
            <button
              onClick={() => handleDigit('.')}
              className="py-3.5 px-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-mono font-bold text-base transition-colors"
            >
              .
            </button>
            <button
              onClick={() => handleOperator('+', 'Operação: Soma (+)')}
              className="py-3.5 px-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/50 dark:hover:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300 font-mono font-bold text-lg sm:text-xl transition-colors border border-emerald-200 dark:border-emerald-800/60"
              title="Soma (+)"
            >
              +
            </button>

            {/* Linha 6: Operador Igual em Destaque */}
            <button
              onClick={handleCalculate}
              className="col-span-4 py-3.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-mono font-bold text-base flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all"
            >
              <Equal className="w-5 h-5" />
              <span>Executar em Python (=)</span>
            </button>
          </div>
        </div>

        {/* Console de Tradução Python Equivalente */}
        <div className="bg-slate-900 text-slate-200 rounded-xl p-4 border border-slate-800 shadow-sm font-mono text-xs">
          <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800 text-slate-400">
            <span className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" />
              <span>Execução Python em Tempo Real</span>
            </span>
            <button
              onClick={() => copyToClipboard(lastPythonCode, 'exec-code')}
              className="hover:text-white transition-colors flex items-center gap-1"
            >
              {copiedId === 'exec-code' ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400">Copiado</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copiar Código</span>
                </>
              )}
            </button>
          </div>
          <pre className="text-emerald-400 font-mono whitespace-pre-wrap leading-relaxed">
            {lastPythonCode}
          </pre>
        </div>
      </div>

      {/* Coluna Lateral: Histórico de Cálculos */}
      <div className="lg:col-span-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2 text-slate-800 dark:text-slate-100 font-semibold text-sm">
            <Clock className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span>Histórico de Cálculos</span>
          </div>
          {history.length > 0 && (
            <button
              onClick={() => setHistory([])}
              className="text-xs text-slate-400 hover:text-rose-500 transition-colors flex items-center gap-1"
              title="Limpar histórico"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Limpar</span>
            </button>
          )}
        </div>

        {history.length === 0 ? (
          <div className="py-12 text-center text-slate-400 dark:text-slate-500 text-xs">
            <RotateCcw className="w-8 h-8 mx-auto mb-2 opacity-40" />
            <p>Nenhum cálculo registrado ainda.</p>
            <p className="mt-1">Faça uma operação para vê-la aqui.</p>
          </div>
        ) : (
          <div className="space-y-3 max-h-[520px] overflow-y-auto pr-1">
            {history.map((item) => (
              <div
                key={item.id}
                onClick={() => {
                  if (!item.isError) {
                    setExpression(item.result);
                  }
                }}
                className={`p-3 rounded-xl border text-left transition-all cursor-pointer group ${
                  item.isError
                    ? 'border-rose-200 dark:border-rose-900/40 bg-rose-50/50 dark:bg-rose-950/20'
                    : 'border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 hover:border-emerald-500/50 hover:bg-slate-50 dark:hover:bg-slate-800/80'
                }`}
              >
                <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                  <span className="font-mono text-[11px] text-emerald-600 dark:text-emerald-400">
                    {item.pythonCall}
                  </span>
                  <span>{item.timestamp}</span>
                </div>
                <div className="font-mono text-xs text-slate-600 dark:text-slate-300">
                  {item.expression}
                </div>
                <div
                  className={`font-mono text-base font-bold mt-0.5 tabular-nums ${
                    item.isError
                      ? 'text-rose-600 dark:text-rose-400 text-xs'
                      : 'text-slate-900 dark:text-white'
                  }`}
                >
                  = {item.result}
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-400 dark:text-slate-500 leading-relaxed">
          <p>
            Dica: você também pode digitar diretamente no teclado físico (números, +, -, *, /,
            Enter para calcular, Esc para limpar).
          </p>
        </div>
      </div>
    </div>
  );
};
