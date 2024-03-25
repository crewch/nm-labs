'use client'

import {
	Dispatch,
	PropsWithChildren,
	SetStateAction,
	createContext,
	useState,
} from 'react'

export const ParamsContext = createContext<{
	params: { n: string; eps: string }
	setParams: Dispatch<
		SetStateAction<{
			n: string
			eps: string
		}>
	>
}>({
	params: { n: '4', eps: '0.001' },
	setParams: () => {
		throw new Error('setParams not implemented')
	},
})

const ParamsContextProvider = ({ children }: PropsWithChildren<{}>) => {
	const [params, setParams] = useState({ n: '4', eps: '0.001' })

	return (
		<ParamsContext.Provider value={{ params, setParams }}>
			{children}
		</ParamsContext.Provider>
	)
}

export default ParamsContextProvider
