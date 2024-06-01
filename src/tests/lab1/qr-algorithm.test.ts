type IMatrix = number[][]
type IVector = number[]

export const qrTest = () => {
	const A: IMatrix = [
		[-1, 4, -4],
		[2, -5, 0],
		[-8, -2, 0],
	]

	const B: IVector = [0, 0, 0]

	return { A, B }
}

function createMatrix(
	rows: number,
	cols: number,
	defaultValue: number = 0
): IMatrix {
	return Array.from({ length: rows }, () => Array(cols).fill(defaultValue))
}

function matrixMultiply(A: IMatrix, B: IMatrix): IMatrix {
	let result = A.map(row => Array(B[0].length).fill(0))

	for (let i = 0; i < A.length; i++) {
		for (let j = 0; j < B[0].length; j++) {
			for (let k = 0; k < A[0].length; k++) {
				result[i][j] += A[i][k] * B[k][j]
			}
		}
	}

	return result
}

function identityMatrix(size: number): IMatrix {
	let I = createMatrix(size, size)

	for (let i = 0; i < size; i++) {
		I[i][i] = 1
	}

	return I
}

function QRDecomposition(A: IMatrix, epsilon: number): [IMatrix, IMatrix] {
	let n = A.length
	let Q = identityMatrix(n)
	let R = A.map(row => [...row])

	for (let i = 0; i < n - 1; i++) {
		let nu: IVector = Array(n).fill(0)
		let norm = 0

		for (let j = i; j < n; j++) {
			norm += R[j][i] * R[j][i]
		}

		let sign = R[i][i] < 0 ? -1 : 1
		nu[i] = R[i][i] + sign * Math.sqrt(norm)

		for (let j = i + 1; j < n; j++) {
			nu[j] = R[j][i]
		}

		let H = createMatrix(n, n)
		let coef = 0

		for (let j = 0; j < n; j++) {
			coef += nu[j] * nu[j]
		}

		if (Math.abs(coef) < epsilon) {
			throw new Error(
				'Coefficient too close to zero, cannot proceed with QR Decomposition'
			)
		}

		for (let j = 0; j < n; j++) {
			for (let k = 0; k < n; k++) {
				H[j][k] = (-2 * nu[j] * nu[k]) / coef
			}
			H[j][j] += 1
		}

		Q = matrixMultiply(Q, H)
		R = matrixMultiply(H, R)
	}

	return [Q, R]
}

type Complex = [number, number]

function subComplex([a, b]: Complex, [c, d]: Complex): Complex {
	return [a - c, b - d]
}

function absComplex([a, b]: Complex): number {
	return Math.sqrt(a * a + b * b)
}

function complexToString([real, imag]: Complex): string {
	if (imag === 0) return real.toFixed(4)
	return `${real.toFixed(4)} + ${imag.toFixed(4)}i`
}

export function runQRAlgorithm(A: IMatrix, epsilon: number) {
	let n = A.length
	let current: Complex[] = Array(n).fill([0, 0])
	let prev: Complex[] = Array(n).fill([0, 0])
	let iter = 0
	let flag: boolean
	let res: (string | IMatrix | IVector | string[])[] = []

	do {
		let [Q, R] = QRDecomposition(A, epsilon)
		A = matrixMultiply(R, Q)

		res.push(`Iteration ${iter + 1}:`)
		res.push('Matrix Q:', Q)
		res.push('Matrix R:', R)
		res.push('Updated Matrix A:', A)

		for (let i = 0; i < n; i++) {
			if (
				i === n - 1 ||
				absComplex(subComplex([A[i + 1][i], 0], [0, 0])) < epsilon
			) {
				current[i] = [A[i][i], 0]
			} else {
				let a = A[i][i]
				let d = A[i + 1][i + 1]
				let b = A[i][i + 1]
				let c = A[i + 1][i]
				let tr = a + d
				let det = a * d - b * c
				let discriminant = tr * tr - 4 * det

				if (discriminant < 0) {
					let realPart = tr / 2
					let imaginaryPart = Math.sqrt(-discriminant) / 2
					current[i] = [realPart, imaginaryPart]
					current[i + 1] = [realPart, -imaginaryPart]
					i++
				} else {
					current[i] = [A[i][i], 0]
				}
			}
		}

		flag = true
		for (let j = 0; j < current.length; j++) {
			if (absComplex(subComplex(current[j], prev[j])) > epsilon) {
				flag = false
				break
			}
		}

		prev = current.map(x => [...x])
		current.fill([0, 0])

		iter++
	} while (!flag)

	res.push('Eigenvalues:')
	const eigenvalueAns: string[] = []
	for (const eigenvalue of prev) {
		eigenvalueAns.push(complexToString(eigenvalue))
	}
	res.push(eigenvalueAns)

	res.push('Total Iterations:', `${iter}`)

	return res
}
