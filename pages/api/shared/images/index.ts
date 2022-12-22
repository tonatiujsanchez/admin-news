import type { NextApiRequest, NextApiResponse } from 'next'


import formidable from 'formidable'

import { v2 as cloudinary } from 'cloudinary'
cloudinary.config( process.env.CLOUDINARY_URL || '' )

import { db, NEWS_CONSTANTS } from '../../../../database'
import { Image } from '../../../../models'

import { IImage } from '../../../../interfaces'
import { ISectionImage } from '../../../../interfaces';

// yarn add formidable
// yarn add -D  @types/formidable
type Data = 
    | { message: string }
    | IImage


export const config = {
    api: {
        bodyParser: false,
    }
}

export default function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
    switch (req.method) {

        case 'POST':
            return uploadImage( req, res )
    
        default:
            return res.status(400).json({ message: 'Bad request' })
    }
}


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
