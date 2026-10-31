import React, { useState } from 'react';
import {
  Plus,
  Minus,
  X,
  Divide,
  AlertTriangle,
  Play,
  CheckCircle2,
  Sparkles
} from 'lucide-react';
import { somar, subtrair, multiplicar, dividir, formatPythonNumber } from '../utils/calculatorLogic';

interface OperationDef {
  id: 'somar' | 'subtrair' | 'multiplicar' | 'dividir';
  name: string;
  symbol: string;
  pythonSignature: string;
  description: string;
  defaultA: number;
  defaultB: number;
  presets: Array<{ label: string; a: number; b: number }>;
}

const OPERATIONS: OperationDef[] = [
  {
    id: 'somar',
    name: 'Soma',
    symbol: '+',
    pythonSignature: 'def somar(a: float, b: float) -> float:\n    return a + b',
    description: 'Calcula a adição entre dois números.',
    defaultA: 25,
    defaultB: 15,
    presets: [
      { label: 'Valores inteiros', a: 100, b: 250 },
      { label: 'Ponto flutuante', a: 0.1, b: 0.2 },
      { label: 'Números negativos', a: -40, b: 15 },
    ],
  },
  {
    id: 'subtrair',
    name: 'Subtração',
    symbol: '-',
    pythonSignature: 'def subtrair(a: float, b: float) -> float:\n    return a - b',
    description: 'Subtrai o segundo número do primeiro.',
    defaultA: 50,
    defaultB: 18,
    presets: [
      { label: 'Resultado positivo', a: 100, b: 45 },
      { label: 'Resultado negativo', a: 10, b: 35 },
      { label: 'Subtrair de zero', a: 0, b: 99 },
    ],
  },
  {
    id: 'multiplicar',
    name: 'Multiplicação',
    symbol: '*',
    pythonSignature: 'def multiplicar(a: float, b: float) -> float:\n    return a * b',
    description: 'Retorna o produto aritmético de dois fatores.',
    defaultA: 12,
    defaultB: 7,
    presets: [
      { label: 'Multiplicação básica', a: 8, b: 9 },
      { label: 'Multiplicação por zero', a: 45, b: 0 },
      { label: 'Regra de sinais (- * -)', a: -6, b: -7 },
    ],
  },
  {
    id: 'dividir',
    name: 'Divisão',
    symbol: '/',
    pythonSignature: 'def dividir(a: float, b: float) -> float:\n    if b == 0:\n        raise ZeroDivisionError("Divisão por zero")\n    return a / b',
    description: 'Divide o dividendo pelo divisor, com proteção para divisão por zero.',
    defaultA: 100,
    defaultB: 4,
    presets: [
      { label: 'Divisão exata', a: 40, b: 5 },
      { label: 'Divisão fracionária', a: 10, b: 3 },
      { label: '⚠️ Testar Divisão por Zero', a: 50, b: 0 },
    ],
  },
];

