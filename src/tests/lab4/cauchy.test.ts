import { Parser, Token, TokenType } from '../lib/lib'

class Runge {
	public static run(y1: number, y2: number, p: number): number {
		return (y2 - y1) / (Math.pow(2, p) - 1)
	}
}

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

export class Task1 {
	private readonly x0: number
	private readonly x1: number
	private fTokens: Token[]
	private y0Tokens: Token[]
	private z0Tokens: Token[]
	private exactTokens: Token[]
	private readonly h: number
	private readonly solver: Solver

	constructor(
		f: string,
		x0: number,
		x1: number,
		y0: string,
		z0: string,
		exact: string,
		h: number
	) {
		const lexer = new Lexer()
		const parser = new Parser()
		this.solver = new Solver()
		this.fTokens = parser.toPostfix(lexer.run(f))
		this.y0Tokens = parser.toPostfix(lexer.run(y0))
		this.z0Tokens = parser.toPostfix(lexer.run(z0))
		this.exactTokens = parser.toPostfix(lexer.run(exact))
		this.x0 = x0
		this.x1 = x1
		this.h = h
	}

	private padRight(value: string, pad: number): string {
		return value.padEnd(pad)
	}

	public printStringEuler(
		k: string,
		x: string,
		y: string,
		dyk: string,
		yExact: string,
		epsK: string
	): string {
		const pad = 20
		return (
			[
				this.padRight(k, pad),
				this.padRight(x, pad),
				this.padRight(y, pad),
				this.padRight(dyk, pad),
				this.padRight(yExact, pad),
				this.padRight(epsK, pad),
			].join('') + '\n'
		)
	}

	public printStringRungeKutta(
		ki: string,
		xk: string,
		yki: string,
		kki: string,
		deltayk: string,
		thetaK: string,
		yExact: string,
		epsK: string
	): string {
		const pad = 20
		return (
			[
				this.padRight(ki, pad),
				this.padRight(xk, pad),
				this.padRight(yki, pad),
				this.padRight(kki, pad),
				this.padRight(deltayk, pad),
				this.padRight(thetaK, pad),
				this.padRight(yExact, pad),
				this.padRight(epsK, pad),
			].join('') + '\n'
		)
	}

	public printStringAdams(
		k: string,
		xk: string,
		yk: string,
		f: string,
		yExact: string,
		epsK: string
	): string {
		const pad = 20
		return (
			[
				this.padRight(k, pad),
				this.padRight(xk, pad),
				this.padRight(yk, pad),
				this.padRight(f, pad),
				this.padRight(yExact, pad),
				this.padRight(epsK, pad),
			].join('') + '\n'
		)
	}

	public eulerMethod(n: number): string {
		let res = 'Euler method:\n\n'
		res += this.printStringEuler('k', 'x', 'y', 'Δy(k)', 'y_exact', 'ε(k)')
		res += '\n'

		let x = this.x0
		let y = this.solver.solve(this.y0Tokens, 0, 0, 0)
		let z = this.solver.solve(this.z0Tokens, 0, 0, 0)
		let yExact = this.solver.solve(this.exactTokens, x, 0, 0)
		let k = 0

		while (k < n) {
			const dyk = this.h * this.solver.solve(this.fTokens, x, y, z)
			res += this.printStringEuler(
				k.toString(),
				x.toFixed(4),
				y.toFixed(4),
				dyk.toFixed(4),
				yExact.toFixed(4),
				Math.abs(yExact - y).toFixed(4)
			)

			z += dyk
			y += z * this.h
			x += this.h
			yExact = this.solver.solve(this.exactTokens, x, 0, 0)
			k++
		}

		yExact = this.solver.solve(this.exactTokens, this.x1, 0, 0)
		res += `Answer: ${y}`
		res += `\nRunge-Romberg Error: ${Runge.run(yExact, y, 1)}`
		return res
	}

