'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Task1 } from '@/tests/lab4/cauchy.test'
import { useState } from 'react'

const MainPage = () => {
	const [f, setF] = useState('')
	const [x, setX] = useState({ x0: 0, x1: 0 })
	const [y, setY] = useState({ y0: '', y1: '' })
	const [exact, setExact] = useState('')
	const [h, setH] = useState(1)
	const [answer, setAnswer] = useState<string | null>(null)

	const handleSolve = () => {
		const result = new Task1(f, x.x0, x.x1, y.y0, y.y1, exact, h)

		setAnswer(result.run())
	}

	const handleTest = () => {
		const testF = "((x + 1) * y' - y) / x"
		const testX = { x0: 1, x1: 2 }
		const testY = { y0: '2 + exp(1)', y1: '1 + exp(1)' }
		const testExact = 'x + 1 + exp(x)'
		const testH = 0.1

		setF(testF)
		setX(testX)
		setY(testY)
		setExact(testExact)
		setH(testH)

		const result = new Task1(
			testF,
			testX.x0,
			testX.x1,
			testY.y0,
			testY.y1,
			testExact,
			testH
		)

		setAnswer(result.run())
	}

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
						className='w-56'
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
						className='w-44'
						value={y.y0}
						onChange={e => setY(prev => ({ ...prev, y0: e.target.value }))}
					/>
				</div>
				<div>
					<Label>y{"'"}(x0)</Label>
					<Input
						className='w-44'
						value={y.y1}
						onChange={e => setY(prev => ({ ...prev, y1: e.target.value }))}
					/>
				</div>
				<div>
					<Label>exact</Label>
					<Input
						className='w-44'
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
						step={0.1}
						onChange={e => setH(+e.target.value)}
					/>
				</div>
			</section>
			<div className='flex justify-center'>{answer && <pre>{answer}</pre>}</div>
		</div>
	)
}

export default MainPage
