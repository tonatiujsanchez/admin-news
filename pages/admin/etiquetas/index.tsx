import { SetStateAction, useState, useEffect } from 'react';
import { NextPage } from 'next'

import { LayoutAdmin } from '../../../components/layouts'
import { BtnPrimary, ModalContainer, TitlePage } from '../../../components/admin/ui'
import { LoadingAdmin } from '../../../components/admin/utilities';
import { TagForm, TagList } from '../../../components/admin/tags';
import { useData } from '../../../hooks';


const EtiquetasPage: NextPage = () => {
    
    const [loading, setLoading] = useState(false)
    const [showTagForm, setShowTagForm] = useState(false)

    const { refreshTags, tags } = useData()

    const loadTags = async() => {
        setLoading(true)
        await refreshTags()
        setLoading(false)
    }

    useEffect(()=> {
        if (tags.length <= 0) {
            loadTags()
        }
    },[loadTags])



    
    return (
        <LayoutAdmin title={'- Etiquetas'} isMain={true}>
            <div className="mb-5 sm:mb-0 flex gap-2 items-center py-3">
                <TitlePage title="Etiquetas" />
                <button
                    className="text-3xl text-slate-600 hover:bg-slate-200 hover:text-slate-900 py-2 px-3 rounded-full active:scale-95"
                    onClick={() => loadTags()}
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
                        <div className="w-full mb-10">
                            <BtnPrimary 
                                onClick={()=>setShowTagForm(true)} 
                                text="Agregar Etiqueta"
                            />
                        </div>
                        <div className='max-w-[960px] mx-auto'>
                            <div className='overflow-x-auto custom-scroll'>
                                <TagList tags={ tags } />
                            </div>
                        </div>
                    </section>
                )
            }
            {
                showTagForm && (
                    <ModalContainer heightFull={true}>
                        <TagForm 
                            setShowTagForm={ setShowTagForm }
                        />
                    </ModalContainer>
                )
            }
        </LayoutAdmin>
    )
}

export default EtiquetasPage