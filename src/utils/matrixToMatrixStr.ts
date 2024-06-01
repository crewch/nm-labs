export const matrixToMatrixStr = (matrix: number[][]) =>
	matrix.map(row => row.map(col => String(col)))
