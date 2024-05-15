import { IMatrix } from '@/context/MatrixAndVectorContextProvider'

function multiplyMatrices(A: IMatrix, B: IMatrix): IMatrix {
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

const createZeroMatrix = (rows: number, cols: number): IMatrix => {
	return Array.from({ length: rows }, () => Array(cols).fill(0))
}

const createIdentityMatrix = (size: number): IMatrix => {
	return createZeroMatrix(size, size).map((row, i) => {
		row[i] = 1

		return row
	})
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

function matrixNorm(matrix: IMatrix): number {
	return Math.max(
		...matrix.map(row => row.reduce((sum, value) => sum + Math.abs(value), 0))
	)
}

const subtractMatrices = (A: IMatrix, B: IMatrix): IMatrix => {
	return A.map((row, i) => row.map((val, j) => val - B[i][j]))
}

const argMax = (
	f: (x: number) => number,
	l: number,
	r: number,
	eps: number = 0.001
): number => {
	while (r - l > eps) {
		const a = (r + 2 * l) / 3
		const b = (2 * r + l) / 3

		if (f(a) < f(b)) {
			l = a
		} else {
			r = b
		}
	}

	return (l + r) / 2
}

export const lab22 = () => {
	function f1(x: number, y: number): number {
		return x - Math.cos(y) - 1
	}

	function f2(x: number, y: number): number {
		return y - Math.sin(x) - 1
	}

	function dxf1(x: number): number {
		return 1
	}

	function dyf1(y: number): number {
		return Math.sin(y)
	}

	function dxf2(x: number): number {
		return -Math.cos(x)
	}

	function dyf2(x: number): number {
		return 1
	}

	// a и b из Desmos
	let ax = 0.5
	let bx = 1
	let ay = 1.5
	let by = 2
	const epsilon = 0.001

	let x = (ax + bx) / 2
	let y = (ay + by) / 2

	let prevX = x
	let prevY = y

	let k = 0

	const nmRes: { iterations: string[]; ans: string } = {
		iterations: [],
		ans: '',
	}

	while (k < 1000) {
		const matrixJk = [
			[dxf1(x), dyf1(y)],
			[dxf2(x), dyf2(x)],
		]
		const detJk =
			matrixJk[0][0] * matrixJk[1][1] - matrixJk[0][1] * matrixJk[1][0]

		const matrixA1k = [
			[f1(x, y), dyf1(y)],
			[f2(x, y), dyf2(x)],
		]
		const detA1k =
			matrixA1k[0][0] * matrixA1k[1][1] - matrixA1k[0][1] * matrixA1k[1][0]

		const matrixA2k = [
			[dxf1(x), dxf2(x)],
			[f1(x, y), f2(x, y)],
		]
		const detA2k =
			matrixA2k[0][0] * matrixA2k[1][1] - matrixA2k[0][1] * matrixA2k[1][0]
		// todo сделать нормальным методом не из методички
		x -= detA1k / detJk
		y -= detA2k / detJk

		nmRes.iterations.push(
			`k=${k}\tx_1=${x.toFixed(4)}\tx_2=${y.toFixed(4)}\tdxf1=${dxf1(x).toFixed(
				4
			)}\tdyf1=${dyf1(y).toFixed(4)}\tdxf2=${dxf2(x).toFixed(4)}\tdyf2=${dyf2(
				x
			).toFixed(4)}\tdetA1k=${detA1k.toFixed(4)}\tdetA2k=${detA2k.toFixed(
				4
			)}\tdetJk=${detJk.toFixed(4)}\n`
		)

		if (Math.max(Math.abs(x - prevX), Math.abs(y - prevY)) <= epsilon) {
			break
		}

		prevX = x
		prevY = y
		k++
	}

	nmRes.ans = `Answer x=${x.toFixed(4)} y=${y.toFixed(4)}`

	const iterRes: { iterations: string[]; ans: string } = {
		iterations: [],
		ans: '',
	}

	const next = (xk: IMatrix, T: IMatrix) => {
		return subtractMatrices(
			xk,
			multiplyMatrices(T, [[f1(xk[0][0], xk[1][0])], [f2(xk[0][0], xk[1][0])]])
		)
	}

	x = (ax + bx) / 2
	y = (ay + by) / 2
	const x0: IMatrix = [[x], [y]]
	const J: IMatrix = [
		[dxf1(x), dyf1(y)],
		[dxf2(x), dyf2(x)],
	]
	const T = inverseMatrix(J)
	const phi = [
		[argMax(dxf1, ax, bx), argMax(dyf1, ay, by)],
		[argMax(dxf2, ax, bx), argMax(dyf2, ay, by)],
	]
	const Q: IMatrix = subtractMatrices(
		createIdentityMatrix(2),
		multiplyMatrices(T, phi)
	)

	const normQ = matrixNorm(Q)
	let prev = x0
	let curr = next(prev, T)
	let iter = 0

	const detJk = J[0][0] * J[1][1] - J[0][1] * J[1][0]

	const matrixA1k = [
		[f1(x, y), dyf1(y)],
		[f2(x, y), dyf2(x)],
	]

	const detA1k =
		matrixA1k[0][0] * matrixA1k[1][1] - matrixA1k[0][1] * matrixA1k[1][0]

	const matrixA2k = [
		[dxf1(x), dxf2(x)],
		[f1(x, y), f2(x, y)],
	]

	const detA2k =
		matrixA2k[0][0] * matrixA2k[1][1] - matrixA2k[0][1] * matrixA2k[1][0]

	iterRes.iterations.push(
		`k=${iter}\tx_1=${curr[0][0].toFixed(4)}\tx_2=${curr[1][0].toFixed(
			4
		)}\tdxf1=${dxf1(x).toFixed(4)}\tdyf1=${dyf1(y).toFixed(4)}\tdxf2=${dxf2(
			x
		).toFixed(4)}\tdyf2=${dyf2(x).toFixed(4)}\tdetA1k=${detA1k.toFixed(
			4
		)}\tdetA2k=${detA2k.toFixed(4)}\tdetJk=${detJk.toFixed(4)}\n`
	)

	while (
		(1 / Math.abs(1 - normQ)) * matrixNorm(subtractMatrices(curr, prev)) >
		epsilon
	) {
		prev = curr
		curr = next(prev, T)
		iter++
		iterRes.iterations.push(
			`k=${iter}\tx_1=${curr[0][0].toFixed(4)}\tx_2=${curr[1][0].toFixed(
				4
			)}\tdxf1=${dxf1(x).toFixed(4)}\tdyf1=${dyf1(y).toFixed(4)}\tdxf2=${dxf2(
				x
			).toFixed(4)}\tdyf2=${dyf2(x).toFixed(4)}\tdetA1k=${detA1k.toFixed(
				4
			)}\tdetA2k=${detA2k.toFixed(4)}\tdetJk=${detJk.toFixed(4)}\n`
		)
	}

	iterRes.ans = `Answer x=${curr[0][0].toFixed(4)} y=${curr[1][0].toFixed(4)}`

	return { nmRes, iterRes }
}
