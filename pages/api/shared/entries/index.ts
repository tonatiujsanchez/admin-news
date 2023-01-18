import type { NextApiRequest, NextApiResponse } from 'next'

import slugify from "slugify"
import * as jose from 'jose'

import { db } from '../../../../database'
import { Entry } from '../../../../models'
import { IEntry } from '../../../../interfaces'
import { isValidObjectId } from 'mongoose'


type Data = 
    | { message: string }
    | IEntry
    | IEntry[]

export default function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
    

    switch (req.method) {

        case 'GET':
            return getEntries( res )
    
        case 'POST':
            return addNewEntry(req, res)

        case 'DELETE':
            return deleteEntry(req, res)
    
        default:
            return res.status(400).json({ message: 'Bad request' })
    }

}

const getEntries = async( res: NextApiResponse<Data> ) => {

    try {
        
        await db.connect()
        const entries = await Entry.find().sort({ createdAt: 'desc' }).lean()       
        await db.disconnect()
    
        return res.status(200).json( entries )
        
    } catch (error) {

        await db.disconnect()
        console.log(error)
        return res.status(500).json({ message: 'Algo salio mal, revisar la consola del servidor' })
    }


}


const addNewEntry = async(req: NextApiRequest, res: NextApiResponse<Data>) => {
    
    const {         
        title = '',
        content = '',
        summary = '',
        published = true,
        publishedAt = new Date(),
        banner= '',
        imageSocial = '',
        inFrontPage = true,
        slug = '',
        category = null,
        subcategory = null,
        author = null,
        tags=[] 
    } = req.body 

    if( title.trim() === 'El titulo es necesario' ){
        return res.status(400).json({ message: 'El título es requerido' })
    }

    if( content.trim() === '' && published ){
        return res.status(400).json({message: 'No se puede publicar un artículo sin contenido'})
    }

    if(!category){
        return res.status(400).json({message: 'La categoría es requerida'})
    }

    if(!author){
        return res.status(400).json({message: 'El autor es requerido'})
    }

    let slugEntry;
    if( slug.trim() === '' ){
        slugEntry = slugify(title, { replacement: '-', lower: true })
    }else {
        slugEntry = slug
    }
    // TODO: Consultar si ya existe el slug

    try {

        const { 'news_session_ed4c1de1770480153a06fa2349f501f0':token } = req.cookies  
        const { payload } = await jose.jwtVerify(String( token ), new TextEncoder().encode(process.env.JWT_SECRET_SEED))

        
        const newEntry = await new Entry({
            user: payload._id,
            title,
            content,
            summary,
            published,
            publishedAt,
            banner,
            imageSocial,
            inFrontPage,
            slug: slugEntry,
            category,
            subcategory,
            author,
            tags
        })

        await db.connect()
        await newEntry.save()
        await db.disconnect()

        return res.status(200).json( newEntry )

        
    } catch (error) {
        await db.disconnect()
        console.log(error)
        return res.status(500).json({ message: 'Algo salio mal, revisar la consola del servidor' })
    }
}



const deleteEntry = async(req: NextApiRequest, res: NextApiResponse<Data>) => {

    const { idEntry } = req.body

    if( !isValidObjectId( idEntry ) ){
        return res.status(400).json({ message: 'ID de Entrada no válido' })
    }

    try {
        
        await db.connect()
        const entry = await Entry.findById( idEntry )

        if( !entry ){
            await db.disconnect()
            return res.status(400).json({ message: 'Entrada no encontrada'})
        }

        await entry.deleteOne()
        await db.disconnect()

        return res.status(200).json({ message: idEntry })

        
    } catch (error) {
        await db.disconnect()
        console.log( error )
        return res.status(400).json({ message: 'Algo salio mal, revisar la consola del servidor' })
    }




    
}

