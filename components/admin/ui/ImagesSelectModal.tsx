import { ChangeEvent, Dispatch, FC, SetStateAction, useEffect, useRef, useState } from "react"

import ReactPaginate from 'react-paginate'

import { useData } from "../../../hooks"
import { ImagesSelectModalList } from "./ImagesSelectModalList"
import { LoadingAdmin, LoadingCircle } from "../utilities"
import { IImage, ISectionImage } from "../../../interfaces"
import { notifyError, notifySuccess } from "../../../utils/frontend"


interface Props {
    sectionImages:ISectionImage
    handleSelectedImage: ( fnSelectedImage: ()=> Promise<string | undefined> ) => Promise<void>
}

export const ImagesSelectModal:FC<Props> = ({ sectionImages, handleSelectedImage }) => {

    const [loading, setLoading] = useState(false)
    const [loadingUploadImages, setLoadingUploadImages] = useState(false)


    const [imagesList, setImagesList] = useState<IImage[]>([])
    const [actualPage, setActualPage] = useState(0)

    const [imageSelected, setImageSelected] = useState<IImage>()

    const [files, setFiles] = useState<FileList | null>(null)
    const fileInputRef = useRef<HTMLInputElement>(null)

    const { images, refreshImages, addNewImage } = useData()



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


    //Upload images
    const handleFilesChange = ({ target }:ChangeEvent<HTMLInputElement>) => {

        if (!target.files || target.files.length === 0) {
            setFiles(null)
            return
        }

        setFiles(target.files as FileList)
        setImageSelected(undefined)
    }

    
    const uploadImages = async () => {

        if (!files) {
            return notifyError('No hay archivos seleccionados para subir')
        }

        setLoading(true)
        setLoadingUploadImages(true)

        const filesArr = Array.from(files)

        const imagesFormData = filesArr.map( file => {
            const formData = new FormData()
            formData.append('file', file)
            formData.append('section', sectionImages)
            return formData
        })

        try {
            await Promise.all( imagesFormData.map( imgFormData => addNewImage( imgFormData ) ))
            setFiles(null)
            setLoading(false)
            setLoadingUploadImages(false)
            fileInputRef.current!.value = ''
            notifySuccess('Imagenes subidas correctamente')

        } catch (error) {
            setLoading(false)
            setLoadingUploadImages(false)
            notifyError('Hubo un error al intentar subir la imagen')
        }

    }




    // Select
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
            <header className="relative bg-white z-50 w-full py-3 sm:py-5 px-3 sm:px-5 border-b flex justify-center items-center gap-2">
                <p className="text-3xl font-bold py-3 text-center">Seleccionar foto</p>
                <button
                    type="button"
                    disabled={ loading }
                    className={`text-2xl text-slate-600 py-1 px-2 rounded-full mt-1 ${ loading ? '' : 'active:scale-95 hover:bg-slate-200 hover:text-slate-900' }`}
                    onClick={() => loadImages()}
                >
                    <i className='bx bx-revision'></i>
                </button>
                <button
                    type="button"
                    disabled={ loading }
                    onClick={ ()=> handleSelectedImage(onSelectedImage)}
                    className={`absolute right-5 top-5 rounded-full w-12 h-12 sm:w-14 sm:h-14 text-gray-500 flex items-center justify-center transition-all ${ loading ? '' : 'hover:bg-slate-200 hover:text-gray-700'}`}
                >
                    <i className='bx bx-x text-4xl sm:text-5xl'></i>
                </button>
            </header>
            <div className="border-b py-5 mb-5 px-3 sm:mx-5 flex justify-between items-center flex-wrap">
                <input
                    type="file"
                    disabled={loading}
                    ref={fileInputRef}
                    accept="image/png, image/jpg, image/jpeg, image/gif, image/webp"
                    multiple
                    onChange={handleFilesChange}
                />
                <button
                    className={`bg-sky-500 hover:bg-sky-600 px-8 py-3 font-semibold rounded-md color-admin mt-5 sm:mt-0 sm:w-auto flex justify-center min-w-[200px] gap-1 ${ loading ? 'disabled:bg-sky-200' : 'disabled:bg-sky-200' }`}
                    onClick={uploadImages}
                    disabled={!files || loading}
                >
                    {
                        loadingUploadImages
                            ? <>
                                <LoadingCircle />
                                <span className="ml-2">Subiendo...</span>
                            </>
                            : <>
                                <i className='bx bx-cloud-upload text-4xl mr-1'></i>
                                Subir
                            </>
                    }
                </button>
            </div>
            <div className="flex-1 overflow-y-auto custom-scroll">
                {
                    loading
                    ? <div className="h-full flex justify-center items-center">
                        <LoadingAdmin />
                    </div>
                    :<div className="px-3 sm:mx-5 py-4">
                        <div>
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
                    </div>
                }
            </div>
            <div className="bg-white px-5 py-7 sm:py-5 mb-8 sm:mb-0 flex flex-col items-center justify-end gap-4 sm:flex sm:flex-row border-t sm:px-8">
                <button
                    onClick={ ()=> handleSelectedImage(onSelectedImage) }
                    disabled={ loading }
                    className="py-4 px-6 border border-gray-300 w-full sm:w-auto rounded-md cursor-pointer transition-colors hover:bg-slate-100 active:scale-95 disabled:scale-100 disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:bg-white"
                >
                    Cancelar
                </button>
                <button
                    onClick={ ()=> handleSelectedImage(onSelectedImage) }
                    disabled={!imageSelected || loading}
                    className="bg-sky-500 hover:bg-sky-600 text-white font-semibold py-4 px-8 w-full sm:w-auto rounded-md cursor-pointer transition-colors min-w-[120px] flex justify-center disabled:bg-sky-300 disabled:cursor-not-allowed disabled:hover:bg-sky-300"
                >
                    Seleccionar
                </button>
            </div>
        </div>
    )
}
