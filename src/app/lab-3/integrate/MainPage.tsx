'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Task5 } from '@/tests/lab3/integrate.test'
import { Lexer, Parser } from '@/tests/lab3/lib'
import { useEffect, useState } from 'react'

const MainPage = () => {
	const [n, setN] = useState(2)
	const [x, setX] = useState<string[]>(['0', '0'])
	const [y, setY] = useState('')
	const [h, setH] = useState({ h1: 0, h2: 0 })
	const [answer, setAnswer] = useState<string | null>(null)

	const handleSolve = () => {
		const lexer = new Lexer()
		const parser = new Parser()
		let fX = lexer.run(y)
		fX = parser.toPostfix(fX)
		let t5 = new Task5(x.map(Number), fX)
		setAnswer(t5.run(h.h1, h.h2))
	}

	const handleTest = () => {
		const testX = ['0', '2']
		const testY = 'x/(x*x+9)'
		const testH = { h1: 0.5, h2: 0.25 }

		setN(2)
		setX(testX)
		setY(testY)
		setH(testH)

		const lexer = new Lexer()
		const parser = new Parser()
		let fX = lexer.run(testY)
		fX = parser.toPostfix(fX)
		let t5 = new Task5(testX.map(Number), fX)
		setAnswer(t5.run(testH.h1, testH.h2))
	}

	const handleClear = () => {
		setAnswer(null)
		setN(2)
		setX(['0', '0'])
	}

	const updateVectorX = (index: number, value: string) => {
		const newVector = [...x]
		newVector[index] = value
		setX(newVector)
	}

	useEffect(() => {
		const updateVectorSize = (newSize: number) => {
			let newVectorX = [...x]
			const vectorLen = newVectorX.length

			if (newSize > vectorLen) {
				for (let i = vectorLen; i < newSize; i++) {
					newVectorX[i] = '0'
				}
			} else {
				newVectorX = newVectorX.slice(0, newSize)
			}

			setX(newVectorX)
		}

		updateVectorSize(n)
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [n])

	return (
		<div>
			<div className='flex justify-center gap-1 my-5'>
				<Button onClick={handleSolve}>Solve</Button>
				<Button onClick={handleTest}>Test</Button>
				<Button onClick={handleClear}>Clear</Button>
			</div>
			<section className='flex justify-center gap-5 my-5'>
				<div>
					<Label>n</Label>
					<Input
						type='number'
						value={n}
						onChange={e => setN(+e.target.value)}
						onKeyDown={e => {
							if (e.key !== 'ArrowUp' && e.key !== 'ArrowDown')
								e.preventDefault()
						}}
						className='w-20'
						min={2}
						max={10}
					/>
				</div>
				<div className='flex flex-col gap-3'>
					<div>
						<Label>x</Label>
						<div className='flex gap-1'>
							{x.map((item, index) => (
								<div key={index}>
									<Input
										type='number'
										value={item}
										onChange={e => updateVectorX(index, e.target.value)}
										className='w-28'
									/>
								</div>
							))}
						</div>
					</div>
				</div>
				<div>
					<Label>y</Label>
					<Input value={y} onChange={e => setY(e.target.value)} />
				</div>
				<div>
					<Label>h1</Label>
					<Input
						type='number'
						value={h.h1}
						onChange={e => setH({ ...h, h1: +e.target.value })}
						step={0.1}
						className='w-20'
					/>
				</div>
				<div>
					<Label>h2</Label>
					<Input
						type='number'
						value={h.h2}
						onChange={e => setH({ ...h, h2: +e.target.value })}
						step={0.1}
						className='w-20'
					/>
				</div>
			</section>
			<div className='flex justify-center'>
				{answer && (
					<div>
						<pre>{answer}</pre>
					</div>
				)}
			</div>
		</div>
	)
}

export default MainPage
