import { Solver, Token } from '../lib/lib'
// выводить оценку погрешности
export class Task5 {
	private readonly X: number[]
	private functionTokens: Token[]
	private readonly solver: Solver

	constructor(x: number[], functionTokens: Token[]) {
		this.X = x
		this.functionTokens = functionTokens
		this.solver = new Solver()
	}

	private static str(value: number): string {
		return value.toFixed(4)
	}

	private static printString(
		i: string,
		xi: string,
		yi: string,
		rect: string,
		trp: string,
		simp: string
	): string {
		const pad = 20
		let res = ''
		res += i.padEnd(pad)
		res += xi.padEnd(pad)
		res += yi.padEnd(pad)
		res += rect.padEnd(pad)
		res += trp.padEnd(pad)
		res += simp.padEnd(pad)
		res += '\n'

		return res
	}

	public runge(
		s1: number,
		s2: number,
		h1: number,
		h2: number,
		p: number
	): number {
		return s1 + (s1 - s2) / (Math.pow(h2 / h1, p) - 1)
	}

	public integrate(h: number): [string, number[][]] {
		let res = `h = ${h}:\n\n`
		let sum = 0
		let X0 = this.X[0]

		let range = Math.ceil((this.X[1] - this.X[0]) / h) + 1
		let iter = 0
		let table = Array.from(Array(range), () => new Array(5).fill(0))

		while (X0 <= this.X[1]) {
			table[iter][0] = X0
			table[iter][1] = this.solver.solve(this.functionTokens, X0, 0, 0)
			X0 += h
			iter++
		}

		X0 = this.X[0]
		iter = 0

		while (X0 <= this.X[1]) {
			table[iter][2] = sum
			sum += this.solver.solve(this.functionTokens, (2 * X0 + h) / 2, 0, 0) * h
			X0 += h
			iter++
		}

		X0 = this.X[0]
		iter = 0
		sum = 0

		while (X0 <= this.X[1]) {
			table[iter][3] = sum / 2
			sum +=
				(this.solver.solve(this.functionTokens, X0 + h, 0, 0) +
					this.solver.solve(this.functionTokens, X0, 0, 0)) *
				h
			X0 += h
			iter++
		}

		X0 = this.X[0]
		iter = 0
		sum = 0

		while (X0 <= this.X[1]) {
			if (iter % 2 !== 0) {
				iter++
				continue
			}

			table[iter][4] = sum / 3
			sum +=
				(this.solver.solve(this.functionTokens, X0, 0, 0) +
					4 * this.solver.solve(this.functionTokens, X0 + h, 0, 0) +
					this.solver.solve(this.functionTokens, X0 + 2 * h, 0, 0)) *
				h
			X0 += 2 * h
			iter++
		}

		res += Task5.printString(
			'i',
			'xi',
			'yi',
			'Rectangles',
			'Trapezoids',
			'Simpson'
		)

		for (let i = 0; i < range; i++) {
			res += Task5.printString(
				i.toString(),
				Task5.str(table[i][0]),
				Task5.str(table[i][1]),
				Task5.str(table[i][2]),
				Task5.str(table[i][3]),
				Task5.str(table[i][4])
			)
		}

		return [res, table]
	}

	public run(h1: number, h2: number): string {
		let res = ''

		const [res1, table1] = this.integrate(h1)
		res += res1
		const [res2, table2] = this.integrate(h2)
		res += '\n' + res2 + '\n'
		res += 'Runge method:\n'
		const range1 = Math.ceil((this.X[1] - this.X[0]) / h1)
		const range2 = Math.ceil((this.X[1] - this.X[0]) / h2)
		res += `Rectangles: ${this.runge(
			table1[range1][2],
			table2[range2][2],
			h1,
			h2,
			2
		)}\n`
		res += `Trapezoids: ${this.runge(
			table1[range1][3],
			table2[range2][3],
			h1,
			h2,
			2
		)}\n`
		res += `Simpson: ${this.runge(
			table1[range1][4],
			table2[range2][4],
			h1,
			h2,
			2
		)}\n`

		return res
	}
}
