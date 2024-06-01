import {
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
	setMatrix: Dispatch<SetStateAction<string[][]>>
	vectorSize: number
	setVector: Dispatch<SetStateAction<string[]>>
}) => {
	setMatrix(createInitialMatrix(matrixSize))
	setVector(createInitialVector(vectorSize))
}
