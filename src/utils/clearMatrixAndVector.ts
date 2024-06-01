export const createInitialMatrix = (size: number): string[][] => {
	return Array.from({ length: size }, () =>
		Array.from({ length: size }, () => '0')
	)
}

export const createInitialVector = (size: number): string[] => {
	return Array.from({ length: size }, () => '0')
}

export const clearMatrixAndVector = ({
	matrixSize,
	setMatrix,
	vectorSize,
	setVector,
}: {
	matrixSize: number
	setMatrix: (matrix: string[][]) => void
	vectorSize: number
	setVector: (vector: string[]) => void
}) => {
	setMatrix(createInitialMatrix(matrixSize))
	setVector(createInitialVector(vectorSize))
}
