import { FC, Fragment, useEffect, useMemo, useState } from "react"

import styled from "@emotion/styled"

import { useData } from "../../../hooks/useData"
import { IEntryCategory } from "../../../interfaces"

interface Props {
    category?: IEntryCategory
    subcategory?: IEntryCategory | null
    handleSelectCategory: (category: IEntryCategory, subcategory?: IEntryCategory) => void
}

export const SelectCategories:FC<Props> = ({ category, subcategory, handleSelectCategory }) => {


    const [loadingCategories, setLoadingCategories] = useState(false)
    const [showSelect, setShowSelect] = useState(false)
    const [categoryActive, setCategoryActive] = useState<IEntryCategory>()

    const { categories, refreshCategories } = useData()


    const loadCategories = async () => {
        setLoadingCategories(true)
        await refreshCategories()
        setLoadingCategories(false)
    }

    useEffect(() => {
        if(categories.length === 0){
            loadCategories()
        }
    }, [])

    useEffect(()=>{

        if(categories.length === 0){ return }
      
        if(subcategory){
            setCategoryActive(subcategory)         
        }else{
            
            if(!category){
                setCategoryActive({
                    _id: categories[0]._id!,
                    title: categories[0].title,
                    slug: categories[0].slug!,
                    tag: categories[0].tag!,
                })
                handleSelectCategory({
                    _id: categories[0]._id!,
                    title: categories[0].title,
                    slug: categories[0].slug!,
                    tag: categories[0].tag!,
                })
                return
            }
            setCategoryActive(category)            
        }

    },[subcategory, category, categories])


    return (
        <div className="flex-1 flex flex-col gap-1">
            <div className="flex items-end gap-2 mb-1">
                <label htmlFor="category" className="mb-1 font-medium">Categoría</label>
                <button
                    type="button"
                    className="text-xl text-slate-600 hover:bg-slate-200 hover:text-slate-900 py-2 px-2 rounded-full grid place-content-center active:scale-95"
                    onClick={() => loadCategories()}>
                    <i className='bx bx-revision'></i>
                </button>
            </div>
            {
                loadingCategories || !categoryActive
                ?<div className="animate-pulse space-x-4 rounded-md bg-slate-300 h-20 w-full"></div>
                : <ContenedorSelect
                    onClick={() => setShowSelect(!showSelect)}
                    className="border border-gray-200"
                 >
                    <OpcionSeleccionada>
                        {categoryActive.title} <i className={`bx bxs-down-arrow transition-all duration-300 ${showSelect ? 'rotate-180' : ''}`}></i>
                    </OpcionSeleccionada>
                    {showSelect &&
                        <Opciones className={`border border-gray-200 shadow-lg custom-scroll`}>
                            {categories.map(category => (
                                <Fragment key={category._id}>
                                    <Opcion
                                        onClick={() => handleSelectCategory({
                                            _id: category._id!,
                                            title: category.title,
                                            slug: category.slug!,
                                            tag: category.tag!,
                                        })}
                                    >
                                        {category.title}
                                    </Opcion>
                                    {
                                        category.subcategories &&
                                        <div>
                                            {
                                                category.subcategories.map(subcategory => (

                                                    <Opcion
                                                        subcategory
                                                        key={subcategory._id}
                                                        onClick={() => handleSelectCategory({
                                                            _id: category._id!,
                                                            title: category.title,
                                                            slug: category.slug!,
                                                            tag: category.tag!,
                                                        },{
                                                            _id: subcategory._id!,
                                                            title: subcategory.title,
                                                            slug: subcategory.slug!,
                                                            tag: subcategory.tag!,
                                                        })}

                                                    >
                                                        - {subcategory.title}
                                                    </Opcion>
                                                ))

                                            }
                                        </div>
                                    }
                                </Fragment>
                            ))
                            }
                        </Opciones>
                    }
                </ContenedorSelect>
                
            }
        </div>
    )
}




const ContenedorSelect = styled.div`
    background-color: rgb(250, 250, 255);
	cursor: pointer;
	border-radius: 0.625rem; /* 10px */
	position: relative;
	height: 5rem; /* 80px */
	width: 100%;
	padding: 0px 1.25rem; /* 20px */
	font-size: 1.5rem; /* 24px */
	text-align: center;
	display: flex;
	align-items: center;
	transition: .5s ease all;
    /* z-index: 20; */
	&:hover {
		background-color: #E8EFF1;
        border: 1px solid #333;
	}
`;

const OpcionSeleccionada = styled.div`
	width: 100%;
	display: flex;
	align-items: center;
	justify-content: space-between;
    /* z-index: 20; */
`;

const Opciones = styled.div`
    background-color: white;
	position: absolute;
	top: 4.9rem; /* 90px */
	left: 0;
	width: 100%;
	border-radius: 0.625rem; /* 10px */
	max-height: 28rem; /* 300px */
	overflow-y: auto;
    z-index: 20;
`;

const Opcion = styled.div<{ subcategory?: boolean }>`
	display: flex;
    padding: ${(props) => props.subcategory ? '1rem 1.25rem 1rem 3rem' : '1.25rem'};
    font-weight: ${(props) => props.subcategory ? 'normal' : 'bold'};
	/* z-index: 20; */
    &:hover {
		background-color: #CBDDE2;
	}
`;

