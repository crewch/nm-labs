export enum TokenType {
	Number,
	Variable,
	Operator,
	UnaryOperator,
	Function,
	Parameter,
	OpenParenthesis,
	CloseParenthesis,
}

export class Token {
	public type: TokenType
	public value: string
	public valueAsDouble?: number
	public priority: number

	constructor(type: TokenType, value: string) {
		this.type = type
		this.value = value
		this.priority = this.calculatePriority()

		if (type === TokenType.Number) {
			this.valueAsDouble = parseFloat(value)
		}
	}

	private calculatePriority(): number {
		if (
			this.type === TokenType.Function ||
			this.type === TokenType.UnaryOperator ||
			(this.type === TokenType.Operator && this.value === '^')
		) {
			return 3
		} else if (
			this.type === TokenType.Operator &&
			(this.value === '*' || this.value === '/')
		) {
			return 2
		} else if (
			this.type === TokenType.Operator &&
			(this.value === '+' || this.value === '-')
		) {
			return 1
		} else {
			return 0
		}
	}
}

export class Lexer {
	public run(input: string): Token[] {
		const tokens: Token[] = []
		let position = 0
		let expectUnary = true

		while (position < input.length) {
			const current = input[position]

			if (this.isDigitOrDot(current)) {
				const number = this.parseNumber(input, position)
				tokens.push(new Token(TokenType.Number, number))
				position += number.length
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
				position += word.length
				const type = this.determineTokenType(word)
				tokens.push(new Token(type, word))
				expectUnary = false
			} else if (current === '(' || current === ')') {
				tokens.push(
					new Token(
						current === '('
							? TokenType.OpenParenthesis
							: TokenType.CloseParenthesis,
						current
					)
				)
				position++
				expectUnary = current === '('
			} else if (/\s/.test(current)) {
				position++
			} else {
				throw new Error(`Unexpected character: ${current}`)
			}
		}

		return tokens
	}

	private isDigitOrDot(char: string): boolean {
		return /\d|\./.test(char)
	}

	private isLetter(char: string): boolean {
		return /[a-zA-Z]/.test(char)
	}

	private parseNumber(input: string, start: number): string {
		let position = start
		while (position < input.length && /\d|\./.test(input[position])) {
			position++
		}
		return input.substring(start, position)
	}

	private parseWord(input: string, start: number): string {
		let position = start
		while (position < input.length && /\w/.test(input[position])) {
			position++
		}
		return input.substring(start, position)
	}

	private determineTokenType(word: string): TokenType {
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
		if (functions.includes(word)) {
			return TokenType.Function
		}
		const parameters = ['a']
		if (parameters.includes(word)) {
			return TokenType.Parameter
		}
		return TokenType.Variable
	}
}

export class Parser {
	toPostfix(infix: Token[]): Token[] {
		const outputQueue: Token[] = []
		const operatorStack: Token[] = []

		infix.forEach(token => {
			switch (token.type) {
				case TokenType.Number:
				case TokenType.Parameter:
				case TokenType.Variable:
					outputQueue.push(token)
					break
				case TokenType.Function:
				case TokenType.UnaryOperator:
					operatorStack.push(token)
					break
				case TokenType.Operator:
					while (
						operatorStack.length > 0 &&
						operatorStack[operatorStack.length - 1].type !==
							TokenType.OpenParenthesis &&
						operatorStack[operatorStack.length - 1].priority >= token.priority
					) {
						outputQueue.push(operatorStack.pop()!)
					}
					operatorStack.push(token)
					break
				case TokenType.OpenParenthesis:
					operatorStack.push(token)
					break
				case TokenType.CloseParenthesis:
					while (
						operatorStack.length > 0 &&
						operatorStack[operatorStack.length - 1].type !==
							TokenType.OpenParenthesis
					) {
						outputQueue.push(operatorStack.pop()!)
					}
					operatorStack.pop()
					if (
						operatorStack.length > 0 &&
						operatorStack[operatorStack.length - 1].type === TokenType.Function
					) {
						outputQueue.push(operatorStack.pop()!)
					}
					break
			}
		})

		while (operatorStack.length > 0) {
			outputQueue.push(operatorStack.pop()!)
		}

		return outputQueue
	}
}

export class Solver {
	solve(tokens: Token[], x1: number, x2: number, a: number): number {
		const stack: number[] = []

		tokens.forEach(token => {
			if (token.type === TokenType.Number) {
				stack.push(token.valueAsDouble!)
			} else if (token.type === TokenType.Parameter) {
				stack.push(a)
			} else if (token.type === TokenType.Variable) {
				stack.push(this.getVariableValue(token, x1, x2))
			} else if (token.type === TokenType.Function) {
				this.applyFunction(stack, token)
			} else if (
				token.type === TokenType.Operator ||
				token.type === TokenType.UnaryOperator
			) {
				this.applyOperator(stack, token)
			}
		})

		return stack.pop()!
	}

