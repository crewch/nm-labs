import { IVector, IVectorStr } from '@/context/MatrixAndVectorContextProvider'

export const vectorToVectorNum = (vector: IVectorStr): IVector => {
	return vector.map(row => +row)
}
