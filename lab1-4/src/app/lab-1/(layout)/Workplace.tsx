'use client'

import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useEffect } from 'react'
import { useVariables, useWorkplaceParams } from '../(store)/store'

const generateColumnHeaders = (n: number): string[] => {
	return Array.from({ length: n }, (_, i) => `A${i + 1}`)
}

const Workplace = () => {
	const { changeEps, changeN, params } = useWorkplaceParams()
	const {
		variables: { matrix, vector },
		setMatrix,
		setVector,
	} = useVariables()

	const columnHeaders = generateColumnHeaders(+params.n)

	const updateMatrix = (row: number, col: number, value: string) => {
		const newMatrix = [...matrix]
		newMatrix[row][col] = value
		setMatrix(newMatrix)
	}

	const updateVector = (index: number, value: string) => {
		const newVector = [...vector]
		newVector[index] = value
		setVector(newVector)
	}

	useEffect(() => {
		const updateMatrixSize = (newSize: number) => {
			setMatrix(
				Array(newSize)
					.fill(null)
					.map((_, i) =>
						Array(newSize)
							.fill(null)
							.map((_, j) => (matrix[i] && matrix[i][j] ? matrix[i][j] : '0'))
					)
			)
		}

		const updateVectorSize = (newSize: number) => {
			let newVector = [...vector]
			const vectorLen = newVector.length

			if (newSize > vectorLen) {
				for (let i = vectorLen; i < newSize; i++) {
					newVector[i] = '0'
				}
			} else {
				newVector = newVector.slice(0, newSize)
			}

			setVector(newVector)
		}

		updateVectorSize(+params.n)
		updateMatrixSize(+params.n)
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [params.n])

	return (
		<div className='mt-5 flex flex-col gap-5'>
			<section className='flex justify-center gap-5'>
				<div>
					<Label>n</Label>
					<Input
						type='number'
						value={`${params.n}`}
						onChange={e => changeN(e.target.value)}
						onKeyDown={e => {
							if (e.key !== 'ArrowUp' && e.key !== 'ArrowDown')
								e.preventDefault()
						}}
						min={1}
						max={6}
					/>
				</div>
				<div>
					<Label>eps</Label>
					<Input
						type='number'
						value={`${params.eps}`}
						onChange={e => changeEps(e.target.value)}
						min={0}
						max={1}
						step={0.01}
					/>
				</div>
			</section>
			<section className='flex justify-center gap-10 mb-8'>
				<div>
					<div className='flex gap-1'>
						{columnHeaders.map(header => (
							<div key={header} className='w-24 pl-1'>
								{header}
							</div>
						))}
					</div>
					<div className='flex flex-col gap-1'>
						{matrix.map((row, rowIndex) => (
							<div key={rowIndex} className='flex gap-1'>
								{row.map((item, columnIndex) => (
									<Input
										type='number'
										value={item}
										step={1}
										onChange={e =>
											updateMatrix(rowIndex, columnIndex, e.target.value)
										}
										key={columnIndex}
										className='w-24'
									/>
								))}
							</div>
						))}
					</div>
				</div>
				<div>
					<div>B:</div>
					<div className='flex flex-col gap-1'>
						{vector.map((item, index) => (
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
			</section>
		</div>
	)
}

export default Workplace
