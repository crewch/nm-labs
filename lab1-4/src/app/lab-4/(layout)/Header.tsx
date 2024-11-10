import { Button } from '@/components/ui/button'
import Link from 'next/link'

const Header = () => {
	return (
		<header className='flex justify-center gap-5'>
			<Button asChild variant={'link'}>
				<Link href={'/'}>Home</Link>
			</Button>
			<Button asChild variant={'link'}>
				<Link href={'cauchy'}>cauchy</Link>
			</Button>
			<Button asChild variant={'link'}>
				<Link href={'boundary-value'}>boundary value</Link>
			</Button>
		</header>
	)
}

export default Header
