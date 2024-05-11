'use client'

import { lab21 } from '@/tests/lab2/lab2.1.test'
import { useMemo } from 'react'

const MainPage = () => {
	const { nmRes, iterRes } = useMemo(() => lab21(), [])

	return (
		<div className='flex flex-col items-center gap-3 mt-3'>
			<p className='text-2xl font-bold'>sin(x) - 2x^2 + 0.5 = 0</p>
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
	)
}

export default MainPage
