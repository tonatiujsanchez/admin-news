import { FC, useCallback, useState } from "react"
import Image from "next/image"

// import Modal from 'react-modal'
import { CopyToClipboard } from 'react-copy-to-clipboard'

import { useData } from "../../../hooks/useData"
import { LoadingCircle } from "../utilities"
import { IImage } from "../../../interfaces"
import { notifyDark } from "../../../utils/frontend"

// const customStyles = {
//     overlay: {
//         backgroundColor: 'rgba(0, 0, 0, 0.8)'
//     },
//     content: {
//         top: '50%',
//         left: '50%',
//         right: 'auto',
//         bottom: 'auto',
//         marginRight: '-50%',
//         transform: 'translate(-50%, -50%)',
//     },
// }
// Modal.setAppElement('#__next')


interface Props {
    image: IImage
}


export const ImageItem:FC<Props> = ({ image }) => {

    const [modalDelete, setModalDelete] = useState(false)
    const [loadingDelete, setLoadingDelete] = useState(false)

    // const { deleteImage } = useData()


    const showModalDelete = () => {

        // const body = document.querySelector('body')
        // body.classList.add('fixed-body')

        setModalDelete(true)
    }


    const hiddenModalDelete = () => {

        // const body = document.querySelector('body')
        // body.classList.remove('fixed-body')

        setModalDelete(false)
    }


    // const onDeleteImage = async () => {

    //     setLoadingDelete(true)

    //     const { hasError } = await deleteImage(image)
        
    //     if(hasError){ 
    //         setLoadingDelete(false)
    //         return
    //     }
    //     hiddenModalDelete()
    //     setLoadingDelete(false)
    // }


    const onCopy = useCallback(() => {
        notifyDark('Se copio URL de la image')
      }, [])

    return (
        <>
            <div className="relative w-[48%] sm:w-[165px]">
                <div className="rounded-lg overflow-hidden border">
                    <Image
                        priority={true}
                        blurDataURL={image.url}
                        placeholder="blur"
                        width={350}
                        height={100}
                        src={image.url}
                        alt={`Imagen ${image.name}`}
                        title={`Imagen ${image.name}`}
                        className='w-full h-auto'
                    />
                    <div className="pl-2 pt-2">
                        <p className="font-bold text-xl mb-2">{ image.name }</p>
                        <div className="flex justify-between items-center">
                            <p className="text-lg text-slate-600">{image.format}</p>
                            <p className="text-lg text-slate-600">{image.size}</p>
                            <CopyToClipboard onCopy={onCopy} text={image.url}>
                                <button
                                    className="bg-slate-200 text-slate-800 px-4 py-2 rounded-tl-lg text-xl active:scale-95">
                                    <i className='bx bx-clipboard'></i>
                                </button>
                            </CopyToClipboard>
                        </div>

                    </div>
                </div>
                <button
                    onClick={showModalDelete} 
                    className="absolute -top-2 -right-2 shadow text-white bg-red-500 opacity-75 rounded-full text-lg w-10 h-10 hover:bg-red-600 hover:opacity-100 active:scale-95">
                    <i className='bx bx-trash'></i>
                </button>
            </div>
            {/* <Modal
                isOpen={modalDelete}
                style={customStyles}>
                <div className="p-5">
                    <header className="text-center">
                        <div className='text-center text-7xl mb-2 text-red-600'>
                            <i className='bx bx-trash'></i>
                        </div>
                        <h3 className='font-bold text-4xl mb-5'>Eliminar Imagen</h3>
                        <p className="text-center text-2xl mb-2">{`¿Desea eliminar esta imagen?`}</p>
                    </header>
                    <div className="px-10 py-5">
                        <Image
                            priority="true"
                            layout='responsive'
                            width={100}
                            height={70}
                            objectFit="cover"
                            src={image.url}
                            alt={`Imagen ${image.name}`}
                            title={`Imagen ${image.name}`}
                        />
                    </div>
                    <div className='flex items-center justify-center gap-2 mt-10'>
                        <button
                            disabled={loadingDelete}
                            onClick={hiddenModalDelete}
                            className="py-3 px-5 uppercase w-full rounded-md cursor-pointer transition-colors disabled:opacity-60 disabled:cursor-auto">
                            Cancelar
                        </button>
                        <button
                            disabled={loadingDelete}
                            onClick={onDeleteImage}
                            className="bg-red-500 hover:bg-red-600 text-white font-bold py-3 px-6 uppercase w-full rounded-md cursor-pointer transition-colors min-w-[120px] flex justify-center disabled:bg-red-300">
                                {   loadingDelete
                                    ? <LoadingCircle />
                                    : <span>Eliminar</span>
                                }
                        </button>
                    </div>
                </div>
            </Modal> */}

        </>
    )
}
