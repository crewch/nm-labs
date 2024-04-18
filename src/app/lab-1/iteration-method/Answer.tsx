import Matrix from '@/components/Matrix'
import Vector from '@/components/Vector'
import { IMatrix, IVector } from '@/context/MatrixAndVectorContextProvider'
import { memo } from 'react'

interface IAnswer {
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
}

const Answer = ({
	answer: {
		alpha,
		beta,
		epsilon,
		normAlpha,
		iterations,
		x,
		condition,
		estIterations,
		iterationsCount,
	},
}: {
	answer: IAnswer
}) => {
	return (
		<div className='flex flex-col items-center gap-5'>
			<Matrix matrix={alpha} label='Matrix alpha:' />
			<Vector vector={beta} label='Vector beta:' />
			<p>||alpha|| = {normAlpha.toFixed(3)}</p>
			{condition ? (
				<p>The sufficient convergence condition is satisfied.</p>
			) : (
				<p>The sufficient convergence condition is not satisfied.</p>
			)}
			<p>Epsilon = {epsilon.toFixed(3)}</p>
			<div>
				{iterations.map(resStr => (
					<p key={resStr.epsilonK}>
						x^({resStr.iteration}) = ({resStr.x.map(num => ` ${num} `)})^T,
						epsilon^({resStr.iteration}) = {resStr.epsilonK}
					</p>
				))}
			</div>
			<Vector vector={x} label='Vector x (answer):' />
			<p>Number of iterations: {iterationsCount}</p>
			<p>
				A priori estimate of the number of iterations: K + 1 {'>= '}
				{estIterations}
			</p>
		</div>
	)
}

export default memo(Answer)
