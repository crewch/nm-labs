import { IMatrix, IMatrixStr } from '@/context/MatrixAndVectorContextProvider'

export const matrixToMatrixStr = (matrix: IMatrix): IMatrixStr => {
	return matrix.map(row => row.map(col => String(col)))
}
