'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Task2 } from '@/tests/lab4/boundary-value.test'
import { useState } from 'react'

const MainPage = () => {
	const [f, setF] = useState('')
	const [x, setX] = useState({ x0: 0, x1: 0 })
	const [y, setY] = useState({ y0: '', y1: '' })
	const [exact, setExact] = useState('')
	const [h, setH] = useState(1)
	const [p, setP] = useState('')
	const [q, setQ] = useState('')
	const [answer, setAnswer] = useState<string | null>(null)

	const handleSolve = () => {
		const result = new Task2(f, x.x0, x.x1, exact, y.y0, y.y1, h, p, q)

		setAnswer(result.run())
	}

	const handleTest = () => {
		const testF = "(y - (x - 3) * y') / (x^2 - 1)"
		const testX = { x0: 0, x1: 1 }
		const testY = { y0: '1 * y(0) = 0', y1: "1 * y'(1) + 1 * y(1) = -0,75" }
		const testExact = 'x - 3 + (1 / (x + 1))'
		const testH = 0.1
		const testP = '1 / (x^2 - 1)'
		const testQ = '-(x - 3) / (x^2 - 1)'

		setF(testF)
		setX(testX)
		setY(testY)
		setExact(testExact)
		setH(testH)
		setP(testP)
		setQ(testQ)

		const result = new Task2(
			testF,
			testX.x0,
			testX.x1,
			testExact,
			testY.y0,
			testY.y1,
			testH,
			testP,
			testQ
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
						onChange={e => setH(+e.target.value)}
					/>
				</div>
				<div>
					<Label>p(x)</Label>
					<Input
						className='w-44'
						value={p}
						onChange={e => setP(e.target.value)}
					/>
				</div>
				<div>
					<Label>q(x)</Label>
					<Input
						className='w-44'
						value={q}
						onChange={e => setQ(e.target.value)}
					/>
				</div>
			</section>
			<div className='flex justify-center'>{answer && <pre>{answer}</pre>}</div>
		</div>
	)
}

export default MainPage
