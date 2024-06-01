import Matrix from '@/components/Matrix'
import Vector from '@/components/Vector'
import { memo } from 'react'

interface IAnswer {
	answer: (string | number[][] | number[] | string[])[]
}

function isVector(
	value: number[] | string[] | number[][]
): value is number[] | string[] {
	return (
		Array.isArray(value) &&
		(typeof value[0] === 'number' || typeof value[0] === 'string')
	)
}

const Answer = ({ answer: { answer } }: { answer: IAnswer }) => {
	return (
		<div className='flex flex-col items-center gap-5'>
			{answer.map((row, index) => {
				if (typeof row === 'string') {
					return <div key={index}>{row}</div>
				} else if (isVector(row)) {
					return <Vector key={index} vector={row} />
				} else {
					return <Matrix key={index} matrix={row} />
				}
			})}
		</div>
	)
}

export default memo(Answer)
