'use client'

import { lab22 } from '@/tests/lab2/lab2.2.test'
import { useMemo } from 'react'

const MainPage = () => {
	const { nmRes, iterRes } = useMemo(() => lab22(), [])

	return (
		<div className='flex flex-col items-center gap-4 mt-3'>
			<div>
				<p className='text-2xl font-bold'>x - cos(y) = 1</p>
				<p className='text-2xl font-bold'>y - sin(x) = 1</p>
			</div>
			<div className='flex flex-col gap-4'>
				<div className='flex flex-col gap-1'>
					<p className='text-xl'>Newton{"'"}s method</p>
					{nmRes.iterations.map((str, index) => (
						<p key={index}>{str}</p>
					))}
					{nmRes.ans}
				</div>
				<div className='flex flex-col gap-1'>
					<p className='text-xl'>Iteration method</p>
					{iterRes.iterations.map((str, index) => (
						<p key={index}>{str}</p>
					))}
					{iterRes.ans}
				</div>
			</div>
		</div>
	)
}

export default MainPage
