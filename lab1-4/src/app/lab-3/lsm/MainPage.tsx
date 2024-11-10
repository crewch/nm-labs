'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Task3 } from '@/tests/lab3/lsm.test'
import { useEffect, useState } from 'react'
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
	const [x, setX] = useState<string[]>(['0', '0', '0', '0'])
	const [f, setF] = useState<string[]>(['0', '0', '0', '0'])
	const [answer, setAnswer] = useState<{
		result: string
		polys: { poly1: number[]; poly2: number[] }
	} | null>(null)

	const handleSolve = () => {
		const task = new Task3(x.map(Number), f.map(Number))
		const [result1, poly1] = task.run(2)
		const [result2, poly2] = task.run(3)

		setAnswer({ result: `${result1}\n${result2}`, polys: { poly1, poly2 } })
	}

	const handleTest = () => {
		const testX = ['-0.7', '-0.4', '-0.1', '0.2', '0.5', '0.8']
		const testF = ['2.3462', '1.9823', '1.671', '1.3694', '1.0472', '0.6435']

		setN(6)
		setX(testX)
		setF(testF)

		const task = new Task3(testX.map(Number), testF.map(Number))
		const [result1, poly1] = task.run(2)
		const [result2, poly2] = task.run(3)

		setAnswer({ result: `${result1}\n${result2}`, polys: { poly1, poly2 } })
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
			</section>
			<div className='flex justify-center'>
				{answer && (
					<div>
						<pre>{answer.result}</pre>
						<Line
							data={{
								datasets: [answer.polys.poly1, answer.polys.poly2].map(
									(poly, index) => {
										const data = x.map(x => ({
											x: +x,
											y: calculatePolynomial(+x, poly),
										}))

										return {
											label: `Polynomial ${index + 1}`,
											data,
											borderColor: `hsl(${index * 90}, 70%, 50%)`,
											borderWidth: 2,
										}
									}
								),
							}}
							options={{
								scales: {
									x: {
										type: 'linear',
										position: 'bottom',
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
