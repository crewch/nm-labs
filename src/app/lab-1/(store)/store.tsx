import {
	createInitialMatrix,
	createInitialVector,
} from '@/utils/clearMatrixAndVector'
import { create } from 'zustand'

type WorkplaceParams = {
	params: { n: string; eps: string }
	changeN: (n: string) => void
	changeEps: (n: string) => void
}

export const useWorkplaceParams = create<WorkplaceParams>(set => ({
	params: { n: '4', eps: '0.001' },
	changeN: n => set(state => ({ params: { n, eps: state.params.eps } })),
	changeEps: eps => set(state => ({ params: { n: state.params.n, eps } })),
}))

type Variables = {
	variables: { matrix: string[][]; vector: string[] }
	setMatrix: (matrix: string[][]) => void
	setVector: (vector: string[]) => void
}

export const useVariables = create<Variables>(set => ({
	variables: { matrix: createInitialMatrix(4), vector: createInitialVector(4) },
	setMatrix: matrix =>
		set(state => ({
			variables: {
				matrix,
				vector: state.variables.vector,
			},
		})),
	setVector: vector =>
		set(state => ({ variables: { matrix: state.variables.matrix, vector } })),
}))
