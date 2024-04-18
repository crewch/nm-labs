import type { Metadata } from 'next'
import Header from './(layout)/Header'
import Workplace from './(layout)/Workplace'

export const metadata: Metadata = {
	title: { default: 'Lab 1', template: '%s | Lab 1' },
	description: 'Lab 1',
}

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode
}>) {
	return (
		<>
			<Header />
			<Workplace />
			{children}
		</>
	)
}
