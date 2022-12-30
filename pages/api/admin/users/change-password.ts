import type { NextApiRequest, NextApiResponse } from 'next' 
import { isValidObjectId } from 'mongoose'

import bcryptjs from 'bcryptjs';

import { db } from '../../../../database'
import { User } from '../../../../models'

type Data = 
    | { message: string }

export default function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
    

    switch (req.method) {

        case 'PUT':
            return changePassword( req, res )
    
        default:
            return res.status(400).json({ message: 'Endpoint NO existente' })
    }

}

const changePassword = async ( req:NextApiRequest, res:NextApiResponse<Data> ) => {

    const { userId = '', password='' } = req.body    

    if (!isValidObjectId( userId )) {
        return res.status(400).json({ message: 'no es un id valido' })
    }

    if ([password].includes('')) {
        return res.status(400).json({ message: 'La contraseña es requerida' })
    }

    if (password.length < 6) {
        return res.status(400).json({ message: 'La contraseña es muy corta, debe tener minimo 6 carateres' })
    }

    try {
        
        await db.connect()
        const user = await User.findById(userId)
    
        if( !user ){
            await db.disconnect()
            return res.status(400).json({ message: 'Usuario no encontrado' })
        }   
    
        user.password = bcryptjs.hashSync( password as string )
    
        await user.save()
        await db.disconnect()

        return res.status(200).json({ message: 'Contraseña actualizada' })
    
    } catch (error) {
        
        await db.disconnect()
        console.log(error)
        return res.status(500).json({ message: 'Algo salio mal, revisar la consola del servidor' })

    }

    
}
