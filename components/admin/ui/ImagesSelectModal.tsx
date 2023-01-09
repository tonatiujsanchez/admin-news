import { Dispatch, FC, SetStateAction, useEffect, useState } from "react"

import ReactPaginate from 'react-paginate'

import { useData } from "../../../hooks"
import { ImagesSelectModalList } from "./ImagesSelectModalList"
import { LoadingAdmin } from "../utilities"
import { IImage, ISectionImage } from "../../../interfaces"

// const sectionImages:ISectionImage = 'articles'

interface Props {
    sectionImages:ISectionImage
    handleSelectedImage: ( fnSelectedImage: ()=> Promise<string | undefined> ) => Promise<void>
}

export const ImagesSelectModal:FC<Props> = ({ sectionImages, handleSelectedImage }) => {

    const [loading, setLoading] = useState(false)
    const [imagesList, setImagesList] = useState<IImage[]>([])
    const [actualPage, setActualPage] = useState(0)

    const [imageSelected, setImageSelected] = useState<IImage>()

    const { images, refreshImages } = useData()



    const loadImages = async () => {
        setLoading(true)
        await refreshImages(sectionImages, actualPage)
        setImagesList(images[sectionImages].data)
        setLoading(false)
    }

    useEffect(()=>{
        const imagesPageActive = Number(localStorage.getItem(`section_page_storage_${sectionImages}_ed4c1de1770480153a06fa2349f501f0`)) || 0
        setActualPage(imagesPageActive)
    },[])


    useEffect(() => {

        if (!actualPage && actualPage !== 0) { return }

        if (images[sectionImages].data.length <= 0) {
            loadImages()
        } else {
            setImagesList(images[sectionImages].data)
        }

    }, [images])


    const onSelectedImage = async():Promise<string | undefined> =>{
        if(!imageSelected){
            return undefined
        }
        return imageSelected.url
    }

    const handlePageClick = async( event:{selected: number} ) => {
        setActualPage(event.selected)
        await refreshImages(sectionImages, event.selected)
    }

    return (
        <div className="flex flex-col h-screen sm:max-h-[75vh] md:w-[600px] lg:w-[750px]">
            <header className="relative bg-white z-50 w-full py-3 sm:py-5 px-3 sm:px-5 border-b">
                <p className="text-3xl font-bold py-3 flex-1 text-center">Seleccionar foto</p>
                <button
                    onClick={ ()=> handleSelectedImage(onSelectedImage)}
                    className="absolute right-5 top-5 rounded-full w-12 h-12 sm:w-14 sm:h-14 text-gray-500 flex items-center justify-center hover:text-gray-700 hover:bg-slate-200 transition-all"
                >
                    <i className='bx bx-x text-4xl sm:text-5xl'></i>
                </button>
            </header>
            <div className="flex-1 overflow-y-auto custom-scroll">
                {
                    loading
                    ? <div className="h-full flex justify-center items-center">
                        <LoadingAdmin />
                    </div>
                    :<div className="px-3 sm:mx-5 py-4">
                        <ImagesSelectModalList
                            images={imagesList}
                            imageSelected={imageSelected}
                            setImageSelected={setImageSelected}
                        />
                        <div className="flex justify-end mt-12 mb-8 px-10">
                            {
                                images[sectionImages].pageCount > 1 &&
                                <ReactPaginate
                                    previousLabel={ <i className={`bx bx-chevron-left text-4xl opacity-50 ${actualPage === 0 ?'':'hover:opacity-100' }`}></i> }
                                    breakLabel="..."
                                    nextLabel={ <i className={`bx bx-chevron-right text-4xl opacity-50 ${(actualPage + 1) === images[sectionImages].pageCount ?'':'hover:opacity-100' }`}></i> }
                                    onPageChange={handlePageClick}
                                    pageCount={ images[sectionImages].pageCount }
                                    forcePage={actualPage}
                                    className="flex justify-end gap-2"
                                    pageLinkClassName="border-2 border-transparent opacity-50 px-5 hover:border-b-sky-500 hover:opacity-100 py-2 font-semibold"
                                    activeLinkClassName="border-2 border-sky-500 opacity-100 py-2 rounded"
                                />
                            }
                        </div>
                    </div>
                }
            </div>
            <div className="bg-white px-5 py-7 sm:py-5 mb-8 sm:mb-0 flex flex-col items-center justify-end gap-4 sm:flex sm:flex-row border-t sm:px-8">
                <button
                    onClick={ ()=> handleSelectedImage(onSelectedImage) }
                    className="py-4 px-6 border border-gray-300 w-full sm:w-auto rounded-md cursor-pointer transition-colors hover:bg-slate-100 active:scale-95 disabled:scale-100 disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:bg-white"
                >
                    Cancelar
                </button>
                <button
                    onClick={ ()=> handleSelectedImage(onSelectedImage) }
                    disabled={!imageSelected}
                    className="bg-sky-500 hover:bg-sky-600 text-white font-semibold py-4 px-8 w-full sm:w-auto rounded-md cursor-pointer transition-colors min-w-[120px] flex justify-center disabled:bg-sky-300 disabled:cursor-not-allowed disabled:hover:bg-sky-300"
                >
                    Seleccionar
                </button>
            </div>
        </div>
    )
}
