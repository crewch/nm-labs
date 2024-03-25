import { Button } from '@/components/ui/button'
import Link from 'next/link'

const Header = () => {
	return (
		<header className='flex justify-center gap-5'>
			<Button asChild variant={'link'}>
				<Link href={'lu-decomposition'}>LU-decomposition</Link>
			</Button>
			<Button asChild variant={'link'}>
				<Link href={'tma'}>TMA</Link>
			</Button>
			<Button asChild variant={'link'}>
				<Link href={'iteration-method'}>Iteration method</Link>
			</Button>
			<Button asChild variant={'link'}>
				<Link href={'seidel-method'}>Seidel method</Link>
			</Button>
			<Button asChild variant={'link'}>
				<Link href={'rotation-method'}>Rotation method</Link>
			</Button>
			<Button asChild variant={'link'}>
				<Link href={'qr-algorithm'}>QR-algorithm</Link>
			</Button>
		</header>
	)
}

export default Header
