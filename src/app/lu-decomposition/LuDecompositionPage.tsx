'use client'

import { Button } from '@/components/ui/button'
import {
	MatrixContext,
	VectorContext,
	IMatrix,
	IVector,
} from '@/context/MatrixAndVectorContextProvider'
import {
	determinant,
	inverseMatrix,
	luDecomposition,
	luTest,
	multiplyMatrices,
	separateLU,
	solveLU,
} from '@/tests/lu-decomposition.test'
import { clearMatrixAndVector } from '@/utils/clearMatrixAndVector'
import { matrixToMatrixNum } from '@/utils/matrixToMatrixNum'
import { matrixToMatrixStr } from '@/utils/matrixToMatrixStr'
import { vectorToVectorNum } from '@/utils/vectorToVectorNum'
import { vectorToVectorStr } from '@/utils/vectorToVectorStr'
import { useContext, useState } from 'react'
import Answer from './Answer'
import { ParamsContext } from '@/context/ParamsContextProvider'

const LuDecompositionPage = () => {
	const { matrix, setMatrix } = useContext(MatrixContext)
	const { vector, setVector } = useContext(VectorContext)
	const { params, setParams } = useContext(ParamsContext)
	const [show, setShow] = useState<'test' | 'solve' | 'no'>('no')
	const [answer, setAnswer] = useState<{
		det: number
		inverse: IMatrix
		L: IMatrix
		U: IMatrix
		LUProduct: IMatrix
		z: IVector
		x: IVector
	} | null>(null)

	const handleSolve = () => {
		setShow('solve')

		const { A, B } = {
			A: matrixToMatrixNum(matrix),
			B: vectorToVectorNum(vector),
		}
		const { LU, permutations } = luDecomposition(A)
		const { L, U } = separateLU(LU)
		const LUProduct = multiplyMatrices(L, U)
		const { x, z } = solveLU(LU, permutations, B)
		const det = determinant(LU)
		const inverse = inverseMatrix(LU, permutations)

		setAnswer({
			det,
			inverse,
			L,
			U,
			LUProduct,
			z,
			x,
		})
	}

	const handleTest = () => {
		setShow('test')
		setParams({ ...params, n: '4' })

		const { A, B } = luTest()
		setMatrix(matrixToMatrixStr(A))
		setVector(vectorToVectorStr(B))
		const { LU, permutations } = luDecomposition(A)
		const { L, U } = separateLU(LU)
		const LUProduct = multiplyMatrices(L, U)
		const { x, z } = solveLU(LU, permutations, B)
		const det = determinant(LU)
		const inverse = inverseMatrix(LU, permutations)

		setAnswer({
			det,
			inverse,
			L,
			U,
			LUProduct,
			z,
			x,
		})
	}

	const handleClear = () => {
		clearMatrixAndVector({
			matrixSize: matrix.length,
			setMatrix,
			vectorSize: vector.length,
			setVector,
		})
		setShow('no')
	}

	return (
		<div>
			<div className='flex justify-center gap-1 mb-5'>
				<Button onClick={handleSolve}>Solve</Button>
				<Button onClick={handleTest}>Test</Button>
				<Button onClick={handleClear}>Clear</Button>
			</div>
			<div>
				{show === 'test' && answer && <Answer answer={answer} />}
				{show === 'solve' && answer && <Answer answer={answer} />}
			</div>
		</div>
	)
}

export default LuDecompositionPage
