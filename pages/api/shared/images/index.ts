import type { NextApiRequest, NextApiResponse } from 'next'

import * as jose from 'jose'
import formidable from 'formidable'

import { v2 as cloudinary } from 'cloudinary'
cloudinary.config( process.env.CLOUDINARY_URL || '' )

import { db, NEWS_CONSTANTS } from '../../../../database'
import { Image } from '../../../../models'

import { IImage } from '../../../../interfaces'
import { ISectionImage } from '../../../../interfaces';
// import { jwt } from '../../../../utils/shared'

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


export const config = {
    api: {
        bodyParser: false,
    }
}

export default function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
    switch (req.method) {

        case 'POST':
            return uploadImage( req, res )

        case 'GET':
            return getImages( req, res )
    
        default:
            return res.status(400).json({ message: 'Bad request' })
    }
}

// POST
const saveFile = async( file: formidable.File, section:ISectionImage,  user:string):Promise<IImage> => {

    const image = await cloudinary.uploader.upload( file.filepath, { folder: process.env.CLOUDINARY_FOLDER  } )
    
     const { public_id, secure_url, bytes, format } = image
        
    return {
        name: public_id.split('/')[1],
        url : secure_url,
        size: bytes,
        format,
        section,
        user
    }
}


const parseFiles =  async( req: NextApiRequest ):Promise<IImage> => {
    
    return new Promise(( resolve, reject ) => {
        
        const form = new formidable.IncomingForm()
        form.parse( req, async( err, fields, files )=>{

            if(!NEWS_CONSTANTS.validImagesSections.includes(fields.section as ISectionImage)){
                return reject('Sección NO valida')
            }

            if(!fields.user){
                return reject('Es necesario un usuario para subir una imagen')
            }
            
            if( err ) { 
                return reject(err)
            }

            const image = await saveFile( 
                files.file as formidable.File, 
                fields.section as ISectionImage, 
                fields.user as string
            )

            resolve(image)
        })

    })
}

const uploadImage = async(req: NextApiRequest, res: NextApiResponse<Data>) => {

    
    try {
        
        const image = await parseFiles( req )

        const newImage = new Image(image)

        await db.connect()
        await newImage.save()
        await db.disconnect()
        
        return res.status(201).json(newImage)

    } catch (error) {

        console.log(error);
        await db.disconnect()
        return res.status(500).json({ message: 'Hubo un error inesperado, revisar la consola del servidor' })

    }
}

// GET
const getImages = async(req: NextApiRequest, res: NextApiResponse<Data>) => {
    
    const { section = '', skipStart = 0 } = req.query

    if( !section ){
        return res.status(400).json({ message: 'La porpiedad section es necesaria' })
    }

    if( !NEWS_CONSTANTS.validImagesSections.includes(section as string) ){
        return res.status(400).json({ message: 'Sección de la imagen NO valida' })
    }

    const imagesPerPage = 10
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
                                .select('name url size format section')
                                .sort({ createdAt: 'descending' })
                                .lean()
        
        } else {

            images = await Image.find({ section })
                                .skip(skipImages)
                                .limit(imagesPerPage)
                                .select('name url size format section')
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