	private getVariableValue(token: Token, x1: number, x2: number): number {
		if (token.value === 'x' || token.value === 'x1') {
			return x1
		} else if (token.value === 'y' || token.value === 'x2') {
			return x2
		}
		throw new Error(`Unrecognized variable: ${token.value}`)
	}

	private applyFunction(stack: number[], token: Token): void {
		const arg = stack.pop()!
		let result: number

		switch (token.value) {
			case 'sqrt':
				result = Math.sqrt(arg)
				break
			case 'ln':
				result = Math.log(arg)
				break
			case 'lg':
				result = Math.log10(arg)
				break
			case 'cos':
				result = Math.cos(arg)
				break
			case 'sin':
				result = Math.sin(arg)
				break
			case 'tg':
				result = Math.tan(arg)
				break
			case 'exp':
				result = Math.exp(arg)
				break
			case 'arcsin':
				result = Math.asin(arg)
				break
			case 'arccos':
				result = Math.acos(arg)
				break
			default:
				throw new Error(`Unrecognized function: ${token.value}`)
		}

		stack.push(result)
	}

	private applyOperator(stack: number[], token: Token): void {
		const right = stack.pop()!
		const left = stack.pop()!

		switch (token.value) {
			case '+':
				stack.push(left + right)
				break
			case '-':
				stack.push(left - right)
				break
			case '*':
				stack.push(left * right)
				break
			case '/':
				stack.push(left / right)
				break
			case '^':
				stack.push(Math.pow(left, right))
				break
			default:
				throw new Error(`Unrecognized operator: ${token.value}`)
		}
	}
}

export class Polynomial {
	private coefficients: number[]

	constructor(coefficients: number[] = []) {
		this.coefficients = coefficients
	}

	public size(): number {
		return this.coefficients.length
	}

	public getCoefficients() {
		return this.coefficients
	}

	public getCoefficient(index: number): number {
		return this.coefficients[index]
	}

	public calculate(x: number): number {
		let result = 0
		let currentPower = 1
		for (let coefficient of this.coefficients) {
			result += currentPower * coefficient
			currentPower *= x
		}

		return result
	}

	public static openBrackets(poly: number[]): number[] {
		if (!poly.length) return []
		const v = [...poly]

		if (v.length === 1) {
			return [v[0], 1]
		}

		const n = v.length
		const last = v.pop()!
		const res = Polynomial.openBrackets(v)
		const tmp = [...res]

		for (let i = 0; i < n; i++) {
			res[i] *= last
		}
		res.push(0)
		for (let i = 1; i <= n; i++) {
			res[i] += tmp[i - 1]
		}
		return res
	}

	private static str(value: number): string {
		return value.toFixed(4)
	}

	public toString(): string {
		let result = ''
		for (let i = this.coefficients.length - 1; i > 0; i--) {
			result +=
				(i === this.coefficients.length - 1
					? Polynomial.str(this.coefficients[i])
					: Polynomial.str(Math.abs(this.coefficients[i]))) +
				'*x^' +
				i +
				(this.coefficients[i - 1] >= 0 ? '+' : '-')
		}
		result += Polynomial.str(Math.abs(this.coefficients[0]))
		return result
	}
}

export interface Task1Args {
	y: string
	x: number[]
	xStar: number
}

export class Matrix {
	private buffer: number[][]

	constructor(n?: number, m?: number) {
		if (n !== undefined && m !== undefined) {
			this.buffer = Array.from({ length: n }, () => new Array(m).fill(0))
		} else if (n !== undefined) {
			this.buffer = Array.from({ length: n }, () => new Array(n).fill(0))
		} else {
			this.buffer = []
		}
	}

	public getBuffer(): number[][] {
		return this.buffer
	}

	public clone(): Matrix {
		const cloned = new Matrix()
		cloned.buffer = this.buffer.map(row => [...row])
		return cloned
	}

	public transpose(): Matrix {
		const n = this.rows
		const m = this.cols
		const res = new Matrix(m, n)
		for (let i = 0; i < n; i++) {
			for (let j = 0; j < m; j++) {
				res.set(j, i, this.buffer[i][j])
			}
		}
		return res
	}

	public get rows(): number {
		return this.buffer.length
	}

	public get cols(): number {
		return this.rows ? this.buffer[0].length : 0
	}

	public set(row: number, col: number, value: number): void {
		this.buffer[row][col] = value
	}

	public get(row: number, col: number): number {
		return this.buffer[row][col]
	}

	public add(other: Matrix): void {
		for (let i = 0; i < this.rows; i++) {
			for (let j = 0; j < this.cols; j++) {
				this.buffer[i][j] += other.get(i, j)
			}
		}
	}

	public multiply(coef: number): void {
		for (let i = 0; i < this.rows; i++) {
			for (let j = 0; j < this.cols; j++) {
				this.buffer[i][j] *= coef
			}
		}
	}

