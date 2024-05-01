'use client'

import { Button } from '@/components/ui/button'
import {
	IMatrix,
	IVector,
	MatrixContext,
	VectorContext,
} from '@/context/MatrixAndVectorContextProvider'
import { ParamsContext } from '@/context/ParamsContextProvider'
import {
	iterationSeidelTest,
	simpleIterationMethod,
} from '@/tests/iteration-seidel-method.test'
import { clearMatrixAndVector } from '@/utils/clearMatrixAndVector'
import { matrixToMatrixNum } from '@/utils/matrixToMatrixNum'
import { vectorToVectorNum } from '@/utils/vectorToVectorNum'
import { useContext, useState } from 'react'
import Answer from './Answer'
import { matrixToMatrixStr } from '@/utils/matrixToMatrixStr'
import { vectorToVectorStr } from '@/utils/vectorToVectorStr'

const IterationMethod = () => {
	const { matrix, setMatrix } = useContext(MatrixContext)
	const { vector, setVector } = useContext(VectorContext)
	const { params, setParams } = useContext(ParamsContext)
	const [show, setShow] = useState<'test' | 'solve' | 'no'>('no')
	const [answer, setAnswer] = useState<{
		alpha: IMatrix
		beta: IVector
		normAlpha: number
		epsilon: number
		condition: boolean
		x: number[]
		estIterations: number
		iterations: {
			iteration: number
			x: number[]
			epsilonK: number
		}[]
		iterationsCount: number
	} | null>(null)

	const handleSolve = () => {
		setShow('solve')
		const { A, B } = {
			A: matrixToMatrixNum(matrix),
			B: vectorToVectorNum(vector),
		}
		const result = simpleIterationMethod(A, B, +params.eps)
		setAnswer(result)
	}

	const handleTest = () => {
		setShow('test')
		setParams({ ...params, n: '4' })
		const { A, B } = iterationSeidelTest()
		setMatrix(matrixToMatrixStr(A))
		setVector(vectorToVectorStr(B))
		const result = simpleIterationMethod(A, B, +params.eps)
		setAnswer(result)
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

export default IterationMethod