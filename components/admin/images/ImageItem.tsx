import { FC, useCallback, useState } from "react"
import Image from "next/image"

import { CopyToClipboard } from 'react-copy-to-clipboard'

import { useData } from "../../../hooks"

import { ModalContainer } from '../ui/ModalContainer';
import { ModalDeleteImage } from '../ui/ModalDeleteImage';
import { notifyDark, sizeFileFormatter } from "../../../utils/frontend"

import { IImage } from "../../../interfaces"


interface Props {
    image: IImage
}


export const ImageItem:FC<Props> = ({ image }) => {

    const [showModalDelete, setShowModalDelete] = useState(false)
    const [loadingDelete, setLoadingDelete] = useState(false)

    const { deleteImage } = useData()


    const onDeleteImage = async ( result: () => Promise<{ confirm: boolean }> ) => {

        const { confirm } = await result()
        
        if( !confirm ){ return setShowModalDelete(false)  }

        setLoadingDelete(true)
        const { hasError } = await deleteImage(image)
        setLoadingDelete(false)
        
        if(hasError){ return }

        setShowModalDelete(false)
        setLoadingDelete(false)
    }


    const onCopy = useCallback(() => {
        notifyDark('Se copio URL de la image')
    }, [])


    return (
        <>
            <div className="relative w-[48%] sm:w-[165px]">
                <div className="rounded-lg overflow-hidden border">
                    {/* <Image
                        priority={true}
                        placeholder="blur"
                        blurDataURL={image.url}
                        width={350}
                        height={100}
                        src={image.url}
                        alt={`Imagen ${image.name}`}
                        title={`Imagen ${image.name}`}
                        className='w-full h-auto'
                    /> */}
                    <div className="relative h-48 w-full">
                        <Image
                            fill
                            sizes="(max-width: 100%) 100%"
                            src={image.url}
                            alt={`Imagen ${image.name}`}
                            title={`Imagen ${image.name}`}
                            className="contain bg-slate-100"
                        />
                    </div>
                    <div className="pl-2 pt-2">
                        <p className="font-bold text-xl mb-2">{ image.name }</p>
                        <div className="flex justify-between items-center">
                            <p className="text-lg text-slate-600 flex items-end gap-1">
                                <i className='bx bxs-image-alt text-xl'></i> <span className="uppercase text-lg">{image.format}</span>
                            </p>
                            <p className="text-lg text-slate-600">{sizeFileFormatter(image.size!)} </p>
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
                    onClick={()=>setShowModalDelete(true)} 
                    className="absolute -top-2 -right-2 shadow text-white bg-red-500 opacity-75 rounded-full text-lg w-10 h-10 hover:bg-red-600 hover:opacity-100 active:scale-95">
                    <i className='bx bx-trash'></i>
                </button>
            </div>
            {
                showModalDelete && (
                    <ModalContainer>
                        <ModalDeleteImage
                            processing={loadingDelete} 
                            image={image} 
                            title={"Eliminar Imagen"} 
                            subtitle={<p>¿Desea eliminar esta imagen?</p>} 
                            onResult={onDeleteImage}
                        />
                    </ModalContainer>
                )
            }

        </>
    )
}
