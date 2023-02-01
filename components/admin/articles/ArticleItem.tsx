import { FC, useState } from 'react'

import Image from 'next/image'
import NextLink from 'next/link'

import { useData } from '../../../hooks'
import { ModalContainer, ModalDelete } from '../ui'
import { dateFormatter, timeFormatter } from '../../../utils/frontend'

import { IEntry } from '../../../interfaces/IEntry'


interface Props {
    article: IEntry
}

export const ArticleItem: FC<Props> = ({ article }) => {   

    const [showModalDelete, setShowModalDelete] = useState(false)
    const [loading, setLoading] = useState(false)

    const { deleteEntry } = useData()


    const onDeleteEntry = async( result: () => Promise<{ confirm: boolean }> )=> {
        
        const { confirm } = await result()
    
        if( !confirm ){ return setShowModalDelete(false) }

        setLoading(true)
        const { hasError } = await deleteEntry( article._id! )
        setLoading(false)

        if(hasError){ return }

        setShowModalDelete(false)

    }

    return (
        <>
            <tr className='border-b hover:bg-slate-100'>
                <td className='px-6 font-semibold'>
                    <p className='flex justify-center'>
                        {
                            article.inFrontPage
                                ?(
                                    <i className='bx bxs-star text-yellow-400' ></i>
                                ):(
                                    <i className='bx bx-star text-gray-600' ></i>
                                )
                        }
                    </p>
                </td>
                <td className='py-6 flex justify-center'>
                    <div className="relative w-16 h-16 rounded-full overflow-hidden cursor-pointer group border">
                        {
                            article.banner 
                            ?(
                                <Image
                                    priority
                                    fill
                                    sizes="(max-width: 100px) 100px"
                                    src={article.banner}
                                    alt={article.title}
                                    className='cover bg-gray-200 aspect-w-1 aspect-h-1 rounded-md overflow-hidden group-hover:opacity-75 lg:aspect-none'
                                />
                            ):(
                                <div className='w-full h-full flex justify-center items-center bg-gray-200 aspect-w-1 aspect-h-1 rounded-md overflow-hidden group-hover:opacity-75 lg:aspect-none'>
                                    <p className="font-bold text-4xl text-slate-800 uppercase">{article.title.slice(0, 1)}</p>
                                </div>
                            )
                        }
                    </div>
                </td>
                <td className='text-left px-6 text-[1.4rem] sm:text-[1.5rem] min-w-[260px] overflow-x-hidden font-bold text-slate-800 py-4'>{ article.title }</td>
                <td className='text-left px-6 text-[1.3rem] sm:text-[1.4rem] text-slate-600'>{ article.category.title }</td>
                <td className='text-left px-6 text-[1.3rem] sm:text-[1.4rem] min-w-[112px] text-slate-600'><span className='block'>{dateFormatter( article.createdAt! )}</span> <span>{timeFormatter( article.createdAt! )}</span></td>
                <td className='text-left px-6 text-[1.3rem] sm:text-[1.4rem] min-w-[112px] text-slate-600'><span className='block'>{dateFormatter( article.publishedAt )}</span> <span>{timeFormatter( article.publishedAt )}</span></td>
                <td className='text-left px-6 min-w-[112px]'>
                    {
                        article.published
                            ?(
                                <span className='bg-emerald-100 text-emerald-600 text-xl p-3 rounded-md font-semibold'>Publicado</span>
                            ):(
                                <span className='bg-slate-100 text-slate-600 text-xl p-3 rounded-md font-semibold'>Sin publicar</span>
                            )
                    }
                </td>
                <td className='text-center px-6 text-[1.3rem] text-slate-600'>{ article.views }</td>
                <td className='text-left px-6'>
                    <div className='flex justify-center gap-4'>
                        <button
                            onClick={ ()=> setShowModalDelete(true)}
                            className="flex items-center text-red-600 hover:text-white bg-red-100 hover:bg-red-500 font-bold text-xl py-3 px-4 rounded-md">
                            <i className='bx bx-trash'></i>
                        </button>
                        <NextLink 
                            href={`/admin/articulos/${article._id}`}
                            className="flex items-center text-sky-600 hover:text-white bg-sky-100 hover:bg-sky-500 font-bold text-xl py-3 px-4 rounded-md"
                        >
                            <i className='bx bx-edit-alt' ></i>
                        </NextLink>
                        <a 
                            href={`/${article.category.slug}/${article.slug}`}
                            target="_blank"
                            rel="noreferrer" 
                            className="flex items-center gap-1 text-emerald-600 hover:text-white bg-emerald-100 hover:bg-emerald-500 py-2 px-5 rounded-md"
                        >
                            <i className='bx bx-link-external text-2xl mt-1'></i>
                        </a>
                    </div>
                </td>
                { 
                    showModalDelete && (
                        <td>
                            <ModalContainer>
                                <ModalDelete
                                    processing={ loading } 
                                    title={'Eliminar artículo'} 
                                    subtitle={<p className="text-2xl text-gray-500">¿Desdea eliminar el artículo <span className='font-semibold italic'>{`"${article.title}"`}</span>?</p>} 
                                    onResult={ onDeleteEntry }
                                />
                            </ModalContainer>
                        </td>
                    )
                }
            </tr>
        </>
    )
}
