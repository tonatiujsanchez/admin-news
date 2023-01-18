
import { NextPage } from 'next'

import { LayoutAdmin } from '../../../components/layouts'
import { LinkPrimary, TitlePage } from '../../../components/admin/ui'
import { useData } from '../../../hooks'
import { useEffect, useState } from 'react';
import { LoadingAdmin } from '../../../components/admin/utilities';
import { ArticleList } from '../../../components/admin/articles';



const ArticulosPage: NextPage = () => {

    const [loading, setLoading] = useState(false)
    
    const { entries, refreshEntries } = useData()

    const loadEntries = async() => {
        setLoading(true)
        await refreshEntries()       
        setLoading(false)
    }
    
    useEffect(()=>{
        if( entries.length <= 0 ){
            loadEntries()   
        }
    },[])




    return (
        <LayoutAdmin title={'- Artículos'} isMain={true} >
            <div className="mb-5 sm:mb-0 flex gap-2 items-center py-3">
                <TitlePage title="Artículos" />
                <button
                    className="text-3xl text-slate-600 hover:bg-slate-200 hover:text-slate-900 py-2 px-3 rounded-full active:scale-95"
                    onClick={() => loadEntries()}
                >
                    <i className='bx bx-revision'></i>
                </button>
            </div>
            {
                loading
                    ?(
                        <div className="flex justify-center mt-96">
                            <LoadingAdmin />
                        </div>
                    ):(
                        <section>
                            <div className="flex w-full mb-10">
                                <LinkPrimary link="/admin/nuevo" text="Nuevo artìculo" />
                            </div>
                            <div className='overflow-x-auto custom-scroll max-w-[1440px] mx-auto'>
                                <ArticleList articles={entries} />
                            </div>
                        </section>
                    )
            }
        </LayoutAdmin>
    )
}

export default ArticulosPage