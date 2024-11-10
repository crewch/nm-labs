'use client'

import Matrix from '@/components/Matrix'
import Vector from '@/components/Vector'
import { memo } from 'react'

interface IAnswer {
	det: number
	inverse: number[][]
	L: number[][]
	U: number[][]
	LUProduct: number[][]
	z: number[]
	x: number[]
}

const Answer = ({ answer }: { answer: IAnswer }) => {
	return (
		<div className='flex flex-col items-center gap-5'>
			<p>
				<span>Det(A):</span>
				{answer.det}
			</p>
			<Matrix matrix={answer.inverse} label='A^-1:' />
			<Matrix matrix={answer.L} label='Matrix L:' />
			<Matrix matrix={answer.U} label='Matrix U:' />
			<Matrix matrix={answer.LUProduct} label='Matrix L * U:' />
			<Vector vector={answer.z} label='Vector z:' />
			<Vector vector={answer.x} label='Vector x (answer):' />
		</div>
	)
}

export default memo(Answer)
