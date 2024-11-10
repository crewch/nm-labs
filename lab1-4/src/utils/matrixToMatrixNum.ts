export const matrixToMatrixNum = (matrix: string[][]): number[][] =>
	matrix.map(row => row.map(col => +col))
