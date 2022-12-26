import { FC, Dispatch, SetStateAction, useEffect, ChangeEvent, useState } from 'react'

import { useForm } from 'react-hook-form'

import { useData } from '../../../hooks'

import { ICategory, ITypeCategory } from '../../../interfaces'
import { notifyError } from '../../../utils/frontend'
import { LoadingCircle } from '../utilities'


interface Props{
    setShowCategoryForm: Dispatch<SetStateAction<boolean>>
    categoryEdit?: ICategory
}

export const CategoryForm:FC<Props> = ({ setShowCategoryForm, categoryEdit }) => {


    const [loading, setLoading] = useState(false)

    const { addNewCategory, categories } = useData()

    const { register, handleSubmit, formState:{ errors }, getValues, setValue, reset } = useForm<ICategory>({
        defaultValues: {
            type: 'category',
            category: categories[0]._id || '',
            title: '',
            tag: '',
        }
    })

    useEffect(() => {
        if (categoryEdit?._id) {

            reset({
                type: categoryEdit.type,
                category: categoryEdit.category || categories[0]._id,
                title: categoryEdit.title,
                tag: categoryEdit.tag
            })
        }
    }, [])
    
    const onChangeTypeCategory = async( { target }:ChangeEvent<HTMLSelectElement> ) => {
        setValue('type', target.value as ITypeCategory, { shouldValidate: true } )
    }

    const onChangeCategory = ( { target }:ChangeEvent<HTMLSelectElement> ) => {
        setValue('category', target.value, { shouldValidate: true } )
    }


    const onSubmitCategory = async({ type, category, title, tag, position }: ICategory) => {
        

        if (type === 'subcategory' && !category) {
            notifyError('Seleccione una categoría')
            return
        }

        if( type === 'category' ){
            category = null
        }

        if( tag === '' ){
            tag = title
        }

        setLoading(true)

        if(categoryEdit) {

            
            // TODO: Editar categoría


        } else {
            position = categories.length + 1
            const { hasError } = await addNewCategory({ type, category, title, tag, position  })
            
            setLoading(false)

            if(hasError){ return }
            
            setShowCategoryForm(false)
        }
        
    }


    return (
        <div className="h-full flex flex-col">
            <header className="py-10 px-8 sm:px-10">
                <h3 className="text-center font-bold text-4xl">{categoryEdit ? `Editando: ${ categoryEdit.title }` : 'Nueva Categoría'}</h3>
            </header>
            <form onSubmit={handleSubmit( onSubmitCategory )} className="h-full flex flex-col justify-between">
                <div className='px-8 sm:px-10'>

                    <div className="my-6">
                        <label htmlFor="type" className="block text-md mb-3 font-bold text-slate-800">
                            Tipo <span className="text-red-500">*</span>
                        </label>
                        <select
                            id="type"
                            name="type"
                            value={ getValues('type')}
                            onChange={ onChangeTypeCategory }
                            className="bg-admin w-full rounded-md flex-1 border p-5 hover:border-slate-800 disabled:border-slate-200"
                            disabled={loading}
                        >
                            <option value="category">Categoría principal</option>
                            <option value="subcategory">Subcategoría</option>
                        </select>
                    </div>

                    {getValues('type') === 'subcategory' &&
                        <div className="my-6">
                            <label htmlFor="category" className="block text-md mb-3 font-bold text-slate-800">
                                Categoría <span className="text-red-500">*</span>
                            </label>
                            <select
                                id="category"
                                name="category"
                                value={getValues('category')!}
                                onChange={onChangeCategory}
                                className="bg-admin w-full rounded-md flex-1 border p-5 hover:border-slate-800 disabled:border-slate-200"
                                disabled={loading}
                            >
                                {
                                    categories.map(category => (
                                        <option key={category._id} value={category._id} >
                                            {category.title}
                                        </option>
                                    ))
                                }
                            </select>
                        </div>
                    }
                    <div className="my-6">
                        <label htmlFor="title" className="block text-md mb-3 font-bold text-slate-800 ">
                            Título <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            id="title"
                            disabled={loading}
                            className={`bg-admin w-full rounded-md flex-1 border p-5 disabled:border-slate-200 ${ !!errors.title ? 'outline outline-2 outline-red-500' :'hover:border-slate-800' }`}
                            { ...register('title', {
                                required: 'Título de la categoría requerido',
                                validate: ( value ) => value.trim() === ''? 'Título de la categoría requerido' : undefined
                            })}
                        />
                        {
                            !!errors.title &&
                            <p className="text-lg text-red-600 mt-1 block">{errors.title.message}</p>
                        }
                    </div>
                    <div className="my-6">
                        <label htmlFor="tag" className="block text-md mb-3 font-bold text-slate-800">
                            Etiqueta
                        </label>
                        <input
                            type="text"
                            id="tag"
                            disabled={loading}
                            className="bg-admin w-full rounded-md flex-1 border p-5 hover:border-slate-800 disabled:border-slate-200"
                            { ...register('tag') }
                        />
                    </div>
                </div>

                <div className="px-8 py-6 sm:px-10 mt-10 flex flex-col items-center justify-end gap-4 sm:flex sm:flex-row">
                    <button
                        type="button"
                        disabled={loading} 
                        onClick={ ()=> setShowCategoryForm( false ) } 
                        className="mt-4 inline-flex w-full justify-center rounded-md border border-gray-300 bg-white py-4 px-8 text-gray-700 shadow-sm hover:bg-gray-100 focus:outline-none sm:mt-0 sm:w-auto text-2xl disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:bg-white"
                    >
                        Cancelar
                    </button>
                    <button 
                        type="submit" 
                        disabled={loading}
                        className="flex w-full justify-center items-center rounded-md border border-transparent bg-sky-500 text-2xl font-semibold py-4 px-10 text-white shadow-sm hover:hover:bg-sky-600 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 sm:w-44 disabled:bg-sky-300 disabled:cursor-not-allowed disabled:hover:bg-sky-300"
                    >
                        {
                            loading
                            ? (
                                <LoadingCircle />
                            )
                            : categoryEdit ? 'Editar' : 'Añadir'
                        }
                    </button>

                </div>
            </form>
        </div>
    )
}
