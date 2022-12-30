// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { db } from '../../database'
import { Category, User } from '../../models';

type Data = {
    message: string
}

export default async function handler( req: NextApiRequest, res: NextApiResponse<Data> ) {

    if( process.env.NODE_ENV === 'production' ){
        return res.status(401).json({ message: 'Not authorized' })
    }

    // await db.connect()

    // await User.updateMany({}, { active: true })
    
    // await db.disconnect()


    return res.status(200).json({ message: 'OK!' })

}
