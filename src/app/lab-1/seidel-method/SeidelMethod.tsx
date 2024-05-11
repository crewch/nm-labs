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
	prepareSeidel,
} from '@/tests/lab1/iteration-seidel-method.test'
import { clearMatrixAndVector } from '@/utils/clearMatrixAndVector'
import { matrixToMatrixNum } from '@/utils/matrixToMatrixNum'
import { matrixToMatrixStr } from '@/utils/matrixToMatrixStr'
import { vectorToVectorNum } from '@/utils/vectorToVectorNum'
import { vectorToVectorStr } from '@/utils/vectorToVectorStr'
import { useContext, useState } from 'react'
import Answer from './Answer'

const SeidelMethod = () => {
	const { matrix, setMatrix } = useContext(MatrixContext)
	const { vector, setVector } = useContext(VectorContext)
	const { params, setParams } = useContext(ParamsContext)
	const [show, setShow] = useState<'test' | 'solve' | 'no'>('no')
	const [answer, setAnswer] = useState<{
		B: IMatrix
		C: IMatrix
		alpha: IMatrix
		normAlpha: number
		beta: any[]
		gamma: IVector
		epsilon: number
		x: IVector
		iterations: number
		iterationDetails: string[]
		aPrioriEstimate: number
	} | null>(null)

	const handleSolve = () => {
		setShow('solve')
		const { A, B } = {
			A: matrixToMatrixNum(matrix),
			B: vectorToVectorNum(vector),
		}
		const result = prepareSeidel(A, B, +params.eps)
		setAnswer(result)
	}

	const handleTest = () => {
		setShow('test')
		setParams({ ...params, n: '4' })
		const { A, B } = iterationSeidelTest()
		setMatrix(matrixToMatrixStr(A))
		setVector(vectorToVectorStr(B))
		const result = prepareSeidel(A, B, +params.eps)
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

export default SeidelMethod
