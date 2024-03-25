import Matrix from '@/components/Matrix'
import Vector from '@/components/Vector'
import { IMatrix, IVector } from '@/context/MatrixAndVectorContextProvider'
import { memo } from 'react'

interface IAnswer {
	alpha: IMatrix
	beta: IVector
	normAlpha: number
	epsilon: number
	iterations: number
	iterationsRes: string[]
	x: IVector
	K: number
}

const Answer = ({
	answer: { alpha, beta, epsilon, normAlpha, iterations, K, x, iterationsRes },
}: {
	answer: IAnswer
}) => {
	return (
		<div className='flex flex-col items-center gap-5'>
			<Matrix matrix={alpha} label='Matrix alpha:' />
			<Vector vector={beta} label='Vector beta:' />
			<p>||alpha|| = {normAlpha.toFixed(3)}</p>
			<p>The sufficient convergence condition is satisfied.</p>
			<p>Epsilon = {epsilon.toFixed(3)}</p>
			<p>Starting iterations...</p>
			<div>
				{iterationsRes.map(resStr => (
					<p key={resStr}>{resStr}</p>
				))}
			</div>
			<Vector vector={x} label='Vector x (answer):' />
			<p>Number of iterations: {iterations}</p>
			<p>
				A priori estimate of the number of iterations: K + 1 {'> '}
				{K.toFixed(6)}
			</p>
		</div>
	)
}

export default memo(Answer)
