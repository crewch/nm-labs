import { Matrix } from '../lib/Matrix'
import { Vector } from '../lib/Vector'

export const luTest = () => {
	const A = [
		[-7, 3, -4, 7],
		[8, -1, -7, 6],
		[9, 9, 3, -6],
		[-7, -9, -8, -5],
	]

	const B = [-126, 29, 27, 34]

	return { A, B }
}

export function separateLU(LU: Matrix): { L: Matrix; U: Matrix } {
	const n = LU.rows
	const L: number[][] = Array.from({ length: n }, () => new Array(n).fill(0))
	const U: number[][] = Array.from({ length: n }, () => new Array(n).fill(0))

	for (let i = 0; i < n; i++) {
		for (let j = 0; j < n; j++) {
			if (i > j) {
				L[i][j] = LU.get(i, j)
			} else if (i === j) {
				L[i][j] = 1
				U[i][j] = LU.get(i, j)
			} else {
				U[i][j] = LU.get(i, j)
			}
		}
	}

	const matrixL = new Matrix()
	matrixL.setBuffer(L)
	const matrixU = new Matrix()
	matrixU.setBuffer(U)

	return { L: matrixL, U: matrixU }
}

export function multiplyMatrices(A: Matrix, B: Matrix): Matrix {
	const rowsA = A.rows
	const colsA = A.cols
	const rowsB = B.rows
	const colsB = B.cols
	const result: number[][] = Array.from({ length: rowsA }, () =>
		new Array(colsB).fill(0)
	)

	if (colsA !== rowsB) {
		throw new Error('Matrices are not multipliable')
	}

	for (let i = 0; i < rowsA; i++) {
		for (let j = 0; j < colsB; j++) {
			for (let k = 0; k < colsA; k++) {
				result[i][j] += A.get(i, k) * B.get(k, j)
			}
			result[i][j] = result[i][j]
		}
	}

	const matrix = new Matrix()
	matrix.setBuffer(result)

	return matrix
}

export function solveLU(LU: Matrix, permutations: number[], b: Vector) {
	const n = LU.rows
	const x: number[] = new Array(n).fill(0)
	const z: number[] = new Array(n).fill(0)

	for (let i = 0; i < n; i++) {
		z[i] = b.get(permutations[i])
		for (let j = 0; j < i; j++) {
			z[i] -= LU.get(i, j) * z[j]
		}
	}

	for (let i = n - 1; i >= 0; i--) {
		x[i] = z[i]
		for (let j = i + 1; j < n; j++) {
			x[i] -= LU.get(i, j) * x[j]
		}
		x[i] = x[i] / LU.get(i, i)
	}

	return { x: new Vector(x), z: new Vector(z) }
}

export function determinant(LU: Matrix): number {
	let det = 1

	for (let i = 0; i < LU.rows; i++) {
		det *= LU.get(i, i)
	}

	return +det.toFixed(4)
}

export function inverseMatrix(LU: Matrix, permutations: number[]) {
	const n = LU.rows
	const inverse: number[][] = Array.from({ length: n }, () =>
		new Array(n).fill(0)
	)

	for (let col = 0; col < n; col++) {
		const e: number[] = new Array(n).fill(0)
		e[col] = 1
		const { x: colSolutions } = solveLU(LU, permutations, new Vector(e))

		for (let row = 0; row < n; row++) {
			inverse[row][col] = colSolutions.get(row)
		}
	}

	const newMatrix = new Matrix()
	newMatrix.setBuffer(inverse)

	return newMatrix
}

export function luDecomposition(A: Matrix): {
	LU: Matrix
	permutations: number[]
} {
	const n = A.rows
	const LU = A.getBuffer().map(row => [...row])
	const permutations: number[] = Array.from({ length: n }, (_, i) => i)

	for (let col = 0; col < n; col++) {
		let maxIdx = col
		for (let row = col + 1; row < n; row++) {
			if (Math.abs(LU[row][col]) > Math.abs(LU[maxIdx][col])) {
				maxIdx = row
			}
		}
		if (maxIdx !== col) {
			;[LU[maxIdx], LU[col]] = [LU[col], LU[maxIdx]]
			;[permutations[maxIdx], permutations[col]] = [
				permutations[col],
				permutations[maxIdx],
			]
		}

		for (let row = col + 1; row < n; row++) {
			const factor = LU[row][col] / LU[col][col]
			LU[row][col] = factor
			for (let j = col + 1; j < n; j++) {
				LU[row][j] -= factor * LU[col][j]
			}
		}
	}

	const matrixLU = new Matrix()
	matrixLU.setBuffer(LU)

	return { LU: matrixLU, permutations }
}
