'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Task4 } from '@/tests/lab3/derivative.test'
import { useEffect, useState } from 'react'

const MainPage = () => {
	const [n, setN] = useState(4)
	const [xStar, setXStar] = useState(0.1)
	const [x, setX] = useState<string[]>(['0', '0', '0', '0'])
	const [f, setF] = useState<string[]>(['0', '0', '0', '0'])
	const [answer, setAnswer] = useState<string | null>(null)

	const handleSolve = () => {
		const task = new Task4(x.map(Number), f.map(Number), xStar)
		let result = `${task.run(1)}${task.run(2)}`

		setAnswer(result)
	}

	const handleTest = () => {
		const testXStar = 1
		const testX = ['-1', '0', '1', '2', '3']
		const testF = ['2.3562', '1.5708', '0.7854', '0.46365', '0.32175']

		setN(5)
		setXStar(testXStar)
		setX(testX)
		setF(testF)

		const task = new Task4(testX.map(Number), testF.map(Number), testXStar)
		const result = `${task.run(1)}${task.run(2)}`

		setAnswer(result)
	}

	const handleClear = () => {
		setAnswer(null)
		setN(4)
		setX(['0', '0', '0', '0'])
		setF(['0', '0', '0', '0'])
	}

	const updateVectorX = (index: number, value: string) => {
		const newVector = [...x]
		newVector[index] = value

		setX(newVector)
	}

	const updateVectorF = (index: number, value: string) => {
		const newVector = [...f]
		newVector[index] = value

		setF(newVector)
	}

	useEffect(() => {
		const updateVectorSize = (newSize: number) => {
			let newVectorX = [...x]
			let newVectorF = [...f]
			const vectorLen = newVectorX.length

			if (newSize > vectorLen) {
				for (let i = vectorLen; i < newSize; i++) {
					newVectorX[i] = '0'
					newVectorF[i] = '0'
				}
			} else {
				newVectorX = newVectorX.slice(0, newSize)
				newVectorF = newVectorF.slice(0, newSize)
			}

			setX(newVectorX)
			setF(newVectorF)
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
						<div>
							<Label>f</Label>
							<div className='flex gap-1'>
								{f.map((item, index) => (
									<div key={index}>
										<Input
											type='number'
											value={item}
											onChange={e => updateVectorF(index, e.target.value)}
											className='w-28'
										/>
									</div>
								))}
							</div>
						</div>
					</div>
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
