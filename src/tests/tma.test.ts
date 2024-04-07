import { IMatrix, IVector } from '@/context/MatrixAndVectorContextProvider'

export const tmaTest = () => {
	const A: IMatrix = [
		[-7, -6, 0, 0, 0],
		[6, 12, 0, 0, 0],
		[0, -3, 5, 0, 0],
		[0, 0, -9, 21, 8],
		[0, 0, 0, -5, -6],
	]

	const B: IVector = [-75, 126, 13, -40, -24]

	return { A, B }
}

export function thomasAlgorithm(
	A: IMatrix,
	B: IVector
): { x: IVector; p: IVector; q: IVector } {
	// Экспорт функции алгоритма Томаса (метод прогонки)
	const n = A.length
	// Получение размера матрицы
	const a: IVector = new Array(n)
	// Инициализация вектора для диагональных элементов
	const b: IVector = new Array(n).fill(0)
	// Инициализация вектора для поддиагональных элементов
	const c: IVector = new Array(n).fill(0)
	// Инициализация вектора для наддиагональных элементов
	const f: IVector = [...B]
	// Инициализация вектора правых частей (копия B)
	const p: IVector = new Array(n).fill(0)
	// Инициализация вектора коэффициентов P
	const q: IVector = new Array(n).fill(0)
	// Инициализация вектора коэффициентов Q
	const x: IVector = new Array(n).fill(0)
	// Инициализация вектора решений X

	for (let i = 0; i < n; i++) {
		a[i] = A[i][i]
		// Заполнение вектора a диагональными элементами матрицы A
		if (i < n - 1) {
			c[i] = A[i][i + 1]
			// Заполнение вектора c наддиагональными элементами матрицы A
		}
		if (i > 0) {
			b[i] = A[i][i - 1]
			// Заполнение вектора b поддиагональными элементами матрицы A
		}
	}

	p[0] = -c[0] / a[0]
	q[0] = f[0] / a[0]
	// Вычисление начальных значений для P и Q
	for (let i = 1; i < n; i++) {
		const m = a[i] + b[i] * p[i - 1]
		// Вычисление промежуточного значения m
		p[i] = -c[i] / m
		// Вычисление коэффициента P[i]
		q[i] = (f[i] - b[i] * q[i - 1]) / m
		// Вычисление коэффициента Q[i]
	}

	x[n - 1] = q[n - 1]
	// Начальное значение для X[n-1]
	for (let i = n - 2; i >= 0; i--) {
		x[i] = p[i] * x[i + 1] + q[i]
		// Обратный ход - вычисление остальных значений X
	}

	return { x, p, q }
	// Возврат вектора решений X и коэффициентов P и Q
}
