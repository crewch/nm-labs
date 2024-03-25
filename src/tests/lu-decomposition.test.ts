import { IMatrix, IVector } from '@/context/MatrixAndVectorContextProvider'
import { roundTo } from '@/utils/roundTo'

export const luTest = () => {
	const A: IMatrix = [
		[-7, 3, -4, 7],
		[8, -1, -7, 6],
		[9, 9, 3, -6],
		[-7, -9, -8, -5],
	]

	const B: IVector = [-126, 29, 27, 34]

	return { A, B }
}

export function separateLU(LU: IMatrix): { L: IMatrix; U: IMatrix } {
	const n = LU.length
	const L: IMatrix = Array.from({ length: n }, () => new Array(n).fill(0))
	const U: IMatrix = Array.from({ length: n }, () => new Array(n).fill(0))

	for (let i = 0; i < n; i++) {
		for (let j = 0; j < n; j++) {
			if (i > j) {
				L[i][j] = LU[i][j]
			} else if (i === j) {
				L[i][j] = 1
				U[i][j] = LU[i][j]
			} else {
				U[i][j] = LU[i][j]
			}
		}
	}
	return { L, U }
}

export function multiplyMatrices(A: IMatrix, B: IMatrix): IMatrix {
	const rowsA = A.length
	const colsA = A[0].length
	const rowsB = B.length
	const colsB = B[0].length
	const result: IMatrix = Array.from({ length: rowsA }, () =>
		new Array(colsB).fill(0)
	)

	if (colsA !== rowsB) {
		throw new Error('Matrices are not multipliable')
	}

	for (let i = 0; i < rowsA; i++) {
		for (let j = 0; j < colsB; j++) {
			for (let k = 0; k < colsA; k++) {
				result[i][j] += A[i][k] * B[k][j]
			}
			result[i][j] = result[i][j]
		}
	}
	return result
}

export function solveLU(LU: IMatrix, permutations: number[], b: number[]) {
	const n = LU.length
	const x: IVector = new Array(n).fill(0)
	const z: IVector = new Array(n).fill(0)

	for (let i = 0; i < n; i++) {
		z[i] = b[permutations[i]]
		for (let j = 0; j < i; j++) {
			z[i] -= LU[i][j] * z[j]
		}
		z[i] = z[i]
	}

	for (let i = n - 1; i >= 0; i--) {
		x[i] = z[i]
		for (let j = i + 1; j < n; j++) {
			x[i] -= LU[i][j] * x[j]
		}
		x[i] = x[i] / LU[i][i]
	}

	return { x, z }
}

export function determinant(LU: IMatrix): number {
	let det = 1
	for (let i = 0; i < LU.length; i++) {
		det *= LU[i][i]
	}
	return roundTo(det)
}

export function inverseMatrix(LU: IMatrix, permutations: number[]): IMatrix {
	const n = LU.length
	const inverse = Array.from({ length: n }, () => new Array(n).fill(0))

	for (let col = 0; col < n; col++) {
		const e = new Array(n).fill(0)
		e[col] = 1
		const { x: colSolutions } = solveLU(LU, permutations, e)

		for (let row = 0; row < n; row++) {
			inverse[row][col] = colSolutions[row]
		}
	}

	return inverse
}

export function luDecomposition(A: IMatrix): {
	LU: IMatrix
	permutations: number[]
} {
	const n = A.length
	const LU = A.map(row => [...row])
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
	return { LU, permutations }
}
