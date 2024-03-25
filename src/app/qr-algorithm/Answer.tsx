import Matrix from '@/components/Matrix'
import Vector from '@/components/Vector'
import { IMatrix, IVector } from '@/context/MatrixAndVectorContextProvider'
import { memo } from 'react'

interface IAnswer {}

const Answer = ({ answer: {} }: { answer: IAnswer }) => {
	return <div className='flex flex-col items-center gap-5'></div>
}

export default memo(Answer)
