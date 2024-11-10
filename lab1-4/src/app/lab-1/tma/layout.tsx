import { Metadata } from 'next'
import { PropsWithChildren } from 'react'

export const metadata: Metadata = {
	title: 'tma',
}

const layout = ({ children }: PropsWithChildren) => {
	return <>{children}</>
}

export default layout
