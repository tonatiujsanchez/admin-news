import type { NextApiRequest, NextApiResponse } from 'next'

import { db } from '../../../../database'
import { ITag } from '../../../../interfaces'
import { Tag } from '../../../../models'

type Data = 
    | { message: string }
    | ITag[]

export default function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
    
    switch (req.method) {

        case 'GET':
            return getTags(res)

        default:
            return res.status(400).json({ message: 'Bad request' })
    }
}


const getTags = async (res:NextApiResponse<Data>) => {
    try {

        await db.connect()
        const tags = await Tag.find().lean()
        await db.disconnect()

        return res.status(200).json( tags )
        
    } catch (error) {
        await db.disconnect()
        console.log(error)
        return res.status(500).json({ message: 'Algo salio mal, revisar la consola del servidor' })
    }
}