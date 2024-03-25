import { IVector, IVectorStr } from '@/context/MatrixAndVectorContextProvider'

export const vectorToVectorStr = (vector: IVector): IVectorStr => {
	return vector.map(row => String(row))
}
