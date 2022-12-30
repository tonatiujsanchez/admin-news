import { useEffect, useState } from 'react'

import { NextPage } from 'next'
import { useRouter } from 'next/router'

import { useData } from '../../../../hooks'

import { LayoutAdmin } from '../../../../components/layouts'
import { AuthorForm } from '../../../../components/admin/authors'
import { TitlePage } from '../../../../components/admin/ui'
import { LoadingAdmin } from '../../../../components/admin/utilities'

import { IAuthor } from '../../../../interfaces'




const EditarAutorPage:NextPage = () => {

    const [author, setAuthor] = useState<IAuthor>()
    const [loading, setLoading] = useState(false)


    const router = useRouter()
    const { id } = router.query

    const { authors, refreshAuthors } = useData()


    const loadAuthorsAndGetById = async() => {

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

            await loadAuthorsAndGetById()

        } else {

            const authorView = authors.find( author => author._id === id )

            if( !authorView ){
                return router.replace('/admin/autores')
            }

            setAuthor(authorView)
            setLoading(false)
        }   
        
    }

    useEffect(() => {

        if(!id){ return }
        getAuthorById()

    }, [id, getAuthorById])



    return (
        <LayoutAdmin title="- Editar Autor">
            {
                loading || !author 
                ?(
                    <div className="flex justify-center mt-96">
                        <LoadingAdmin />
                    </div>
                ):(
                <>
                    <div className="mb-5 flex gap-2 items-center py-3">
                        <TitlePage title="Editar autor" />
                    </div>
                    <div className='max-w-[1200px] mx-auto'>
                        <AuthorForm authorEdit={author} />
                    </div>
                </>
                )
            }
        </LayoutAdmin>
    )
}

export default EditarAutorPage