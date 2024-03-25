import { IMatrix, IMatrixStr } from '@/context/MatrixAndVectorContextProvider'

export const matrixToMatrixNum = (matrix: IMatrixStr): IMatrix => {
	return matrix.map(row => row.map(col => +col))
}
