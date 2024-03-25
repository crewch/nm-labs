import { NextRequest, NextResponse } from 'next/server'

export async function middleware(request: NextRequest, response: NextResponse) {
	const { url, nextUrl } = request

	if (nextUrl.pathname === '/') {
		return NextResponse.redirect(new URL('/lu-decomposition', url))
	}

	return NextResponse.next()
}

export const config = {
	matcher: ['/'],
}
