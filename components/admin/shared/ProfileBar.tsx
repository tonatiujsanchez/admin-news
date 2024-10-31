import { useState } from "react"

import NextLink from 'next/link'

import { useAuth } from "../../../hooks"
import Image from 'next/image';

export const ProfileBar = () => {

    const [showProfileOptions, setShowProfileOptions] = useState(false)
    const { user, logout } = useAuth()


    return (
        <>
            {!user
                ? (
                    <div className="flex justify-end items-center gap-4 bg-white py-5 px-5 shadow">
                        <div className="animate-pulse space-x-4 rounded-md bg-slate-300 h-7 w-60"></div>
                        <div className="animate-pulse space-x-4 rounded-full bg-slate-300 h-14 w-14"></div>
                    </div>
                ):
                (
                    <div className="flex items-center justify-between sm:justify-end bg-white py-2 sm:py-5 px-5 shadow">
                        <NextLink href="/admin" className="mt-2 sm:hidden">
                            <i className='bx bxs-dashboard text-4xl'></i>
                        </NextLink>
                        <div className="flex items-center gap-4">
                            <p className="font-bold text-slate-700 capitalize">{user.name}</p>
                            <div>
                                <div
                                    onClick={() => setShowProfileOptions(!showProfileOptions)} 
                                    className="relative w-14 h-14 rounded-full overflow-hidden cursor-pointer group border bg-white">
                                    {
                                        user.photo 
                                        ?(
                                            <Image
                                                priority
                                                fill
                                                sizes="(max-width: 125px) 125px"
                                                src={user.photo}
                                                alt={user.name}
                                                className='cover rounded-full bg-gray-200 border-2 border-white aspect-w-1 aspect-h-1 overflow-hidden group-hover:opacity-75 lg:aspect-none'        
                                            />
                                        ):(
                                            <div className="w-full h-full flex justify-center items-center rounded-full bg-gray-200 border-2 border-white">
                                                <p className="font-bold text-3xl text-slate-800 uppercase">{user.name.slice(0, 1)}</p>
                                            </div>
                                        )
                                    }
                                    
                                </div>
                                {
                                    showProfileOptions &&
                                    <div className="origin-top-right absolute right-5 mt-5 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none" role="menu">
                                        <div className="py-2" role="none">
                                            <button
                                                className="w-full text-left text-gray-700 flex items-center gap-2 px-4 py-3 text-xl hover:bg-gray-100 hover:text-gray-900">
                                                <i className='bx bxs-user text-3xl'></i>
                                                <span>Perfil</span>
                                            </button>
                                            {
                                                user.role === 'admin' &&
                                                <NextLink 
                                                    href="/admin/usuarios" 
                                                    className="w-full text-left text-gray-700 flex items-center gap-2 px-4 py-3 text-xl hover:bg-gray-100 hover:text-gray-900"
                                                >
                                                    <i className='bx bx-shield-quarter text-3xl'></i>
                                                    <span>Usuarios</span>  
                                                </NextLink>
                                            }
                                            <button
                                                onClick={ logout } 
                                                className="w-full text-left text-gray-700 flex items-center gap-2 px-4 py-3 text-xl hover:bg-gray-100 hover:text-gray-900">
                                                <i className='bx bx-log-out text-3xl'></i>
                                                <span>Cerrar Sesión</span>
                                            </button>
                                        </div>
                                    </div>
                                }
                            </div>
                        </div>
                    </div>
                )
            }
        </>
    )
}
