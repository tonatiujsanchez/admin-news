import { useEffect, useState } from 'react'
import { NextPage } from 'next'
import { useRouter } from 'next/router';

import ReactPaginate from 'react-paginate';

import { useAuth, useData } from '../../../hooks'

import { LayoutAdmin } from '../../../components/layouts'
import { ArticleList } from '../../../components/admin/articles';
import { LinkPrimary, TitlePage } from '../../../components/admin/ui'
import { LoadingAdmin } from '../../../components/admin/utilities'



const ArticulosPage: NextPage = () => {

    const [loading, setLoading] = useState(false)
    
    const router = useRouter()

    const { entries, refreshEntries } = useData()
    const { user: userSession } = useAuth()


    const loadEntries = async() => {
        
        const { page } = router.query as { page?: string }
        
        let actualPage = 0

        if( page && Number( page ) >= 1 ){
            actualPage = Number( page ) - 1
        }

        setLoading(true)
        await refreshEntries(actualPage)        

        if((entries.page + 1) !== Number( page )){
            router.push(`/admin/articulos?page=${ entries.page }`)
        }
        setLoading(false)
    }
    
    useEffect(()=>{        
        
        if( !userSession ){
            return
        }     
        
        if( entries.data.length <= 0 ){
            loadEntries()   
        } else {
            router.push(`/admin/articulos?page=${ entries.page + 1}`)
        }

    },[userSession])
       


    const handlePageClick = async(event: {selected: number}) => {
        
        setLoading(true)
        await refreshEntries( event.selected )
        setLoading(false)

        router.push(`/admin/articulos?page=${event.selected + 1}`)
    }




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
            <div className="flex w-full mb-10">
                <LinkPrimary link="/admin/nuevo" text="Nuevo artìculo" disabled={ loading } />
            </div>
            {
                loading
                    ?(
                        <div className="flex justify-center mt-96">
                            <LoadingAdmin />
                        </div>
                    ):(
                        <section className='max-w-[1440px] mx-auto'>
                            <div className='overflow-x-auto custom-scroll'>
                                <ArticleList articles={entries.data} />
                            </div>
                            
                            <div className="flex justify-center sm:justify-end py-16 pb-10">
                                {
                                    entries.pageCount > 1 &&
                                    <ReactPaginate
                                        previousLabel={ <i className={`bx bx-chevron-left text-4xl opacity-50 ${entries.page === 0 ?'cursor-default':'hover:opacity-100' }`}></i> }
                                        breakLabel="..."
                                        nextLabel={ <i className={`bx bx-chevron-right text-4xl opacity-50 ${(entries.page + 1) === entries.pageCount ?'cursor-default':'hover:opacity-100' }`}></i> }
                                        onPageChange={handlePageClick}
                                        pageCount={ entries.pageCount }
                                        forcePage={ entries.page }
                                        marginPagesDisplayed={2}
                                        className="flex justify-end gap-1 sm:gap-2"
                                        pageLinkClassName="border-2 border-transparent opacity-50 px-5 hover:border-b-sky-500 hover:opacity-100 py-2 font-semibold"
                                        activeLinkClassName="border-2 border-sky-500 opacity-100 py-2 rounded"
                                    />
                                }
                            </div>
                                
                        </section>
                    )
            }
        </LayoutAdmin>
    )
}

export default ArticulosPage