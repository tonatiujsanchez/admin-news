import { FC } from "react"


import { ImageItem } from "./ImageItem"
import { IImage } from "../../../interfaces"


interface Props {
  images: IImage[]
}

export const ImageList: FC<Props> = ({ images }) => {
  return (
    <>
      {
        images.length === 0
          ? (
            <div></div>
          ) : (
            <div className="flex flex-wrap gap-x-4 gap-y-8">
              {
                images.map(image => (
                  <ImageItem key={image._id} image={image} />
                ))
              }
            </div>
          )
      }
    </>
  )
}
