import { IMatrix, IVector } from '@/context/MatrixAndVectorContextProvider'

export const iterationSeidelTest = () => {
	const A: IMatrix = [
		[28, 9, -3, -7],
		[-5, 21, -5, -3],
		[-8, 1, -16, 5],
		[0, -2, 5, 8],
	]

	const B: IVector = [-159, 63, -45, 24]

	return { A, B }
}

function multiplyMatrixVector(matrix: IMatrix, vector: IVector): IVector {
	return matrix.map(row =>
		row.reduce((sum, val, idx) => sum + val * vector[idx], 0)
	)
}

function subtractVectors(v1: IVector, v2: IVector): IVector {
	return v1.map((val, idx) => val - v2[idx])
}

function vectorNorm(v: IVector): number {
	return Math.sqrt(v.reduce((sum, val) => sum + val * val, 0))
}

function addVectors(v1: IVector, v2: IVector): IVector {
	return v1.map((val, index) => val + v2[index])
}

function getBaseLog(x: number, y: number) {
	return Math.log(y) / Math.log(x)
}
// TODO: переделать 2 метода как у Вани
export function simpleIterationMethodDetailedOutput(
	A: IMatrix,
	b: IVector,
	epsilon: number
) {
	let x: IVector = new Array(b.length).fill(0)
	let iterations = 0
	let error: number

	const alpha: IMatrix = A.map((row, i) =>
		row.map((value, j) => (i !== j ? +(-value / A[i][i]).toFixed(4) : 0))
	)
	const normAlpha = Math.max(
		...alpha.map(row => row.reduce((a, b) => Math.abs(a) + Math.abs(b), 0))
	)

	const beta: IVector = b.map((value, i) => +(value / A[i][i]).toFixed(4))
	const normBeta = vectorNorm(beta)

	const iterationsRes = []

	do {
		let nextX = addVectors(beta, multiplyMatrixVector(alpha, x))
		error = vectorNorm(subtractVectors(nextX, x))
		if (error < epsilon) break
		x = nextX

		iterationsRes.push(
			`x^(${iterations + 1}) = [${x.map(xi => xi.toFixed(3)).join(', ')}]^T`
		)
		// iterationsRes.push(
		// 	`x^(${iterations + 1}) = [${x
		// 		.map(xi => xi.toFixed(3))
		// 		.join(', ')}]^T, epsilon^(${iterations + 1}) = ${error.toFixed(
		// 		6
		// 	)} > ${epsilon.toFixed(6)}`
		// )

		iterations++
	} while (true)

	const K =
		(getBaseLog(10, epsilon) -
			getBaseLog(10, normBeta) +
			getBaseLog(10, 1 - normAlpha)) /
		getBaseLog(10, normAlpha)

	return {
		alpha,
		beta,
		normAlpha,
		epsilon,
		iterations,
		iterationsRes,
		x,
		K,
	}
}

const createZeroMatrix = (rows: number, cols: number): IMatrix => {
	return Array.from({ length: rows }, () => Array(cols).fill(0))
}

const createIdentityMatrix = (size: number): IMatrix => {
	return createZeroMatrix(size, size).map((row, i) => {
		row[i] = 1
		return row
	})
}

const subtractMatrices = (A: IMatrix, B: IMatrix): IMatrix => {
	return A.map((row, i) => row.map((val, j) => val - B[i][j]))
}

const multiplyMatrix = (A: IMatrix, B: IMatrix): IMatrix => {
	return A.map((row, i) =>
		B[0].map((_, j) => row.reduce((acc, _, n) => acc + A[i][n] * B[n][j], 0))
	)
}

const duplicateMatrix = (A: IMatrix): IMatrix => {
	return A.map(row => [...row])
}

