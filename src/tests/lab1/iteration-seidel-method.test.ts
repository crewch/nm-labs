type IMatrix = number[][]
type IVector = number[]

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

function createAlphaAndBeta(
	A: IMatrix,
	b: IVector
): { alpha: IMatrix; beta: IVector } {
	const n = A.length
	let alpha: IMatrix = Array.from({ length: n }, () => Array(n).fill(0))
	let beta: IVector = Array(n)

	for (let i = 0; i < n; i++) {
		for (let j = 0; j < n; j++) {
			if (i !== j) {
				alpha[i][j] = -(A[i][j] / A[i][i])
			}
		}
		beta[i] = b[i] / A[i][i]
	}

	return { alpha, beta }
}

function vectorNorm(vector: IVector): number {
	return Math.sqrt(vector.reduce((sum, value) => sum + value * value, 0))
}

function matrixNorm(matrix: IMatrix): number {
	return Math.max(
		...matrix.map(row => row.reduce((sum, value) => sum + Math.abs(value), 0))
	)
}

function multiplyMatrixVector(matrix: IMatrix, vector: IVector): IVector {
	return matrix.map(row =>
		row.reduce((sum, value, i) => sum + value * vector[i], 0)
	)
}

function addVectors(v1: IVector, v2: IVector): IVector {
	return v1.map((value, i) => value + v2[i])
}

function subtractVectors(v1: IVector, v2: IVector): IVector {
	return v1.map((value, i) => value - v2[i])
}

export function simpleIterationMethod(A: IMatrix, b: IVector, epsilon: number) {
	const { alpha, beta } = createAlphaAndBeta(A, b)
	const normAlpha = matrixNorm(alpha)
	const betaNorm = vectorNorm(beta)

	let cond = normAlpha < 1
	let estK =
		(Math.log10(epsilon) - Math.log10(betaNorm) + Math.log10(1 - normAlpha)) /
		Math.log10(normAlpha)

	let x: IVector = [...beta]
	let prevX: IVector = [...beta]
	let K = 0
	let epsilonK = epsilon + 1

	const iterations: { iteration: number; x: number[]; epsilonK: number }[] = []
	while (epsilonK > epsilon) {
		x = addVectors(beta, multiplyMatrixVector(alpha, prevX))
		let coef = Math.pow(normAlpha, K) / (1 - normAlpha)
		let normDiffXk = vectorNorm(subtractVectors(x, prevX))
		epsilonK = cond ? coef * normDiffXk : normDiffXk
		K++

		iterations.push({
			iteration: K,
			x: x.map(value => Math.round(value * 1000) / 1000),
			epsilonK,
		})

		if (K > estK) {
			break
		}

		prevX = [...x]
	}

	return {
		alpha,
		beta,
		normAlpha,
		epsilon,
		condition: cond,
		x: x.map(value => Math.round(value * 1000) / 1000),
		estIterations: Math.floor(estK),
		iterations,
		iterationsCount: iterations.length,
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
	formattedString += `, epsilon^(${iteration}) = ${epsilonValue.toFixed(10)}`
	return formattedString
}

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

	const aPrioriEstimate = Math.floor(
		(Math.log10(epsilon) - Math.log10(normGamma) + Math.log10(1 - normAlpha)) /
			Math.log10(normAlpha)
	)

	let x: IVector = new Array(n).fill(0)
	let converge = false
	let iterations = 0
	let iterationDetails = []

	while (!converge) {
		iterations++
		let x_new: IVector = [...x]
		let diffVector = Array(n).fill(0)

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
			diffVector[i] = x_new[i] - x[i]
		}

		const maxDiff = Math.sqrt(
			diffVector.reduce((sum, value) => sum + value * value, 0)
		)
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
