export interface CodeSnippet {
  id: string;
  title: string;
  filename: string;
  description: string;
  code: string;
}

export const PYTHON_SCRIPTS: CodeSnippet[] = [
  {
    id: 'cli-menu',
    title: 'Script Completo com Menu Interativo',
    filename: 'calculadora.py',
    description: 'Código principal com funções individuais para cada operação básica e menu interativo no terminal.',
    code: `"""
Calculadora em Python com Operações Básicas
Operações: Soma (+), Subtração (-), Multiplicação (*) e Divisão (/)
"""

def somar(a: float, b: float) -> float:
    """Retorna a soma de dois números."""
    return a + b


def subtrair(a: float, b: float) -> float:
    """Retorna a subtração do segundo número pelo primeiro."""
    return a - b


def multiplicar(a: float, b: float) -> float:
    """Retorna a multiplicação de dois números."""
    return a * b


def dividir(a: float, b: float) -> float:
    """
    Retorna a divisão do primeiro número pelo segundo.
    Lança ZeroDivisionError se o divisor for zero.
    """
    if b == 0:
        raise ZeroDivisionError("Erro: Não é possível realizar divisão por zero!")
    return a / b


def exibir_menu():
    """Exibe as opções da calculadora."""
    print("\\n" + "=" * 32)
    print("      CALCULADORA EM PYTHON")
    print("=" * 32)
    print("1. Soma (+)")
    print("2. Subtração (-)")
    print("3. Multiplicação (*)")
    print("4. Divisão (/)")
    print("0. Sair")
    print("=" * 32)


def obter_numero(mensagem: str) -> float:
    """Garante a leitura de um número float válido do usuário."""
    while True:
        try:
            return float(input(mensagem))
        except ValueError:
            print("Entrada inválida! Por favor, digite um número válido.")


def main():
    """Função principal que orquestra o loop da calculadora."""
    while True:
        exibir_menu()
        opcao = input("Escolha uma operação (0-4): ").strip()

        if opcao == "0":
            print("\\nEncerrando a calculadora. Até mais!")
            break

        if opcao not in ("1", "2", "3", "4"):
            print("Opção inválida! Escolha um número entre 0 e 4.")
            continue

        print("\\n-- Inserir Valores --")
        num1 = obter_numero("Digite o primeiro número: ")
        num2 = obter_numero("Digite o segundo número: ")

        try:
            if opcao == "1":
                resultado = somar(num1, num2)
                simbolo = "+"
            elif opcao == "2":
                resultado = subtrair(num1, num2)
                simbolo = "-"
            elif opcao == "3":
                resultado = multiplicar(num1, num2)
                simbolo = "*"
            elif opcao == "4":
                resultado = dividir(num1, num2)
                simbolo = "/"

            print("-" * 32)
            print(f">>> Resultado: {num1} {simbolo} {num2} = {resultado}")
            print("-" * 32)

        except ZeroDivisionError as erro:
            print(f"\\n[ERRO MATEMÁTICO] {erro}")


if __name__ == "__main__":
    main()
`
  },
  {
    id: 'simple-functions',
    title: 'Funções Puras & Modulares',
    filename: 'operacoes.py',
    description: 'Módulo reutilizável apenas com as 4 operações matemáticas e anotações de tipo.',
    code: `"""
Módulo de Operações Matemáticas Básicas
Arquivo: operacoes.py
"""

def somar(a: float, b: float) -> float:
    """Calcula a + b."""
    return a + b


def subtrair(a: float, b: float) -> float:
    """Calcula a - b."""
    return a - b


def multiplicar(a: float, b: float) -> float:
    """Calcula a * b."""
    return a * b


def dividir(a: float, b: float) -> float:
    """Calcula a / b com tratamento de divisão por zero."""
    if b == 0:
        raise ZeroDivisionError("Divisão por zero não é permitida.")
    return a / b


# Exemplos de uso direto:
if __name__ == "__main__":
    print("Soma: 10 + 5 =", somar(10, 5))
    print("Subtração: 10 - 5 =", subtrair(10, 5))
    print("Multiplicação: 10 * 5 =", multiplicar(10, 5))
    print("Divisão: 10 / 5 =", dividir(10, 5))
`
  },
  {
    id: 'oop-class',
    title: 'Versão Orientada a Objetos (POO)',
    filename: 'calculadora_poo.py',
    description: 'Classe Python com histórico de cálculos e memória interna.',
    code: `"""
Calculadora Orientada a Objetos com Histórico
Arquivo: calculadora_poo.py
"""
from typing import List, Tuple

class Calculadora:
    """Representa uma calculadora com memória e histórico."""

    def __init__(self):
        self.historico: List[str] = []
        self.ultimo_resultado: float = 0.0

    def somar(self, a: float, b: float) -> float:
        resultado = a + b
        self._registrar(f"{a} + {b} = {resultado}", resultado)
        return resultado

    def subtrair(self, a: float, b: float) -> float:
        resultado = a - b
        self._registrar(f"{a} - {b} = {resultado}", resultado)
        return resultado

    def multiplicar(self, a: float, b: float) -> float:
        resultado = a * b
        self._registrar(f"{a} * {b} = {resultado}", resultado)
        return resultado

    def dividir(self, a: float, b: float) -> float:
        if b == 0:
            raise ZeroDivisionError("Divisão por zero não é permitida.")
        resultado = a / b
        self._registrar(f"{a} / {b} = {resultado}", resultado)
        return resultado

    def _registrar(self, expressao: str, resultado: float):
        self.historico.append(expressao)
        self.ultimo_resultado = resultado

    def ver_historico(self):
        print("\\n=== HISTÓRICO DE CÁLCULOS ===")
        for i, item in enumerate(self.historico, 1):
            print(f"{i}. {item}")


# Exemplo de uso:
if __name__ == "__main__":
    calc = Calculadora()
    calc.somar(15, 25)
    calc.multiplicar(10, 4)
    calc.dividir(100, 5)
    calc.ver_historico()
`
  },
  {
    id: 'unit-tests',
    title: 'Testes Automatizados (unittest)',
    filename: 'test_calculadora.py',
    description: 'Casos de teste garantindo a precisão das operações e o tratamento de divisão por zero.',
    code: `"""
Testes Unitários para a Calculadora
Executar com: python -m unittest test_calculadora.py
"""
import unittest

def somar(a, b):
    return a + b

def subtrair(a, b):
    return a - b

def multiplicar(a, b):
    return a * b

def dividir(a, b):
    if b == 0:
        raise ZeroDivisionError("Divisão por zero")
    return a / b


class TestCalculadora(unittest.TestCase):
    def test_soma(self):
        self.assertEqual(somar(10, 5), 15)
        self.assertEqual(somar(-2, 3), 1)
        self.assertAlmostEqual(somar(0.1, 0.2), 0.3, places=7)

    def test_subtracao(self):
        self.assertEqual(subtrair(20, 8), 12)
        self.assertEqual(subtrair(5, 10), -5)

    def test_multiplicacao(self):
        self.assertEqual(multiplicar(6, 7), 42)
        self.assertEqual(multiplicar(9, 0), 0)
        self.assertEqual(multiplicar(-4, 5), -20)

    def test_divisao(self):
        self.assertEqual(dividir(100, 4), 25.0)
        self.assertEqual(dividir(7, 2), 3.5)

    def test_divisao_por_zero(self):
        with self.assertRaises(ZeroDivisionError):
            dividir(10, 0)


if __name__ == "__main__":
    unittest.main()
`
  }
];
