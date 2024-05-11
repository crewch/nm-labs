import { IMatrix, IVector } from '@/context/MatrixAndVectorContextProvider'

export const rotationTest = () => {
	const A: IMatrix = [
		[-7, -6, 8],
		[-6, 3, -7],
		[8, -7, 4],
	]

	const B: IVector = [0, 0, 0]

	return { A, B }
}

function transpose(matrix: IMatrix): IMatrix {
	// Функция для транспонирования матрицы
	const rows = matrix.length
	const cols = matrix[0].length
	const transposed: IMatrix = Array.from(
		{ length: cols },
		() => new Array(rows)
	)
	// Создаем транспонированную матрицу

	for (let i = 0; i < rows; i++) {
		for (let j = 0; j < cols; j++) {
			transposed[j][i] = matrix[i][j]
			// Переставляем элементы матрицы
		}
	}

	return transposed
	// Возвращаем транспонированную матрицу
}

function multiplyMatrices(matrix1: IMatrix, matrix2: IMatrix): IMatrix {
	// Функция для умножения матриц
	const result: IMatrix = []

	for (let i = 0; i < matrix1.length; i++) {
		result[i] = []

		for (let j = 0; j < matrix2[0].length; j++) {
			let sum = 0

			for (let k = 0; k < matrix1[0].length; k++) {
				sum += matrix1[i][k] * matrix2[k][j]
				// Суммируем произведения элементов
			}

			result[i][j] = sum
			// Присваиваем элементу результата сумму
		}
	}

	return result
	// Возвращаем результирующую матрицу
}

function identityMatrix(size: number): IMatrix {
	// Функция для создания единичной матрицы
	return Array.from({ length: size }, (_, i) =>
		Array.from({ length: size }, (_, j) => (i === j ? 1 : 0))
	)
	// Заполняем матрицу, где диагональные элементы равны 1, остальные 0
}

function matrixEquals(matrix1: IMatrix, matrix2: IMatrix): boolean {
	// Функция для проверки равенства двух матриц
	for (let i = 0; i < matrix1.length; i++) {
		for (let j = 0; j < matrix1[0].length; j++) {
			if (matrix1[i][j] !== matrix2[i][j]) return false
			// Если элементы не равны, возвращаем false
		}
	}

	return true
	// Если все элементы равны, возвращаем true
}

function calculateT(matrix: IMatrix): number {
	// Функция для вычисления суммы квадратов недиагональных элементов матрицы
	let res = 0

	for (let i = 0; i < matrix.length - 1; i++) {
		for (let j = i + 1; j < matrix[i].length; j++) {
			res += matrix[i][j] * matrix[i][j]
			// Складываем квадраты элементов
		}
	}

	return Math.sqrt(res)
	// Возвращаем квадратный корень из суммы квадратов
}

export function jacobiMethod(
	A: IMatrix,
	epsilon: number
): (IMatrix | IVector | string)[] {
	// Функция метода Якоби для нахождения собственных значений и векторов матрицы
	let res: (IMatrix | IVector | string)[] = []
	// Массив для сохранения результатов

	if (!matrixEquals(A, transpose(A))) {
		return ['Invalid matrix']
		// Проверяем, является ли матрица симметричной
	}

	const n = A.length
	// Получаем размерность матрицы
	let k = 0
	// Инициализируем счетчик итераций
	let globalU = identityMatrix(n)
	// Создаем глобальную единичную матрицу U

	while (calculateT(A) > epsilon) {
		// Пока сумма квадратов недиагональных элементов больше epsilon
		let maxVal = 0
		let maxI = 0
		let maxJ = 0

		for (let i = 0; i < n - 1; i++) {
			for (let j = i + 1; j < n; j++) {
				if (Math.abs(A[i][j]) > Math.abs(maxVal)) {
					maxVal = A[i][j]
					// Находим максимальный по модулю недиагональный элемент
					maxI = i
					maxJ = j
					// Запоминаем его индексы
				}
			}
		}

		let U = identityMatrix(n)
		// Создаем единичную матрицу U для этой итерации
		let phiK
		// Угол вращения

		if (A[maxI][maxI] !== A[maxJ][maxJ]) {
			phiK =
				0.5 * Math.atan((2 * A[maxI][maxJ]) / (A[maxI][maxI] - A[maxJ][maxJ]))
			// Вычисляем угол phiK
		} else {
			phiK = Math.PI / 4
			// Если элементы диагонали равны, phiK равно π/4
		}

		U[maxI][maxJ] = -Math.sin(phiK)
		U[maxJ][maxI] = Math.sin(phiK)
		U[maxI][maxI] = Math.cos(phiK)
		U[maxJ][maxJ] = Math.cos(phiK)
		// Заполняем матрицу U

		res.push(`Iteration ${k}: a[i,j]^(${k}) = ${maxVal}`)
		// Добавляем информацию об итерации в результат
		res.push(`Matrix U^${k}`)
		// Добавляем матрицу U текущей итерации
		res.push(U.map(row => row.map(value => +value.toFixed(4))))
		// Добавляем матрицу U с округленными элементами

		let uT = transpose(U)
		// Транспонируем матрицу U
		let nextA = multiplyMatrices(multiplyMatrices(uT, A), U)
		// Вычисляем следующую матрицу A

		for (let i = 0; i < n; i++) {
			for (let j = 0; j < n; j++) {
				A[i][j] = nextA[i][j]
				// Обновляем матрицу A
			}
		}

		k++
		// Увеличиваем счетчик итераций
		globalU = multiplyMatrices(globalU, U)
		// Обновляем глобальную матрицу U

		res.push(`Matrix A^${k}`)
		// Добавляем обновленную матрицу A
		res.push(A.map(row => row.map(value => +value.toFixed(4))))
		// Добавляем матрицу A с округленными элементами
		res.push(`t(A) after iteration ${k}: ${calculateT(A).toFixed(4)}`)
		// Добавляем значение t(A) после итерации
	}

	res.push('Matrix U:')
	res.push(globalU)
	// Добавляем глобальную матрицу U
	res.push('Eigenvalues:')
	// Добавляем информацию о собственных значениях

	const eigenvalues: IVector = []

	for (let i = 0; i < n; i++) {
		eigenvalues.push(+A[i][i].toFixed(4))
		// Добавляем собственные значения
	}
	res.push(eigenvalues)
	// Добавляем вектор собственных значений

	res.push('Eigenvectors:')
	// Добавляем информацию о собственных векторах

	const eigenvectors: IMatrix = []

	for (let i = 0; i < n; i++) {
		const row: number[] = []

		for (let j = 0; j < n; j++) {
			row.push(+globalU[j][i].toFixed(4))
			// Добавляем элементы собственных векторов
		}

		eigenvectors.push(row)
	}

	res.push(eigenvectors)
	// Добавляем матрицу собственных векторов

	return res
	// Возвращаем результаты метода Якоби
}
