import { thomasAlgorithm } from '../lab1/tma.test'
import { Matrix } from '../lib/Matrix'
import { Vector } from '../lib/Vector'
import { Token, TokenType, Parser } from '../lib/lib'

class Solver {
	constructor() {}

	public solve(f: Token[], x1: number, x2: number, x3: number): number {
		const stack: number[] = []

		for (const token of f) {
			if (token.type === TokenType.Number && token.valueAsDouble) {
				stack.push(token.valueAsDouble)
			} else if (token.type === TokenType.Variable) {
				if (token.value === 'x' || token.value === 'x1') {
					stack.push(x1)
				} else if (token.value === 'y' || token.value === 'x2') {
					stack.push(x2)
				} else if (token.value === "y'" || token.value === 'z') {
					stack.push(x3)
				}
			} else if (token.type === TokenType.Function) {
				let funcRes = 0
				const tmp = stack.pop()!

				switch (token.value) {
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
			} else if (token.type === TokenType.Operator) {
				const tmp2 = stack.pop()!
				const tmp1 = stack.pop()!

				switch (token.value) {
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
						if (tmp2 === 0) return 0
						stack.push(tmp1 / tmp2)
						break
					case '^':
						stack.push(Math.pow(tmp1, tmp2))
						break
				}
			} else if (token.type === TokenType.UnaryOperator) {
				let tmp = stack.pop()!

				if (token.value === '-') {
					tmp *= -1
				}

				stack.push(tmp)
			}
		}
		return stack[stack.length - 1]
	}

	public getConstraints(tokens: Token[]): number[] {
		const constraints: number[] = [0, 0, 0]
		const stack: Token[] = []

		for (const token of tokens) {
			if (
				token.type === TokenType.Variable ||
				token.type === TokenType.Number
			) {
				stack.push(token)
			} else if (token.type === TokenType.Operator) {
				if (token.value === '=') {
					const c = stack.pop()!.valueAsDouble

					if (c) {
						constraints[2] = c
					}

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
					const constr = stack.pop()!.valueAsDouble

					if (constr) {
						if (rank.value === 'y') {
							constraints[0] = constr
						} else {
							constraints[1] = constr
						}
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

				if (token.value === '-' && tmp.valueAsDouble) {
					tmp.value = token.value + tmp.value
					tmp.valueAsDouble *= -1
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
	private readonly x0: number
	private readonly x1: number
	private h: number
	private c0: number[]
	private c1: number[]
	private fTokens: Token[]
	private pTokens: Token[]
	private qTokens: Token[]
	private exactTokens: Token[]
	private solver: Solver

	public static readonly p = 4
	public readonly a = [0, 0, 0.5, 0.5, 1]
	public readonly b = [[], [0], [0, 0.5], [0, 0, 0.5], [0, 0, 0, 0.5]]
	public readonly c = [0, 1.0 / 6, 1.0 / 3, 1.0 / 3, 1.0 / 6]

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

	private printStringShooting(
		j: string,
		etaj: string,
		phietaj: string
	): string {
		const pad = 20

		return `${j.padEnd(pad)}${etaj.padEnd(pad)}${phietaj.padEnd(pad)}\n`
	}

	private printStringFinite(k: string, xk: string, yk: string): string {
		const pad = 20

		return `${k.padEnd(pad)}${xk.padEnd(pad)}${yk.padEnd(pad)}\n`
	}

	public rungeRomberg(
		i1: number,
		i2: number,
		h1: number,
		h2: number,
		p: number
	): number {
		const k = h2 / h1

		return (i1 - i2) / (Math.pow(k, p) - 1)
	}

	public makeArgs(
		x: number,
		y: number[],
		addX: number,
		addY: number
	): number[] {
		const res = [x + addX]

		return res.concat(y.map(val => val + addY))
	}

	public dy1(x: number[]): number {
		return x[2]
	}

	public rungeKutta(yk: number[], l: number, r: number, h: number): number[][] {
		const n = yk.length
		const res: number[][] = Array.from({ length: n }, (_, i) => [yk[i]])

		for (let x = l; x <= r - h; x += h) {
			const y = res.map(list => list[list.length - 1])

			const K: number[] = new Array(Task2.p + 1).fill(0)

			for (let idx = 0; idx < n; idx++) {
				if (idx === 0) {
					K[1] = h * this.dy1(this.makeArgs(x, y, 0, 0))
				} else {
					const args = this.makeArgs(x, y, 0, 0)

					K[1] = h * this.solver.solve(this.fTokens, args[0], args[1], args[2])
				}

				for (let i = 2; i <= Task2.p; i++) {
					let add = 0

					for (let j = 1; j <= i - 1; j++) add += this.b[i][j] * K[j]

					if (idx === 0) {
						K[i] = h * this.dy1(this.makeArgs(x, y, this.a[i] * h, add))
					} else {
						const args = this.makeArgs(x, y, this.a[i] * h, add)

						K[i] =
							h * this.solver.solve(this.fTokens, args[0], args[1], args[2])
					}
				}
				const delta = this.c
					.slice(1)
					.map((ci, i) => ci * K[i + 1])
					.reduce((sum, val) => sum + val, 0)
				res[idx].push(res[idx][res[idx].length - 1] + delta)
			}
		}

		return res
	}

	public shootingMethod(
		a: number,
		b: number,
		alpha: number[],
		beta: number[],
		ya: number,
		yb: number,
		h: number
	): number[] {
		const eps = 0.00001

		const phi = (eta: number): number => {
			const args =
				Math.abs(beta[0]) > eps
					? [eta, (ya - alpha[0] * eta) / beta[0]]
					: [ya / alpha[0], eta]

			const yk = this.rungeKutta(args, a, b, h)

			return (
				alpha[1] * yk[0][yk[0].length - 1] +
				beta[1] * yk[1][yk[1].length - 1] -
				yb
			)
		}

		let n0 = 10,
			n1 = -1
		let phi0 = phi(n0)
		let phi1 = phi(n1)
		let n: number

		while (true) {
			n = n1 - ((n1 - n0) / (phi1 - phi0)) * phi1

			const phij = phi(n)

			if (Math.abs(phij) < eps) break

			n0 = n1
			n1 = n
			phi0 = phi1
			phi1 = phij
		}

		const args2 =
			Math.abs(beta[0]) > eps
				? [n, (ya - alpha[0] * n) / beta[0]]
				: [ya / alpha[0], n]

		const res = this.rungeKutta(args2, a, b, h)

		return res[0]
	}

	public finiteDifferenceMethod(_h: number): Vector {
		const n = Math.floor((this.x1 - this.x0) / _h)
		const A = new Matrix(n + 1)
		const B = new Vector(n + 1)

		A.set(0, 0, this.c0[0] * _h - this.c1[0])
		A.set(0, 1, this.c1[0])
		B.set(0, _h * this.c0[2])

		let x = this.x0 + _h

		for (let i = 1; i < n; i++) {
			const pValue = this.solver.solve(this.pTokens, x, 0, 0)
			const qValue = this.solver.solve(this.qTokens, x, 0, 0)

			A.set(i, i + 1, 1 + (pValue * _h) / 2)
			A.set(i, i, -2 + _h * _h * qValue)
			A.set(i, i - 1, 1 - (pValue * _h) / 2)
			B.set(i, 0)
			x += _h
		}

		A.set(n, n - 1, -this.c1[1])
		A.set(n, n, this.c0[1] * _h + this.c1[1])
		B.set(n, _h * this.c1[2])

		return new Vector(thomasAlgorithm(A.getBuffer(), B.getBuffer()).x)
	}

	public run(): string {
		let res = ''

		res += 'Shooting method\n\n'

		const h1 = this.h
		const y1 = this.shootingMethod(
			this.x0,
			this.x1,
			[this.c0[0], this.c0[1]],
			[this.c1[0], this.c1[1]],
			this.c0[2],
			this.c1[2],
			h1
		)

		res += this.printStringShooting('k', 'x(x)', 'y(k)')
		let xk = this.x0

		for (let i = 0; i < y1.length; i++) {
			res += this.printStringShooting(
				i.toString(),
				xk.toFixed(4),
				y1[i].toFixed(4)
			)
			xk += this.h
		}
		res += '\n'

		const h2 = this.h / 2
		const y2 = this.shootingMethod(
			this.x0,
			this.x1,
			[this.c0[0], this.c0[1]],
			[this.c1[0], this.c1[1]],
			this.c0[2],
			this.c1[2],
			h2
		)
		const errorShooting =
			this.rungeRomberg(y1[y1.length - 1], y2[y2.length - 1], h1, h2, 4) /
			(Math.pow(2, 2) - 1)
		res += `Estimated error using Runge-Romberg for Shooting Method: ${errorShooting}\n\n`

		res += 'Finite Difference method:\n\n'
		const ansFD = this.finiteDifferenceMethod(this.h)

		let x = this.x0
		res += this.printStringFinite('k', 'x(k)', 'y(k)')
		const n = Math.floor((this.x1 - this.x0) / this.h)
		for (let i = 0; i < ansFD.rows; i++) {
			res += this.printStringFinite(
				i.toString(),
				x.toFixed(4),
				ansFD.get(i).toFixed(4)
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
