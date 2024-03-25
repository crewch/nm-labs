import { IVector } from '@/context/MatrixAndVectorContextProvider'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { roundTo } from '@/utils/roundTo'

const Vector = ({ vector, label }: { vector: IVector; label?: string }) => {
	return (
		<div>
			{label && <Label>{label}</Label>}
			<div className='flex gap-1'>
				{vector.map((item, index) => (
					<Input
						className='w-24'
						value={String(roundTo(item))}
						key={index}
						readOnly
					/>
				))}
			</div>
		</div>
	)
}

export default Vector
