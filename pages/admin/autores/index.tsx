import { useEffect, useState } from 'react';
import { NextPage } from 'next';

import { LayoutAdmin } from '../../../components/layouts';

import { AuthorCard } from '../../../components/admin/authors';
import { LinkPrimary, TitlePage } from '../../../components/admin/ui';
import { LoadingAdmin } from '../../../components/admin/utilities';

import { useData } from '../../../hooks';



const AutoresPage:NextPage = () => {

    const [loading, setLoading] = useState(false)

    const { refreshAuthors, authors } = useData()

    const loadAuthors = async () => {
        setLoading(true)
        await refreshAuthors()
        setLoading(false)
    }

    useEffect(() => {
        if (authors.length <= 0) {
            loadAuthors()
        }
    }, [loadAuthors])


    return (
        <LayoutAdmin title="- Autores" >

            <div className="mb-5 flex gap-2 items-center py-3">
                <TitlePage title="Autores" />
                <button
                    className="text-3xl text-slate-600 hover:bg-slate-200 hover:text-slate-900 py-2 px-3 rounded-full active:scale-95"
                    onClick={() => loadAuthors()}>
                    <i className='bx bx-revision'></i>
                </button>
            </div>

            {
                loading
                    ? <div className="flex justify-center mt-96">
                        <LoadingAdmin />
                    </div>
                    : <section>
                        <div className="flex w-full mb-10">
                            <LinkPrimary link="/admin/autores/nuevo" text="Agregar nuevo autor" />
                        </div>
                        <div className="flex flex-wrap justify-center sm:justify-start gap-y-10 gap-5 sm:gap-10 rounded-lg">
                            {
                                authors.map(author => (
                                    <AuthorCard key={author._id} author={author} />
                                ))
                            }
                        </div>
                    </section>
            }

        
        </LayoutAdmin>
        
    
    )
}

export default AutoresPage