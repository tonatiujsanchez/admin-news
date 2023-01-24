import type { NextApiRequest, NextApiResponse } from 'next'

import { isValidObjectId } from 'mongoose'
import * as jose from 'jose'

import { v2 as cloudinary } from 'cloudinary'
cloudinary.config( process.env.CLOUDINARY_URL || '' )

import { db, NEWS_CONSTANTS } from '../../../../database'
import { Image } from '../../../../models'

import { IImage } from '../../../../interfaces'


// yarn add formidable
// yarn add -D  @types/formidable
type Data = 
    | { message: string }
    | IImage
    | {
        section: string
        length : number
        totalOfPages: number
        images : IImage[]
    }


export default function handler(req: NextApiRequest, res: NextApiResponse<Data>) {

    switch (req.method) {

        case 'GET':
            return getImages(req, res)
    
        case 'DELETE':
            return deleteImage(req, res)
    
        default:
            return res.status(400).json({ message: 'Bad request' })
    }

}


const getImages = async(req: NextApiRequest, res: NextApiResponse<Data>) => {
    
    const { section = '', skipStart = 0 } = req.query

    if( !section ){
        return res.status(400).json({ message: 'La porpiedad section es necesaria' })
    }

    if( !NEWS_CONSTANTS.validImagesSections.includes(section as string) ){
        return res.status(400).json({ message: 'Sección de la imagen NO valida' })
    }

    const imagesPerPage = 20
    let skipImages = Number(skipStart)

    const { 'news_session_ed4c1de1770480153a06fa2349f501f0':token } = req.cookies    
    const { payload } = await jose.jwtVerify(String( token ), new TextEncoder().encode(process.env.JWT_SECRET_SEED))
        

    if( section === 'authors' && payload.role !== 'admin' ){
        return res.status(400).json({ message: 'No tiene permisos a esta sección de imagenes' })
    }

    try {

        await db.connect()

        let imagesLengthDB = 0

        if(section === 'users' && payload.role !== 'admin'){
            imagesLengthDB = await Image.find({ section, user: payload._id  }).count()
        }else {
            imagesLengthDB = await Image.find({ section }).count()
        }

        if( skipImages >= imagesLengthDB || skipImages < 0 ){
            skipImages = 0
        }

        let images = []

        if(section === 'users' && payload.role !== 'admin') {

            images = await Image.find({ section, user: payload._id })
                                .skip(skipImages)
                                .limit(imagesPerPage)
                                // .select('name url size format section')
                                .sort({ createdAt: 'descending' })
                                .lean()
        
        } else {

            images = await Image.find({ section })
                                .skip(skipImages)
                                .limit(imagesPerPage)
                                // .select('name url size format section')
                                .sort({ createdAt: 'descending' })
                                .lean()

        }

        await db.disconnect()

        return res.status(200).json({
            section: section as string,
            length: imagesLengthDB,
            totalOfPages: Math.ceil(imagesLengthDB / imagesPerPage),
            images,
        })

        
    } catch (error) {

        await db.disconnect()
        console.log(error)
        return res.status(500).json({ message: 'Algo salio mal, revisar la consola del servidor' })
    }
}


const deleteImage = async (req:NextApiRequest, res:NextApiResponse<Data>) => {

    const { idImage } = req.body
    

    if (!isValidObjectId(idImage)) {
        return res.status(400).json({ message: `ID de imagen no valido` })
    }

    try {

        await db.connect()
        const image = await Image.findById(idImage)
        
        if( !image ){
            await db.disconnect()
            return res.status(400).json({ message: 'Imagen no encontrada' })
        }        
        
        await Promise.all([
            cloudinary.uploader.destroy( `${process.env.CLOUDINARY_FOLDER}/${image.name}` ),
            image.deleteOne()
        ])
        
        await db.disconnect()
        return res.status(200).json( image )

    } catch (error) {

        await db.disconnect()
        console.log(error)
        return res.status(500).json({ message: 'Algo salio mal, revisar la consola del servidor' })

    }


}