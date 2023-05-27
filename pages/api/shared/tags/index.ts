import type { NextApiRequest, NextApiResponse } from 'next'

import { isValidObjectId } from 'mongoose';
import slugify from 'slugify'

import { db } from '../../../../database'
import { Tag } from '../../../../models'
import { ITag } from '../../../../interfaces';



type Data = 
    | { message: string }
    | ITag

export default function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
    
    switch (req.method) {
        
        case 'POST':
            return addNewTag( req, res )

        case 'PUT':
            return updateTag( req, res )

        case 'DELETE':
            return deleteTag( req, res )
    
        default:
            return res.status(400).json({ message: 'Bad request' })
    }
}   


const addNewTag = async(req: NextApiRequest, res: NextApiResponse<Data>) => {
    
    const { title = '', active = true } = req.body

    if( title.trim() === '' ){
        return res.status(400).json({ message:'El título de la etiqueta es requerido' })
    }

    const slug = slugify(title, { replacement: '-', lower: true })   

    try {
        await db.connect()
        const tagBD = await Tag.findOne({ slug })

        if( tagBD ){
            await db.disconnect()
            return res.status(400).json({ message: 'Ya exite una etiqueta con ese nombre' })
        }

        const newTag = new Tag({
            title: title.trim(),
            slug,
            active
        })

        await newTag.save()
        await db.disconnect()

        return res.status(201).json(newTag)        

    } catch (error) {
        await db.disconnect()
        console.log(error);
        return res.status(500).json({ message: 'Algo salio mal, revisar la consola del servidor' })
    }
}

const updateTag = async (req:NextApiRequest, res:NextApiResponse<Data>) => {

    const { _id = '', } = req.body

    if( !isValidObjectId( _id ) ){
        return res.status(400).json({ message: 'ID de Etiqueta no válido' })
    }

    try {
        await db.connect()
        const tag = await Tag.findById(_id)

        if( !tag ){
            await db.disconnect()
            return res.status(400).json({ message: 'Etiqueta no encontrada' })
        }

        const {
            title = tag.title,
            active= tag.active
        } = req.body

        if (title !== tag.title) {
            tag.slug = slugify(title, { replacement: '-', lower: true })
        }

        const tagBySlug = await Tag.findOne({ slug: tag.slug })

        if( tagBySlug &&  JSON.parse(JSON.stringify(tagBySlug._id)) !== JSON.parse(JSON.stringify(tag._id)) ){
            return res.status(400).json({ message: 'Ya exite una etiqueta con ese nombre' })
        }

        tag.title = title
        tag.active = active

        await tag.save()
        await db.disconnect()

        return res.status(200).json(tag)

    } catch (error) {
        await db.disconnect()
        console.log(error)
        return res.status(500).json({ message: 'Algo salio mal, revisar la consola del servidor' })
    }

}


const deleteTag = async (req:NextApiRequest, res:NextApiResponse<Data>) => {
    
    const { idTag } = req.body

    if( !isValidObjectId( idTag ) ){
        return res.status(400).json({ message: 'ID de Etiqueta no válido' })
    }

    try {

        await db.connect()
        const tag = await Tag.findById(idTag)

        if( !tag ){
            await db.disconnect()
            return res.status(400).json({ message: 'Etiqueta NO encontrada' })
        }

        await tag.deleteOne()
        await db.disconnect()
    
        return res.status(200).json({ message: idTag })
        
    } catch (error) {
        await db.disconnect()
        console.log(error)
        return res.status(500).json({ message: 'Algo salio mal, revisar la consola del servidor' })
    }

}
