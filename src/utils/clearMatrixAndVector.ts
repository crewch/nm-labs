import {
	IMatrixStr,
	IVectorStr,
	createInitialMatrix,
	createInitialVector,
} from '@/context/MatrixAndVectorContextProvider'
import { Dispatch, SetStateAction } from 'react'

export const clearMatrixAndVector = ({
	matrixSize,
	setMatrix,
	vectorSize,
	setVector,
}: {
	matrixSize: number
	setMatrix: Dispatch<SetStateAction<IMatrixStr>>
	vectorSize: number
	setVector: Dispatch<SetStateAction<IVectorStr>>
}) => {
	setMatrix(createInitialMatrix(matrixSize))
	setVector(createInitialVector(vectorSize))
}
