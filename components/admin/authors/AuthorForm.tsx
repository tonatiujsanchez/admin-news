import { FC, useEffect, useRef, useState } from "react"

import Image from "next/image"
import { useRouter } from 'next/router'

import { useForm } from "react-hook-form"

import { useUI } from "../../../hooks/useUI"
import { useData } from "../../../hooks/useData"

import { LoadingCircle } from "../utilities"
import { IAuthor } from "../../../interfaces"
import { validations } from "../../../utils/shared"
import { notifyError } from "../../../utils/frontend"


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

    const { addNewImage, addNewAuthor, updateAuthor } = useData()

    const { register, handleSubmit, formState:{ errors }, getValues, reset } = useForm<IAuthor>({
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
    }, [authorEdit, reset])


    // Photo
    const handleFileChange = (e:any) => {

        if( !e.target.files || e.target.files.length === 0 ){
            return
        }
       
        const fileSelected = e.target.files[0]

        if (!fileSelected.type.match(imageMimeType)) {
            notifyError('Formato no válido')
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
        router.replace('/admin/autores')
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
            const { hasError } = await updateAuthor(newAuthor)
            if(hasError){
                setLoadingSubmit(false)
                return
            }
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
                        <h3 className="mb-5 font-bold text-slate-800">Redes Sociales</h3>
                        <div className="mb-4">
                            <div className="flex items-center gap-2">
                                <i className='bx bxl-facebook text-4xl'></i>
                                <input
                                    type="text"
                                    id="facebook"
                                    disabled={loadingSubmit}
                                    placeholder="@usuario"
                                    className={`bg-admin rounded-md border p-3 flex-1 ${ !!errors.facebook && getValues('facebook') ? 'outline outline-2 outline-red-500' :'hover:border-slate-800 disabled:border-slate-200' }`}
                                    {...register('facebook',{
                                        validate: ( value ) => value ? validations.isSocialUsername( value ) : undefined
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
                                    disabled={loadingSubmit}
                                    placeholder="@usuario"
                                    className={`bg-admin rounded-md flex-1 border p-3 ${ !!errors.twitter && getValues('twitter') ? 'outline outline-2 outline-red-500' :'hover:border-slate-800 disabled:border-slate-200'}`} 
                                    {...register('twitter',{
                                        validate: ( value ) => value ? validations.isSocialUsername( value ) : undefined
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
                                    disabled={loadingSubmit}
                                    placeholder="@usuario"
                                    className={`bg-admin rounded-md flex-1 border p-3 ${ !!errors.instagram && getValues('instagram') ? 'outline outline-2 outline-red-500' :'hover:border-slate-800 disabled:border-slate-200' }`}
                                    {...register('instagram', {
                                        validate: ( value ) => value ? validations.isSocialUsername( value ) : undefined
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
                                    disabled={loadingSubmit}
                                    placeholder="https://sitio-web.com/"
                                    className={`bg-admin rounded-md flex-1 border p-3 ${ !!errors.web && getValues('web') ? 'outline outline-2 outline-red-500' :'hover:border-slate-800 disabled:border-slate-200' }`}
                                    {...register('web', {
                                        validate: ( value ) => value ? validations.isURLWebSite( value ) : undefined,
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
                    <div className="flex flex-col sm:flex-row flex-wrap items-center justify-between">
                        <div className="flex flex-col gap-2 mb-4 w-full lg:w-[48%]">
                            <label htmlFor="name" className="font-bold text-slate-800">Nombre <span className="text-red-500">*</span></label>
                            <input
                                type="text"
                                id="name"
                                disabled={loadingSubmit}
                                className={`bg-admin rounded-md flex-1 border p-5 ${ !!errors.name ? 'outline outline-2 outline-red-500' :'hover:border-slate-800 disabled:border-slate-200' }`} 
                                { ...register("name", { 
                                        required: 'El nombre es requerido',
                                        validate: (value)=> value.trim() === '' ? 'El nombre es requerido' : undefined
                                    })
                                }
                            />
                            {
                                !errors.name &&
                                <p className="text-lg text-transparent block">Nombre completo</p>
                            }
                            {
                                !!errors.name &&
                                <p className="text-lg text-red-600 block">{errors.name.message}</p>
                            }
                        </div>
                        <div className="flex flex-col gap-2 mb-4 w-full lg:w-[48%]">
                            <label htmlFor="email" className="font-bold text-slate-800">Correo</label>
                            <input
                                type="text"
                                id="email"
                                disabled={loadingSubmit}
                                className={`bg-admin rounded-md flex-1 border p-5 ${ !!errors.email && getValues('email') ? 'outline outline-2 outline-red-500' :'hover:border-slate-800 disabled:border-slate-200' }` }
                                {...register('email', {
                                    validate: (value)=> value ? validations.isEmail(value) : undefined
                                })}
                            />
    
                            <p className={`text-lg block ${!!errors.email && getValues('email') ? 'text-red-600':'text-transparent'}`}>Correo no válido</p>
                            
                        </div>
                        <div className="flex flex-col gap-2 mb-4 w-full lg:w-[48%]">
                            <label htmlFor="phone" className="font-bold text-slate-800">Telefono</label>
                            <input
                                type="text"
                                id="phone"
                                disabled={loadingSubmit}
                                className="bg-admin rounded-md flex-1 border p-5 hover:border-slate-800 disabled:border-slate-200" 
                                {...register('phone')}
                            />
                        </div>
                        <div className="flex flex-col gap-2 mb-4 w-full lg:w-[48%]">
                            <label htmlFor="occupation" className="font-bold text-slate-800">Ocupación/Profesión</label>
                            <input
                                type="text"
                                id="occupation"
                                disabled={loadingSubmit}
                                className="bg-admin rounded-md flex-1 border p-5 hover:border-slate-800 disabled:border-slate-200"
                                {...register('occupation')} 
                            />
                        </div>
                        <div className="flex flex-col gap-2 mb-4 w-full">
                            <label htmlFor="description" className="font-bold text-slate-800">Descripción</label>
                            <textarea
                                id="description"
                                disabled={loadingSubmit}
                                cols={30}
                                rows={10}
                                className="bg-admin rounded-md flex-1 border p-5 hover:border-slate-800 disabled:border-slate-200"
                                {...register('description')} 
                            >
                            </textarea>
                        </div>
                    </div>

                    <div className="flex flex-col items-center justify-end gap-4 mt-5 sm:flex sm:flex-row">
                        <button
                            type="button"
                            onClick={onCalcel}
                            disabled={loadingSubmit}
                            className="py-4 px-6 border border-gray-300 w-full sm:w-auto rounded-md cursor-pointer transition-colors hover:bg-slate-100 active:scale-95 disabled:scale-100 disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:bg-white">
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={loadingSubmit}
                            className="bg-sky-500 hover:bg-sky-600 text-white font-semibold py-4 px-8 w-full sm:w-auto rounded-md cursor-pointer transition-colors min-w-[120px] flex justify-center disabled:bg-sky-300 disabled:cursor-not-allowed disabled:hover:bg-sky-300">
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
