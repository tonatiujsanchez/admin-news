import { NextApiRequest, NextApiResponse } from "next";

import bcryptjs from 'bcryptjs';

import { db } from "../../../database"
import { User } from "../../../models"

import { jwt } from "../../../utils/shared";


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
        case 'POST':

            return loginUser(req, res)

        default:
            return res.status(400).json({ message: 'Bad request' })
    }
}


const loginUser = async (req: NextApiRequest, res: NextApiResponse<Data>) => {

    const { email = '', password = '' } = req.body

    if ([email, password].includes('')) {
        return res.status(400).json({ message: 'El email y el password son requeridos' })
    }

    await db.connect()
    const user = await User.findOne({ email: email.toLowerCase() })
    await db.disconnect()


    if (!user) {
        await db.disconnect()
        return res.status(400).json({ message: 'Correo o Contaseña no válidos' })
    }

    if (!(bcryptjs.compareSync(password, user.password))) {
        await db.disconnect()
        return res.status(400).json({ message: 'Correo o Contaseña no válidos' })
    }
    

    const { _id, name, role, photo } = user
    const token = jwt.signToken( _id, email, role ) //jwt

    await db.disconnect()
    return res.status(200).json({
        token,
        user: {
            _id,
            name,
            email,
            role,
            photo
        }
    })

}