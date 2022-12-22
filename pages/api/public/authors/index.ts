import type { NextApiRequest, NextApiResponse } from 'next'

import { db } from '../../../../database'
import { IAuthor } from '../../../../interfaces'
import { Author } from '../../../../models'


type Data = 
    | { message: string }
    | IAuthor[]
    

export default function handler(req: NextApiRequest, res: NextApiResponse<Data>) {

    switch (req.method) {

        case 'GET':
            return getAuthors(res)

        default:
            return res.status(400).json({ message: 'Bad request' })
    }

}

const getAuthors = async (res:NextApiResponse<Data>) => {

    try {
        
        await db.connect()
        const authors = await Author.find().sort({ createdAt: 'ascending' }).lean()
        await db.disconnect()
    
        return res.status(200).json( authors )
    } catch (error) {

        await db.disconnect()
        console.log(error)
        return res.status(500).json({ message: 'Algo salio mal, revisar la consola del servidor' })
    }

}