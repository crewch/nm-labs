import { Button } from '@/components/ui/button'
import Link from 'next/link'

const Header = () => {
	return (
		<header className='flex justify-center gap-5'>
			<Button asChild variant={'link'}>
				<Link href={'/'}>Home</Link>
			</Button>
			<Button asChild variant={'link'}>
				<Link href={'linear'}>Linear</Link>
			</Button>
			<Button asChild variant={'link'}>
				<Link href={'system'}>System</Link>
			</Button>
		</header>
	)
}

export default Header
