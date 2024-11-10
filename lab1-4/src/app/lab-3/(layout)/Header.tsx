import { Button } from '@/components/ui/button'
import Link from 'next/link'

const Header = () => {
	return (
		<header className='flex justify-center gap-5'>
			<Button asChild variant={'link'}>
				<Link href={'/'}>Home</Link>
			</Button>
			<Button asChild variant={'link'}>
				<Link href={'interpolation'}>interpolation</Link>
			</Button>
			<Button asChild variant={'link'}>
				<Link href={'spline'}>spline</Link>
			</Button>
			<Button asChild variant={'link'}>
				<Link href={'lsm'}>lsm</Link>
			</Button>
			<Button asChild variant={'link'}>
				<Link href={'derivative'}>derivative</Link>
			</Button>
			<Button asChild variant={'link'}>
				<Link href={'integrate'}>integrate</Link>
			</Button>
		</header>
	)
}

export default Header
