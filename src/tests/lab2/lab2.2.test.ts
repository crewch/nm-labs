import { Matrix } from '../lib/Matrix'

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

	const next = (xk: Matrix, T: Matrix) => {
		const matrix = new Matrix()
		matrix.setBuffer([
			[f1(xk.get(0, 0), xk.get(1, 0))],
			[f2(xk.get(0, 0), xk.get(1, 0))],
		])

		return Matrix.subtractMatrices(xk, Matrix.multiplyMM(T, matrix))
	}

	x = (ax + bx) / 2
	y = (ay + by) / 2
	const x0 = new Matrix()
	x0.setBuffer([[x], [y]])
	const J = new Matrix()
	J.setBuffer([
		[dxf1(x), dyf1(y)],
		[dxf2(x), dyf2(x)],
	])
	const T = Matrix.inverseMatrix(J)
	const phi = new Matrix()
	phi.setBuffer([
		[argMax(dxf1, ax, bx), argMax(dyf1, ay, by)],
		[argMax(dxf2, ax, bx), argMax(dyf2, ay, by)],
	])
	const Q = Matrix.subtractMatrices(
		Matrix.createIdentityMatrix(2),
		Matrix.multiplyMM(T, phi)
	)

	const normQ = Q.norm()
	let prev = x0
	let curr = next(prev, T)
	let iter = 0

	const detJk = J.get(0, 0) * J.get(1, 1) - J.get(0, 1) * J.get(1, 0)

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
		`k=${iter}\tx_1=${curr.get(0, 0).toFixed(4)}\tx_2=${curr
			.get(1, 0)
			.toFixed(4)}\tdxf1=${dxf1(x).toFixed(4)}\tdyf1=${dyf1(y).toFixed(
			4
		)}\tdxf2=${dxf2(x).toFixed(4)}\tdyf2=${dyf2(x).toFixed(
			4
		)}\tdetA1k=${detA1k.toFixed(4)}\tdetA2k=${detA2k.toFixed(
			4
		)}\tdetJk=${detJk.toFixed(4)}\n`
	)

	while (
		(1 / Math.abs(1 - normQ)) * Matrix.subtractMatrices(curr, prev).norm() >
		epsilon
	) {
		prev = curr
		curr = next(prev, T)
		iter++
		iterRes.iterations.push(
			`k=${iter}\tx_1=${curr.get(0, 0).toFixed(4)}\tx_2=${curr
				.get(1, 0)
				.toFixed(4)}\tdxf1=${dxf1(x).toFixed(4)}\tdyf1=${dyf1(y).toFixed(
				4
			)}\tdxf2=${dxf2(x).toFixed(4)}\tdyf2=${dyf2(x).toFixed(
				4
			)}\tdetA1k=${detA1k.toFixed(4)}\tdetA2k=${detA2k.toFixed(
				4
			)}\tdetJk=${detJk.toFixed(4)}\n`
		)
	}

	iterRes.ans = `Answer x=${curr.get(0, 0).toFixed(4)} y=${curr
		.get(1, 0)
		.toFixed(4)}`

	return { nmRes, iterRes }
}
