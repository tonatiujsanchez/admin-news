import type { AppProps } from 'next/app'

import { AuthProvider } from '../context/auth'
import { UIProvider } from '../context/ui'

import 'boxicons/css/boxicons.min.css'
import '../styles/globals.css'



export default function App({ Component, pageProps }: AppProps) {
    return (
        <AuthProvider>
            <UIProvider>
                <Component {...pageProps} />
            </UIProvider>
        </AuthProvider>

    )
}
