'use client'

import { Button } from '@/components/ui/button'

import { clearMatrixAndVector } from '@/utils/clearMatrixAndVector'
import { matrixToMatrixNum } from '@/utils/matrixToMatrixNum'
import { useState } from 'react'
import Answer from './Answer'
import { matrixToMatrixStr } from '@/utils/matrixToMatrixStr'
import { vectorToVectorStr } from '@/utils/vectorToVectorStr'
import { jacobiMethod, rotationTest } from '@/tests/lab1/rotation-method.test'
import { useVariables, useWorkplaceParams } from '../(store)/store'

const RotationMethod = () => {
	const {
		variables: { matrix, vector },
		setMatrix,
		setVector,
	} = useVariables()
	const { params, changeN } = useWorkplaceParams()
	const [answer, setAnswer] = useState<
		(number[][] | number[] | string)[] | null
	>(null)

	const handleSolve = () => {
		const { A } = {
			A: matrixToMatrixNum(matrix),
		}

		const result = jacobiMethod(A, +params.eps)
		setAnswer(result)
	}

	const handleTest = () => {
		changeN('3')
		const { A, B } = rotationTest()
		setMatrix(matrixToMatrixStr(A))
		setVector(vectorToVectorStr(B))
		const result = jacobiMethod(A, +params.eps)
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

export default RotationMethod
