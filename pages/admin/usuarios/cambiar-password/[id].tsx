import { useEffect, useRef, useState } from "react"
import { NextPage } from "next"
import { useRouter } from "next/router"

import { useForm } from "react-hook-form"

import { useData } from "../../../../hooks"

import { LayoutAdmin } from "../../../../components/layouts"
import { TitlePage } from "../../../../components/admin/ui"
import { LoadingAdmin, LoadingCircle } from "../../../../components/admin/utilities"

import { IUser } from "../../../../interfaces"

interface PasswordForm{
    password: string
    repitePassword: string
}

const CambiarPasswordPage:NextPage = () => {

    const router = useRouter()
    const [userEdit, setUserEdit] = useState<IUser>()
    const [loadingPassword, setLoadingPassword] = useState(false)

    const { register, handleSubmit, watch, formState: { errors } } = useForm<PasswordForm>()

    const password = useRef({})
    password.current = watch("password", "")

    const { users, updatePassword } = useData()


    useEffect(() => {

        if(users.length === 0){ 
            router.replace('/admin/usuarios')
            return 
        }

        const user = users.find(user => user._id === router.query.id)
        if (user) {
            setUserEdit({ ...user })
        } else {
            router.replace('/admin/usuarios')
        }
    }, [users])

    const onCalcel = () => {
        router.back()
    }

    
    const onPasswordSubmit = async ({ password }: PasswordForm) => {

        setLoadingPassword(true)

        const { hasError } = await updatePassword(userEdit?._id!, password)
    
        if(hasError){
            setLoadingPassword(false)
            return
        }

        router.replace('/admin/usuarios')
    }


    return (
        <LayoutAdmin title="- Cambiar contraseña" >
            {
                !userEdit
                ?(
                    <div className="flex justify-center mt-96">
                        <LoadingAdmin />
                    </div>
                ):(
                    <>
                        <div className="mb-5 flex flex-col gap-2 items-start py-3">
                            <TitlePage title="Cambiar contraseña" />
                            <p>Cambiando contraseña de: <strong>{userEdit.name}</strong></p>
                        </div>
                        <form onSubmit={handleSubmit(onPasswordSubmit)} className="max-w-[500px] mx-auto mt-16">
                            <div className="my-7">
                                <label htmlFor="password" className="block font-bold text-slate-800">
                                    Contraseña <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="password"
                                    id="password"
                                    {...register('password', {
                                        required: 'Contraseña requerida',
                                        minLength: { value: 6, message: 'Se requieren minimo 6 caracteres' }
                                    })}
                                    className={`border mt-2 block w-full p-5 rounded-md text-md ${ !!errors.password ? 'outline outline-2 outline-red-500' :'hover:border-slate-800' }`}
                                />
                                {
                                    !!errors.password &&
                                    <p className="text-xl text-red-600 mt-2">{errors.password.message}</p>
                                }
                            </div>
                            <div className="my-7">
                                <label htmlFor="repitePassword" className="block font-bold text-slate-800">
                                    Repite Contraseña <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="password"
                                    id="repitePassword"
                                    {...register('repitePassword', {
                                        required: 'Repite la contraseña',
                                        minLength: { value: 6, message: 'Se requieren minimo 6 caracteres' },
                                        validate: value => value === password.current || "Las contraseñas no coinsiden"
                                    })}
                                    className={`border mt-2 block w-full p-5 rounded-md text-md ${ !!errors.repitePassword ? 'outline outline-2 outline-red-500' :'hover:border-slate-800' }`}
                                />
                                {
                                    !!errors.repitePassword &&
                                    <p className="text-xl text-red-600 mt-2">{errors.repitePassword.message}</p>
                                }
                            </div>
                            <div className="flex flex-col items-center justify-end gap-4 sm:flex sm:flex-row mt-16">
                                <button
                                    type="button"
                                    disabled={loadingPassword}
                                    onClick={onCalcel}
                                    className="py-4 px-6 border border-gray-300 w-full sm:w-auto rounded-md cursor-pointer transition-colors hover:bg-slate-100 active:scale-95 disabled:scale-100 disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:bg-white"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    disabled={loadingPassword}
                                    className="bg-sky-500 hover:bg-sky-600 text-white font-semibold py-4 px-8 w-full sm:w-auto rounded-md cursor-pointer transition-colors min-w-[120px] flex justify-center disabled:bg-sky-300 disabled:cursor-not-allowed disabled:hover:bg-sky-300"
                                >
                                    {loadingPassword
                                        ? <LoadingCircle />
                                        : <span>Cambiar</span>
                                    }
                                </button>
                            </div>
                        </form>
                    </>
                )
            }
        </LayoutAdmin>
    )


}

export default CambiarPasswordPage