	public rungeKuttaMethod(n: number): [string, number[][]] {
		let res = 'Runge-Kutta method (rank 4):\n\n'
		res += this.printStringRungeKutta(
			'k/i',
			'x(k)',
			'y_i(k)',
			'K_i(k)',
			'Δy(k)',
			'θ(k)',
			'y_exact',
			'ε(k)'
		)

		res += '\n'

		const table: number[][] = [[], [], []]

		let x = this.x0
		let y = this.solver.solve(this.y0Tokens, this.x0, 0, 0)
		let z = this.solver.solve(this.z0Tokens, this.x0, 0, 0)

		table[0].push(x)
		table[1].push(y)
		table[2].push(z)

		let yExact
		let k = 0

		while (k < n) {
			const K: number[] = new Array(4)
			const L: number[] = new Array(4)

			for (let i = 0; i < 4; i++) {
				let yk = y

				for (let j = 0; j < i; j++) {
					yk += 0.5 * K[j]
				}

				yExact = this.solver.solve(this.exactTokens, x, 0, 0)
				const epsK = Math.abs(y - yExact)

				if (i === 3) {
					K[i] = this.h * (z + L[i - 1])
					L[i] =
						this.h *
						this.solver.solve(
							this.fTokens,
							x + this.h,
							y + K[i - 1],
							z + L[i - 1]
						)

					const dyk = (K[0] + 2 * K[1] + 2 * K[2] + K[3]) / 6
					const thetaK = Math.abs((K[1] - K[2]) / (K[0] - K[1]))

					res += this.printStringRungeKutta(
						`${k}/${i + 1}`,
						(x + 0.5 * this.h * i).toFixed(4),
						(yk + 0.5 * K[i]).toFixed(4),
						K[i].toFixed(4),
						dyk.toFixed(4),
						thetaK.toFixed(4),
						'',
						''
					)

					res += '\n'
				} else {
					if (i === 0) {
						K[i] = this.h * z
						L[i] = this.h * this.solver.solve(this.fTokens, x, y, z)
					} else if (i === 1) {
						K[i] = this.h * (z + 0.5 * L[i - 1])
						L[i] =
							this.h *
							this.solver.solve(
								this.fTokens,
								x + 0.5 * this.h,
								y + 0.5 * K[i - 1],
								z + 0.5 * L[i - 1]
							)
					} else if (i === 2) {
						K[i] = this.h * (z + 0.5 * L[i - 1])
						L[i] =
							this.h *
							this.solver.solve(
								this.fTokens,
								x + 0.5 * this.h,
								y + 0.5 * K[i - 1],
								z + 0.5 * L[i - 1]
							)
					}

					res += this.printStringRungeKutta(
						`${k}/${i + 1}`,
						(x + 0.5 * this.h * i).toFixed(4),
						yk.toFixed(4),
						K[i].toFixed(4),
						'',
						'',
						yExact.toFixed(4),
						epsK.toFixed(4)
					)
				}
			}

			z += (K[0] + 2 * K[1] + 2 * K[2] + K[3]) / 6
			y += (L[0] + 2 * L[1] + 2 * L[2] + L[3]) / 6
			x += this.h
			table[0].push(x)
			table[1].push(y)
			table[2].push(z)
			k++
		}

		yExact = this.solver.solve(this.exactTokens, this.x1, 0, 0)
		res += `Answer: ${y}`
		res += `\nRunge-Romberg Error: ${Runge.run(yExact, y, 4)}`

		return [res, table]
	}

	public adamsMethod(n: number, table: number[][]): string {
		let res = 'Adams method (rank 4):\n\n'
		res += '\n'

		let k = 3

		while (k < table[0].length - 1) {
			table[2][k + 1] =
				table[2][k] +
				(this.h *
					(55 *
						this.solver.solve(
							this.fTokens,
							table[0][k],
							table[1][k],
							table[2][k]
						) -
						59 *
							this.solver.solve(
								this.fTokens,
								table[0][k - 1],
								table[1][k - 1],
								table[2][k - 1]
							) +
						37 *
							this.solver.solve(
								this.fTokens,
								table[0][k - 2],
								table[1][k - 2],
								table[2][k - 2]
							) -
						9 *
							this.solver.solve(
								this.fTokens,
								table[0][k - 3],
								table[1][k - 3],
								table[2][k - 3]
							))) /
					24

			table[1][k + 1] =
				table[1][k] +
				(this.h *
					(55 * table[2][k] -
						59 * table[2][k - 1] +
						37 * table[2][k - 2] -
						9 * table[2][k - 3])) /
					24
			k++
		}

		res += this.printStringAdams(
			'k',
			'x(k)',
			'y(k)',
			'f(x(k), y(k))',
			'y_exact',
			'ε(k)'
		)
		res += '\n'

		for (let i = 0; i < table[0].length; i++) {
			const f = this.solver.solve(
				this.fTokens,
				table[0][i],
				table[1][i],
				table[2][i]
			)
			const yExact1 = this.solver.solve(this.exactTokens, table[0][i], 0, 0)

			res += this.printStringAdams(
				i.toString(),
				table[0][i].toFixed(4),
				table[1][i].toFixed(4),
				f.toFixed(4),
				yExact1.toFixed(4),
				Math.abs(yExact1 - table[1][i]).toFixed(4)
			)
		}

		const y = table[1][table[0].length - 1]
		const yExact = this.solver.solve(this.exactTokens, this.x1, 0, 0)
		res += `\nAnswer: ${y}`
		res += `\nRunge-Romberg Error: ${Runge.run(yExact, y, 4)}`

		return res
	}

	public run(): string {
		let res = ''
		const n = Math.floor((this.x1 - this.x0) / this.h)
		res += this.eulerMethod(n)
		res += '\n\n'
		const [rungeKuttaRes, table] = this.rungeKuttaMethod(n)
		res += rungeKuttaRes
		res += '\n\n'
		res += this.adamsMethod(n, table)
		res += '\n\n'

		return res
	}
}
