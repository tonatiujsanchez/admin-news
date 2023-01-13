import { FC, Fragment, useEffect, useState } from "react"

import styled from "@emotion/styled"

import { useData } from "../../../hooks/useData"
import { IEntryAuthor } from '../../../interfaces/IEntry';

interface Props {
    author?: IEntryAuthor
    handleSelectAuthor: (author: IEntryAuthor) => void
}

export const SelectAuthors:FC<Props> = ({ author, handleSelectAuthor }) => {

    const [loadingAuthors, setLoadingAuthors] = useState(false)
    const [showSelect, setShowSelect] = useState(false)
    const [authorActive, setAuthorActive] = useState<IEntryAuthor>()
    

    const { authors, refreshAuthors } = useData()

    const LoadAuthors = async () => {
        setLoadingAuthors(true)
        await refreshAuthors()
        setLoadingAuthors(false)
    }

    useEffect(() => {
        if (authors.length === 0) {
            LoadAuthors()
        }
    }, [])

    useEffect(()=>{        

        if( authors.length === 0 ){ return }

        if(!author){
            setAuthorActive({
                _id: authors[0]._id!,
                name: authors[0].name,
                photo: authors[0].photo!,
                occupation: authors[0].occupation!,
                slug: authors[0].occupation!,
            })
            handleSelectAuthor({
                _id: authors[0]._id!,
                name: authors[0].name,
                photo: authors[0].photo!,
                occupation: authors[0].occupation!,
                slug: authors[0].occupation!,
            })
            return
        }

        setAuthorActive(author)
    },[author, authors])


    return (
        <div className="flex-1 flex flex-col gap-1">
            <div className="flex items-end gap-2 mb-1">
                <label htmlFor="author" className="mb-1 block font-bold text-slate-800">Autor</label>
                <button
                    type="button"
                    className="text-xl text-slate-600 hover:bg-slate-200 hover:text-slate-900 py-2 px-2 rounded-full grid place-content-center active:scale-95"
                    onClick={() => LoadAuthors()}>
                    <i className='bx bx-revision'></i>
                </button>
            </div>
            {
                loadingAuthors || !authorActive
                    ? <div className="animate-pulse space-x-4 rounded-md bg-slate-300 h-20 w-full"></div>
                    : <ContenedorSelect
                        onClick={() => setShowSelect(!showSelect)}
                        className="border border-gray-200"
                    >
                        <OpcionSeleccionada>
                            {authorActive.name} <i className={`bx bxs-down-arrow transition-all duration-300 ${showSelect ? 'rotate-180' : ''}`}></i>
                        </OpcionSeleccionada>
                        {showSelect &&
                            <Opciones className={`border border-gray-200 shadow-lg`}>
                                {authors.map(author => (
                                        <Opcion
                                            key={author._id}
                                            onClick={() => handleSelectAuthor({
                                                _id: author._id!,
                                                name: author.name,
                                                photo: author.photo,
                                                occupation: author.occupation,
                                                slug: author.slug!,
                                            })}
                                        >
                                            {author.name}
                                        </Opcion>
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
	transition: .3s ease all;
    /* z-index: 10; */
	&:hover {
        border: 1px solid #333;
	}
`;

const OpcionSeleccionada = styled.div`
	width: 100%;
	display: flex;
	align-items: center;
	justify-content: space-between;
    /* z-index: 10; */
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
    z-index: 10;
`;

const Opcion = styled.div<{ subcategory?: boolean }>`
	display: flex;
    padding: ${(props) => props.subcategory ? '1rem 1.25rem 1rem 3rem' : '1.25rem'};
    font-weight: ${(props) => props.subcategory ? 'normal' : 'bold'};
    /* z-index: 10; */
	&:hover {
		background-color: #CBDDE2;
	}
`;

