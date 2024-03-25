'use client'

import {
	Dispatch,
	PropsWithChildren,
	SetStateAction,
	createContext,
	useState,
} from 'react'

export type IMatrix = number[][]
export type IVector = number[]
export type IMatrixStr = string[][]
export type IVectorStr = string[]

export const MatrixContext = createContext<{
	matrix: IMatrixStr
	setMatrix: Dispatch<SetStateAction<IMatrixStr>>
}>({
	matrix: [],
	setMatrix: () => {
		throw new Error('setMatrix not implemented')
	},
})

export const VectorContext = createContext<{
	vector: IVectorStr
	setVector: Dispatch<SetStateAction<IVectorStr>>
}>({
	vector: [],
	setVector: () => {
		throw new Error('setVector not implemented')
	},
})

export const createInitialMatrix = (size: number): IMatrixStr => {
	return Array.from({ length: size }, () =>
		Array.from({ length: size }, () => '0')
	)
}

export const createInitialVector = (size: number): IVectorStr => {
	return Array.from({ length: size }, () => '0')
}

const MatrixAndVectorContextProvider = ({ children }: PropsWithChildren) => {
	const [matrix, setMatrix] = useState<IMatrixStr>(createInitialMatrix(4))
	const [vector, setVector] = useState<IVectorStr>(createInitialVector(4))

	return (
		<MatrixContext.Provider value={{ matrix, setMatrix }}>
			<VectorContext.Provider value={{ vector, setVector }}>
				{children}
			</VectorContext.Provider>
		</MatrixContext.Provider>
	)
}

export default MatrixAndVectorContextProvider
