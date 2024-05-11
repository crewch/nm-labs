import { Polynomial } from './lib'

export class Task4 {
	private readonly X: number[]
	private readonly fX: number[]
	private readonly xStar: number

	constructor(x: number[], y: number[], xStar: number) {
		this.X = x
		this.fX = y
		this.xStar = xStar
	}

	private static lagrangeInterpolation(x: number[], y: number[]): Polynomial {
		const n = x.length
		let interpolation = new Array(n).fill(0)
		for (let i = 0; i < n; i++) {
			let tmp: number[] = []
			let coef = y[i]
			for (let j = 0; j < n; j++) {
				if (i === j) continue
				tmp.push(-x[j])
				coef /= x[i] - x[j]
			}
			let expanded = Polynomial.openBrackets(tmp)
			for (let j = 0; j < n; j++) {
				interpolation[j] += coef * (expanded[j] || 0)
			}
		}
		return new Polynomial(interpolation)
	}

	public run(d: number): string {
		let res = ''
		const n = this.X.length
		let polynomials: Polynomial[] = []
		for (let i = 0; i <= n - d; i++) {
			let x: number[] = this.X.slice(i, i + d + 1)
			let y: number[] = this.fX.slice(i, i + d + 1)
			let poly = Task4.lagrangeInterpolation(x, y)

			for (let j = 1; j <= d; j++) {
				let tmp: number[] = []
				for (let k = 1; k < poly.getCoefficients().length; k++) {
					tmp.push(k * poly.getCoefficient(k))
				}
				poly = new Polynomial(tmp)
			}
			polynomials.push(poly)
		}

		let idx = this.X.findIndex(val => val >= this.xStar)
		idx = idx === -1 ? this.X.length - 1 : idx

		res += 'y'
		for (let i = 0; i < d; i++) {
			res += "'"
		}
		res += `(${this.xStar}) = `
		res += polynomials[Math.max(0, idx - 1)].calculate(this.xStar).toFixed(4)
		res += '\n\n'
		return res
	}
}
