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
	// Функция для создания матрицы alpha и вектора beta
	const n = A.length
	// Определение размера матрицы
	let alpha: IMatrix = Array.from({ length: n }, () => Array(n).fill(0))
	let beta: IVector = Array(n)
	// Инициализация матрицы alpha и вектора beta

	for (let i = 0; i < n; i++) {
		for (let j = 0; j < n; j++) {
			if (i !== j) {
				alpha[i][j] = -(A[i][j] / A[i][i])
				// Заполнение матрицы alpha
			}
		}
		beta[i] = b[i] / A[i][i]
		// Заполнение вектора beta
	}

	return { alpha, beta }
	// Возврат матрицы alpha и вектора beta
}

function vectorNorm(vector: IVector): number {
	// Функция для вычисления нормы вектора
	return Math.sqrt(vector.reduce((sum, value) => sum + value * value, 0))
	// Возврат квадратного корня из суммы квадратов элементов вектора
}

function matrixNorm(matrix: IMatrix): number {
	// Функция для вычисления нормы матрицы
	return Math.max(
		...matrix.map(row => row.reduce((sum, value) => sum + Math.abs(value), 0))
	)
	// Возврат максимальной суммы абсолютных значений элементов в каждой строке
}

function multiplyMatrixVector(matrix: IMatrix, vector: IVector): IVector {
	// Функция для умножения матрицы на вектор
	return matrix.map(row =>
		row.reduce((sum, value, i) => sum + value * vector[i], 0)
	)
	// Возврат результата умножения
}

function addVectors(v1: IVector, v2: IVector): IVector {
	// Функция для сложения двух векторов
	return v1.map((value, i) => value + v2[i])
	// Возврат результата сложения
}

function subtractVectors(v1: IVector, v2: IVector): IVector {
	// Функция для вычитания векторов
	return v1.map((value, i) => value - v2[i])
	// Возврат результата вычитания
}

