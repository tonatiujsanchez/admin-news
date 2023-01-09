import { FC } from 'react';
import { useForm } from 'react-hook-form';
import { IEntry } from '../../../interfaces';
import { SelectImage } from '../ui';



interface Props {
    articleEdit?: IEntry
}

export const ArticleForm:FC<Props> = ({ articleEdit }) => {


    const { register, handleSubmit, formState:{ errors }, getValues, setValue, reset  } = useForm<IEntry>()

    const handleSetImageBanner = ( imageUrl?:string ) => {
        setValue('banner', imageUrl, { shouldValidate: true })
    }

    const handleSetImageSocial = ( imageUrl?:string ) => {
        setValue('imageSocial', imageUrl, { shouldValidate: true })
    }



    const onEntrySubmit = ( data: IEntry ) => {
        console.log(data);
    }


    return (
        <form onSubmit={ handleSubmit(onEntrySubmit) } className="bg-white p-5 sm:p-10 rounded-xl">
            
            <div className="flex flex-col gap-2 mb-4 sm:mb-10">
                <label htmlFor="title" className="block font-bold text-slate-800">
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
                    <p>Category</p>
                    <p>Author</p>
                    <p>Date</p>
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

        </form>
    )
}
