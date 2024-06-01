import { IVector, IVectorStr } from '@/context/MatrixAndVectorContextProvider'

export const vectorToVectorNum = (vector: IVectorStr): IVector =>
	vector.map(row => +row)
