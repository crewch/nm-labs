import { Matrix } from '../lib/Matrix'
import { Vector } from '../lib/Vector'

export const tmaTest = () => {
	const A = [
		[-7, -6, 0, 0, 0],
		[6, 12, 0, 0, 0],
		[0, -3, 5, 0, 0],
		[0, 0, -9, 21, 8],
		[0, 0, 0, -5, -6],
	]

	const B = [-75, 126, 13, -40, -24]

	return { A, B }
}

export function thomasAlgorithm(
	A: Matrix,
	B: Vector
): { x: Vector; p: Vector; q: Vector } {
	const n = A.rows
	const a: number[] = new Array(n)
	const b: number[] = new Array(n).fill(0)
	const c: number[] = new Array(n).fill(0)
	const f: number[] = B.getBuffer()
	const p: number[] = new Array(n).fill(0)
	const q: number[] = new Array(n).fill(0)
	const x: number[] = new Array(n).fill(0)

	for (let i = 0; i < n; i++) {
		a[i] = A.get(i, i)
		if (i < n - 1) {
			c[i] = A.get(i, i + 1)
		}
		if (i > 0) {
			b[i] = A.get(i, i - 1)
		}
	}

	p[0] = -c[0] / a[0]
	q[0] = f[0] / a[0]
	for (let i = 1; i < n; i++) {
		const m = a[i] + b[i] * p[i - 1]
		p[i] = -c[i] / m
		q[i] = (f[i] - b[i] * q[i - 1]) / m
	}

	x[n - 1] = q[n - 1]
	for (let i = n - 2; i >= 0; i--) {
		x[i] = p[i] * x[i + 1] + q[i]
	}

	return { x: new Vector(x), p: new Vector(p), q: new Vector(q) }
}