export function simpleIterationMethod(A: IMatrix, b: IVector, epsilon: number) {
	// Экспорт функции метода простой итерации с детальным выводом
	const { alpha, beta } = createAlphaAndBeta(A, b)
	// Создание матрицы alpha и вектора beta
	const normAlpha = matrixNorm(alpha)
	// Вычисление нормы матрицы alpha
	const betaNorm = vectorNorm(beta)
	// Вычисление нормы вектора beta

	let cond = normAlpha < 1
	// Проверка условия сходимости
	let estK =
		(Math.log10(epsilon) - Math.log10(betaNorm) + Math.log10(1 - normAlpha)) /
		Math.log10(normAlpha)
	// Оценка количества итераций

	let x: IVector = [...beta]
	// Инициализация вектора x
	let prevX: IVector = [...beta]
	// Инициализация предыдущего значения вектора x
	let K = 0
	// Инициализация счетчика итераций
	let epsilonK = epsilon + 1
	// Инициализация текущей точности

	const iterations: { iteration: number; x: number[]; epsilonK: number }[] = []
	// Инициализация массива для хранения итераций
	while (epsilonK > epsilon) {
		x = addVectors(beta, multiplyMatrixVector(alpha, prevX))
		// Вычисление нового значения вектора x
		let coef = Math.pow(normAlpha, K) / (1 - normAlpha)
		// Вычисление коэффициента
		let normDiffXk = vectorNorm(subtractVectors(x, prevX))
		// Вычисление нормы разности векторов
		epsilonK = cond ? coef * normDiffXk : normDiffXk
		// Вычисление текущей точности
		K++
		// Увеличение счетчика итераций

		iterations.push({
			iteration: K,
			x: x.map(value => Math.round(value * 1000) / 1000),
			epsilonK,
		})
		// Добавление информации об итерации в массив

		if (K > estK) {
			break
		}
		// Прерывание, если количество итераций превышает оценку

		prevX = [...x]
		// Обновление предыдущего значения вектора x
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
	// Возврат результатов итерационного метода
}

/////////////////////////////////////////////////////////////////

const createZeroMatrix = (rows: number, cols: number): IMatrix => {
	// Функция для создания матрицы, заполненной нулями
	return Array.from({ length: rows }, () => Array(cols).fill(0))
	// Возвращаем матрицу заданных размеров, заполненную нулями
}

const createIdentityMatrix = (size: number): IMatrix => {
	// Функция для создания единичной матрицы
	return createZeroMatrix(size, size).map((row, i) => {
		row[i] = 1
		return row
		// В каждой строке на диагонали ставим 1, остальные элементы 0
	})
}

const subtractMatrices = (A: IMatrix, B: IMatrix): IMatrix => {
	// Функция для вычитания матриц
	return A.map((row, i) => row.map((val, j) => val - B[i][j]))
	// Вычитаем элементы одной матрицы из соответствующих элементов другой
}

const multiplyMatrix = (A: IMatrix, B: IMatrix): IMatrix => {
	// Функция для умножения матриц
	return A.map(
		(row, i) =>
			B[0].map((_, j) => row.reduce((acc, _, n) => acc + A[i][n] * B[n][j], 0))
		// Для каждого элемента результирующей матрицы вычисляем сумму произведений
	)
}

const duplicateMatrix = (A: IMatrix): IMatrix => {
	// Функция для дублирования матрицы
	return A.map(row => [...row])
	// Создаем копию каждой строки матрицы
}

const inverseMatrix = (A: IMatrix): IMatrix => {
	// Функция для вычисления обратной матрицы
	let I = createIdentityMatrix(A.length),
		C = duplicateMatrix(A)
	// Создаем единичную матрицу и копию исходной
	for (let i = 0; i < A.length; i++) {
		let e = C[i][i]
		// Получаем диагональный элемент
		if (e === 0) {
			// Если элемент равен нулю, ищем ненулевой элемент в другой строке
			for (let ii = i + 1; ii < A.length; ii++) {
				if (C[ii][i] !== 0) {
					// Обмениваем строки в C и I
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
			// Повторно проверяем элемент
			if (e === 0) {
				return []
				// Если не найдено подходящих элементов, возвращаем пустую матрицу
			}
		}
		for (let j = 0; j < A.length; j++) {
			// Делаем строку с диагональным элементом равной 1
			C[i][j] = C[i][j] / e
			I[i][j] = I[i][j] / e
		}
		for (let ii = 0; ii < A.length; ii++) {
			if (ii === i) {
				continue
			}
			// Для всех остальных строк обнуляем i-й элемент
			e = C[ii][i]
			for (let j = 0; j < A.length; j++) {
				C[ii][j] -= e * C[i][j]
				I[ii][j] -= e * I[i][j]
			}
		}
	}
	return I
	// Возвращаем обратную матрицу
}

const formatSeidelIteration = (
	iteration: number,
	x: IVector,
	epsilonValue: number
): string => {
	// Форматирование итерации метода Зейделя
	let formattedString = `x^(${iteration}) = (`
	// Создаем строку для записи результата итерации
	formattedString += x.map(xi => xi.toFixed(3)).join(', ') + ')^T'
	// Добавляем вектор решений, округленный до трех знаков после запятой
	formattedString += `, epsilon^(${iteration}) = ${epsilonValue.toFixed(10)}`
	// Добавляем значение погрешности, округленное до десяти знаков после запятой
	return formattedString
	// Возвращаем сформированную строку
}

export const prepareSeidel = (A: IMatrix, b: IVector, epsilon: number) => {
	// Экспортируем функцию подготовки к методу Зейделя
	const n = A.length
	// Определяем размерность матрицы
	let B = createZeroMatrix(n, n)
	let C = createZeroMatrix(n, n)
	// Создаем матрицы B и C
	let beta = Array(n).fill(0)
	// Инициализируем вектор beta нулями

	for (let i = 0; i < n; i++) {
		beta[i] = b[i] / A[i][i]
		// Заполняем вектор beta
		for (let j = 0; j < n; j++) {
			if (i !== j) {
				const value = -(A[i][j] / A[i][i])
				// Рассчитываем элементы матриц B и C
				if (i > j) {
					B[i][j] = value
					// Заполняем матрицу B
				} else {
					C[i][j] = value
					// Заполняем матрицу C
				}
			}
		}
	}

	const E = createIdentityMatrix(B.length)
	// Создаем единичную матрицу E

	const E_minus_B = subtractMatrices(E, B)
	// Вычитаем матрицу B из единичной матрицы

	const inverse_E_minus_B = inverseMatrix(E_minus_B)
	// Находим обратную матрицу для (E - B)

	const alpha = multiplyMatrix(inverse_E_minus_B, C)
	// Рассчитываем матрицу alpha
	const normAlpha = Math.max(
		...alpha.map(row => row.reduce((a, b) => Math.abs(a) + Math.abs(b), 0))
	)
	// Вычисляем норму матрицы alpha

	const gamma = multiplyMatrixVector(inverse_E_minus_B, beta)
	// Рассчитываем вектор gamma
	const normGamma = vectorNorm(gamma)
	// Вычисляем норму вектора gamma

	const aPrioriEstimate = Math.floor(
		(Math.log10(epsilon) - Math.log10(normGamma) + Math.log10(1 - normAlpha)) /
			Math.log10(normAlpha)
	)
	// Рассчитываем априорную оценку количества итераций

	let x: IVector = new Array(n).fill(0)
	// Инициализируем вектор решений x нулями
	let converge = false
	// Флаг сходимости
	let iterations = 0
	// Счетчик итераций
	let iterationDetails = []
	// Массив для хранения подробностей итераций

	while (!converge) {
		// Пока не достигнем сходимости
		iterations++
		let x_new: IVector = [...x]
		let diffVector = Array(n).fill(0)
		// Создаем новый вектор для хранения разностей

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
			// Рассчитываем новые значения для вектора x
			diffVector[i] = x_new[i] - x[i]
			// Вычисляем разницу для каждого элемента вектора
		}

		const maxDiff = Math.sqrt(
			diffVector.reduce((sum, value) => sum + value * value, 0)
		)
		// Вычисляем максимальное отклонение
		converge = maxDiff < epsilon
		// Проверяем условие сходимости
		x = x_new
		// Обновляем вектор решений

		iterationDetails.push(formatSeidelIteration(iterations, x, maxDiff))
		// Добавляем информацию об итерации в массив
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
	// Возвращаем результаты работы метода Зейделя
}
