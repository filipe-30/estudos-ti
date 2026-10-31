/**
 * Funções matemáticas base que espelham o comportamento do Python 3
 */

export function somar(a: number, b: number): number {
  return a + b;
}

export function subtrair(a: number, b: number): number {
  return a - b;
}

export function multiplicar(a: number, b: number): number {
  return a * b;
}

export function dividir(a: number, b: number): number {
  if (b === 0) {
    throw new Error('ZeroDivisionError: division by zero');
  }
  return a / b;
}

export function formatPythonNumber(num: number): string {
  if (!isFinite(num)) return String(num);
  // Round tiny floating inaccuracies like 0.1 + 0.2 = 0.30000000000000004
  const rounded = Number(Math.round(Number(num + 'e+12')) + 'e-12');
  return String(rounded);
}

export interface CalculationRecord {
  id: string;
  expression: string;
  result: string;
  pythonCall: string;
  timestamp: string;
  isError?: boolean;
}

/**
 * Avaliador de expressões aritméticas seguras com suporte a regras Python
 * (+, -, *, /, %, **)
 */
export function evaluatePythonExpression(expr: string): {
  result: number | null;
  error: string | null;
  pythonEquivalent: string;
} {
  const cleaned = expr.trim();
  if (!cleaned) {
    return { result: null, error: null, pythonEquivalent: '' };
  }

  // Substitui símbolos visuais por operadores Python
  const pyExpr = cleaned
    .replace(/×/g, '*')
    .replace(/÷/g, '/')
    .replace(/\^/g, '**');

  // Validação de caracteres permitidos (apenas números, operadores, parênteses, pontos e espaços)
  if (!/^[0-9+\-*/%.() ]+$/.test(pyExpr)) {
    return {
      result: null,
      error: 'SyntaxError: caractere inválido na expressão',
      pythonEquivalent: pyExpr,
    };
  }

  try {
    // Tokenização
    const tokens = tokenize(pyExpr);
    if (tokens.length === 0) {
      return { result: null, error: null, pythonEquivalent: pyExpr };
    }

    const val = parseExpression(tokens);

    if (val === null || !isFinite(val)) {
      return {
        result: null,
        error: 'ZeroDivisionError: division by zero',
        pythonEquivalent: pyExpr,
      };
    }

    return {
      result: val,
      error: null,
      pythonEquivalent: pyExpr,
    };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'SyntaxError: sintaxe inválida';
    return {
      result: null,
      error: msg,
      pythonEquivalent: pyExpr,
    };
  }
}

// Tokenizer para aritmética simples
function tokenize(str: string): string[] {
  const tokens: string[] = [];
  let i = 0;
  while (i < str.length) {
    const char = str[i];

    if (/\s/.test(char)) {
      i++;
      continue;
    }

    // Operador de potência **
    if (char === '*' && str[i + 1] === '*') {
      tokens.push('**');
      i += 2;
      continue;
    }

    // Números (inteiros ou floats)
    if (/[0-9.]/.test(char)) {
      let num = '';
      while (i < str.length && /[0-9.]/.test(str[i])) {
        num += str[i];
        i++;
      }
      tokens.push(num);
      continue;
    }

    // Operadores individuais e parênteses
    if (['+', '-', '*', '/', '%', '(', ')'].includes(char)) {
      tokens.push(char);
      i++;
      continue;
    }

    throw new Error(`SyntaxError: caractere inesperado '${char}'`);
  }
  return tokens;
}

// Recursive Descent Parser para aritmética com precedência Python
function parseExpression(tokens: string[]): number {
  let index = 0;

  function parseAddSub(): number {
    let left = parseMulDiv();
    while (index < tokens.length && (tokens[index] === '+' || tokens[index] === '-')) {
      const op = tokens[index++];
      const right = parseMulDiv();
      if (op === '+') {
        left = somar(left, right);
      } else {
        left = subtrair(left, right);
      }
    }
    return left;
  }

  function parseMulDiv(): number {
    let left = parsePower();
    while (
      index < tokens.length &&
      (tokens[index] === '*' || tokens[index] === '/' || tokens[index] === '%')
    ) {
      const op = tokens[index++];
      const right = parsePower();
      if (op === '*') {
        left = multiplicar(left, right);
      } else if (op === '/') {
        left = dividir(left, right);
      } else if (op === '%') {
        if (right === 0) throw new Error('ZeroDivisionError: float modulo');
        left = left % right;
      }
    }
    return left;
  }

  function parsePower(): number {
    let left = parseUnary();
    if (index < tokens.length && tokens[index] === '**') {
      index++;
      const right = parsePower(); // Direito-associativo para potências em Python
      left = Math.pow(left, right);
    }
    return left;
  }

  function parseUnary(): number {
    if (index < tokens.length && tokens[index] === '+') {
      index++;
      return parseUnary();
    }
    if (index < tokens.length && tokens[index] === '-') {
      index++;
      return -parseUnary();
    }
    return parsePrimary();
  }

  function parsePrimary(): number {
    if (index >= tokens.length) {
      throw new Error('SyntaxError: expressão incompleta');
    }

    const token = tokens[index++];
    if (token === '(') {
      const val = parseAddSub();
      if (index >= tokens.length || tokens[index] !== ')') {
        throw new Error('SyntaxError: parênteses não fechados');
      }
      index++; // consome ')'
      return val;
    }

    const num = Number(token);
    if (isNaN(num)) {
      throw new Error(`SyntaxError: número inválido '${token}'`);
    }
    return num;
  }

  const result = parseAddSub();
  if (index < tokens.length) {
    throw new Error(`SyntaxError: token inesperado '${tokens[index]}'`);
  }
  return result;
}
