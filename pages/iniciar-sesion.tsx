import { useState } from "react"

import { NextPage } from "next"

// import { useAuth } from "../hooks/useAuth"

import { useForm } from "react-hook-form"
import { LoadingCircle } from "../components/admin/utilities"
import { useRouter } from "next/router"
import { useAuth } from "../hooks"
import Image from "next/image"


interface UserAuthentication {
    email: string 
    password: string
}

const IniciarSesionPage:NextPage = () => {


    const [showError, setShowError] = useState(false)
    const [loading, setLoading] = useState(false)
    
    const router = useRouter()


    const { loginUser } = useAuth()

    const { register, handleSubmit, formState: { errors } } = useForm<UserAuthentication>()

    const onLoginUser = async ({ email, password }:UserAuthentication) => {
        setShowError(false)
        setLoading(true)


        const isValidLogin = await loginUser(email, password)

        if (!isValidLogin) {
            setShowError(true)
            setLoading(false)
            setTimeout(() => setShowError(false), 3000)
            return
        }

        // router.replace('/admin')
        router.reload()
    }


    return (
        <main className="bg-admin h-screen flex justify-center items-center">
            <article className="sm:bg-white rounded-lg sm:shadow-lg px-5 sm:px-16 py-20 flex flex-col items-center w-[320px] md:w-[400px] mb-36">
                {/* <img
                    src="https://res.cloudinary.com/ton/image/upload/v1661840375/jurrdmthg3uih7hxxbht.jpg"
                    alt="Logo admin"
                    className="w-32 mb-10"
                /> */}
                <Image
                    src="/images/innovagen-logotipo.png"
                    alt="Logo de InnovaGen Solutions"
                    width={132}
                    height={132}
                    className="w-56 mb-10"
                />
                <form
                    onSubmit={handleSubmit(onLoginUser)}
                    className="w-full"
                >
                    {
                        showError &&
                        <p className="bg-red-100 text-red-600 text-center py-3 rounded-md mb-5 font-medium transition">Usuario o Contraseña no válidos</p>
                    }

                    <div className="mb-8">
                        <label htmlFor="user" className="block text-md mb-2 font-semibold text-gray-500 uppercase">Usuario</label>
                        <input
                            type="text"
                            id="user"
                            className="sm:bg-admin rounded-md flex-1 border p-5 w-full"
                            {...register('email', {
                                required: 'Este campo es requerido',
                            })}
                        />
                        {
                            !!errors.email &&
                            <p className="text-xl text-red-600">{errors.email.message}</p>
                        }
                    </div>
                    <div className="mb-16">
                        <label htmlFor="pwd" className="block text-md mb-2 font-semibold text-gray-500 uppercase">Contraseña</label>
                        <input
                            type="password"
                            id="pwd"
                            className="sm:bg-admin rounded-md flex-1 border p-5 w-full"
                            {...register('password', {
                                required: 'Este campo es requerido',
                            })}
                        />
                        {
                            !!errors.password &&
                            <p className="text-xl text-red-600">{errors.password.message}</p>
                        }
                    </div>
                    <button
                        type="submit"
                        disabled={loading}
                        className="bg-primary-600 hover:bg-primary-500 px-8 py-5 font-semibold rounded-md color-admin w-full ml-auto uppercase disabled:bg-primary-300">
                        {
                            loading
                            ? <div className="flex justify-center text-center"> <LoadingCircle /> </div>
                            : 'Iniciar Sesión'
                        }
                        
                    </button>
                </form>
            </article>
        </main>
    )
}

export default IniciarSesionPage