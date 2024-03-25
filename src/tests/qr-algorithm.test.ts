import { IMatrix, IVector } from '@/context/MatrixAndVectorContextProvider'

export const qrTest = () => {
	const A: IMatrix = [
		[-1, 4, -4],
		[2, -5, 0],
		[-8, -2, 0],
	]

	const B: IVector = [0, 0, 0]

	return { A, B }
}
