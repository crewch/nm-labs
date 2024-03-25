import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Header from './(layout)/Header'
import { cn } from '@/lib/utils'
import Workplace from './(layout)/Workplace'
import Providers from './providers'

const inter = Inter({ subsets: ['latin', 'cyrillic'] })

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
		<html lang='en'>
			<body className={cn(inter.className, 'm-5')}>
				<Providers>
					<Header />
					<Workplace />
					{children}
				</Providers>
			</body>
		</html>
	)
}
