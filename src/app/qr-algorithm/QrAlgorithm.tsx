'use client'

import { Button } from '@/components/ui/button'
import {
	IMatrix,
	IVector,
	MatrixContext,
	VectorContext,
} from '@/context/MatrixAndVectorContextProvider'
import { ParamsContext } from '@/context/ParamsContextProvider'
import { useContext, useState } from 'react'
import Answer from './Answer'
import { clearMatrixAndVector } from '@/utils/clearMatrixAndVector'
import { runQRAlgorithm, qrTest } from '@/tests/qr-algorithm.test'
import { matrixToMatrixStr } from '@/utils/matrixToMatrixStr'
import { vectorToVectorStr } from '@/utils/vectorToVectorStr'
import { matrixToMatrixNum } from '@/utils/matrixToMatrixNum'

const QrAlgorithm = () => {
	const { matrix, setMatrix } = useContext(MatrixContext)
	const { vector, setVector } = useContext(VectorContext)
	const { params, setParams } = useContext(ParamsContext)
	const [show, setShow] = useState<'test' | 'solve' | 'no'>('no')
	const [answer, setAnswer] = useState<{} | null>(null)

	const handleSolve = () => {
		setShow('solve')
		const { A } = {
			A: matrixToMatrixNum(matrix),
		}

		// const result =
		// setAnswer(result)
	}

	const handleTest = () => {
		setShow('test')
		setParams({ ...params, n: '3' })
		const { A, B } = qrTest()
		setMatrix(matrixToMatrixStr(A))
		setVector(vectorToVectorStr(B))
		console.log(runQRAlgorithm(A, +params.eps))

		// const result =
		// setAnswer(result)
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

export default QrAlgorithm
