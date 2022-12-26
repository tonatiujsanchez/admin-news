
import { FC, useState } from 'react'

import { useData } from '../../../hooks/useData'
import { ICategory } from '../../../interfaces'
import { ModalContainer, ModalDelete } from '../ui'


interface Props {
    category: ICategory
}

export const CategoryItem:FC<Props> = ({ category }) => {

    const [showModalDelete, setShowModalDelete] = useState(false)
    const [loading, setLoading] = useState(false)

    const [openSubcategories, setOpenSubcategories] = useState(false)
    
    const [categoryDelete, setCategoryDelete] = useState<ICategory>()

    const { deleteCategory } = useData()


    const onShowModalDelete = ( categorySelected: ICategory ) => {
        setCategoryDelete(categorySelected)
        setShowModalDelete(true)
    }

    const onDeleteCategory = async( result: () => Promise<{ confirm: boolean; }> ) => {

        const { confirm } = await result()

        if(!confirm){
            setShowModalDelete(false)
            setCategoryDelete(undefined)
            return
        }

        setLoading(true)
        const { hasError } = await deleteCategory(categoryDelete?._id!)
        setLoading(false)
        
        if( hasError ){ return }

        setShowModalDelete(false)
        setCategoryDelete(undefined)

    }

    return (
        <>
            <div className={`mb-3 border pl-5 pr-10 py-4 bg-white rounded-md ${openSubcategories ? 'h-auto' : 'h-25'}`}>
                <div className="flex justify-between items-center">
                    <div className="flex gap-2 items-center">
                        <button
                            onClick={() => setOpenSubcategories(!openSubcategories)}
                            className={`text-5xl p-2 ${category.subcategories?.length ? 'opacity-100' : 'opacity-10'}`}>
                            <i className={`bx bx-chevron-down transition-all ${openSubcategories && category.subcategories?.length ? 'rotate-180' : ''}`}></i>
                        </button>
                        <p
                            onClick={() => setOpenSubcategories(!openSubcategories)}
                            className={`font-bold ${category.subcategories ? 'cursor-pointer' : 'cursor-text'}`}>
                            {category.title}
                        </p>
                    </div>
                    <div className="flex gap-5">
                        <button
                            className='flex items-center text-sky-600 hover:text-white bg-sky-100 hover:bg-sky-500 font-bold text-3xl py-2 px-3 rounded-md'
                            // onClick={() => onEditCategory(category)}
                        >
                            <i className='bx bx-edit'></i>
                        </button>
                        <button
                            className='flex items-center text-red-600 hover:text-white bg-red-100 hover:bg-red-500 font-bold text-3xl py-2 px-3 rounded-md'
                            onClick={() => onShowModalDelete(category)}
                        >
                            <i className='bx bx-trash' ></i>
                        </button>
                    </div>
                </div>
                {
                    category.subcategories &&
                    <div>
                        {
                            category.subcategories.map(subcategory => {
                                if (subcategory.category === category._id) {
                                    return (
                                        <div key={subcategory._id} className={`pl-10 pr-10 my-1 py-4 justify-between items-center even:bg-gray-100 ${openSubcategories ? 'opacity-100 flex' : 'opacity-0 hidden'}`}>
                                            <p><i className='bx bx-minus'></i> {subcategory.title}</p>
                                            <div className="flex gap-5">
                                                <button
                                                    className='text-sky-700 hover:text-sky-800'
                                                    // onClick={() => onEditCategory(subc)}
                                                >
                                                    <i className='bx bx-edit'></i>
                                                </button>
                                                <button
                                                    className='text-red-500 hover:text-red-600'
                                                    onClick={() => onShowModalDelete(subcategory)}
                                                >
                                                    <i className='bx bx-trash' ></i>
                                                </button>
                                            </div>
                                        </div>
                                    )
                                }
                            })
                        }
                    </div>
                }
            </div>
            {
                showModalDelete && categoryDelete && (
                    <ModalContainer>
                        <ModalDelete 
                            processing={ loading } 
                            title={'Eliminar categoría'} 
                            subtitle={
                                <p className="text-2xl text-gray-500">
                                    ¿Desdea eliminar la categoría <span className='font-semibold italic'>{`"${categoryDelete.title}"`}</span>?
                                </p>
                            } 
                            onResult={ onDeleteCategory } 
                        />
                    </ModalContainer>
                )
            }
        </>
    )
}
