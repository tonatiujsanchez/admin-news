import type { AppProps } from 'next/app'

import { ToastContainer } from 'react-toastify'

import { AuthProvider } from '../context/auth'
import { DataProvider } from '../context/data'
import { UIProvider } from '../context/ui'

import 'boxicons/css/boxicons.min.css'
import 'react-toastify/dist/ReactToastify.css'
import '../styles/globals.css'



export default function App({ Component, pageProps }: AppProps) {
    return (
        <AuthProvider>
            <DataProvider>
                <UIProvider>
                    <>
                        <ToastContainer />
                        <Component {...pageProps} />
                    </>
                </UIProvider>
            </DataProvider>
        </AuthProvider>
    )
}
