import { ChangeEvent, useEffect, useState } from 'react'
import { NextPage } from 'next'
import { useRouter } from 'next/router'

import { useForm } from 'react-hook-form'
import ReactPaginate from 'react-paginate'

import { useAuth, useData } from '../../../hooks'

import { LayoutAdmin } from '../../../components/layouts'
import { ArticleList } from '../../../components/admin/articles';
import { LinkPrimary, TitlePage } from '../../../components/admin/ui'
import { LoadingAdmin } from '../../../components/admin/utilities'



const ArticulosPage: NextPage = () => {

    const [loading, setLoading] = useState(false)
    
    const router = useRouter()

    const { register, handleSubmit, formState:{ errors }, getValues, setValue, reset } = useForm({
        defaultValues: {
            searchTerm: '',
            category: '',
            status: ''
        }
    })
        
    const { entries, refreshEntries, categories, refreshCategories } = useData()
    const { user: userSession } = useAuth()


    const loadEntries = async(searchTerm?:string, category?:string, status?:string) => {
        
        const { page } = router.query as { page?: string }
        
        let actualPage = 0

        if( page && Number( page ) >= 1 ){
            actualPage = Number( page ) - 1
        }

        setLoading(true)
        await refreshEntries(actualPage, searchTerm, category, status)        

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


    const loadCategories = async()=> {
        await refreshCategories()
    }

    useEffect(()=>{
        if( !userSession ){
            return
        }     
        
        if(categories.length === 0){
            loadCategories()
        }
    },[userSession])
       

    const onChangeCategory = ( { target }:ChangeEvent<HTMLSelectElement> ) => {
        setValue('category', target.value, { shouldValidate: true } )
    }

    const onFilterSubmit = async( data ) => {
        await loadEntries(
            data.searchTerm,
            data.category,
            data.status,
        )
    }


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
                            <form 
                                onSubmit={ handleSubmit( onFilterSubmit ) } 
                                className="py-6 px-5 md:px-10 bg-white rounded-md mb-5 sm:mb-10 flex flex-col md:flex-row md:items-end flex-wrap gap-5 lg:gap-10"
                            >
                                <div className="flex flex-col md:flex-row flex-wrap gap-5 lg:gap-10">
                                    <div className="min-w-full md:min-w-[260px] lg:min-w-[300px]">
                                        <label htmlFor="title" className="block text-md mb-3 font-bold text-slate-800 ">
                                            Título
                                        </label>
                                        <input
                                            type="text"
                                            id="title"
                                            placeholder="Buscar por título"
                                            disabled={loading}
                                            className={`bg-admin w-full rounded-md flex-1 border px-5 py-3 disabled:border-slate-200 ${ !!errors.searchTerm ? 'outline outline-2 outline-red-500' :'hover:border-slate-800' }`}
                                            { ...register('searchTerm')}
                                        />
                                    </div>
                                    <div className="min-w-full md:min-w-[260px] lg:min-w-[300px]">
                                        <label htmlFor="category" className="block text-md mb-3 font-bold text-slate-800">
                                            Categoría
                                        </label>
                                        <select
                                            id="category"
                                            name="category"
                                            value={getValues('category')!}
                                            onChange={onChangeCategory}
                                            className="bg-admin w-full rounded-md flex-1 border px-5 py-3 hover:border-slate-800 disabled:border-slate-200"
                                            disabled={loading}
                                        >
                                            <option value="" key="0" className="text-gray-400">--- Todas ---</option>
                                            {
                                                categories.map(category => (
                                                    <option key={category._id} value={category._id} >
                                                        {category.title}
                                                    </option>
                                                ))
                                            }
                                        </select>
                                    </div>
                                    <div className="min-w-full md:min-w-[260px] lg:min-w-[300px]">
                                        <label htmlFor="category" className="block text-md mb-3 font-bold text-slate-800">
                                            Estado
                                        </label>
                                        <select
                                            id="status"
                                            className="bg-admin w-full rounded-md flex-1 border px-5 py-3 hover:border-slate-800 disabled:border-slate-200"
                                            disabled={loading}
                                            { ...register('status') }
                                        >
                                            <option value="" className="text-gray-400">--- Todos ---</option>
                                            <option value={'published'} > Publicado </option>
                                            <option value={'unpublished'} > Sin publicar </option>
                                        </select>
                                    </div>
                                </div>
                                <button className="border-2 border-sky-600 text-sky-700 hover:bg-sky-600 hover:text-white transition-all rounded-md py-[0.65rem] px-7 w-full md:w-auto font-semibold">
                                    Filtrar
                                </button>
                            </form>
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