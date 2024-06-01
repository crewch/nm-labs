'use client'

import { Button } from '@/components/ui/button'
import {
	MatrixContext,
	VectorContext,
} from '@/context/MatrixAndVectorContextProvider'
import { ParamsContext } from '@/context/ParamsContextProvider'
import { useContext, useState } from 'react'
import Answer from './Answer'
import { clearMatrixAndVector } from '@/utils/clearMatrixAndVector'
import { runQRAlgorithm, qrTest } from '@/tests/lab1/qr-algorithm.test'
import { matrixToMatrixStr } from '@/utils/matrixToMatrixStr'
import { vectorToVectorStr } from '@/utils/vectorToVectorStr'
import { matrixToMatrixNum } from '@/utils/matrixToMatrixNum'

const QrAlgorithm = () => {
	const { matrix, setMatrix } = useContext(MatrixContext)
	const { vector, setVector } = useContext(VectorContext)
	const { params, setParams } = useContext(ParamsContext)
	const [answer, setAnswer] = useState<{
		answer: (string | number[][] | number[] | string[])[]
	} | null>(null)

	const handleSolve = () => {
		const { A } = {
			A: matrixToMatrixNum(matrix),
		}
		setAnswer({ answer: runQRAlgorithm(A, +params.eps) })
	}

	const handleTest = () => {
		setParams({ ...params, n: '3' })
		const { A, B } = qrTest()
		setMatrix(matrixToMatrixStr(A))
		setVector(vectorToVectorStr(B))
		setAnswer({ answer: runQRAlgorithm(A, +params.eps) })
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

export default QrAlgorithm
