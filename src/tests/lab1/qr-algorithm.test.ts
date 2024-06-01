import {
	IMatrix,
	IVector,
	IVectorStr,
} from '@/context/MatrixAndVectorContextProvider'

export const qrTest = () => {
	const A: IMatrix = [
		[-1, 4, -4],
		[2, -5, 0],
		[-8, -2, 0],
	]

	const B: IVector = [0, 0, 0]

	return { A, B }
}

// Функция для создания матрицы с заданными размерами и начальным значением
function createMatrix(
	rows: number,
	cols: number,
	defaultValue: number = 0
): IMatrix {
	// Создаем матрицу заданного размера, заполненную defaultValue
	return Array.from({ length: rows }, () => Array(cols).fill(defaultValue))
}

// Функция для умножения матриц
function matrixMultiply(A: IMatrix, B: IMatrix): IMatrix {
	// Инициализация результирующей матрицы нулями
	let result = A.map(row => Array(B[0].length).fill(0))

	// Тройной цикл для умножения матриц
	for (let i = 0; i < A.length; i++) {
		for (let j = 0; j < B[0].length; j++) {
			for (let k = 0; k < A[0].length; k++) {
				result[i][j] += A[i][k] * B[k][j]
			}
		}
	}

	// Возвращаем результат
	return result
}

// Функция для создания единичной матрицы заданного размера
function identityMatrix(size: number): IMatrix {
	// Создаем матрицу с заданным размером и нулевыми значениями
	let I = createMatrix(size, size)
	// Заполняем диагональ единицами
	for (let i = 0; i < size; i++) {
		I[i][i] = 1
	}
	// Возвращаем единичную матрицу
	return I
}

// Функция для выполнения QR-разложения
function QRDecomposition(A: IMatrix, epsilon: number): [IMatrix, IMatrix] {
	// Получаем размерность матрицы
	let n = A.length
	// Инициализируем Q как единичную матрицу
	let Q = identityMatrix(n)
	// Копируем матрицу A в R
	let R = A.map(row => [...row])

	// Основной цикл для QR-разложения
	for (let i = 0; i < n - 1; i++) {
		// Инициализация вектора nu
		let nu: IVector = Array(n).fill(0)
		// Вычисление нормы
		let norm = 0

		// Вычисление нормы для текущего столбца R
		for (let j = i; j < n; j++) {
			norm += R[j][i] * R[j][i]
		}

		// Определение знака для nu[i]
		let sign = R[i][i] < 0 ? -1 : 1
		// Вычисление первого элемента вектора nu
		nu[i] = R[i][i] + sign * Math.sqrt(norm)

		// Вычисление остальных элементов вектора nu
		for (let j = i + 1; j < n; j++) {
			nu[j] = R[j][i]
		}

		// Инициализация матрицы Хаусхолдера H
		let H = createMatrix(n, n)
		// Коэффициент для нормализации вектора nu
		let coef = 0

		// Вычисление коэффициента
		for (let j = 0; j < n; j++) {
			coef += nu[j] * nu[j]
		}

		// Проверка коэффициента на близость к нулю
		if (Math.abs(coef) < epsilon) {
			throw new Error(
				'Coefficient too close to zero, cannot proceed with QR Decomposition'
			)
		}

		// Заполнение матрицы Хаусхолдера H
		for (let j = 0; j < n; j++) {
			for (let k = 0; k < n; k++) {
				H[j][k] = (-2 * nu[j] * nu[k]) / coef
			}
			// Добавление единиц на диагонали матрицы H
			H[j][j] += 1
		}

		// Обновление матрицы Q
		Q = matrixMultiply(Q, H)
		// Обновление матрицы R
		R = matrixMultiply(H, R)
	}

	// Возвращаем матрицы Q и R
	return [Q, R]
}

// Тип для представления комплексных чисел
type Complex = [number, number]

// Функция для вычитания комплексных чисел
function subComplex([a, b]: Complex, [c, d]: Complex): Complex {
	return [a - c, b - d]
}

// Функция для вычисления модуля комплексного числа
function absComplex([a, b]: Complex): number {
	return Math.sqrt(a * a + b * b)
}

// Функция для преобразования комплексного числа в строку
function complexToString([real, imag]: Complex): string {
	// Возвращаем строку в зависимости от наличия мнимой части
	if (imag === 0) return real.toFixed(4)
	return `${real.toFixed(4)} + ${imag.toFixed(4)}i`
}

// Функция для выполнения QR-алгоритма
export function runQRAlgorithm(A: IMatrix, epsilon: number) {
	// Получение размера матрицы
	let n = A.length
	// Инициализация массивов для текущих и предыдущих значений
	let current: Complex[] = Array(n).fill([0, 0])
	let prev: Complex[] = Array(n).fill([0, 0])
	// Счетчик итераций
	let iter = 0
	// Флаг для определения сходимости
	let flag: boolean
	// Строка для хранения результатов
	let res: (string | IMatrix | IVector | IVectorStr)[] = []

	// Цикл, выполняющийся до сходимости
	do {
		// Получение матриц Q и R из QR-разложения
		let [Q, R] = QRDecomposition(A, epsilon)
		// Обновление матрицы A
		A = matrixMultiply(R, Q)

		// Добавление информации о текущей итерации в результат
		res.push(`Iteration ${iter + 1}:`)
		res.push('Matrix Q:', Q)
		res.push('Matrix R:', R)
		res.push('Updated Matrix A:', A)

		// Вычисление собственных значений
		for (let i = 0; i < n; i++) {
			if (
				// Условие для определения, является ли элемент диагональным
				i === n - 1 ||
				absComplex(subComplex([A[i + 1][i], 0], [0, 0])) < epsilon
			) {
				// Для диагональных элементов
				current[i] = [A[i][i], 0]
			} else {
				// Для не диагональных элементов
				let a = A[i][i]
				let d = A[i + 1][i + 1]
				let b = A[i][i + 1]
				let c = A[i + 1][i]
				let tr = a + d
				let det = a * d - b * c
				let discriminant = tr * tr - 4 * det

				if (discriminant < 0) {
					// Для комплексных собственных значений
					let realPart = tr / 2
					let imaginaryPart = Math.sqrt(-discriminant) / 2
					current[i] = [realPart, imaginaryPart]
					current[i + 1] = [realPart, -imaginaryPart]
					// Пропускаем следующий элемент, так как он является частью той же 2x2 подматрицы
					i++
				} else {
					// Для действительных собственных значений, аналогично предыдущему случаю
					current[i] = [A[i][i], 0]
				}
			}
		}

		// Проверка на сходимость
		flag = true
		for (let j = 0; j < current.length; j++) {
			if (absComplex(subComplex(current[j], prev[j])) > epsilon) {
				flag = false
				break
			}
		}

		// Обновление предыдущих значений
		prev = current.map(x => [...x])
		// Обнуление текущих значений
		current.fill([0, 0])

		// Увеличение счетчика итераций
		iter++
	} while (!flag)

	// Добавление в результат списка собственных значений
	res.push('Eigenvalues:')
	const eigenvalueAns: IVectorStr = []
	for (const eigenvalue of prev) {
		eigenvalueAns.push(complexToString(eigenvalue))
	}
	res.push(eigenvalueAns)

	// Добавление общего количества итераций в результат
	res.push('Total Iterations:', `${iter}`)
	// Включаем в строку `res` итоговые результаты и собственные значения

	return res
}
