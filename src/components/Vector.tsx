import { IVector, IVectorStr } from '@/context/MatrixAndVectorContextProvider'
import { Input } from './ui/input'
import { Label } from './ui/label'

const Vector = ({
	vector,
	label,
}: {
	vector: IVector | IVectorStr
	label?: string
}) => {
	return (
		<div>
			{label && <Label>{label}</Label>}
			<div className='flex gap-1'>
				{vector.map((item, index) => (
					<Input
						className={item.toString().length > 8 ? 'w-36' : 'w-24'}
						value={typeof item === 'string' ? item : item.toFixed(4)}
						key={index}
						readOnly
					/>
				))}
			</div>
		</div>
	)
}

export default Vector
