import { useState, useEffect } from 'react';

import { NextPage } from 'next'
import { useRouter } from 'next/router'

import { useAuth, useData } from '../../../hooks'

import { LayoutAdmin } from '../../../components/layouts'
import { ArticleForm } from '../../../components/admin/articles'
import { TitlePage } from '../../../components/admin/ui'
import { IEntry } from '../../../interfaces'
import { LoadingAdmin } from '../../../components/admin/utilities';


const ArticuloPage: NextPage = () => {


    const [entry, setEntry] = useState<IEntry>()
    const [loading, setLoading] = useState(true)

    const router = useRouter()
    const { id } = router.query as { id?:string }


    const { entries, getEntry } = useData()
    const { user:userSession } = useAuth()


    const getEntryById = async() => {
        
        setLoading(true)

        if( entries.length === 0 ){

            const { hasError, entryResp } = await getEntry( id! )

            if(hasError){
                return router.replace('/admin/articulos')
            }

            setEntry( entryResp )
            setLoading(false)

        } else {

            const entryView = entries.data.find( entry => entry._id === id )

            if(!entryView){
                return router.replace('/admin/articulos')
            }

            setEntry( entryView )
            setLoading(false)
        }

    }

    useEffect(()=>{

        if(!id || !userSession){ return }    
        getEntryById()

    },[id, userSession])

    


    return (
        <LayoutAdmin title={'- Editar Artículo'}>
            {
                loading 
                ?(
                    <div className="flex justify-center mt-96">
                        <LoadingAdmin />
                    </div>
                ):(
                    <>
                        <div className="mb-5 flex gap-2 items-center py-3">
                            <TitlePage title="Editar Artículo" />
                        </div>
                        <div className="max-w-[1240px] mx-auto">
                            <ArticleForm articleEdit={entry} />
                        </div>
                    </>
                )
            }
        </LayoutAdmin>
    )
}

export default ArticuloPage