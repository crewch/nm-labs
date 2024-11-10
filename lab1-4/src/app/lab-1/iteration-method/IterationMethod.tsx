'use client'

import { Button } from '@/components/ui/button'
import {
	iterationSeidelTest,
	simpleIterationMethod,
} from '@/tests/lab1/iteration-seidel-method.test'
import { clearMatrixAndVector } from '@/utils/clearMatrixAndVector'
import { matrixToMatrixNum } from '@/utils/matrixToMatrixNum'
import { vectorToVectorNum } from '@/utils/vectorToVectorNum'
import { useState } from 'react'
import Answer from './Answer'
import { matrixToMatrixStr } from '@/utils/matrixToMatrixStr'
import { vectorToVectorStr } from '@/utils/vectorToVectorStr'
import { useVariables, useWorkplaceParams } from '../(store)/store'

const IterationMethod = () => {
	const {
		variables: { matrix, vector },
		setMatrix,
		setVector,
	} = useVariables()
	const { params, changeN } = useWorkplaceParams()
	const [answer, setAnswer] = useState<{
		alpha: number[][]
		beta: number[]
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
		const { A, B } = {
			A: matrixToMatrixNum(matrix),
			B: vectorToVectorNum(vector),
		}
		const result = simpleIterationMethod(A, B, +params.eps)
		setAnswer(result)
	}

	const handleTest = () => {
		changeN('4')
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

export default IterationMethod
