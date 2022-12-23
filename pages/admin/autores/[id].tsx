import { useEffect, useState } from 'react';
import Image from 'next/image';
import { NextPage } from 'next';
import { useRouter } from 'next/router';

import { useData } from '../../../hooks';

import { LayoutAdmin } from '../../../components/layouts';
import { TitlePage } from '../../../components/admin/ui';
import { LoadingAdmin } from '../../../components/admin/utilities';


import { IAuthor } from '../../../interfaces';




const DetallesAutorPage: NextPage = () => {

    const [author, setAuthor] = useState<IAuthor>()
    const [loading, setLoading] = useState(false)


    const router = useRouter()
    const { id } = router.query

    const { authors, refreshAuthors } = useData()


    const LoadAuthorsAndGetById = async() => {

        const { hasError, authors: authorsResp  } = await refreshAuthors()

        if( hasError ){
            return router.replace('/admin/autores')
        }

        const authorResp = authorsResp.find( author => author._id === id )

        if( !authorResp ){
            return router.replace('/admin/autores')
        }

        setAuthor(authorResp)
        setLoading(false)
    }


    const getAuthorById = async() => {

        setLoading(true)

        if( authors.length === 0 ){

            await LoadAuthorsAndGetById()

        } else {

            const authorView = authors.find( author => author._id === id )

            if( !authorView ){
                router.replace('/admin/autores')
            }

            setAuthor(authorView)
            setLoading(false)
        }   
        
    }

    useEffect(() => {
        if(!id){ return }
        getAuthorById()
    }, [id])



    return (
        <LayoutAdmin title={`- ${author?.name}`} >
            {
                loading || !author
                    ? <div className="flex justify-center mt-96">
                        <LoadingAdmin />
                    </div>
                    : <>
                        <div className="mb-5 flex gap-2 items-center py-3">
                            <TitlePage title="Autor" />
                        </div>
                        <article className='flex flex-col sm:flex-row gap-5 items-center sm:items-start max-w-[700px] mx-auto'>
                            <div className='relative w-[300px] min-w-[300px] h-[300px] sm:w-[220px] sm:min-w-[220px] sm:h-[220px] rounded-lg overflow-hidden group border-white border-8 shadow-lg'>
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
                                                <p className="font-bold text-9xl text-slate-800 uppercase">{author.name.slice(0, 1)}</p>
                                            </div>
                                        )
                                    }
                            </div>
                            <div className='w-full'>
                                <div className='my-5 flex flex-col gap-2'>
                                    <h1 className='text-4xl font-bold text-slate-800'>{ author.name }</h1>
                                    { author.occupation && <p>{ author.occupation }</p>  }
                                </div>
                                {
                                    author.email && (
                                        <p className='mb-5 text-slate-600 font-medium flex gap-2'>
                                            <i className='bx bx-mail-send text-4xl' ></i> 
                                            {author.email}
                                        </p>
                                    )
                                }
  
                                {
                                    author.phone && (
                                        <p className='mb-5 text-slate-600 font-medium flex gap-2'>
                                            <i className='bx bx-phone text-4xl' ></i> 
                                            {author.phone}
                                        </p>
                                    )
                                }
  
                                <div className='flex items-center gap-7'>
                                    <a href={`https://www.facebook.com/${ author.facebook?.slice(1) }`}
                                        rel="noopener noreferrer"
                                        target="_blank"
                                        className={`flex items-end gap-1 mb-4 text-4xl text-gray-800 p-2 hover:bg-slate-200 rounded-full ${author.facebook? '' : 'pointer-events-none opacity-30'}`}>
                                        <i className='bx bxl-facebook-circle' ></i>
                                    </a>
                                    <a href={`https://www.twitter.com/${ author.twitter?.slice(1) }`}
                                        rel="noopener noreferrer"
                                        target="_blank"
                                        className={`flex items-end gap-1 mb-4 text-4xl text-gray-800 p-2 hover:bg-slate-200 rounded-full ${author.twitter? '' : 'pointer-events-none opacity-30'}`}>
                                        <i className='bx bxl-twitter' ></i>
                                    </a>
                                    <a href={`https://www.instagram.com/${ author.instagram?.slice(1) }`}
                                        rel="noopener noreferrer"
                                        target="_blank"
                                        className={`flex items-end gap-1 mb-4 text-4xl text-gray-800 p-2 hover:bg-slate-200 rounded-full ${author.instagram ? '' : 'pointer-events-none opacity-30'}`}>
                                        <i className='bx bxl-instagram-alt' ></i>
                                    </a>
                                    <a href={author.web}
                                        rel="noopener noreferrer"
                                        target="_blank"
                                        className={`flex items-end gap-1 mb-4 text-4xl text-gray-800 p-2 hover:bg-slate-200 rounded-full ${author.web ? '' : 'pointer-events-none opacity-40'}`}>
                                        <i className='bx bx-globe' ></i>
                                    </a>
                                </div>
                                {
                                    author.description && (
                                        <p className='mb-5'>{ author.description }</p>
                                    )
                                }
                                <button
                                    onClick={ ()=> router.replace('/admin/autores') }
                                    className="mt-5 inline-flex w-full justify-center items-center gap-1 rounded-md border border-gray-300 bg-white py-3 px-8 text-gray-700 hover:bg-gray-100 focus:outline-none sm:w-auto text-2xl disabled:opacity-70 disabled:cursor-not-allowed"
                                >
                                    <i className='bx bx-arrow-back'></i>Regresar
                                </button>
                            </div>
                        </article>
                    </>
            }   
        </LayoutAdmin>
    )
}

export default DetallesAutorPage