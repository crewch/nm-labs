'use client'

import { Button } from '@/components/ui/button'
import {
	IVector,
	MatrixContext,
	VectorContext,
} from '@/context/MatrixAndVectorContextProvider'
import { ParamsContext } from '@/context/ParamsContextProvider'
import { thomasAlgorithm, tmaTest } from '@/tests/lab1/tma.test'
import { clearMatrixAndVector } from '@/utils/clearMatrixAndVector'
import { matrixToMatrixNum } from '@/utils/matrixToMatrixNum'
import { matrixToMatrixStr } from '@/utils/matrixToMatrixStr'
import { vectorToVectorNum } from '@/utils/vectorToVectorNum'
import { vectorToVectorStr } from '@/utils/vectorToVectorStr'
import { useContext, useState } from 'react'
import Answer from './Answer'

const Tma = () => {
	const { matrix, setMatrix } = useContext(MatrixContext)
	const { vector, setVector } = useContext(VectorContext)
	const { params, setParams } = useContext(ParamsContext)
	const [show, setShow] = useState<'solve' | 'no'>('no')
	const [answer, setAnswer] = useState<{
		x: IVector
		p: IVector
		q: IVector
	} | null>(null)

	const handleSolve = () => {
		setShow('solve')

		const { A, B } = {
			A: matrixToMatrixNum(matrix),
			B: vectorToVectorNum(vector),
		}
		const { x, p, q } = thomasAlgorithm(A, B)
		setAnswer({ p, q, x })
	}

	const handleTest = () => {
		setShow('solve')
		setParams({ ...params, n: '5' })

		const { A, B } = tmaTest()
		setMatrix(matrixToMatrixStr(A))
		setVector(vectorToVectorStr(B))
		const { x, p, q } = thomasAlgorithm(A, B)
		setAnswer({ p, q, x })
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
			<div>{show === 'solve' && answer && <Answer answer={answer} />}</div>
		</div>
	)
}

export default Tma
