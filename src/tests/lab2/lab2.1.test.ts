export const lab21 = () => {
	function f(x: number): number {
		return Math.sin(x) - 2 * x ** 2 + 0.5
	}

	function df(x: number): number {
		return Math.cos(x) - 4 * x
	}

	function sign(num: number): number {
		return num >= 0 ? 1 : -1
	}

	// a и b из Desmos
	const a: number = 0.3
	const b: number = 1
	const epsilon: number = 0.001
	let x: number = b
	let prevX: number = x
	let k: number = 0

	const nmRes: { iterations: string[]; ans: string } = {
		iterations: [],
		ans: '',
	}

	while (true) {
		if (k > 1000) {
			break
		}

		x = prevX - f(x) / df(x)
		nmRes.iterations.push(
			`k=${k}\tx=${x.toFixed(4)}\tf(x)=${f(x).toFixed(4)}\tdf(x)=${df(
				x
			).toFixed(4)}\t-f(x)/df(x)=${(-f(x) / df(x)).toFixed(4)}`
		)

		if (Math.abs(x - prevX) <= epsilon) {
			break
		}

		prevX = x
		k++
	}

	nmRes.ans = `Answer x = ${x.toFixed(4)}`

	const iterRes: { iterations: string[]; ans: string } = {
		iterations: [],
		ans: '',
	}

	const dfA: number = df(a)
	const dfB: number = df(b)

	const signOfDfA: number = sign(dfA)

	const lambdaValue: number = signOfDfA / Math.max(Math.abs(dfA), Math.abs(dfB))
	x = (a + b) / 2
	prevX = x
	k = 0

	while (k < 1000) {
		x = prevX - lambdaValue * f(prevX)
		iterRes.iterations.push(
			`k=${k}\tx=${x.toFixed(4)}\tf(x)=${f(x).toFixed(4)}\tdf(x)=${df(
				x
			).toFixed(4)}\t-f(x)/df(x)=${(-f(x) / df(x)).toFixed(4)}`
		)

		if (Math.abs(x - prevX) <= epsilon) {
			// todo исправить
			break
		}

		prevX = x
		k++
	}

	iterRes.ans = `Answer x = ${x.toFixed(4)}`

	return { nmRes, iterRes }
}
