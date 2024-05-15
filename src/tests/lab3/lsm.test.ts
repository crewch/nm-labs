import { luDecomposition, solveLU } from '../lab1/lu-decomposition.test'
import { Matrix, Polynomial, Vector } from '../lib/lib'
// исправить решение из методички
export class Task3 {
	private readonly X: number[]
	private readonly fX: number[]

	constructor(x: number[], y: number[]) {
		this.X = x
		this.fX = y
	}

	private static str(value: number): string {
		return value.toFixed(4)
	}

	private static printString(i: string, xi: string, Fxi: string): string {
		const pad = 20
		let res = ''
		let value = i.padEnd(pad)
		res += value
		value = xi.padEnd(pad)
		res += value
		value = Fxi.padEnd(pad)
		res += value
		res += '\n'

		return res
	}

	public run(pow: number): [string, number[]] {
		let res = ''
		res += `LSM with pow = ${pow - 1}:\n\n`
		const n = this.X.length
		const Phi = new Matrix(n, pow)

		for (let i = 0; i < n; i++) {
			for (let j = 0; j < pow; j++) {
				Phi.set(i, j, Math.pow(this.X[i], j))
			}
		}

		const PhiT = Phi.transpose()
		const G = Matrix.multiplyMM(PhiT, Phi)
		const Y = new Vector(this.fX)
		const Z = Matrix.multiplyMV(PhiT, Y)

		const { LU, permutations } = luDecomposition(G.getBuffer())
		const { x } = solveLU(LU, permutations, Z.getBuffer())
		const ansV = new Vector(x)
		const ansL = Array.from({ length: ansV.rows }).map((_, i) => ansV.get(i))

		ansL.forEach((a, i) => {
			res += `a${i} = ${a} \n`
		})

		res += '\n'
		const poly = new Polynomial(ansL)
		let MSE = 0
		res += Task3.printString('i', 'xi', `F${pow - 1}(xi)`)
		res += '\n'

		for (let i = 0; i < n; i++) {
			const FpowXj = poly.calculate(this.X[i])
			res += Task3.printString(
				i.toString(),
				Task3.str(this.X[i]),
				Task3.str(FpowXj)
			)
			MSE += Math.pow(FpowXj - this.fX[i], 2)
		}

		res += '\n'
		res += poly.toString()
		res += `\n\nФ = ${MSE}\n\n`

		return [res, poly.getCoefficients()]
	}
}
