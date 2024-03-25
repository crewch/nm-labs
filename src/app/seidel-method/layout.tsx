import { Metadata } from 'next'
import { PropsWithChildren } from 'react'

export const metadata: Metadata = {
	title: 'seidel method',
}

const layout = ({ children }: PropsWithChildren) => {
	return <>{children}</>
}

export default layout
