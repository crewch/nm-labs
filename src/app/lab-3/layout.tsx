import type { Metadata } from 'next'
import Header from './(layout)/Header'

export const metadata: Metadata = {
	title: { default: 'Lab 3', template: '%s | Lab 3' },
	description: 'Lab 3',
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
