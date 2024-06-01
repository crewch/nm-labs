'use client'

import {
	Dispatch,
	PropsWithChildren,
	SetStateAction,
	createContext,
	useState,
} from 'react'

export const MatrixContext = createContext<{
	matrix: string[][]
	setMatrix: Dispatch<SetStateAction<string[][]>>
}>({
	matrix: [],
	setMatrix: () => {
		throw new Error('setMatrix not implemented')
	},
})

export const VectorContext = createContext<{
	vector: string[]
	setVector: Dispatch<SetStateAction<string[]>>
}>({
	vector: [],
	setVector: () => {
		throw new Error('setVector not implemented')
	},
})

export const createInitialMatrix = (size: number): string[][] => {
	return Array.from({ length: size }, () =>
		Array.from({ length: size }, () => '0')
	)
}

export const createInitialVector = (size: number): string[] => {
	return Array.from({ length: size }, () => '0')
}

const MatrixAndVectorContextProvider = ({ children }: PropsWithChildren) => {
	const [matrix, setMatrix] = useState<string[][]>(createInitialMatrix(4))
	const [vector, setVector] = useState<string[]>(createInitialVector(4))

	return (
		<MatrixContext.Provider value={{ matrix, setMatrix }}>
			<VectorContext.Provider value={{ vector, setVector }}>
				{children}
			</VectorContext.Provider>
		</MatrixContext.Provider>
	)
}

export default MatrixAndVectorContextProvider