export const FunctionTester: React.FC = () => {
  const [selectedOpId, setSelectedOpId] = useState<'somar' | 'subtrair' | 'multiplicar' | 'dividir'>('dividir');
  const [valA, setValA] = useState<string>('100');
  const [valB, setValB] = useState<string>('4');

  const currentOp = OPERATIONS.find((op) => op.id === selectedOpId)!;

  const numA = parseFloat(valA);
  const numB = parseFloat(valB);

  let result: string | null = null;
  let error: string | null = null;

  if (isNaN(numA) || isNaN(numB)) {
    error = 'Entrada inválida. Digite números válidos para a e b.';
  } else {
    try {
      if (selectedOpId === 'somar') result = formatPythonNumber(somar(numA, numB));
      else if (selectedOpId === 'subtrair') result = formatPythonNumber(subtrair(numA, numB));
      else if (selectedOpId === 'multiplicar') result = formatPythonNumber(multiplicar(numA, numB));
      else if (selectedOpId === 'dividir') result = formatPythonNumber(dividir(numA, numB));
    } catch (err: unknown) {
      error = err instanceof Error ? err.message : String(err);
    }
  }

  const applyPreset = (a: number, b: number) => {
    setValA(String(a));
    setValB(String(b));
  };

  return (
    <div className="space-y-6">
      {/* Seletor de Operações */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {OPERATIONS.map((op) => {
          const isSelected = op.id === selectedOpId;
          return (
            <button
              key={op.id}
              onClick={() => {
                setSelectedOpId(op.id);
                setValA(String(op.defaultA));
                setValB(String(op.defaultB));
              }}
              className={`p-4 rounded-xl border text-left transition-all ${
                isSelected
                  ? 'bg-emerald-600 text-white border-emerald-600 shadow-md'
                  : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 hover:border-emerald-500/50'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-xl font-bold">{op.symbol}</span>
                <span
                  className={`text-[11px] font-mono ${
                    isSelected ? 'text-emerald-100' : 'text-slate-400'
                  }`}
                >
                  {op.id}()
                </span>
              </div>
              <p className="font-bold text-sm mt-1">{op.name}</p>
              <p
                className={`text-xs mt-0.5 line-clamp-1 ${
                  isSelected ? 'text-emerald-100' : 'text-slate-500 dark:text-slate-400'
                }`}
              >
                {op.description}
              </p>
            </button>
          );
        })}
      </div>

      {/* Painel de Testes */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Painel Esquerdo: Entradas e Resultados */}
        <div className="lg:col-span-7 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-6">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <span>Testar Operação: {currentOp.name}</span>
              <span className="font-mono text-xs px-2 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded">
                {currentOp.id}(a, b)
              </span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Altere os parâmetros `a` e `b` para ver o retorno correspondente da função Python.
            </p>
          </div>

          {/* Entradas a e b */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5 font-mono">
                Parâmetro a (dividendo / minuendo / termo 1):
              </label>
              <input
                type="number"
                step="any"
                value={valA}
                onChange={(e) => setValA(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-mono text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5 font-mono">
                Parâmetro b (divisor / subtraendo / termo 2):
              </label>
              <input
                type="number"
                step="any"
                value={valB}
                onChange={(e) => setValB(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-mono text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          {/* Casos Prontos de Teste (Presets) */}
          <div>
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400 block mb-2">
              Casos Rápidos de Teste:
            </span>
            <div className="flex flex-wrap gap-2">
              {currentOp.presets.map((preset, idx) => (
                <button
                  key={idx}
                  onClick={() => applyPreset(preset.a, preset.b)}
                  className="px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors"
                >
                  {preset.label} ({preset.a}, {preset.b})
                </button>
              ))}
            </div>
          </div>

          {/* Resultado da Chamada */}
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
            <span className="text-xs font-semibold text-slate-600 dark:text-slate-400 block mb-2">
              Retorno da Função Python:
            </span>

            {error ? (
              <div className="p-4 rounded-xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/50 text-rose-700 dark:text-rose-400 font-mono text-xs sm:text-sm flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold">Exceção Lançada:</div>
                  <div className="mt-1">{error}</div>
                </div>
              </div>
            ) : (
              <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/50 text-slate-900 dark:text-white font-mono text-xs sm:text-sm space-y-1">
                <div className="text-slate-500 dark:text-slate-400">
                  Chamada: <span className="text-emerald-600 dark:text-emerald-400 font-semibold">{currentOp.id}({valA}, {valB})</span>
                </div>
                <div className="text-lg sm:text-xl font-bold text-emerald-700 dark:text-emerald-300 tabular-nums">
                  &gt;&gt;&gt; {result}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Painel Direito: Implementação em Python */}
        <div className="lg:col-span-5 bg-slate-950 rounded-2xl border border-slate-800 p-6 shadow-sm text-slate-200 font-mono text-xs">
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800 text-slate-400">
            <span className="font-semibold text-white">Definição da Função</span>
            <span>Python 3</span>
          </div>

          <pre className="text-emerald-400 leading-relaxed overflow-x-auto whitespace-pre-wrap">
            {currentOp.pythonSignature}
          </pre>

          <div className="mt-6 pt-4 border-t border-slate-800 text-slate-400 text-[11px] space-y-2">
            <p className="font-semibold text-slate-300">Explicação Técnica:</p>
            {selectedOpId === 'somar' && (
              <p>O operador `+` soma dois operandos numéricos (`int` ou `float`). Em Python, tipos flutuantes seguem a especificação IEEE 754.</p>
            )}
            {selectedOpId === 'subtrair' && (
              <p>O operador `-` subtrai o segundo operando do primeiro. A ordem dos parâmetros é fundamental (`a - b != b - a`).</p>
            )}
            {selectedOpId === 'multiplicar' && (
              <p>O operador `*` multiplica dois números. Qualquer número multiplicado por 0 retorna 0.</p>
            )}
            {selectedOpId === 'dividir' && (
              <p>No Python 3, a barra única `&#47;` sempre realiza a divisão real retornando um `float` (ex: 4 / 2 resulta em 2.0). Quando o divisor for zero, o interpretador lança obrigatoriamente a exceção `ZeroDivisionError`.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
