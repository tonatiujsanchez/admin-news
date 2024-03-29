import { FC, useEffect, useRef, useState } from "react"
import { useRouter } from "next/router"
import Image from "next/image"
import NextLink from "next/link"

import { useForm } from "react-hook-form"

import { useData } from "../../../hooks"
import { Checkbox, ImagesSelectModal, ModalContainer } from "../ui"
import { LoadingCircle } from "../utilities"
import { validations } from "../../../utils/shared"
import { IUser } from "../../../interfaces"



const imageMimeType = /image\/(png|jpg|jpeg|gif|webp)/i;


interface IUserForm {
    _id?    :  string
    name    : string
    email   : string
    password: string
    repitePassword: string
    role    : string
    photo?  :   string
    active :   boolean
}

interface Props {
    userEdit?: IUser
}


export const UserForm:FC<Props> = ({ userEdit }) => {

    const [loadingSubmit, setLoadingSubmit] = useState(false)
    const [showImagesModal, setShowImagesModal] = useState(false)

    const [photo, setPhotoAuthor] = useState<string>()
    
    const router = useRouter()

    const { addNewUser, updateUser } = useData()

    const { register, handleSubmit, watch, reset, formState: { errors }, setValue, getValues } = useForm<IUserForm>({
        defaultValues: {
            role: 'editor',
            name: '',
            email: '',
            password: '',
            repitePassword: '',
            active: true
        }
    })


    const password = useRef({})
    password.current = watch("password", "")

    
    useEffect(()=>{
        if(userEdit){
            reset({
                role: userEdit.role,
                name: userEdit.name,
                email: userEdit.email,
                photo: userEdit.photo,
                password: '',
                repitePassword: '',
                active: userEdit.active
            })
            setPhotoAuthor(userEdit.photo)
        }
    },[userEdit])


    const onCalcel = () => {
        router.replace('/admin/usuarios')
    }

    // Image select and preview 

    const removePhoto = () => {
        setPhotoAuthor(undefined)
        setValue('photo', undefined, { shouldValidate: true })
    }

    const handleSelectedImage = async( fnSelectedImage:()=> Promise<string | undefined> ) => {

        const image = await fnSelectedImage()

        if(image) {
            setValue('photo', image, { shouldValidate: true })
            setPhotoAuthor(image)
        }

        setShowImagesModal(false)
    }

    const handleSetActive = () => {
        setValue('active', !getValues('active'), { shouldValidate: true })
    }


    const onUserSubmit = async ({ role, name, email, password, photo, active }:IUserForm) => {

        setLoadingSubmit(true)

        if( userEdit ){
            // Editar
            const newUser = {
                ...userEdit,
                role,
                name,
                email,
                photo,
                active
            }
            const { hasError } = await updateUser(newUser)
            if(hasError){
                setLoadingSubmit(false)
                return
            }

        }else{
            // Nuevo            
            const { hasError } = await addNewUser({
                role, 
                name, 
                email, 
                password, 
                photo,
                active
            })

            if(hasError){
                setLoadingSubmit(false)
                return
            }
        }

        router.replace('/admin/usuarios')
    }



    return (
        <div className="py-5 mx-auto">
            <div className="max-w-[260px] h-72 mx-auto">
                { photo
                    ? (
                        <div className="relative group mb-5 flex justify-center w-full h-full border-white border-8 shadow-lg">
                            <Image
                                priority
                                fill
                                sizes="(max-width: 100%) 100%"
                                src={ photo || '' }
                                alt={'Nombre de pagina'}
                                className='cover' 
                            />
                            <button
                                onClick={removePhoto}
                                type="button"
                                disabled={loadingSubmit} 
                                className="absolute -top-6 -right-6 shadow text-white bg-red-500 rounded-full w-12 h-12 hover:bg-red-600 active:scale-95 hover:shadow-2xl disabled:opacity-0">
                                <i className='bx bx-trash'></i>
                            </button>
                        </div>

                    ):(
                        <div
                            onClick={()=> setShowImagesModal(true)} 
                            className={`w-full h-full group border-dashed border-2 border-gray-300 flex justify-center items-center mb-5 ${loadingSubmit ? '' : 'hover:border-slate-800 hover:cursor-pointer'}`}
                        >
                            <i className={`bx bxs-image-add text-6xl text-slate-800 opacity-60 ${ loadingSubmit ? '' : 'group-hover:opacity-100' }`}></i>
                        </div>
                    )
                }
            </div>
            <form onSubmit={handleSubmit(onUserSubmit)} className="max-w-[500px] mx-auto">
                <div className="my-6">
                    <label htmlFor="role" className="block font-bold text-slate-800">
                        Rol <span className="text-red-500">*</span>
                    </label>
                    <select
                        id="role"
                        disabled={loadingSubmit}
                        className={`w-full rounded-md flex-1 border p-5 disabled:border-slate-200 ${ !!errors.role ? 'outline outline-2 outline-red-500' :'hover:border-slate-800' }`}
                        {...register('role', {
                            required: 'El role es requerido',
                        })}
                    >
                        <option value="editor">Editor</option>
                        <option value="admin">Administrador</option>
                    </select>
                    {
                        !!errors.role &&
                        <p className="text-xl text-red-600 mt-2">{errors.role.message}</p>
                    }
                </div>
                <div className="my-6">
                    <label htmlFor="name" className="block font-bold text-slate-800">
                        Nombre <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        id="name"
                        disabled={loadingSubmit}
                        className={`border mt-2 block w-full p-5 rounded-md text-md ${ !!errors.name ? 'outline outline-2 outline-red-500' :'hover:border-slate-800' }`}
                        {...register('name', {
                            required: 'El nombre es requerido',
                            validate: ( value ) => value.trim() === ''? 'El nombre es requerido' : undefined
                        })}
                    />
                    {
                        !!errors.name &&
                        <p className="text-xl text-red-600 mt-2">{errors.name.message}</p>
                    }
                </div>
                <div className="my-6">
                    <label htmlFor="email" className="block font-bold text-slate-800">
                        Correo <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="email"
                        id="email"
                        disabled={loadingSubmit}
                        {...register('email', {
                            required: 'El correro es requerido',
                            validate: validations.isEmail
                        })}
                        className={`border mt-2 block w-full p-5 rounded-md text-md ${ !!errors.email ? 'outline outline-2 outline-red-500' :'hover:border-slate-800' }`}
                    />
                    {
                        !!errors.email &&
                        <p className="text-xl text-red-600 mt-2">{errors.email.message}</p>
                    }
                </div>
                {
                 userEdit
                    ?<div className="text-2xl ml-2">
                        <NextLink 
                            href={`/admin/usuarios/cambiar-password/${userEdit._id}`}
                            className="text-blue-500 hover:text-blue-800"
                        >
                            Cambiar contraseña
                        </NextLink>
                    </div>    
                    :<>
                        <div className="my-6">
                            <label htmlFor="password" className="block font-bold text-slate-800">
                                Contraseña <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="password"
                                id="password"
                                disabled={loadingSubmit}
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
                        <div className="my-6">
                            <label htmlFor="repitePassword" className="block font-bold text-slate-800">
                                Repite Contraseña <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="password"
                                id="repitePassword"
                                disabled={loadingSubmit}
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
                    </>
                }
                <div className="mt-5">
                    <Checkbox 
                        value={ getValues('active') } 
                        name="active-user" 
                        onCheckChange={handleSetActive}
                        label="Activo" 
                        processing={ loadingSubmit }
                    />
                </div>
                <div className="flex flex-col items-center justify-end gap-4 sm:flex sm:flex-row mt-10">
                    <button
                        type="button"
                        disabled={loadingSubmit}
                        onClick={onCalcel}
                        className="py-4 px-6 border border-gray-300 w-full sm:w-auto rounded-md cursor-pointer transition-colors hover:bg-slate-100 active:scale-95 disabled:scale-100 disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:bg-white"
                    >
                        Cancelar
                    </button>
                    <button
                        type="submit"
                        disabled={loadingSubmit}
                        className="bg-sky-500 hover:bg-sky-600 text-white font-semibold py-4 px-8 w-full sm:w-auto rounded-md cursor-pointer transition-colors min-w-[120px] flex justify-center disabled:bg-sky-300 disabled:cursor-not-allowed disabled:hover:bg-sky-300"
                    >
                        { loadingSubmit 
                            ? <LoadingCircle />
                            : <span>
                                { userEdit ? 'Editar' : 'Agregar'}
                                </span>
                        }
                    </button>
                </div>
            </form>
            {
                showImagesModal && (
                    <ModalContainer heightFull={true} widthLg={true}>
                        <ImagesSelectModal
                            sectionImages="users" 
                            handleSelectedImage={handleSelectedImage}
                        />
                    </ModalContainer>
                )
            }
        </div>
    )
}
