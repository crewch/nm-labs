import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import Link from 'next/link'

const MainPage = () => {
	return (
		<header className='flex flex-col gap-4'>
			<h1 className='text-6xl text-center'>Labs</h1>
			<Separator />
			<nav className='flex justify-center items-center gap-10 h-10'>
				<Button asChild variant={'link'} className='text-2xl'>
					<Link href={'lab-1/lu-decomposition'}>Lab 1</Link>
				</Button>
				<Separator orientation='vertical' />
				<Button asChild variant={'link'} className='text-2xl'>
					<Link href={'lab-2/linear'}>Lab 2</Link>
				</Button>
				<Separator orientation='vertical' />
				<Button asChild variant={'link'} className='text-2xl'>
					<Link href={'lab-3/'}>Lab 3</Link>
				</Button>
				<Separator orientation='vertical' />
				<Button asChild variant={'link'} className='text-2xl'>
					<Link href={'lab-4/'}>Lab 4</Link>
				</Button>
			</nav>
		</header>
	)
}

export default MainPage
