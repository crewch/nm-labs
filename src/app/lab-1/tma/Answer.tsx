import Vector from '@/components/Vector'
import { IVector } from '@/context/MatrixAndVectorContextProvider'
import { memo } from 'react'

interface IAnswer {
	x: IVector
	p: IVector
	q: IVector
}

const Answer = ({ answer }: { answer: IAnswer }) => {
	return (
		<div className='flex flex-col items-center gap-5'>
			<Vector vector={answer.p} label='Coefficients P:' />
			<Vector vector={answer.q} label='Coefficients Q:' />
			<Vector vector={answer.x} label='Vector x (answer):' />
		</div>
	)
}

export default memo(Answer)