const inverseMatrix = (A: IMatrix): IMatrix => {
	let I = createIdentityMatrix(A.length),
		C = duplicateMatrix(A)
	for (let i = 0; i < A.length; i++) {
		let e = C[i][i]
		if (e === 0) {
			for (let ii = i + 1; ii < A.length; ii++) {
				if (C[ii][i] !== 0) {
					let temp = C[i]
					C[i] = C[ii]
					C[ii] = temp
					temp = I[i]
					I[i] = I[ii]
					I[ii] = temp
					break
				}
			}
			e = C[i][i]
			if (e === 0) {
				return []
			}
		}
		for (let j = 0; j < A.length; j++) {
			C[i][j] = C[i][j] / e
			I[i][j] = I[i][j] / e
		}
		for (let ii = 0; ii < A.length; ii++) {
			if (ii === i) {
				continue
			}
			e = C[ii][i]
			for (let j = 0; j < A.length; j++) {
				C[ii][j] -= e * C[i][j]
				I[ii][j] -= e * I[i][j]
			}
		}
	}
	return I
}

const formatSeidelIteration = (
	iteration: number,
	x: IVector,
	epsilonValue: number
): string => {
	let formattedString = `x^(${iteration}) = (`
	formattedString += x.map(xi => xi.toFixed(3)).join(', ') + ')^T'
	// formattedString += `, epsilon^(${iteration}) = ${epsilonValue.toFixed(10)}`
	return formattedString
}

const calculateAPrioriEstimate = (
	normAlpha: number,
	normGamma: number,
	epsilon: number
): number => {
	if (normAlpha >= 1) {
		throw new Error(
			'Alpha norm must be less than 1 for a priori estimate to be valid.'
		)
	}

	return Math.ceil(Math.log(epsilon / normGamma) / Math.log(normAlpha)) + 1
}

// TODO: переделать 2 метода как у Вани
export const prepareSeidel = (A: IMatrix, b: IVector, epsilon: number) => {
	const n = A.length
	let B = createZeroMatrix(n, n)
	let C = createZeroMatrix(n, n)
	let beta = Array(n).fill(0)

	for (let i = 0; i < n; i++) {
		beta[i] = b[i] / A[i][i]
		for (let j = 0; j < n; j++) {
			if (i !== j) {
				const value = -(A[i][j] / A[i][i])
				if (i > j) {
					B[i][j] = value
				} else {
					C[i][j] = value
				}
			}
		}
	}

	const E = createIdentityMatrix(B.length)

	const E_minus_B = subtractMatrices(E, B)

	const inverse_E_minus_B = inverseMatrix(E_minus_B)

	const alpha = multiplyMatrix(inverse_E_minus_B, C)
	const normAlpha = Math.max(
		...alpha.map(row => row.reduce((a, b) => Math.abs(a) + Math.abs(b), 0))
	)

	const gamma = multiplyMatrixVector(inverse_E_minus_B, beta)
	const normGamma = vectorNorm(gamma)

	const aPrioriEstimate = calculateAPrioriEstimate(
		normAlpha,
		normGamma,
		epsilon
	)

	let x: IVector = new Array(n).fill(0)
	let converge = false
	let iterations = 0
	let iterationDetails = []

	while (!converge) {
		iterations++
		let x_new: IVector = [...x]
		let maxDiff = 0

		for (let i = 0; i < n; i++) {
			let sum1 = 0
			let sum2 = 0
			for (let j = 0; j < i; j++) {
				sum1 += A[i][j] * x_new[j]
			}
			for (let j = i + 1; j < n; j++) {
				sum2 += A[i][j] * x[j]
			}
			x_new[i] = (b[i] - sum1 - sum2) / A[i][i]
			maxDiff = Math.max(maxDiff, Math.abs(x_new[i] - x[i]))
		}

		converge = maxDiff < epsilon
		x = x_new

		iterationDetails.push(formatSeidelIteration(iterations, x, maxDiff))
	}

	return {
		B,
		C,
		alpha,
		normAlpha,
		beta,
		gamma,
		epsilon,
		x,
		iterations,
		iterationDetails,
		aPrioriEstimate,
	}
}
