'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useState } from 'react'

const MainPage = () => {
	const [f, setF] = useState('')
	const [x, setX] = useState({ x0: 0, x1: 0 })
	const [y, setY] = useState({ y0: '', y1: '' })
	const [exact, setExact] = useState('')
	const [h, setH] = useState(1)
	const [answer, setAnswer] = useState<string | null>(null)

	const handleSolve = () => {}

	const handleTest = () => {}

	const handleClear = () => {
		setF('')
		setX({ x0: 0, x1: 0 })
		setY({ y0: '', y1: '' })
		setExact('')
		setH(1)
		setAnswer(null)
	}

	return (
		<div>
			<div className='flex justify-center gap-1 my-5'>
				<Button onClick={handleSolve}>Solve</Button>
				<Button onClick={handleTest}>Test</Button>
				<Button onClick={handleClear}>Clear</Button>
			</div>
			<section className='flex justify-center gap-5 my-5'>
				<div>
					<Label>f(x, y, y{"'"})</Label>
					<Input
						className='w-28'
						value={f}
						onChange={e => setF(e.target.value)}
					/>
				</div>
				<div>
					<Label>x0</Label>
					<Input
						type='number'
						className='w-20'
						value={x.x0}
						onChange={e => setX(prev => ({ ...prev, x0: +e.target.value }))}
					/>
				</div>
				<div>
					<Label>x1</Label>
					<Input
						type='number'
						className='w-20'
						value={x.x1}
						onChange={e => setX(prev => ({ ...prev, x1: +e.target.value }))}
					/>
				</div>
				<div>
					<Label>y(x0)</Label>
					<Input
						className='w-28'
						value={y.y0}
						onChange={e => setY(prev => ({ ...prev, y0: e.target.value }))}
					/>
				</div>
				<div>
					<Label>y(x1)</Label>
					<Input
						className='w-28'
						value={y.y1}
						onChange={e => setY(prev => ({ ...prev, y1: e.target.value }))}
					/>
				</div>
				<div>
					<Label>exact</Label>
					<Input
						className='w-28'
						value={exact}
						onChange={e => setExact(e.target.value)}
					/>
				</div>
				<div>
					<Label>h</Label>
					<Input
						type='number'
						className='w-20'
						value={h}
						onChange={e => setH(+e.target.value)}
					/>
				</div>
			</section>
			<div>{answer && <pre>{answer}</pre>}</div>
		</div>
	)
}

export default MainPage
