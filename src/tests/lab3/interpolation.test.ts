import {
	Lexer,
	Solver,
	Polynomial,
	Matrix,
	Parser,
	Task1Args,
} from '../lib/lib'

const initializeTask = ({ y, x, xStar }: Task1Args) => {
	const lexer = new Lexer()
	const parser = new Parser()
	const solver = new Solver()
	const functionTokens = parser.toPostfix(lexer.run(y))
	const X = [...x]
	const fX = X.map(xi => solver.solve(functionTokens, xi, 1, 1))

	return { X, fX, xStar, solver, functionTokens }
}

const str = (value: number): string => value.toFixed(4)

const printStringLagrange = (...values: string[]): string => {
	const pad = 20

	return values.map(value => value.padEnd(pad)).join('') + '\n'
}

const lagrangeInterpolation = ({
	X,
	fX,
	xStar,
	solver,
	functionTokens,
}: ReturnType<typeof initializeTask>) => {
	let result = 'Lagrange polynomial:\n\n'
	result += printStringLagrange(
		'i',
		'xi',
		'fi',
		'w4(xi)',
		'fi/w4(xi)',
		'X* - xi'
	)
	result += '\n'
	const n = X.length
	const interpolation = new Array(n).fill(0)

	for (let i = 0; i < n; i++) {
		let tmp = []
		let coef = fX[i]

		for (let j = 0; j < n; j++) {
			if (i !== j) {
				tmp.push(-X[j])
				coef /= X[i] - X[j]
			}
		}

		const tmpPoly = Polynomial.openBrackets(tmp)

		for (let j = 0; j < n; j++) {
			interpolation[j] += coef * tmpPoly[j]
		}

		result += printStringLagrange(
			i.toString(),
			str(X[i]),
			str(fX[i]),
			str(fX[i] / coef),
			str(coef),
			str(xStar - X[i])
		)
	}
	const poly = new Polynomial(interpolation)
	result += `\nL3(x) = ${poly.toString()}`
	result += `\nL3(${xStar}) = ${poly.calculate(xStar)}`
	result += `\nf(${xStar}) = ${solver.solve(functionTokens, xStar, 1, 1)}`
	result += `\nDelta(L3(${xStar})) = ${str(
		Math.abs(poly.calculate(xStar) - solver.solve(functionTokens, xStar, 1, 1))
	)}`

	return result
}

const newtonInterpolation = ({
	X,
	fX,
	xStar,
	solver,
	functionTokens,
}: ReturnType<typeof initializeTask>) => {
	let result = 'Newton polynomial:\n\n'
	result += printStringLagrange('i', 'xi', 'fi', 'f1', 'f2', 'f3')
	result += '\n'
	const n = X.length
	const interpolation = new Array(n).fill(0)
	interpolation[0] = fX[0]
	const difference = new Matrix(n - 1)

	for (let i = 0; i < n - 1; i++) {
		difference.set(0, i, (fX[i] - fX[i + 1]) / (X[i] - X[i + 1]))
	}

	for (let i = 1; i < n - 1; i++) {
		for (let j = 0; j < n - i - 1; j++) {
			difference.set(
				i,
				j,
				(difference.get(i - 1, j) - difference.get(i - 1, j + 1)) /
					(X[j] - X[j + i + 1])
			)
		}
	}
	// todo сделать график убрать лишнюю информацию в первом методе
	result += printStringLagrange('0', str(X[0]), str(fX[0]), '', '', '')

	for (let i = 1; i < n; i++) {
		const diffs = new Array(n - i)
			.fill('')
			.map((_, idx) => str(difference.get(idx, i - 1)))
		result += printStringLagrange(i.toString(), str(X[i]), str(fX[i]), ...diffs)
	}

	let current = []

	for (let i = 0; i < n - 1; i++) {
		current.push(-X[i])
		const tmp = Polynomial.openBrackets(current)

		for (let j = 0; j < tmp.length; j++) {
			interpolation[j] += difference.get(i, 0) * tmp[j]
		}
	}

	const poly = new Polynomial(interpolation)
	result += `\nP3(x) = ${poly.toString()}`
	result += `\nP3(${xStar}) = ${poly.calculate(xStar)}`
	result += `\nf(${xStar}) = ${solver.solve(functionTokens, xStar, 1, 1)}`
	result += `\nDelta(P3(${xStar})) = ${str(
		Math.abs(poly.calculate(xStar) - solver.solve(functionTokens, xStar, 1, 1))
	)}`

	return result
}

export const runTask1 = (args: Task1Args): string => {
	const context = initializeTask(args)
	let results = lagrangeInterpolation(context)
	results += '\n\n'
	results += newtonInterpolation(context)

	return results
}
