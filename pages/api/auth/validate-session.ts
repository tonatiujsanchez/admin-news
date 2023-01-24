import { NextApiRequest, NextApiResponse } from "next"

import { db } from "../../../database"
import { jwt } from "../../../utils/shared"
import { User } from "../../../models"


type Data = 
    | { message: string }
    | {
        token: string
        user: {
            _id:string,
            email:string,
            name:string,
            role:string,
            photo?:string
        }
      }



export default function handler(req: NextApiRequest, res: NextApiResponse<Data>) {

    switch (req.method) {

        case 'GET':
            return checkJWT(req, res);

        default:
            return res.status(400).json({ message: 'Bad request' })
    }
}


const checkJWT = async (req: NextApiRequest, res: NextApiResponse<Data>) => {

    const { news_session_ed4c1de1770480153a06fa2349f501f0 = '' } = req.cookies

    let userId = ''

    try {

        userId = await jwt.isValidToken( news_session_ed4c1de1770480153a06fa2349f501f0 )

    } catch (error) {
        return res.status(401).json({
            message: 'Token de autorización no valido'
        })
    }

    await db.connect()
    const user = await User.findById(userId).lean()
    await db.disconnect()

    if (!user) {
        return res.status(400).json({ message: 'Usuario no encontrado' })
    }

    if(!user.active){
        return res.status(400).json({ message: 'Usuario no encontrado' })
    }
    

    const { _id, email, name, role, photo } = user

    const token = jwt.signToken( _id, email, role  )

    return res.status(200).json({
        token,
        user: {
            _id,
            email,
            name,
            role,
            photo
        }
    })

}