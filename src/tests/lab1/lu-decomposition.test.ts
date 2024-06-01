import { IMatrix, IVector } from '@/context/MatrixAndVectorContextProvider'

export const luTest = () => {
	const A: IMatrix = [
		[-7, 3, -4, 7],
		[8, -1, -7, 6],
		[9, 9, 3, -6],
		[-7, -9, -8, -5],
	]

	const B: IVector = [-126, 29, 27, 34]

	return { A, B }
}

export function separateLU(LU: IMatrix): { L: IMatrix; U: IMatrix } {
	// Экспорт функции для разделения LU-матрицы на L и U
	const n = LU.length
	// Получение размера матрицы
	const L: IMatrix = Array.from({ length: n }, () => new Array(n).fill(0))
	// Инициализация нижнетреугольной матрицы L
	const U: IMatrix = Array.from({ length: n }, () => new Array(n).fill(0))
	// Инициализация верхнетреугольной матрицы U

	for (let i = 0; i < n; i++) {
		for (let j = 0; j < n; j++) {
			if (i > j) {
				L[i][j] = LU[i][j]
				// Заполнение нижнетреугольной матрицы L
			} else if (i === j) {
				L[i][j] = 1
				// Заполнение диагонали матрицы L единицами
				U[i][j] = LU[i][j]
				// Заполнение диагонали матрицы U
			} else {
				U[i][j] = LU[i][j]
				// Заполнение верхнетреугольной матрицы U
			}
		}
	}

	return { L, U }
	// Возврат матриц L и U
}

export function multiplyMatrices(A: IMatrix, B: IMatrix): IMatrix {
	// Экспорт функции для умножения матриц
	const rowsA = A.length
	// Получение количества строк матрицы A
	const colsA = A[0].length
	// Получение количества столбцов матрицы A
	const rowsB = B.length
	// Получение количества строк матрицы B
	const colsB = B[0].length
	// Получение количества столбцов матрицы B
	const result: IMatrix = Array.from({ length: rowsA }, () =>
		new Array(colsB).fill(0)
	)
	// Инициализация результирующей матрицы

	if (colsA !== rowsB) {
		throw new Error('Matrices are not multipliable')
		// Проверка на возможность умножения матриц
	}

	for (let i = 0; i < rowsA; i++) {
		for (let j = 0; j < colsB; j++) {
			for (let k = 0; k < colsA; k++) {
				result[i][j] += A[i][k] * B[k][j]
				// Выполнение умножения матриц
			}
			result[i][j] = result[i][j]
			// Запись результата в результирующую матрицу
		}
	}
	return result
	// Возврат результирующей матрицы
}

export function solveLU(LU: IMatrix, permutations: number[], b: number[]) {
	// Экспорт функции для решения системы уравнений с помощью LU-разложения
	const n = LU.length
	// Получение размера матрицы
	const x: IVector = new Array(n).fill(0)
	// Инициализация вектора решений x
	const z: IVector = new Array(n).fill(0)
	// Инициализация вспомогательного вектора z

	for (let i = 0; i < n; i++) {
		z[i] = b[permutations[i]]
		// Применение перестановок к вектору b
		for (let j = 0; j < i; j++) {
			z[i] -= LU[i][j] * z[j]
			// Вычисление вектора z
		}
	}

	for (let i = n - 1; i >= 0; i--) {
		x[i] = z[i]
		// Инициализация значения x
		for (let j = i + 1; j < n; j++) {
			x[i] -= LU[i][j] * x[j]
			// Вычисление значения x
		}
		x[i] = x[i] / LU[i][i]
		// Деление на диагональный элемент
	}

	return { x, z }
	// Возврат решения и вспомогательного вектора
}

export function determinant(LU: IMatrix): number {
	// Экспорт функции для вычисления детерминанта матрицы
	let det = 1
	// Инициализация значения детерминанта
	for (let i = 0; i < LU.length; i++) {
		det *= LU[i][i]
		// Вычисление детерминанта путем умножения диагональных элементов
	}
	return +det.toFixed(4)
	// Возврат округленного значения детерминанта
}

export function inverseMatrix(LU: IMatrix, permutations: number[]): IMatrix {
	// Экспорт функции для вычисления обратной матрицы
	const n = LU.length
	// Получение размера матрицы
	const inverse = Array.from({ length: n }, () => new Array(n).fill(0))
	// Инициализация обратной матрицы

	for (let col = 0; col < n; col++) {
		const e = new Array(n).fill(0)
		e[col] = 1
		// Инициализация единичного вектора
		const { x: colSolutions } = solveLU(LU, permutations, e)
		// Решение системы уравнений для каждого столбца единичной матрицы

		for (let row = 0; row < n; row++) {
			inverse[row][col] = colSolutions[row]
			// Заполнение обратной матрицы решениями
		}
	}

	return inverse
	// Возврат обратной матрицы
}

export function luDecomposition(A: IMatrix): {
	LU: IMatrix
	permutations: number[]
} {
	// Экспорт функции для выполнения LU-разложения
	const n = A.length
	// Получение размера матрицы
	const LU = A.map(row => [...row])
	// Копирование матрицы A
	const permutations: number[] = Array.from({ length: n }, (_, i) => i)
	// Инициализация массива перестановок

	for (let col = 0; col < n; col++) {
		let maxIdx = col
		// Инициализация индекса максимального элемента
		for (let row = col + 1; row < n; row++) {
			if (Math.abs(LU[row][col]) > Math.abs(LU[maxIdx][col])) {
				maxIdx = row
				// Поиск максимального элемента в столбце
			}
		}
		if (maxIdx !== col) {
			;[LU[maxIdx], LU[col]] = [LU[col], LU[maxIdx]]
			// Обмен строк местами
			;[permutations[maxIdx], permutations[col]] = [
				permutations[col],
				permutations[maxIdx],
			]
			// Обмен перестановок местами
		}

		for (let row = col + 1; row < n; row++) {
			const factor = LU[row][col] / LU[col][col]
			// Вычисление множителя
			LU[row][col] = factor
			// Заполнение нижней части матрицы LU множителями
			for (let j = col + 1; j < n; j++) {
				LU[row][j] -= factor * LU[col][j]
				// Выполнение преобразования строк
			}
		}
	}

	return { LU, permutations }
	// Возврат LU-матрицы и массива перестановок
}
