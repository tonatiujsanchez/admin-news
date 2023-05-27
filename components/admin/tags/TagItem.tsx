import { FC, SetStateAction, useState } from 'react';
import { ITag } from "../../../interfaces"
import NextLink from 'next/link'
import { ModalContainer, ModalDelete } from "../ui"
import { useData } from '../../../hooks';
import { TagForm } from './TagForm';

interface Props {
    tag:ITag
    index: number
}

export const TagItem:FC<Props> = ({ tag, index }) => {

    const [loading, setLoading] = useState(false)
    const [showModalDelete, setShowModalDelete] = useState(false)
    const [showModalUpdate, setShowModalUpdate] = useState(false)

    const { deleteTag } = useData()

    const onDeleteTag = async( result: () => Promise<{ confirm: boolean; }> ) => {
        
        const { confirm } = await result()
        
        if( !confirm ){ return setShowModalDelete(false) }
    
        setLoading(true)
        const { hasError } = await deleteTag( tag._id! )
        setLoading(false)

        if( hasError ){ return }
        
        setShowModalDelete(false)
    }

    return (
        <tr className="border-b last-of-type:border-b-0 hover:bg-slate-50 hover:shadow-inner">
            <td className="px-6 py-6 font-semibold">
                <p className="flex justify-center items-center">{ index + 1 }</p>
            </td>
            <td className='text-left px-6 text-[1.4rem] min-w-[160px] overflow-x-hidden text-slate-800 py-6 font-bold'>
                <span className='bg-legado-200 border border-legado-700 text-xl py-2 px-3 rounded-md font-bold'>{ tag.title }</span>
            </td>
            <td className='text-left px-6 text-[1.4rem] overflow-x-hidden text-slate-800 py-6 min-w-[160px]'>{ tag.slug }</td>
            <td className='text-left px-6 min-w-[112px]'>
                {
                    tag.active
                        ?(
                            <span className='bg-emerald-100 text-emerald-600 text-xl py-2 px-3 rounded-md font-semibold'>Activo</span>
                        ):(
                            <span className='bg-slate-100 text-slate-600 text-xl py-2 px-3 rounded-md font-semibold'>Inactivo</span>
                        )
                }
            </td>

            <td className='text-left px-6'>
                <div className='flex justify-center gap-4'>
                    <button
                        onClick={ ()=> setShowModalUpdate(true) } 
                        className="flex items-center text-sky-600 hover:text-white bg-sky-100 hover:bg-sky-500 font-bold text-xl py-3 px-4 rounded-md"
                    >
                        <i className='bx bx-edit-alt' ></i>
                    </button>
                    <button
                        onClick={ ()=> setShowModalDelete(true)}
                        className="flex items-center text-red-600 hover:text-white bg-red-100 hover:bg-red-500 font-bold text-xl py-3 px-4 rounded-md">
                        <i className='bx bx-trash'></i>
                    </button>
                </div>
            </td>
            { 
                showModalDelete && (
                    <td>
                        <ModalContainer>
                            <ModalDelete
                                processing={ loading } 
                                title={'Eliminar etiqueta'} 
                                subtitle={
                                    <p className="text-2xl text-gray-500">
                                        ¿Desdea eliminar la etiqueta <span className='font-semibold italic'>{`"${tag.title}"`}</span>?
                                    </p>
                                } 
                                onResult={ onDeleteTag }
                            />
                        </ModalContainer>
                    </td>
                )
            }
            {
                showModalUpdate && (
                    <td>
                        <ModalContainer>
                            <TagForm 
                                setShowTagForm={setShowModalUpdate}
                                tagEdit={ tag }
                            />
                        </ModalContainer>
                    </td>
                )
            }
        </tr>
    )
}
