import { IVector, IVectorStr } from '@/context/MatrixAndVectorContextProvider'

export const vectorToVectorStr = (vector: IVector): IVectorStr =>
	vector.map(row => String(row))
