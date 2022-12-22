import { FC, useEffect, useRef, useState } from "react"

import Image from "next/image"
import { useRouter } from 'next/router'

import { toast } from 'react-toastify'
import { useForm } from "react-hook-form"

import { useUI } from "../../../hooks/useUI"
import { useData } from "../../../hooks/useData"

import { LoadingCircle } from "../utilities"
import { IAuthor } from "../../../interfaces"
import { validations } from "../../../utils/shared"


const imageMimeType = /image\/(png|jpg|jpeg|gif|webp)/i;

interface Props {
    authorEdit?: IAuthor
}

export const AuthorForm:FC<Props> = ({ authorEdit }) => {

    const [loadingSubmit, setLoadingSubmit] = useState(false)

    const router = useRouter()

    // Photo
    const [file, setFile] = useState(null);
    const [fileDataURL, setFileDataURL] = useState(null);
    const [photo, setPhoto] = useState<string>()


    const fileInputRef = useRef<HTMLInputElement>(null)

    const { showSideMenu } = useUI()

    const { addNewImage, addNewAuthor } = useData()

    const { register, handleSubmit, formState:{ errors }, getValues, setValue, reset } = useForm<IAuthor>({
        defaultValues: {
            name: '',
            facebook: '',
            twitter: '',
            instagram: '',
            email: '',
            phone: '',
            web: '',
            occupation: '',
            description: '',
        }
    })


    useEffect(() => {
        if (authorEdit) {
            reset({
                name: authorEdit.name,
                facebook: authorEdit.facebook,
                twitter: authorEdit.twitter,
                instagram: authorEdit.instagram,
                email: authorEdit.email,
                phone: authorEdit.phone,
                web: authorEdit.web,
                occupation: authorEdit.occupation,
                description: authorEdit.description,
            })
            setPhoto( authorEdit.photo )
        }
    }, [authorEdit])


    // Photo
    const handleFileChange = (e:any) => {

        if( !e.target.files || e.target.files.length === 0 ){
            return
        }
       
        const fileSelected = e.target.files[0]

        if (!fileSelected.type.match(imageMimeType)) {
            toast.error('Formato no válido', {
                theme: "colored",
                autoClose: 1000
            })
            return
        }
        
        setFile(fileSelected)
    }

    useEffect(() => {
        let fileReader:any;
        let isCancel: boolean = false;

        if (file) {
            fileReader = new FileReader()
            fileReader.onload = (e:any) => {
                const { result } = e.target
                if (result && !isCancel) {
                    setFile(file)
                    setFileDataURL(result)
                }
            }
            fileReader.readAsDataURL(file)
        }

        return () => {
            isCancel = true
            if (fileReader && fileReader.readyState === 1) {
                fileReader.abort()
            }
        }
    }, [file])

    const removePhoto = () => {
        setPhoto(undefined)
        setFile(null)
        setFileDataURL(null)
        if(fileInputRef.current?.value){
            fileInputRef.current.value = ''
        }
    }


    const onCalcel = () => {
        router.back()
    }

    
    const onSave = async({ name, facebook, twitter, instagram, email, phone, web, occupation, description}:IAuthor) => {


        setLoadingSubmit(true)

        let newImageUrl =  null
        if(file){

            const formData = new FormData()
            formData.append('file', file)
            formData.append('section', 'authors')

            const { hasError, urlImage } = await addNewImage(formData)
            
            if(hasError){
                setLoadingSubmit(false)
                return
            }
            
            newImageUrl = urlImage
        }

        const newAuthor:IAuthor = {
            ...authorEdit,
            name,
            facebook,
            twitter,
            instagram,
            email,
            phone,
            web,
            occupation,
            description,
            photo: newImageUrl 
                ? newImageUrl 
                : photo
        }

        
        if (authorEdit) {
            // const { hasError } = await updateAuthor(newAuthor)
            // if(hasError){
            //     setLoadingSubmit(false)
            //     return
            // }
        } else {

            const { hasError } = await addNewAuthor(newAuthor)
            if(hasError){
                setLoadingSubmit(false)
                return
            }
        }

        router.replace('/admin/autores')
    }



    return (
        <>
            <form 
                onSubmit={handleSubmit(onSave)}
                className="flex flex-col sm:flex-row gap-10 sm:flex-wrap"
            >
                <section className={`bg-white p-5 sm:p-10 rounded-md lg:order-2 min-w-[300px] ${showSideMenu ? 'w-full' : 'sm:w-[300px]'} lg:w-[320px]`}>
                    {
                        fileDataURL || photo
                            ? (
                                <div className="relative group mb-5 flex justify-center w-[full] h-80 shadow mx-auto">
                                    <Image
                                        priority
                                        fill
                                        sizes="(max-width: 100%) 100%"
                                        src={ fileDataURL || photo || 'profilePic'}
                                        alt={'Nombre de pagina'}
                                        className='cover p-3' 
                                    />
                                    <button
                                        onClick={removePhoto}
                                        type="button"
                                        disabled={loadingSubmit} 
                                        className="absolute -top-3 -right-3 shadow text-white bg-red-500 rounded-full w-12 h-12 hover:bg-red-600 active:scale-95 hover:shadow-2xl disabled:opacity-0">
                                        <i className='bx bx-trash'></i>
                                    </button>
                                </div>

                            ):(
                                <div className="p-5">
                                    <div
                                        onClick={()=> fileInputRef.current?.click()} 
                                        className={`group mx-auto border-dashed border-2 py-28 flex justify-center mb-5 rounded ${loadingSubmit ? '' : 'hover:border-slate-800 hover:cursor-pointer'}`}>
                                        <i className={`bx bxs-image-add text-6xl text-slate-800 opacity-50 ${ loadingSubmit ? '' : 'group-hover:opacity-100' }`}></i>
                                    </div>
                                </div>
                            )
                    }
                    <div>
                        <h3 className="mb-5 font-semibold text-3xl">Redes Sociales</h3>
                        <div className="mb-4">
                            <div className="flex items-center gap-2">
                                <i className='bx bxl-facebook text-4xl'></i>
                                <input
                                    type="text"
                                    id="facebook"
                                    placeholder="@usuario"
                                    className="bg-admin rounded-md border p-3 flex-1"
                                    {...register('facebook',{
                                        validate: ( value ) => value && validations.isSocialUsername( value )
                                    })} 
                                />
                            </div>
                            {
                                !!errors.facebook &&
                                <p className="text-lg text-red-600 mt-1 ml-12 block">{errors.facebook.message}</p>
                            }
                        </div>
                        <div className="mb-4">
                            <div className="flex items-center gap-2">
                                <i className='bx bxl-twitter text-4xl'></i>
                                <input
                                    type="text"
                                    id="twitter"
                                    placeholder="@usuario"
                                    className="bg-admin rounded-md flex-1 border p-3" 
                                    {...register('twitter',{
                                        validate: ( value ) => value && validations.isSocialUsername( value )
                                    })} 
                                />
                            </div>
                            {
                                !!errors.twitter &&
                                <p className="text-lg text-red-600 mt-1 ml-12 block">{errors.twitter.message}</p>
                            }
                        </div>
                        <div className="mb-4">
                            <div className="flex items-center gap-2">
                                <i className='bx bxl-instagram text-4xl'></i>
                                <input
                                    type="text"
                                    id="instagram"
                                    placeholder="@usuario"
                                    className="bg-admin rounded-md flex-1 border p-3"
                                    {...register('instagram', {
                                        validate: ( value ) => value && validations.isSocialUsername( value )
                                    })} 
                                />
                            </div>
                            {
                                !!errors.instagram &&
                                <p className="text-lg text-red-600 mt-1 ml-12 block">{errors.instagram.message}</p>
                            }
                        </div>
                        <div className="mb-4">
                            <div className="flex items-center gap-2">
                                <i className='bx bx-globe text-4xl'></i>
                                <input
                                    type="text"
                                    id="web"
                                    placeholder="https://sitio-web.com/"
                                    className="bg-admin rounded-md flex-1 border p-3"
                                    {...register('web', {
                                        validate: ( value ) => value 
                                            && !value.includes('https://') && !value.includes('http://') || value!.trim().includes(' ') 
                                            ? 'La url no es válida' : undefined,
                                    })} 
                                />
                            </div>
                            {
                                !!errors.web &&
                                <p className="text-lg text-red-600 mt-1 ml-12 block">{errors.web.message}</p>
                            }
                        </div>
                    </div>
                    <input
                        type="file"
                        style={{ display: 'none' }}
                        disabled={loadingSubmit}
                        ref={ fileInputRef }
                        accept="image/png, image/jpg, image/jpeg, image/gif, image/webp"
                        onChange={handleFileChange}
                    />
                </section>
                <section className="bg-white p-5 sm:p-10 rounded-md sm:order-1 flex-1">
                    <h2 className="mb-10 font-semibold text-4xl">Datos:</h2>
                    <div className="flex flex-col sm:flex-row flex-wrap items-center justify-between">
                        <div className="flex flex-col gap-2 mb-4 w-full lg:w-[48%]">
                            <label htmlFor="name">Nombre</label>
                            <input
                                type="text"
                                id="name"
                                className="bg-admin rounded-md flex-1 border p-5" 
                                { ...register("name", { 
                                        required: 'El nombre es requerido',
                                        validate: (value)=> value.trim() === '' ? 'El nombre es requerido' : undefined
                                    })
                                }
                            />
                            {
                                !!errors.name &&
                                <p className="text-lg text-red-600 block">{errors.name.message}</p>
                            }
                        </div>
                        <div className="flex flex-col gap-2 mb-4 w-full lg:w-[48%]">
                            <label htmlFor="email">Correo</label>
                            <input
                                type="text"
                                id="email"
                                className="bg-admin rounded-md flex-1 border p-5"
                                {...register('email', {
                                    validate: (value)=> value && validations.isEmail(value) 
                                })}
                            />
                            {
                                !!errors.email &&
                                <p className="text-lg text-red-600 block">{errors.email.message}</p>
                            }
                        </div>
                        <div className="flex flex-col gap-2 mb-4 w-full lg:w-[48%]">
                            <label htmlFor="phone">Telefono</label>
                            <input
                                type="text"
                                id="phone"
                                className="bg-admin rounded-md flex-1 border p-5" 
                                {...register('phone')}
                            />
                        </div>
                        <div className="flex flex-col gap-2 mb-4 w-full lg:w-[48%]">
                            <label htmlFor="occupation">Ocupación/Profesión</label>
                            <input
                                type="text"
                                id="occupation"
                                className="bg-admin rounded-md flex-1 border p-5"
                                {...register('occupation')} 
                            />
                        </div>
                        <div className="flex flex-col gap-2 mb-4 w-full">
                            <label htmlFor="description">Descripción</label>
                            <textarea
                                id="description"
                                cols={30}
                                rows={10}
                                className="bg-admin rounded-md flex-1 border p-5"
                                {...register('description')} 
                            >
                            </textarea>
                        </div>
                    </div>

                    <div className="flex items-center justify-end gap-2 mt-5">
                        <button
                            type="button"
                            onClick={onCalcel}
                            disabled={loadingSubmit}
                            className="py-3 px-5 uppercase w-full sm:w-auto rounded-md cursor-pointer transition-colors">
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={loadingSubmit}
                            className="bg-sky-500 hover:bg-sky-600 text-white font-semibold py-3 px-8 uppercase w-full sm:w-auto rounded-md cursor-pointer transition-colors min-w-[120px] flex justify-center disabled:bg-sky-300">
                            {
                                loadingSubmit
                                ? <LoadingCircle />
                                : <span>Guardar</span>
                            }
                            
                        </button>
                    </div>
                </section>
            </form>
        </>
    )
}
