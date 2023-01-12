import { FC, useEffect, useState } from 'react'

import { useForm } from 'react-hook-form'
import slugify from 'slugify'

import { SelectCategories } from './SelectCategories'
import { SelectAuthors } from './SelectAuthors'
import { Checkbox, DTPicker, QuillEditor, SelectImage } from '../ui'
import { IEntry, IEntryCategory, IEntryAuthor } from '../../../interfaces'


interface Props {
    articleEdit?: IEntry
}

export const ArticleForm:FC<Props> = ({ articleEdit }) => {


    const [contentEditor, setContentEditor] = useState<string>()

    const { register, handleSubmit, formState:{ errors }, getValues, setValue, watch, reset  } = useForm<IEntry>({
        defaultValues: {
            title: '',
            publishedAt: String( new Date() ),
            inFrontPage: true
            
        }
    })
    
    useEffect(()=>{

        if( !contentEditor ){ return }

        // const desc = contentEditor.split('<p><br></p>')

        // setArticle({
        //     ...article,
        //     content: contentEditor,
        //     description: desc[0] !== '' ? desc[0] : null
        // })

        setValue('content', contentEditor, { shouldValidate: true })

    },[contentEditor])

    useEffect(()=>{
        const subscription = watch( ( value, { name, type } ) => {
            if( name === 'title' && value.title){

                const slug = slugify(value.title, { replacement: '-', lower: true })
                setValue('slug', slug)
            }
        })

        return () => {
            subscription.unsubscribe()
        }
     },[watch, setValue])



    const handleSetCategory = ( category:IEntryCategory, subcategory?:IEntryCategory ) => {

        setValue('category', category, { shouldValidate: true })
        
        if( subcategory ){
            setValue('subcategory', subcategory, { shouldValidate: true })
        }else{
            setValue('subcategory', null, { shouldValidate: true })
        }
    }

    const handleSetAuthor = ( author:IEntryAuthor ) => {
        setValue('author', author, { shouldValidate: true })
    }

    const handleSetImageBanner = ( imageUrl?:string ) => {
        setValue('banner', imageUrl, { shouldValidate: true })
    }

    const handleSetImageSocial = ( imageUrl?:string ) => {
        setValue('imageSocial', imageUrl, { shouldValidate: true })
    }

    const handleSetPublishedAt = ( dateTime:Date ) => {
        setValue('publishedAt', String(dateTime), { shouldValidate: true })
    }

    const onEditorChange = ( html:string ) => {
        setContentEditor(html)
    }

    const handleSetInFrontPage = () => {
        setValue('inFrontPage', !getValues('inFrontPage'), { shouldValidate: true })
    }





    const onEntrySubmit = ( data: IEntry ) => {
        console.log(data);
    }


    return (
        <form onSubmit={ handleSubmit(onEntrySubmit) } className="bg-white p-5 sm:p-10 rounded-xl">
            
            <div className="flex flex-col mb-4 sm:mb-10">
                <label htmlFor="title" className="mb-1 block font-bold text-slate-800">
                    Título <span className="text-red-500">*</span>
                </label>
                <input
                    type="text"
                    id="title"
                    className={`bg-admin border mt-2 block w-full p-5 rounded-md text-md ${ !!errors.title ? 'outline outline-2 outline-red-500' :'hover:border-slate-800' }`}
                    { ...register('title', {
                        required: 'El título es requerido',
                        validate: ( value ) => value.trim() === ''? 'El título es requerido' : undefined
                    })}
                />
                {
                    !!errors.title &&
                    <p className="text-xl text-red-600 mt-2">{errors.title.message}</p>
                }
            </div>

            <div className="flex flex-col sm:flex-row flex-wrap gap-4 sm:gap-20 sm:items-start mb-4 sm:mb-10">
                <div className="flex-1 flex flex-col gap-4 mb-4 sm:order-2">
                    <SelectCategories
                        category={ getValues('category') }
                        subcategory={ getValues('subcategory') }
                        handleSelectCategory={handleSetCategory}
                    />
                    <SelectAuthors
                        author={ getValues('author') }
                        handleSelectAuthor = { handleSetAuthor }
                    />
                    <DTPicker
                        value={ new Date( getValues('publishedAt') ) }
                        onChangePublishedAt={ handleSetPublishedAt }
                        label="Fecha de publicación"
                    />
                </div>
                <div className="flex-1 mb-4 sm:order-1">
                    <div className="flex justify-center flex-col lg:flex-row sm:gap-10">
                        <SelectImage
                            label="Foto principal"
                            objetFillImage='contain'
                            handleSetImage={handleSetImageBanner}
                        />
                        <SelectImage
                            label="Redes sociales"
                            heightContentImage='h-64'
                            handleSetImage={handleSetImageSocial}
                        />
                    </div>
                </div>
            </div>

            <div className="mb-4 sm:mb-10">
                <QuillEditor
                    placeholder={"Contenido del artículo"}
                    onEditorChange={onEditorChange}
                    content={ getValues('content') }
                    label="Contenido del artículo"
                />    
            </div>

            <div className="flex items-start gap-4">
                <div className="flex-1 flex flex-col mb-4">
                    <label htmlFor="slug" className="mb-1 block font-bold text-slate-800">Url</label>
                    <input
                        type="text"
                        id="slug"
                        className={`bg-admin border mt-2 block w-full p-5 rounded-md text-md ${ !!errors.slug ? 'outline outline-2 outline-red-500' :'hover:border-slate-800' }`}
                        { ...register('slug', {
                            required: 'Este campo es requerido',
                            validate: (val) => val && val.trim().includes(' ') ? 'No puede tener espacios en blanco': undefined
                        })}
                    />
                    {
                        !!errors.slug &&
                        <p className="text-xl text-red-600 mt-2">{errors.slug.message}</p>
                    }
                </div>
                <Checkbox 
                    value={ getValues('inFrontPage') } 
                    onCheckChange={handleSetInFrontPage}
                    label="Destacado"    
                />
            </div>

                <button>get</button>
        </form>
    )
}
