import { thomasAlgorithm } from '../lab1/tma.test'
import { Matrix, Parser, Token, TokenType, Vector } from '../lib/lib'

class Solver {
	constructor() {}

	solve(f: Token[], x1: number, x2: number, x3: number): number {
		const stack: number[] = []
		for (let i = 0; i < f.length; i++) {
			if (f[i].type === TokenType.Number) {
				stack.push(f[i].valueAsDouble!)
			} else if (f[i].type === TokenType.Variable) {
				if (f[i].value === 'x' || f[i].value === 'x1') {
					stack.push(x1)
				} else if (f[i].value === 'y' || f[i].value === 'x2') {
					stack.push(x2)
				} else if (f[i].value === "y'" || f[i].value === 'z') {
					stack.push(x3)
				}
			} else if (f[i].type === TokenType.Function) {
				let funcRes = 0
				const tmp = stack.pop()!
				switch (f[i].value) {
					case 'sqrt':
						if (tmp < 0) return 0
						funcRes = Math.sqrt(tmp)
						break
					case 'ln':
						if (tmp <= 0) return 0
						funcRes = Math.log(tmp)
						break
					case 'lg':
						if (tmp <= 0) return 0
						funcRes = Math.log10(tmp)
						break
					case 'cos':
						funcRes = Math.cos(tmp)
						break
					case 'sin':
						funcRes = Math.sin(tmp)
						break
					case 'arccos':
						funcRes = Math.acos(tmp)
						break
					case 'arcsin':
						funcRes = Math.asin(tmp)
						break
					case 'tg':
						if (tmp === Math.PI / 2) return 0
						funcRes = Math.tan(tmp)
						break
					case 'exp':
						funcRes = Math.exp(tmp)
						break
				}
				stack.push(funcRes)
			} else if (f[i].type === TokenType.Operator) {
				const tmp2 = stack.pop()!
				const tmp1 = stack.pop()!
				switch (f[i].value) {
					case '+':
						stack.push(tmp1 + tmp2)
						break
					case '-':
						stack.push(tmp1 - tmp2)
						break
					case '*':
						stack.push(tmp1 * tmp2)
						break
					case '/':
						if (tmp1 === 0) return 0
						stack.push(tmp1 / tmp2)
						break
					case '^':
						stack.push(Math.pow(tmp1, tmp2))
						break
				}
			} else if (f[i].type === TokenType.UnaryOperator) {
				let tmp = stack.pop()!
				if (f[i].value === '-') {
					tmp *= -1
				}
				stack.push(tmp)
			}
		}
		return stack[stack.length - 1]
	}

	getConstraints(tokens: Token[]): number[] {
		const constraints: number[] = new Array(3).fill(0)
		const stack: Token[] = []
		for (const token of tokens) {
			if (token.type === TokenType.Variable) {
				stack.push(token)
			} else if (token.type === TokenType.Number) {
				stack.push(token)
			} else if (token.type === TokenType.Operator) {
				if (token.value === '=') {
					const c = stack.pop()!.valueAsDouble!
					constraints[2] = c
					if (stack.length !== 0) {
						const rank = stack.pop()!
						if (rank.value === 'y') {
							constraints[0] = 1
						} else {
							constraints[1] = 1
						}
					}
				} else if (token.value === '*') {
					stack.pop()
					const rank = stack.pop()!
					const constr = stack.pop()!.valueAsDouble!
					if (rank.value === 'y') {
						constraints[0] = constr
					} else {
						constraints[1] = constr
					}
					stack.push(rank)
				} else if (token.value === '-' || token.value === '+') {
					const rank = stack.pop()!
					stack.pop()
					if (rank.type === TokenType.Variable) {
						if (token.value === '-') {
							if (rank.value === 'y') {
								constraints[0] *= -1
								if (stack.length !== 0) {
									constraints[1] = 1
								}
							} else {
								constraints[1] *= -1
								if (stack.length !== 0) {
									constraints[0] = 1
								}
							}
						}
					}
				}
			} else if (token.type === TokenType.UnaryOperator) {
				const tmp = stack.pop()!
				if (token.value === '-') {
					tmp.value = token.value + tmp.value
					tmp.valueAsDouble! *= -1
				}
				stack.push(tmp)
			}
		}
		return constraints
	}
}

class Lexer {
	constructor() {}

