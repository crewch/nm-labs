'use client'

import { Button } from '@/components/ui/button'
import { thomasAlgorithm, tmaTest } from '@/tests/lab1/tma.test'
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

const Tma = () => {
	const {
		variables: { matrix, vector },
		setMatrix,
		setVector,
	} = useVariables()
	const { changeN } = useWorkplaceParams()
	const [answer, setAnswer] = useState<{
		x: number[]
		p: number[]
		q: number[]
	} | null>(null)

	const handleSolve = () => {
		const { A, B } = {
			A: matrixToMatrixNum(matrix),
			B: vectorToVectorNum(vector),
		}

		const matrixA = new Matrix()
		matrixA.setBuffer(A)
		const { x, p, q } = thomasAlgorithm(matrixA, new Vector(B))
		setAnswer({ p: p.getBuffer(), q: q.getBuffer(), x: x.getBuffer() })
	}

	const handleTest = () => {
		changeN('5')

		const { A, B } = tmaTest()
		setMatrix(matrixToMatrixStr(A))
		setVector(vectorToVectorStr(B))

		const matrixA = new Matrix()
		matrixA.setBuffer(A)
		const { x, p, q } = thomasAlgorithm(matrixA, new Vector(B))
		setAnswer({ p: p.getBuffer(), q: q.getBuffer(), x: x.getBuffer() })
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

export default Tma
