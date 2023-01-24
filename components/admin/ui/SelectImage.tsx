import { FC, useEffect, useState } from "react"
import Image from "next/image"

import { ModalContainer } from "./ModalContainer"
import { ImagesSelectModal } from "./ImagesSelectModal"


interface Props {
    image?: string
    heightContentImage?: string
    objetFillImage?: string
    label: string
    handleSetImage: ( imageUrl?: string )=> void
    processing?: boolean
}


export const SelectImage:FC<Props> = ({ image, heightContentImage='h-80', objetFillImage='cover', label="Foto", handleSetImage, processing=false }) => {

    const [photo, setPhoto] = useState<string>()

    const [showImagesModal, setShowImagesModal] = useState(false)

    useEffect(()=>{
        if(image){
            setPhoto(image)
        }
    },[image])

    const removePhoto = () => {
        setPhoto(undefined)
        handleSetImage("")
    }


    const handleSelectedImage = async( fnSelectedImage:()=> Promise<string | undefined> ) => {

        const image = await fnSelectedImage()

        if(image) {
            handleSetImage(image)
            setPhoto(image)
        }

        setShowImagesModal(false)
    }


    return (
        <>
            <div className={`rounded-lg flex flex-col sm:flex-1 gap-2`} >
                <p className="mb-1 block font-bold text-slate-800">{ label }</p>
                {
                    photo ? (
                        <div className={`relative group mb-5 flex justify-center w-full ${heightContentImage} shadow mx-auto border`}>
                            <Image
                                priority
                                fill
                                sizes="(max-width: 100%) 100%"
                                src={ photo || 'profilePic'}
                                alt={'Nombre de pagina'}
                                className={`${objetFillImage} rounded`}
                            />
                            <button
                                onClick={removePhoto}
                                type="button"
                                disabled={processing} 
                                className="absolute -top-5 -right-5 shadow text-white bg-red-500 rounded-full w-12 h-12 hover:bg-red-600 active:scale-95 hover:shadow-2xl disabled:opacity-0">
                                <i className='bx bx-trash'></i>
                            </button>
                        </div>
                    ):(
                        <div
                            onClick={ ()=>setShowImagesModal(true) } 
                            className={`group mx-auto border-dashed border-2 ${heightContentImage} flex justify-center items-center mb-5 rounded w-full ${processing ? 'pointer-events-none' : 'hover:border-slate-800 hover:cursor-pointer'}`}>
                            <i className={`bx bxs-image-add text-6xl text-slate-800 opacity-50 ${ processing ? '' : 'group-hover:opacity-100' }`}></i>
                        </div>
                    )
                }
            </div>

            {
                showImagesModal && (
                    <ModalContainer heightFull={true} widthLg={true}>
                        <ImagesSelectModal
                            sectionImages="articles" 
                            handleSelectedImage={handleSelectedImage}
                        />
                    </ModalContainer>
                )
            }
        </>
    )
}
