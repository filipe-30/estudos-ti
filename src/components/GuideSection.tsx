import React from 'react';
import { BookOpen, Check, AlertCircle, Sparkles, Terminal } from 'lucide-react';

export const GuideSection: React.FC = () => {
  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Introdução */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-sm">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2.5 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              Guia de Operações Aritméticas em Python
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Conceitos fundamentais das 4 operações matemáticas básicas e boas práticas em Python 3.
            </p>
          </div>
        </div>

        <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
          Criar uma calculadora em Python é um dos exercícios mais clássicos e didáticos para aprender lógica de programação.
          Ele engloba definição de funções puras (<code className="font-mono text-emerald-600 dark:text-emerald-400">def</code>),
          conversão de tipos de dados (<code className="font-mono text-emerald-600 dark:text-emerald-400">float(input())</code>),
          controle de fluxo (<code className="font-mono text-emerald-600 dark:text-emerald-400">while True</code>, <code className="font-mono text-emerald-600 dark:text-emerald-400">if / elif / else</code>)
          e tratamento de exceções (<code className="font-mono text-emerald-600 dark:text-emerald-400">try ... except ZeroDivisionError</code>).
        </p>
      </div>

      {/* As 4 Operações Básicas */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Soma */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-bold text-slate-900 dark:text-white text-base flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-mono font-bold">
                +
              </span>
              <span>1. Operação de Soma</span>
            </h3>
            <span className="text-xs font-mono text-slate-400">Operador: +</span>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
            Em Python, a adição entre dois números utiliza o operador <code className="font-mono font-bold">+</code>. Se ambos forem inteiros (<code className="font-mono">int</code>), o retorno será <code className="font-mono">int</code>. Se algum for decimal (<code className="font-mono">float</code>), o resultado é promovido a <code className="font-mono">float</code>.
          </p>
          <div className="bg-slate-950 p-3 rounded-xl font-mono text-xs text-emerald-400">
            <p>def somar(a: float, b: float) -&gt; float:</p>
            <p className="pl-4">return a + b</p>
          </div>
        </div>

        {/* Subtração */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-bold text-slate-900 dark:text-white text-base flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-mono font-bold">
                −
              </span>
              <span>2. Operação de Subtração</span>
            </h3>
            <span className="text-xs font-mono text-slate-400">Operador: -</span>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
            A subtração é realizada com o operador <code className="font-mono font-bold">-</code>. Diferente da soma e multiplicação, a subtração não é comutativa (<code className="font-mono">a - b ≠ b - a</code>).
          </p>
          <div className="bg-slate-950 p-3 rounded-xl font-mono text-xs text-emerald-400">
            <p>def subtrair(a: float, b: float) -&gt; float:</p>
            <p className="pl-4">return a - b</p>
          </div>
        </div>

        {/* Multiplicação */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-bold text-slate-900 dark:text-white text-base flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-mono font-bold">
                ×
              </span>
              <span>3. Operação de Multiplicação</span>
            </h3>
            <span className="text-xs font-mono text-slate-400">Operador: *</span>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
            Em Python, a multiplicação utiliza o caractere asterisco <code className="font-mono font-bold">*</code>. Multiplicações por zero sempre resultam em zero. A potência (exponenciação) usa dois asteriscos (<code className="font-mono">**</code>).
          </p>
          <div className="bg-slate-950 p-3 rounded-xl font-mono text-xs text-emerald-400">
            <p>def multiplicar(a: float, b: float) -&gt; float:</p>
            <p className="pl-4">return a * b</p>
          </div>
        </div>

        {/* Divisão */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-bold text-slate-900 dark:text-white text-base flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-mono font-bold">
                ÷
              </span>
              <span>4. Operação de Divisão</span>
            </h3>
            <span className="text-xs font-mono text-slate-400">Operador: /</span>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
            No Python 3, o operador de barra única <code className="font-mono font-bold">/</code> é a <strong>divisão real</strong>, que sempre retorna um <code className="font-mono">float</code> (ex: <code className="font-mono">10 / 2 = 5.0</code>).
          </p>
          <div className="bg-slate-950 p-3 rounded-xl font-mono text-xs text-emerald-400">
            <p>def dividir(a: float, b: float) -&gt; float:</p>
            <p className="pl-4">if b == 0:</p>
            <p className="pl-8 text-rose-400">raise ZeroDivisionError("Divisão por zero!")</p>
            <p className="pl-4">return a / b</p>
          </div>
        </div>
      </div>

      {/* Caixa de Atenção: Tratamento de Exceções */}
      <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/50 rounded-2xl p-6 shadow-sm">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
          <div className="space-y-2 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
            <h4 className="font-bold text-slate-900 dark:text-white text-sm sm:text-base">
              Por que tratar ZeroDivisionError em Python?
            </h4>
            <p className="leading-relaxed">
              Matematicamente, a divisão por zero é indefinida. Quando o Python encontra uma tentativa como <code className="font-mono bg-amber-100 dark:bg-amber-900/60 px-1 py-0.5 rounded">10 / 0</code>, ele interrompe o programa imediatamente com um erro crítico.
            </p>
            <p className="leading-relaxed">
              Usar blocos <code className="font-mono bg-amber-100 dark:bg-amber-900/60 px-1 py-0.5 rounded">try ... except ZeroDivisionError</code> impede que o programa feche abruptamente e permite exibir uma mensagem amigável para o usuário.
            </p>
          </div>
        </div>
      </div>

      {/* Estrutura do Loop Principal */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-4">
        <h3 className="font-bold text-slate-900 dark:text-white text-base">
          Como funciona o loop interativo (CLI)?
        </h3>
        <ol className="list-decimal list-inside space-y-2 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
          <li><strong>Exibição do Menu:</strong> Mostra as opções numeradas de 1 a 4 para cada operação e 0 para sair.</li>
          <li><strong>Validação de Entrada:</strong> O <code className="font-mono">input()</code> captura a escolha e garante que só números válidos sejam processados.</li>
          <li><strong>Coleta dos Números:</strong> A função auxiliar <code className="font-mono">obter_numero()</code> trata erros se o usuário digitar letras ou símbolos.</li>
          <li><strong>Execução e Exibição:</strong> Chama a função matemática correspondente e imprime o resultado na tela.</li>
          <li><strong>Repetição:</strong> O laço <code className="font-mono">while True</code> continua ativo até que o usuário opte por digitar `0`.</li>
        </ol>
      </div>
    </div>
  );
};
