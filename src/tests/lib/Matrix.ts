import { Vector } from './Vector'

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

	public setBuffer(matrix: number[][]) {
		this.buffer = matrix
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

	public static subtractMatrices(A: Matrix, B: Matrix) {
		return A.buffer.map((row, i) => row.map((val, j) => val - B.get(i, j)))
	}

	public duplicateMatrix = (A: Matrix): Matrix => {
		const newMatrix = new Matrix()
		newMatrix.setBuffer(A.buffer.map(row => [...row]))

		return newMatrix
	}
}