	public static multiplyMM(A: Matrix, B: Matrix): Matrix {
		if (A.cols !== B.rows) {
			throw new Error(
				'Columns of A must match rows of B to perform multiplication.'
			)
		}

		const res = new Matrix(A.rows, B.cols)
		for (let i = 0; i < A.rows; i++) {
			for (let j = 0; j < B.cols; j++) {
				let sum = 0
				for (let k = 0; k < B.rows; k++) {
					sum += A.get(i, k) * B.get(k, j)
				}
				res.set(i, j, sum)
			}
		}
		return res
	}

	public static multiplyMV(A: Matrix, B: Vector): Vector {
		if (A.cols !== B.rows) {
			throw new Error(
				'Matrix and Vector dimensions do not match for multiplication.'
			)
		}
		const res = new Vector(A.rows)
		for (let i = 0; i < A.rows; i++) {
			let sum = 0
			for (let k = 0; k < B.rows; k++) {
				sum += A.get(i, k) * B.get(k)
			}
			res.set(i, sum)
		}
		return res
	}

	public swapRows(first: number, second: number): void {
		for (let j = 0; j < this.cols; j++) {
			;[this.buffer[first][j], this.buffer[second][j]] = [
				this.buffer[second][j],
				this.buffer[first][j],
			]
		}
	}

	public swapCols(first: number, second: number): void {
		for (let i = 0; i < this.rows; i++) {
			;[this.buffer[i][first], this.buffer[i][second]] = [
				this.buffer[i][second],
				this.buffer[i][first],
			]
		}
	}

	public norm(): number {
		let max = 0
		for (let i = 0; i < this.rows; i++) {
			let sum = this.buffer[i].reduce((acc, val) => acc + Math.abs(val), 0)
			if (sum > max) {
				max = sum
			}
		}
		return max
	}

	public toString(): string {
		return this.buffer
			.map(row => row.map(value => value.toFixed(4).padEnd(10)).join(''))
			.join('\n')
	}
}

export class Vector {
	private buffer: number[]

	constructor(bufferOrSize?: number[] | number) {
		if (Array.isArray(bufferOrSize)) {
			this.buffer = [...bufferOrSize]
		} else if (typeof bufferOrSize === 'number') {
			this.buffer = new Array(bufferOrSize).fill(0)
		} else {
			this.buffer = []
		}
	}

	public getBuffer(): number[] {
		return this.buffer
	}

	public clone(): Vector {
		return new Vector(this.buffer)
	}

	public get(index: number): number {
		return this.buffer[index]
	}

	public set(index: number, value: number): void {
		this.buffer[index] = value
	}

	public get rows(): number {
		return this.buffer.length
	}

	public equals(other: Vector): boolean {
		if (this.rows !== other.rows) return false
		for (let i = 0; i < this.rows; i++) {
			if (this.buffer[i] !== other.get(i)) {
				return false
			}
		}
		return true
	}

	public add(other: Vector): void {
		for (let i = 0; i < this.rows; i++) {
			this.buffer[i] += other.get(i)
		}
	}

	public mul(coef: number): void {
		for (let i = 0; i < this.rows; i++) {
			this.buffer[i] *= coef
		}
	}

	public norm(): number {
		let max = 0
		for (let i = 0; i < this.rows; i++) {
			max = Math.max(max, Math.abs(this.buffer[i]))
		}
		return max
	}

	public static add(a: Vector, b: Vector): Vector {
		const result = a.clone()
		result.add(b)
		return result
	}

	public static multiply(a: Vector, coef: number): Vector {
		const result = a.clone()
		result.mul(coef)
		return result
	}

	public toString(): string {
		return this.buffer.map(x => x.toFixed(4).padEnd(18)).join('')
	}
}

export class CubicSpline {
	private readonly polynomials: Polynomial[]
	private readonly points: number[]

	constructor(points: number[], polynomials: Polynomial[]) {
		this.polynomials = polynomials
		this.points = points
	}

	size(): number {
		return this.polynomials.length
	}

	calculate(x: number): number {
		let idx = this.findClosestPointIndex(x)
		idx = Math.min(idx, this.points.length - 1) - 1
		idx = Math.max(0, idx)

		return this.polynomials[idx].calculate(x)
	}

	private findClosestPointIndex(x: number): number {
		let low = 0,
			high = this.points.length - 1,
			mid
		while (low <= high) {
			mid = Math.floor((low + high) / 2)
			if (this.points[mid] === x) return mid
			else if (this.points[mid] < x) low = mid + 1
			else high = mid - 1
		}
		return low
	}

	public getCubicSpline() {
		return { polynomials: this.polynomials, points: this.points }
	}

	toString(): string {
		let res = ''
		for (let i = 0; i < this.polynomials.length; i++) {
			res += `[${this.points[i]}; ${this.points[i + 1]}] ${
				this.polynomials[i]
			}\n`
		}

		return res
	}
}
