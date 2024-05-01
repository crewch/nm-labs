import type { Metadata } from 'next'
import Header from './(layout)/Header'

export const metadata: Metadata = {
	title: { default: 'Lab 2', template: '%s | Lab 2' },
	description: 'Lab 2',
}

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode
}>) {
	return (
		<>
			<Header />
			{children}
		</>
	)
}
