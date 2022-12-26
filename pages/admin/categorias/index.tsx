import { useEffect, useMemo, useState } from 'react';
import { NextPage } from 'next';

import { useData } from '../../../hooks';

import { LayoutAdmin } from '../../../components/layouts';
import { ModalContainer, TitlePage } from '../../../components/admin/ui';
import { BtnPrimary } from '../../../components/admin/ui';
import { LoadingAdmin } from '../../../components/admin/utilities';
import { CategoryForm, CategoryItem } from '../../../components/admin/categories';



const CategoriasPage:NextPage = () => {

    const [loading, setLoading] = useState(false)
    const [showCategoryForm, setShowCategoryForm] = useState(false)

    const { refreshCategories, categories } = useData()
    

    const loadCategories = async () => {
        setLoading(true)
        await refreshCategories()
        setLoading(false)
    }

    useEffect(() => {
        if (categories.length <= 0) {
            loadCategories()
        }
    }, [loadCategories])

    
    
    return (
        <LayoutAdmin title={'- Categorías'} isMain={true}>
            <div className="mb-5 sm:mb-0 flex gap-2 items-center py-3">
                <TitlePage title="Categorías" />
                <button
                    className="text-3xl text-slate-600 hover:bg-slate-200 hover:text-slate-900 py-2 px-3 rounded-full active:scale-95"
                    onClick={() => loadCategories()}
                >
                    <i className='bx bx-revision'></i>
                </button>
            </div>
            {
                loading
                    ? <div className="flex justify-center mt-96">
                        <LoadingAdmin />
                    </div>
                    : <section>
                        <div className="w-full mb-10">
                            <BtnPrimary 
                                onClick={()=>setShowCategoryForm(true)} 
                                text="Agregar categoría"
                            />
                        </div>
                        <div className='max-w-[960px] mx-auto'>
                            {
                                categories.map(category => (
                                    <CategoryItem
                                        key={category._id}
                                        category={category}
                                    />
                                ))

                            }
                        </div>
                    </section>
            }
            {
                showCategoryForm &&
                <ModalContainer heightFull={true}>
                    <CategoryForm setShowCategoryForm={setShowCategoryForm} />
                </ModalContainer>
            }
        </LayoutAdmin>
    )
}

export default CategoriasPage