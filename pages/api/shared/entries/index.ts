import type { NextApiRequest, NextApiResponse } from 'next'

import slugify from "slugify"
import * as jose from 'jose'

import { db } from '../../../../database'
import { isValidObjectId } from 'mongoose'
import { Entry } from '../../../../models'

import { IEntry } from '../../../../interfaces'


type Data = 
    | { message: string }
    | IEntry
    | IEntry[]
    | {
        length : number
        totalOfPages: number
        page: number,
        entries : IEntry[]
    }

export default function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
    

    switch (req.method) {

        case 'GET':
            return getEntries( req, res )
    
        case 'POST':
            return addNewEntry(req, res)

        case 'PUT':
            return updateEntry(req, res)

        case 'DELETE':
            return deleteEntry(req, res)
    
        default:
            return res.status(400).json({ message: 'Bad request' })
    }

}

const getEntries = async( req: NextApiRequest, res: NextApiResponse<Data> ) => {

    const { page = 0, entriesPerPage = 10 } = req.query

    let skipStart = Number(page) * Number(entriesPerPage)

    try {
        
        await db.connect()

        const entriesLengthDB = await Entry.find().count() 

        if( skipStart >= entriesLengthDB || skipStart < 0 ){
            skipStart = 0
        }

        const entries = await Entry.find()
            .populate({ path: 'category', model: 'Category' })
            .populate({ path: 'subcategory', model: 'Category' })
            .populate({ path: 'author', model: 'Author' })     
            .sort({ createdAt: 'desc' })
            .skip( Number(skipStart) )
            .limit( Number(entriesPerPage) )

        await db.disconnect()

    
        return res.status(200).json({
            length: entriesLengthDB,
            totalOfPages: Math.ceil(entriesLengthDB / Number( entriesPerPage )),
            page: skipStart === 0 ? 0 : Number(page),
            entries,
        } )
        
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

    try {
        await db.connect()

        const entries = await Entry
            .find({ $text: { $search: `\"${ slugEntry }\"` } })
            .select('title slug')
            .sort({ createdAt: 'desc' })
            .lean()
        
        if(entries.length > 0){

            const entryLast = entries[0]
            const lastCaracterSlug = entryLast.slug!.substring(entryLast.slug!.length - 1, entryLast.slug!.length)
            
            if( !Number(lastCaracterSlug) ){
                slugEntry = `${slugEntry}-1`
            }else{
                slugEntry = `${slugEntry}-${ Number(lastCaracterSlug) + 1 }`
            }
            
        }

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
            category: category._id,
            subcategory: subcategory ? subcategory._id : null,
            author: author._id,
            tags
        })

        await newEntry.save()
        await db.disconnect()
        
        
        const entry = {
            ...JSON.parse( JSON.stringify( newEntry ) ),
            category,
            subcategory,
            author
        }

        return res.status(200).json(entry)

        
    } catch (error) {
        await db.disconnect()
        console.log(error)
        return res.status(500).json({ message: 'Algo salio mal, revisar la consola del servidor' })
    }
}



const updateEntry = async(req: NextApiRequest, res: NextApiResponse<Data>) => {

    const { _id = '', } = req.body

    if( !isValidObjectId( _id ) ){
        return res.status(400).json({ message: 'ID de Entrada no válido' })
    }

    try {

        await db.connect()
        const entry = await Entry.findById( _id )
            .populate({ path: 'category', model: 'Category' })
            .populate({ path: 'subcategory', model: 'Category' })
            .populate({ path: 'author', model: 'Author' })    
    
        if( !entry ){
            await db.disconnect()
            return res.status(400).json({ message: 'Artículo no encontrado' })
        }
    
        const {         
            title       = entry.title,
            content     = entry.content,
            summary     = entry.summary,
            published   = entry.published,
            publishedAt = entry.publishedAt,
            banner      = entry.banner,
            imageSocial = entry.imageSocial,
            inFrontPage = entry.inFrontPage,
            slug        = entry.slug,
            category    = entry.category,
            subcategory = entry.subcategory,
            author      = entry.author,
            tags        = entry.tags 
        } = req.body 

        entry.title       = title
        entry.content     = content
        entry.summary     = summary
        entry.published   = published
        entry.publishedAt = publishedAt
        entry.banner      = banner
        entry.imageSocial = imageSocial
        entry.inFrontPage = inFrontPage
        entry.slug        = slug
        entry.category    = category
        entry.subcategory = subcategory
        entry.author      = author
        entry.tags        = tags



        await entry.save()
        await db.disconnect()

        const entryUpdate = {
            ...JSON.parse( JSON.stringify( entry ) ),
            category,
            subcategory,
            author
        }
        
        return res.status(200).json( entryUpdate )

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

