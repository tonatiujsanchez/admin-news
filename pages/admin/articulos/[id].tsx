import { useState, useEffect } from 'react';

import { NextPage } from 'next'
import { useRouter } from 'next/router'

import { useData } from '../../../hooks'

import { LayoutAdmin } from '../../../components/layouts'
import { ArticleForm } from '../../../components/admin/articles'
import { TitlePage } from '../../../components/admin/ui'
import { IEntry } from '../../../interfaces'
import { LoadingAdmin } from '../../../components/admin/utilities';


const ArticuloPage: NextPage = () => {


    const [entry, setEntry] = useState<IEntry>()
    const [loading, setLoading] = useState(false)

    const router = useRouter()
    const { id } = router.query


    const { entries, refreshEntries } = useData()


    const loadEntryAndGetById = async() => {

        const { hasError, entriesResp } = await refreshEntries()
        
        if(hasError){
            return router.replace('/admin/articulos')
        }

        const entryResp = entriesResp.find( entry => entry._id === id )
        
        if(!entryResp){
            return router.replace('/admin/articulos')
        }

        setEntry( entryResp )
        setLoading( false )

    }

    const getEntryById = async() => {
        
        setLoading(true)

        if( entries.length === 0 ){

            await loadEntryAndGetById()

        } else {

            const entryView = entries.find( entry => entry._id === id )

            if(!entryView){
                router.replace('/admin/articulos')
            }

            setEntry( entryView )
            setLoading(false)
        }

    }

    useEffect(()=>{

        if(!id){ return }    
        getEntryById()

    },[id])

    


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