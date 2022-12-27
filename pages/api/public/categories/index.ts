import type { NextApiRequest, NextApiResponse } from 'next'

import { db } from '../../../../database'
import { Category } from '../../../../models'
import { ICategory } from '../../../../interfaces'

type Data = 
    | { message: string }
    | ICategory[]

export default function handler(req: NextApiRequest, res: NextApiResponse<Data>) {

    switch (req.method) {

        case 'GET':
            return getCategories(res)

        default:
            return res.status(400).json({ message: 'Bad request' })
    }

}

const getCategories = async (res:NextApiResponse<Data>) => {

    try {

        await db.connect()
        const categories = await Category.find({ active: true }).sort({ position: 'ascending' })
        await db.disconnect()

        return res.status(200).json( categories )

    } catch (error) {

        await db.disconnect()
        console.log(error)
        return res.status(500).json({ message: 'Algo salio mal, revisar la consola del servidor' })
    }

}