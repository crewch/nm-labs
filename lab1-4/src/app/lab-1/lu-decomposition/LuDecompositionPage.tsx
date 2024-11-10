'use client'

import { Button } from '@/components/ui/button'
import {
	determinant,
	inverseMatrix,
	luDecomposition,
	luTest,
	multiplyMatrices,
	separateLU,
	solveLU,
} from '@/tests/lab1/lu-decomposition.test'
import { clearMatrixAndVector } from '@/utils/clearMatrixAndVector'
import { matrixToMatrixNum } from '@/utils/matrixToMatrixNum'
import { matrixToMatrixStr } from '@/utils/matrixToMatrixStr'
import { vectorToVectorNum } from '@/utils/vectorToVectorNum'
import { vectorToVectorStr } from '@/utils/vectorToVectorStr'
import { useState } from 'react'
import Answer from './Answer'
import { Matrix } from '@/tests/lib/Matrix'
import { Vector } from '@/tests/lib/Vector'
import { useVariables, useWorkplaceParams } from '../(store)/store'

const LuDecompositionPage = () => {
	const {
		variables: { matrix, vector },
		setMatrix,
		setVector,
	} = useVariables()
	const { changeN } = useWorkplaceParams()
	const [answer, setAnswer] = useState<{
		det: number
		inverse: number[][]
		L: number[][]
		U: number[][]
		LUProduct: number[][]
		z: number[]
		x: number[]
	} | null>(null)

	const handleSolve = () => {
		const { A, B } = {
			A: matrixToMatrixNum(matrix),
			B: vectorToVectorNum(vector),
		}
		const matrixA = new Matrix()
		matrixA.setBuffer(A)
		const vectorB = new Vector(B)

		const { LU, permutations } = luDecomposition(matrixA)
		const { L, U } = separateLU(LU)
		const LUProduct = multiplyMatrices(L, U)
		const { x, z } = solveLU(LU, permutations, vectorB)
		const det = determinant(LU)
		const inverse = inverseMatrix(LU, permutations)

		setAnswer({
			det,
			inverse: inverse.getBuffer(),
			L: L.getBuffer(),
			U: U.getBuffer(),
			LUProduct: LUProduct.getBuffer(),
			z: z.getBuffer(),
			x: x.getBuffer(),
		})
	}

	const handleTest = () => {
		changeN('4')

		const { A, B } = luTest()
		setMatrix(matrixToMatrixStr(A))
		setVector(vectorToVectorStr(B))

		const matrixA = new Matrix()
		matrixA.setBuffer(A)
		const vectorB = new Vector(B)

		const { LU, permutations } = luDecomposition(matrixA)
		const { L, U } = separateLU(LU)
		const LUProduct = multiplyMatrices(L, U)
		const { x, z } = solveLU(LU, permutations, vectorB)
		const det = determinant(LU)
		const inverse = inverseMatrix(LU, permutations)

		setAnswer({
			det,
			inverse: inverse.getBuffer(),
			L: L.getBuffer(),
			U: U.getBuffer(),
			LUProduct: LUProduct.getBuffer(),
			z: z.getBuffer(),
			x: x.getBuffer(),
		})
	}

	const handleClear = () => {
		clearMatrixAndVector({
			matrixSize: matrix.length,
			setMatrix,
			vectorSize: vector.length,
			setVector,
		})
		setAnswer(null)
	}

	return (
		<div>
			<div className='flex justify-center gap-1 mb-5'>
				<Button onClick={handleSolve}>Solve</Button>
				<Button onClick={handleTest}>Test</Button>
				<Button onClick={handleClear}>Clear</Button>
			</div>
			<div>{answer && <Answer answer={answer} />}</div>
		</div>
	)
}

export default LuDecompositionPage