	run(input: string): Token[] {
		const tokens: Token[] = []
		let position = 0
		let expectUnary = true

		while (position < input.length) {
			const current = input[position]

			if (this.isDigit(current) || current === '.') {
				const number = this.parseNumber(input, position)
				tokens.push(new Token(TokenType.Number, number.value))
				position = number.position
				expectUnary = false
			} else if ('+-*/=^'.includes(current)) {
				if (expectUnary && (current === '+' || current === '-')) {
					tokens.push(new Token(TokenType.UnaryOperator, current))
				} else {
					tokens.push(new Token(TokenType.Operator, current))
				}
				position++
				expectUnary = true
			} else if (this.isLetter(current)) {
				const word = this.parseWord(input, position)
				const type = this.isFunction(word.value)
					? TokenType.Function
					: this.isParameter(word.value)
					? TokenType.Parameter
					: TokenType.Variable
				tokens.push(new Token(type, word.value))
				position = word.position
				expectUnary = false
			} else if (current === '(') {
				tokens.push(new Token(TokenType.OpenParenthesis, current))
				position++
				expectUnary = true
			} else if (current === ')') {
				tokens.push(new Token(TokenType.CloseParenthesis, current))
				position++
				expectUnary = false
			} else if (this.isWhiteSpace(current)) {
				position++
			} else {
				throw new Error(`Unexpected character: ${current}`)
			}
		}

		return tokens
	}

	private parseNumber(
		input: string,
		position: number
	): { value: string; position: number } {
		const start = position
		while (
			position < input.length &&
			(this.isDigit(input[position]) || input[position] === ',')
		) {
			position++
		}
		return { value: input.substring(start, position), position: position }
	}

	private parseWord(
		input: string,
		position: number
	): { value: string; position: number } {
		const start = position
		while (
			position < input.length &&
			(this.isLetter(input[position]) ||
				this.isDigit(input[position]) ||
				input[position] === "'")
		) {
			position++
		}
		return { value: input.substring(start, position), position: position }
	}

	private isFunction(word: string): boolean {
		const functions = [
			'sqrt',
			'ln',
			'lg',
			'cos',
			'sin',
			'tg',
			'exp',
			'arcsin',
			'arccos',
		]
		return functions.includes(word)
	}

	private isParameter(word: string): boolean {
		const parameters = ['a']
		return parameters.includes(word)
	}

	private isDigit(char: string): boolean {
		return char >= '0' && char <= '9'
	}

	private isLetter(char: string): boolean {
		return (char >= 'a' && char <= 'z') || (char >= 'A' && char <= 'Z')
	}

	private isWhiteSpace(char: string): boolean {
		return char === ' ' || char === '\t' || char === '\n' || char === '\r'
	}
}

export class Task2 {
	private x0: number
	private x1: number
	private h: number
	private c0: number[]
	private c1: number[]
	private fTokens: Token[]
	private pTokens: Token[]
	private qTokens: Token[]
	private exactTokens: Token[]
	private solver: Solver

	constructor(
		f: string,
		x0: number,
		x1: number,
		exact: string,
		constr0: string,
		constr1: string,
		h: number,
		p: string,
		q: string
	) {
		const lexer = new Lexer()
		const parser = new Parser()
		this.solver = new Solver()
		this.fTokens = parser.toPostfix(lexer.run(f))
		this.pTokens = parser.toPostfix(lexer.run(p))
		this.qTokens = parser.toPostfix(lexer.run(q))
		this.exactTokens = parser.toPostfix(lexer.run(exact))
		const constr0Tokens = parser.toPostfix(lexer.run(constr0))
		this.c0 = this.solver.getConstraints(constr0Tokens)
		const constr1Tokens = parser.toPostfix(lexer.run(constr1))
		this.c1 = this.solver.getConstraints(constr1Tokens)
		this.x0 = x0
		this.x1 = x1
		this.h = h
	}

	printStringShooting(
		j: string,
		etaj: string,
		y: string,
		phietaj: string
	): string {
		const pad = 20
		let res = ''
		res += j.padEnd(pad)
		res += etaj.padEnd(pad)
		res += y.padEnd(pad)
		res += phietaj.padEnd(pad)
		res += '\n'
		return res
	}

	printStringFinite(k: string, xk: string, yk: string): string {
		const pad = 20
		let res = ''
		res += k.padEnd(pad)
		res += xk.padEnd(pad)
		res += yk.padEnd(pad)
		res += '\n'
		return res
	}

	rungeKuttaMethod(y0: number, z0: number): [number, number] {
		const n = Math.floor((this.x1 - this.x0) / this.h)
		let x = this.x0
		let y = y0
		let yPrev = y
		let z = z0
		let k = 0
		while (k < n) {
			const K: number[] = new Array(4)
			const L: number[] = new Array(4)
			for (let i = 0; i < 4; i++) {
				if (i === 0) {
					K[i] = this.h * z
					L[i] = this.h * this.solver.solve(this.fTokens, x, y, z)
				} else if (i === 1 || i === 2) {
					K[i] = this.h * (z + 0.5 * L[i - 1])
					L[i] =
						this.h *
						this.solver.solve(
							this.fTokens,
							x + 0.5 * this.h,
							y + 0.5 * K[i - 1],
							z + 0.5 * L[i - 1]
						)
				} else if (i === 3) {
					K[i] = this.h * (z + L[i - 1])
					L[i] =
						this.h *
						this.solver.solve(
							this.fTokens,
							x + this.h,
							y + K[i - 1],
							z + L[i - 1]
						)
				}
			}
			z += (K[0] + 2 * K[1] + 2 * K[2] + K[3]) / 6
			y += (L[0] + 2 * L[1] + 2 * L[2] + L[3]) / 6
			x += this.h
			k++
			yPrev = y
		}
		return [y, yPrev]
	}

