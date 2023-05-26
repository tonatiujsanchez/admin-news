import { Dispatch, FC, SetStateAction, useState, useEffect } from 'react';
import { useForm } from "react-hook-form"
import { useData } from "../../../hooks"
import { ITag } from "../../../interfaces"
import { Checkbox } from "../ui"
import { LoadingCircle } from "../utilities"


interface Props {
    setShowTagForm: Dispatch<SetStateAction<boolean>>
    tagEdit?: ITag
}

export const TagForm:FC<Props> = ({ setShowTagForm, tagEdit }) => {
    
    const [loading, setLoading] = useState(false)

    const { addNewTag, updateTag } = useData()

    const { register, handleSubmit, formState:{ errors }, getValues, setValue, reset } = useForm<ITag>({
        defaultValues: {
            title: '',
            slug: '',
            active: true
        }
    })

    useEffect(()=>{

        if( tagEdit ){
            reset(tagEdit)
        }

    },[tagEdit])

    const handleSetActive = () => {
        setValue('active', !getValues('active'), { shouldValidate: true })
    }

    const onSubmitTag = async( data:ITag ) => {

        setLoading(true)

        if( tagEdit ){
            const { hasError } = await updateTag( data )
            setLoading(false)

            if( hasError ){ return }
            setShowTagForm(false)

        }else {
            const { hasError } = await addNewTag( data )
            setLoading(false)

            if( hasError ){ return }
            setShowTagForm(false)
        }
    }

    
    return (
        <div className="h-full flex flex-col sm:w-[400px] overflow-y-scroll custom-scroll">
            <header className="pt-10 pb-5 px-8 sm:px-10">
                <h3 className="text-center font-bold text-4xl pb-3 border-b flex justify-center items-center gap-2">
                    {
                        tagEdit 
                            ? <><i className='bx bxs-edit' ></i>Editar</>
                            : <><i className='bx bx-message-square-add' ></i>Nuevo</>
                    }
                </h3>
                <p className="text-center mt-3">{tagEdit ? `Editando a: ${ tagEdit.title }` : 'Agregar nueva etiqueta'}</p>
            </header>
            <form onSubmit={ handleSubmit( onSubmitTag ) } className="h-full flex flex-col justify-between">
                <div className='px-8 sm:px-10'>
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
                    <div>
                        <Checkbox 
                            value={ getValues('active') } 
                            name="active-tag" 
                            onCheckChange={handleSetActive}
                            label="Activo" 
                            processing={ loading }
                        />
                    </div>


                </div>
                <div className="px-8 py-6 sm:px-10 mt-10 flex flex-col items-center justify-end gap-4 sm:flex sm:flex-row">
                    <button
                        type="button"
                        disabled={loading} 
                        onClick={ ()=> setShowTagForm( false ) } 
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
                            : tagEdit ? 'Editar' : 'Añadir'
                        }
                    </button>

                </div>
            </form>
        </div>
    )
}
