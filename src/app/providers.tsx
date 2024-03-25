import MatrixAndVectorContextProvider from '@/context/MatrixAndVectorContextProvider'
import ParamsContextProvider from '@/context/ParamsContextProvider'
import { PropsWithChildren } from 'react'

const Providers = ({ children }: PropsWithChildren<{}>) => {
	return (
		<ParamsContextProvider>
			<MatrixAndVectorContextProvider>
				{children}
			</MatrixAndVectorContextProvider>
		</ParamsContextProvider>
	)
}

export default Providers
