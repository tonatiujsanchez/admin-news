import { useState, FC } from 'react';

import Image from 'next/image'
import NextLink from 'next/link'

import { useData } from '../../../hooks/useData'

import { ModalContainer, ModalDelete } from '../ui';

import { IAuthor } from '../../../interfaces';


interface Props {
    author: IAuthor
}

export const AuthorCard:FC<Props> = ({ author }) => {


    const [modalDelete, setModalDelete] = useState(false)
    const [loading, setLoading] = useState(false)

    const { deleteAuthor } = useData()


    const onDeleteAuthor = async( result: () => Promise<{ confirm: boolean }> ) => {

        const { confirm } = await result()

        if(!confirm){
            setModalDelete(false)
            return
        }

        setLoading(true)
        const { hasError } = await deleteAuthor(author._id!)
        setLoading(false)

        if(hasError){ return }

        setModalDelete(false)
    }

    return (
        <>
            <div className="w-full sm:w-[290px] bg-white shadow-md px-10 py-12 rounded-xl">
                <div className='flex gap-5 mb-5'>
                    <NextLink 
                        href={`/admin/autores/${author._id}`} 
                        className="block w-[100px] min-w-[100px] relative h-[100px] rounded-lg overflow-hidden group border-white border-8 shadow-lg"
                    >
                        {
                            author.photo 
                            ?(
                                <Image
                                    priority
                                    fill
                                    sizes="(max-width: 125px) 125px"
                                    src={author.photo}
                                    alt={author.name}
                                    className='cover bg-gray-200 aspect-w-1 aspect-h-1 rounded-md overflow-hidden group-hover:opacity-75 lg:aspect-none'
                                />
                            ):(
                                <div className='w-full h-full flex justify-center items-center bg-gray-200 aspect-w-1 aspect-h-1 rounded-md overflow-hidden group-hover:opacity-75 lg:aspect-none'>
                                    <p className="font-bold text-4xl text-slate-800 uppercase">{author.name.slice(0, 1)}</p>
                                </div>
                            )
                        }

                    </NextLink>
                    <div>
                        <NextLink 
                            href={`/admin/autores/${author._id}`}
                            className="block font-bold mb-2 mt-1"
                        >
                            { author.name }
                        </NextLink>
                        <p className='text-slate-500 font-semibold'>{author.occupation}</p>
                    </div>
                </div>
                <div className='flex items-center justify-center gap-7 mt-10'>
                    <a href={`https://www.facebook.com/${ author.facebook?.slice(1) }`}
                        rel="noopener noreferrer"
                        target="_blank"
                        className={`flex items-end gap-1 mb-4 text-4xl text-gray-800 p-2 hover:bg-slate-200 rounded-full ${author.facebook? '' : 'pointer-events-none opacity-40'}`}>
                        <i className='bx bxl-facebook-circle' ></i>
                    </a>
                    <a href={`https://www.twitter.com/${ author.twitter?.slice(1) }`}
                        rel="noopener noreferrer"
                        target="_blank"
                        className={`flex items-end gap-1 mb-4 text-4xl text-gray-800 p-2 hover:bg-slate-200 rounded-full ${author.twitter? '' : 'pointer-events-none opacity-40'}`}>
                        <i className='bx bxl-twitter' ></i>
                    </a>
                    <a href={`https://www.instagram.com/${ author.instagram?.slice(1) }`}
                        rel="noopener noreferrer"
                        target="_blank"
                        className={`flex items-end gap-1 mb-4 text-4xl text-gray-800 p-2 hover:bg-slate-200 rounded-full ${author.instagram ? '' : 'pointer-events-none opacity-40'}`}>
                        <i className='bx bxl-instagram-alt' ></i>
                    </a>
                    <a href={author.web}
                        rel="noopener noreferrer"
                        target="_blank"
                        className={`flex items-end gap-1 mb-4 text-4xl text-gray-800 p-2 hover:bg-slate-200 rounded-full ${author.web ? '' : 'pointer-events-none opacity-40'}`}>
                        <i className='bx bx-globe' ></i>
                    </a>
                </div>
                <div className="flex flex-col">
                    <p className="border-b py-5">
                        <span className='font-semibold'>Correo:</span> {author.email ? author.email : <span className='opacity-40 font-normal text-slate-400'>--------------------</span>}
                    </p>
                    <p className="border-b py-5">
                        <span className='font-semibold'>Telefono:</span> {author.phone ? author.phone : <span className='opacity-40 font-normal text-slate-400'>--------------------</span>}
                    </p>
                </div>
                <div className='mt-10 flex justify-between gap-5'>
                    <div className='flex gap-5'>
                        <button
                            onClick={ ()=> setModalDelete(true) }
                            className="flex items-center text-red-600 hover:text-white bg-red-100 hover:bg-red-500 font-bold text-2xl py-2 px-4 rounded-md">
                            <i className='bx bx-trash'></i>
                        </button>
                        <NextLink 
                            href={`/admin/autores/${author.slug}/editar`}
                            className="flex items-center text-sky-600 hover:text-white bg-sky-100 hover:bg-sky-500 font-bold text-2xl py-2 px-4 rounded-md"
                        >
                            <i className='bx bx-edit-alt' ></i>
                        </NextLink>
                    </div>
                    <div>
                        <NextLink 
                            href={`/admin/autores/${author._id}`} 
                            className="flex items-center gap-1 text-emerald-600 hover:text-white bg-emerald-100 hover:bg-emerald-500 py-2 px-5 rounded-md"
                        >
                            <i className='bx bx-show text-2xl mt-1'></i> <span className='font-medium text-2xl'>Ver</span>
                        </NextLink>
                    </div>
                </div>
            </div>

            { modalDelete &&
                <ModalContainer>
                    <ModalDelete
                        processing={ loading } 
                        title={'Eliminar autor'} 
                        subtitle={<>¿Desdea eliminar el autor <span className='font-semibold italic'>"{ author.name }"</span>?</>} 
                        onResult={ onDeleteAuthor }
                    />
                </ModalContainer>
            }
        </>
    )
}
