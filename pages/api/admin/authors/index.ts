import type { NextApiRequest, NextApiResponse } from 'next'

import slugify from "slugify"

import { db } from '../../../../database'
import { Author } from '../../../../models'
import { IAuthor } from '../../../../interfaces'

import { v2 as cloudinary } from 'cloudinary'
import { isValidObjectId } from 'mongoose'
cloudinary.config( process.env.CLOUDINARY_URL || '' )


type Data = 
    | { message: string }
    | IAuthor
    

export default function handler(req: NextApiRequest, res: NextApiResponse<Data>) {

    switch (req.method) {

        case 'POST':
            return addNewAuthor(req, res)

        case 'PUT':
            return updateAuthor(req, res)

        case 'DELETE':
            return deleteAuthor(req, res)

        default:
            return res.status(400).json({ message: 'Endpoint NO existente' })
    }

}


const addNewAuthor = async (req:NextApiRequest, res:NextApiResponse) => {
    const {
        name = '',
        facebook = '',
        twitter = '',
        instagram = '',
        email = '',
        phone = '',
        web = '',
        occupation = '',
        description = '',
        photo = null,
    } = req.body  

    if([name.trim()].includes('')){
        return res.status(400).json({ message: 'La propiedad name es requeridas' })
    }

    const slug = slugify(name, { replacement: '-', lower: true })

    const newAuthor = new Author({
        name: name.trim(),
        slug,
        facebook: facebook.trim(),
        twitter: twitter.trim(),
        instagram: instagram.trim(),
        email: email.trim(),
        phone: phone.trim(),
        web: web.trim(),
        occupation: occupation.trim(),
        description: description.trim(),
        photo,
    })


    try {
        await db.connect()
        await newAuthor.save()
        await db.disconnect()

        return res.status(201).json(newAuthor)

    } catch (error) {

        await db.disconnect()
        console.log(error)
        return res.status(500).json({ message: 'Algo salio mal, revisar la consola del servidor' })
    }
}

const updateAuthor = async (req:NextApiRequest, res:NextApiResponse) => {
        return res.status(200).json({ message: 'Llegamos a updateAuthor Endpoint' })
}


const deleteAuthor = async (req:NextApiRequest, res:NextApiResponse) => {

    const { idAuthor } = req.body

    
    if( !isValidObjectId( idAuthor ) ){
        return res.status(400).json({ message: 'ID de Autor no válido' })
    }

    try {

        await db.connect()
        const author = await Author.findById( idAuthor )

        if( !author ){
            await db.disconnect()
            return res.status(400).json({ message: 'Autor no encontrado' })
        }

        if( author.photo ){
            const [ fileId, extencion ] = (author.photo).substring( (author.photo).lastIndexOf('/') + 1 ).split('.')
            await cloudinary.uploader.destroy( `${process.env.CLOUDINARY_FOLDER}/${fileId}` )
        }

        await author.deleteOne()
        await db.disconnect()

        return res.status(200).json({ message: idAuthor })

    } catch (error) {

        await db.disconnect()
        console.log( error )
        return res.status(400).json({ message: 'Algo salio mal, revisar la consola del servidor' })
    }



}