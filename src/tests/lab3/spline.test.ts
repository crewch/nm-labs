import { thomasAlgorithm } from '../lab1/tma.test'
import { Matrix, Vector, Polynomial, CubicSpline } from '../lib/lib'

export class Task2 {
	private X: number[]
	private fX: number[]
	private readonly xStar: number

	constructor(x: number[], fX: number[], xStar: number) {
		this.X = x
		this.fX = fX
		this.xStar = xStar
	}

	private static str(value: number): string {
		return value.toFixed(4)
	}

	private static printString(
		i: string,
		range: string,
		ai: string,
		bi: string,
		ci: string,
		di: string
	): string {
		const pad = 20

		return `${i.padEnd(pad)}${range.padEnd(pad)}${ai.padEnd(pad)}${bi.padEnd(
			pad
		)}${ci.padEnd(pad)}${di.padEnd(pad)}\n`
	}

	public run(): [string, { polynomials: number[][]; points: number[] }] {
		let res = ''
		const n = this.X.length - 1
		const a = new Vector(n)
		const b = new Vector(n)
		const c = new Vector(n)
		const d = new Vector(n)
		const h = new Vector(n)

		for (let i = 0; i < n; i++) {
			h.set(i, this.X[i + 1] - this.X[i])
		}

		const A = new Matrix(n - 1)
		const B = new Vector(n - 1)

		for (let i = 0; i < n - 1; i++) {
			if (i > 0) {
				A.set(i, i - 1, h.get(i))
			}

			A.set(i, i, 2 * (h.get(i) + h.get(i + 1)))

			if (i < n - 2) {
				A.set(i, i + 1, h.get(i + 1))
			}

			B.set(
				i,
				3 *
					((this.fX[i + 2] - this.fX[i + 1]) / h.get(i + 1) -
						(this.fX[i + 1] - this.fX[i]) / h.get(i))
			)
		}

		const { x } = thomasAlgorithm(A.getBuffer(), B.getBuffer())
		const s = new Vector(x)

		for (let i = 1; i < n; i++) {
			c.set(i, s.get(i - 1))
		}

		for (let i = 0; i < n; i++) {
			a.set(i, this.fX[i])

			if (i < n - 1) {
				b.set(
					i,
					(this.fX[i + 1] - this.fX[i]) / h.get(i) -
						(h.get(i) / 3) * (c.get(i + 1) + 2 * c.get(i))
				)
			}

			if (i > 0) {
				d.set(i - 1, (c.get(i) - c.get(i - 1)) / (3 * h.get(i - 1)))
			}
		}

		b.set(
			n - 1,
			(this.fX[n] - this.fX[n - 1]) / h.get(n - 1) -
				(2 / 3) * h.get(n - 1) * c.get(n - 1)
		)

		d.set(n - 1, -c.get(n - 1) / (3 * h.get(n - 1)))

		res += Task2.printString('i', '[x_i-1, x_i]', 'ai', 'bi', 'ci', 'di')

		for (let i = 0; i < n; i++) {
			res += Task2.printString(
				(i + 1).toString(),
				`[${i}, ${i + 1}]`,
				Task2.str(a.get(i)),
				Task2.str(b.get(i)),
				Task2.str(c.get(i)),
				Task2.str(d.get(i))
			)
		}

		const polynomials: Polynomial[] = []

		for (let i = 0; i < n; i++) {
			const ansV: number[] = [a.get(i), 0, 0, 0]
			const tmp: number[] = []
			const coefs: number[] = [a.get(i), b.get(i), c.get(i), d.get(i)]

			for (let j = 1; j < 4; j++) {
				tmp.push(-this.X[i])
				const tmp1 = Polynomial.openBrackets(tmp)

				for (let k = 0; k < tmp1.length; k++) {
					ansV[k] += tmp1[k] * coefs[j]
				}
			}

			polynomials.push(new Polynomial(ansV))
		}

		const spline = new CubicSpline(this.X, polynomials)

		res += `\n${spline.toString()}\n${spline
			.calculate(this.xStar)
			.toFixed(6)}\n`
		// todo исправить график без лишних точек(гладкий)
		const splineRes = spline.getCubicSpline()

		return [
			res,
			{
				points: splineRes.points,
				polynomials: splineRes.polynomials.map(item => item.getCoefficients()),
			},
		]
	}
}
