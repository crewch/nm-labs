'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { runTask1 } from '@/tests/lab3/interpolation.test'
import { useEffect, useState } from 'react'

const MainPage = () => {
	const [n, setN] = useState(4)
	const [xStar, setXStar] = useState(0.1)
	const [y, setY] = useState('')
	const [x, setX] = useState<string[]>(['0', '0', '0', '0'])
	const [show, setShow] = useState<'test' | 'solve' | 'no'>('no')
	const [answer, setAnswer] = useState<string | null>(null)

	const handleSolve = () => {
		setShow('solve')
		setAnswer(runTask1({ y, x: x.map(Number), xStar }))
	}

	const handleTest = () => {
		setShow('test')
		setN(4)
		setXStar(0.1)
		setY('arccos(x)')
		setX(['-0.4', '-0.1', '0.2', '0.5'])
		setAnswer(
			runTask1({ y: 'arccos(x)', x: [-0.4, -0.1, 0.2, 0.5], xStar: 0.1 })
		)
	}

	const handleClear = () => {
		setShow('no')
		setY('')
		setX(['0', '0', '0', '0'])
	}

	const updateVector = (index: number, value: string) => {
		const newVector = [...x]
		newVector[index] = value
		setX(newVector)
	}

	useEffect(() => {
		const updateVectorSize = (newSize: number) => {
			let newVector = [...x]
			const vectorLen = newVector.length

			if (newSize > vectorLen) {
				for (let i = vectorLen; i < newSize; i++) {
					newVector[i] = '0'
				}
			} else {
				newVector = newVector.slice(0, newSize)
			}

			setX(newVector)
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
				<div>
					<Label>X</Label>
					<div className='flex gap-1'>
						{x.map((item, index) => (
							<div key={index}>
								<Input
									type='number'
									value={item}
									step={1}
									onChange={e => updateVector(index, e.target.value)}
									className='w-20'
								/>
							</div>
						))}
					</div>
				</div>
				<div>
					<Label>y</Label>
					<Input value={y} onChange={e => setY(e.target.value)} />
				</div>
				<div>
					<Label>X*</Label>
					<Input
						type='number'
						value={xStar}
						onChange={e => setXStar(+e.target.value)}
						step={0.1}
						className='w-20'
					/>
				</div>
			</section>
			<div className='flex justify-center'>
				{show === 'test' && answer && <pre>{answer}</pre>}
				{show === 'solve' && answer && <pre>{answer}</pre>}
			</div>
		</div>
	)
}

export default MainPage
