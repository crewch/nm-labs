import { IMatrix, IVector } from '@/context/MatrixAndVectorContextProvider'

export const rotationTest = () => {
	const A: IMatrix = [
		[-7, -6, 8],
		[-6, 3, -7],
		[8, -7, 4],
	]

	const B: IVector = [0, 0, 0]

	return { A, B }
}

function transpose(matrix: IMatrix): IMatrix {
	const rows = matrix.length
	const cols = matrix[0].length
	const transposed: IMatrix = Array.from(
		{ length: cols },
		() => new Array(rows)
	)

	for (let i = 0; i < rows; i++) {
		for (let j = 0; j < cols; j++) {
			transposed[j][i] = matrix[i][j]
		}
	}

	return transposed
}

function multiplyMatrices(matrix1: IMatrix, matrix2: IMatrix): IMatrix {
	const result: IMatrix = []

	for (let i = 0; i < matrix1.length; i++) {
		result[i] = []

		for (let j = 0; j < matrix2[0].length; j++) {
			let sum = 0

			for (let k = 0; k < matrix1[0].length; k++) {
				sum += matrix1[i][k] * matrix2[k][j]
			}

			result[i][j] = sum
		}
	}

	return result
}

function identityMatrix(size: number): IMatrix {
	return Array.from({ length: size }, (_, i) =>
		Array.from({ length: size }, (_, j) => (i === j ? 1 : 0))
	)
}

function matrixEquals(matrix1: IMatrix, matrix2: IMatrix): boolean {
	for (let i = 0; i < matrix1.length; i++) {
		for (let j = 0; j < matrix1[0].length; j++) {
			if (matrix1[i][j] !== matrix2[i][j]) return false
		}
	}

	return true
}

function calculateT(matrix: IMatrix): number {
	let res = 0

	for (let i = 0; i < matrix.length - 1; i++) {
		for (let j = i + 1; j < matrix[i].length; j++) {
			res += matrix[i][j] * matrix[i][j]
		}
	}

	return Math.sqrt(res)
}

export function jacobiMethod(
	A: IMatrix,
	epsilon: number
): (IMatrix | IVector | string)[] {
	let res: (IMatrix | IVector | string)[] = []

	if (!matrixEquals(A, transpose(A))) {
		return ['Invalid matrix']
	}

	const n = A.length
	let k = 0
	let globalU = identityMatrix(n)
	while (calculateT(A) > epsilon) {
		let maxVal = 0
		let maxI = 0
		let maxJ = 0

		for (let i = 0; i < n - 1; i++) {
			for (let j = i + 1; j < n; j++) {
				if (Math.abs(A[i][j]) > Math.abs(maxVal)) {
					maxVal = A[i][j]

					maxI = i
					maxJ = j
				}
			}
		}

		let U = identityMatrix(n)
		let phiK

		if (A[maxI][maxI] !== A[maxJ][maxJ]) {
			phiK =
				0.5 * Math.atan((2 * A[maxI][maxJ]) / (A[maxI][maxI] - A[maxJ][maxJ]))
		} else {
			phiK = Math.PI / 4
		}

		U[maxI][maxJ] = -Math.sin(phiK)
		U[maxJ][maxI] = Math.sin(phiK)
		U[maxI][maxI] = Math.cos(phiK)
		U[maxJ][maxJ] = Math.cos(phiK)

		res.push(`Iteration ${k}: a[i,j]^(${k}) = ${maxVal}`)
		res.push(`Matrix U^${k}`)
		res.push(U.map(row => row.map(value => +value.toFixed(4))))

		let uT = transpose(U)
		let nextA = multiplyMatrices(multiplyMatrices(uT, A), U)

		for (let i = 0; i < n; i++) {
			for (let j = 0; j < n; j++) {
				A[i][j] = nextA[i][j]
			}
		}

		k++
		globalU = multiplyMatrices(globalU, U)

		res.push(`Matrix A^${k}`)
		res.push(A.map(row => row.map(value => +value.toFixed(4))))
		res.push(`t(A) after iteration ${k}: ${calculateT(A).toFixed(4)}`)
	}

	res.push('Matrix U:')
	res.push(globalU)
	res.push('Eigenvalues:')

	const eigenvalues: IVector = []

	for (let i = 0; i < n; i++) {
		eigenvalues.push(+A[i][i].toFixed(4))
	}
	res.push(eigenvalues)

	res.push('Eigenvectors:')

	const eigenvectors: IMatrix = []

	for (let i = 0; i < n; i++) {
		const row: number[] = []

		for (let j = 0; j < n; j++) {
			row.push(+globalU[j][i].toFixed(4))
		}

		eigenvectors.push(row)
	}

	res.push(eigenvectors)

	return res
}
