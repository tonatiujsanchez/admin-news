import Image from "next/image"
import { Dispatch, FC, SetStateAction } from "react"
import { IImage } from "../../../interfaces"



interface Props {
    images: IImage[]
    imageSelected?: IImage
    setImageSelected: Dispatch<SetStateAction<IImage | undefined>>
}

export const ImagesSelectModalList:FC<Props> = ({ images, imageSelected, setImageSelected }) => {


    const selectImage = (image: IImage) => {

        if (image?._id === imageSelected?._id) {
            setImageSelected(undefined)
            return
        }

        setImageSelected(image)
    }


    return (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {
                images.map(image => {
                    return (
                        <div
                            key={image._id}
                            onClick={() => selectImage(image)}
                            className={`cursor-pointer rounded border ${imageSelected && imageSelected._id === image._id ? 'outline outline-2 outline-sky-400 scale-95' : ''}`}
                        >
                            <div className={ `relative h-48 w-full ${imageSelected && imageSelected._id === image._id ? 'opacity-60' : ''}`}>
                                <Image
                                    fill
                                    sizes="(max-width: 100%) 100%"
                                    src={image.url}
                                    alt={`Imagen ${image.name}`}
                                    title={`Imagen ${image.name}`}
                                    className="contain bg-slate-100"
                                />
                            </div>
                            <div className="pl-2 py-3 px-1 text-center">
                                <p className="font-bold text-xl">{image.name}</p>
                            </div>
                        </div>
                    )
                })
            }
        </div>
    )
}
