

import type { NextApiRequest, NextApiResponse } from 'next'
import { isValidObjectId } from 'mongoose'

import { IEntry } from '../../../../interfaces'
import { db } from '../../../../database'
import { Entry } from '../../../../models'

type Data = 
    | { message: string }
    | IEntry

export default function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
    
    switch (req.method) {

        case 'GET':
            return getEntry( req, res )
    
        default:
            return res.status(400).json({ message: 'Bad request' })
    }

}

const getEntry = async( req: NextApiRequest, res: NextApiResponse<Data> ) => {

    let { id = '' } = req.query

    if( !isValidObjectId( id ) ){
        return res.status(400).json({ message: 'Artículo no encontrado' })
    }

    try {

        await db.connect()
        const entry = await Entry.findById( id )
            .populate({ path: 'category', model: 'Category' })
            .populate({ path: 'subcategory', model: 'Category' })
            .populate({ path: 'author', model: 'Author' })
            .populate({ path: 'tags', model: 'Tag' })    
            .lean()
        await db.disconnect()

        if( !entry ){
            return res.status(400).json({ message: 'Artículo no encontrado' })
        }

        return res.status(200).json( entry )
        
    } catch (error) {
        await db.disconnect()
        console.log(error)
        return res.status(500).json({ message: 'Algo salio mal, revisar la consola del servidor' })
    }

}