import Matrix from '@/components/Matrix'
import Vector from '@/components/Vector'
import { memo } from 'react'

interface IAnswer {
	answer: (number[][] | number[] | string)[]
}

function isMatrix(value: number[][] | number[]): value is number[][] {
	return Array.isArray(value) && Array.isArray(value[0])
}

function isVector(value: number[]): value is number[] {
	return Array.isArray(value) && typeof value[0] === 'number'
}

const Answer = ({ answer }: IAnswer) => {
	return (
		<div className='flex flex-col items-center gap-5'>
			{answer.map((row, index) => {
				if (typeof row === 'string') {
					return <div key={index}>{row}</div>
				} else if (isMatrix(row)) {
					if (answer.at(-1) === row) {
						return row.map((item, itemIndex) => (
							<div
								key={`${index}-${itemIndex}`}
								className='flex items-center gap-2'
							>
								<span>x{itemIndex} =</span> <Vector vector={item} />
							</div>
						))
					}

					return <Matrix key={index} matrix={row} />
				} else if (isVector(row)) {
					return <Vector key={index} vector={row} />
				}
			})}
		</div>
	)
}

export default memo(Answer)