	shootingMethod(): string {
		let res = 'Shooting method:\n\n'
		let eta1 = 1.0,
			eta2 = 0.8
		let y1 = this.rungeKuttaMethod(this.c0[2], eta1)
		let y2 = this.rungeKuttaMethod(this.c0[2], eta2)
		res += this.printStringShooting('j', 'η(j)', 'y', 'Ф(η(о))')
		res += '\n'
		let j = 0

		while (true) {
			res += this.printStringShooting(
				j.toString(),
				eta1.toString(),
				y1[0].toString(),
				''
			)

			const etaTmp = eta2
			eta2 -=
				((y2[0] - this.c1[2]) * (eta2 - eta1)) /
				(y2[0] - this.c1[2] - (y1[0] - this.c1[2]))
			eta1 = etaTmp
			y1 = this.rungeKuttaMethod(this.c0[2], eta1)
			y2 = this.rungeKuttaMethod(this.c0[2], eta2)
			j++
			if (Math.abs(y2[0] - this.c1[2]) < this.h / 10) {
				break
			}
		}
		res += this.printStringShooting(
			j.toString(),
			eta1.toString(),
			y1[0].toString(),
			''
		)
		res += this.printStringShooting(
			j.toString(),
			eta2.toString(),
			y2[0].toString(),
			''
		)
		res += '\ny = '
		const ans = this.rungeKuttaMethod(this.c0[2], eta2)[0]
		res += ans.toString()
		res += '\n'
		const y1_h = this.rungeKuttaMethod(this.c0[2], eta2)
		const h2 = this.h
		this.h = this.h / 2
		const y2_h = this.rungeKuttaMethod(this.c0[2], eta2)
		this.h = h2
		const y_h = y1_h[0]
		const y_2h = y2_h[0]
		const errorShooting = (y_h - y_2h) / (Math.pow(2, 4) - 1)
		res += `Estimated error using Runge-Romberg for Shooting Method: ${errorShooting}\n`
		res += '\n\n'

		return res
	}

	finiteDifferenceMethod(_h: number): Vector {
		const n = Math.floor((this.x1 - this.x0) / _h)
		const A = new Matrix(n + 1)
		const B = new Vector(n + 1)
		A.set(0, 0, this.c0[0] * _h - this.c1[0])
		A.set(0, 1, this.c1[0])
		B.set(0, _h * this.c0[2])
		let x = this.x0 + _h
		for (let i = 1; i < n; i++) {
			A.set(i, i + 1, 1 + (this.solver.solve(this.pTokens, x, 0, 0) * _h) / 2)
			A.set(i, i, -2 + _h * _h * this.solver.solve(this.qTokens, x, 0, 0))
			A.set(i, i - 1, 1 - (this.solver.solve(this.pTokens, x, 0, 0) * _h) / 2)
			B.set(i, _h * _h * 0)
			x += _h
		}
		A.set(n, n - 1, -1 * this.c1[1])
		A.set(n, n, this.c0[1] * _h + this.c1[1])
		B.set(n, _h * this.c1[2])

		return new Vector(thomasAlgorithm(A.getBuffer(), B.getBuffer()).x)
	}

	run(): string {
		let res = ''

		res += this.shootingMethod()
		res += 'Finite Difference method:\n\n'
		const ansFD = this.finiteDifferenceMethod(this.h)
		let x = this.x0
		res += this.printStringFinite('k', 'x(k)', 'y(k)')
		const n = Math.floor((this.x1 - this.x0) / this.h)
		for (let i = 0; i < ansFD.rows; i++) {
			res += this.printStringFinite(
				i.toString(),
				x.toString(),
				ansFD.get(i).toString()
			)
			x += this.h
		}

		const ansFD2 = this.finiteDifferenceMethod(this.h / 2)
		const n2 = Math.floor((this.x1 - this.x0) / (this.h / 2))
		const errorFinite = (ansFD.get(n) - ansFD2.get(n2)) / (Math.pow(2, 2) - 1)
		res += `Estimated error using Runge-Romberg for Finite Difference Method: ${errorFinite}\n\n`

		return res
	}
}
