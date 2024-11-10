import Matrix from '@/components/Matrix'
import Vector from '@/components/Vector'
import { memo } from 'react'

interface IAnswer {
	B: number[][]
	C: number[][]
	alpha: number[][]
	normAlpha: number
	beta: number[]
	gamma: number[]
	epsilon: number
	x: number[]
	iterations: number
	iterationDetails: string[]
	aPrioriEstimate: number
}

const Answer = ({
	answer: {
		B,
		C,
		alpha,
		beta,
		epsilon,
		iterationDetails,
		iterations,
		normAlpha,
		x,
		gamma,
		aPrioriEstimate,
	},
}: {
	answer: IAnswer
}) => {
	return (
		<div className='flex flex-col items-center gap-5'>
			<Matrix matrix={B} label='Matrix B:' />
			<Matrix matrix={C} label='Matrix C:' />
			<Matrix matrix={alpha} label='Matrix alpha = (E - B)^(-1)C:' />
			<Vector vector={beta} label='Vector beta:' />
			<Vector vector={gamma} label='Vector gamma = (E - B)^(-1)beta:' />
			<p>||alpha|| = {normAlpha}</p>
			{normAlpha >= 1 ? (
				<p>The sufficient convergence condition is not met</p>
			) : (
				<p>The sufficient convergence condition is satisfied</p>
			)}
			<p>Epsilon = {epsilon}</p>
			<div>
				{iterationDetails.map(row => (
					<p key={row}>{row}</p>
				))}
			</div>
			<Vector vector={x} label='Vector x (answer):' />
			<p>Number of iterations: {iterations}</p>
			<p>
				A priori estimate of the number of iterations: K + 1 {'>= '}
				{aPrioriEstimate}
			</p>
		</div>
	)
}

export default memo(Answer)
