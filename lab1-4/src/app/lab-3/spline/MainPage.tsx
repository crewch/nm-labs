'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Task2 } from '@/tests/lab3/spline.test'
import { Line } from 'react-chartjs-2'
import {
	Chart as ChartJS,
	CategoryScale,
	LinearScale,
	PointElement,
	LineElement,
	Title,
	Tooltip,
	Legend,
} from 'chart.js'

ChartJS.register(
	CategoryScale,
	LinearScale,
	PointElement,
	LineElement,
	Title,
	Tooltip,
	Legend
)

const MainPage = () => {
	const [n, setN] = useState(4)
	const [xStar, setXStar] = useState(0.1)
	const [x, setX] = useState<string[]>(['0', '0', '0', '0'])
	const [f, setF] = useState<string[]>(['0', '0', '0', '0'])
	const [answer, setAnswer] = useState<{
		result: string
		splines: { polynomials: number[][]; points: number[] }
	} | null>(null)

	const handleSolve = () => {
		const task = new Task2(x.map(Number), f.map(Number), xStar)
		const [result, splines] = task.run()

		setAnswer({ result, splines })
	}

	const handleTest = () => {
		const testXStar = 0.1
		const testX = ['-0.4', '-0.1', '0.2', '0.5', '0.8']
		const testF = ['1.9823', '1.6710', '1.3694', '1.0472', '0.64350']

		setN(5)
		setXStar(testXStar)
		setX(testX)
		setF(testF)

		const task = new Task2(testX.map(Number), testF.map(Number), testXStar)
		const [result, splines] = task.run()

		setAnswer({ result, splines })
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

	function calculatePolynomial(x: number, coefficients: number[]) {
		return coefficients.reduce(
			(acc, coeff, index) => acc + coeff * Math.pow(x, index),
			0
		)
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
						<pre>{answer.result}</pre>
						<Line
							data={{
								datasets: answer.splines.polynomials.map((poly, index) => {
									const start = answer.splines.points[index]
									const end = answer.splines.points[index + 1]
									const range = end - start
									const data = Array.from({
										length: Math.floor(range / 0.012 + 1),
									}).map((_, i) => {
										const x = start + i * 0.012
										return { x, y: calculatePolynomial(x, poly) }
									})
									return {
										label: `Polynomial ${index + 1}`,
										data,
										borderColor: `hsl(${index * 90}, 70%, 50%)`,
										borderWidth: 2,
									}
								}),
							}}
							options={{
								scales: {
									x: {
										type: 'linear',
										position: 'bottom',
									},
									y: {
										beginAtZero: true,
									},
								},
								plugins: {
									legend: {
										display: false,
									},
									title: {
										display: true,
										text: 'Polynomial Graphs',
									},
								},
							}}
						/>
					</div>
				)}
			</div>
		</div>
	)
}

export default MainPage
