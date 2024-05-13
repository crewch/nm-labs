import type { Metadata } from 'next'
import Header from './(layout)/Header'

export const metadata: Metadata = {
	title: { default: 'Lab 4', template: '%s | Lab 4' },
	description: 'Lab 4',
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
