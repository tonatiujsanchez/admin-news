import type { NextApiRequest, NextApiResponse } from 'next'

import { isValidObjectId } from 'mongoose'
import bcryptjs from 'bcryptjs'

import { db } from '../../../../database'
import { User } from '../../../../models'
import { validations } from '../../../../utils/shared'
import { IUser } from '../../../../interfaces'


type Data = 
    | { message: string }
    | IUser[]
    | IUser

export default function handler( req:NextApiRequest, res:NextApiResponse<Data> ) {
    
    switch (req.method) {

        case 'GET':
            return getUsers( res )

        case 'POST':
            return registerUser( req, res )

        case 'PUT':
            return updateUser( req, res )

        case 'DELETE':
            return deleteUser( req, res )
    
        default:
            return res.status(400).json({ message: 'Bad request' })
    }

}


const getUsers = async( res:NextApiResponse<Data> ) => {

    try {      

        await db.connect()
        const users = await User.find().select('-password').lean()
        await db.disconnect()
    
        return res.status(200).json( users )

    } catch (error) {
        await db.disconnect()
        console.log(error)
        return res.status(500).json({ message: 'Algo salio mal, revisar la consola del servidor' })
    }

}


const registerUser = async( req:NextApiRequest, res:NextApiResponse<Data> ) => {
    
    const { name = '', email = '', password = '', role = 'editor', photo = null, active = true } = req.body

    if ([name, email, password].includes('')) {
        return res.status(400).json({ message: 'Las propiedades name, email, password son requeridas' })
    }

    if (password.length < 6) {
        return res.status(400).json({ message: 'La contraseña es muy corta, debe tener minimo 6 carateres' })
    }

    if (name.length < 2) {
        return res.status(400).json({ message: 'El nombre es muy corto, debe tener minimo 2 carateres' })
    }

    if (!validations.isValidEmail(email)) {
        return res.status(400).json({ message: 'El correo no es válido' })
    }

    try {

        await db.connect()

        const user = await User.findOne({ email }).lean()

        if (user) {
            await db.disconnect()
            return res.status(400).json({ message: `Ya existe una cuenta registrada con ese correo` })
        }

        const newUser = new User({
            name, 
            email: email.toLowerCase(),
            password: bcryptjs.hashSync( password ),
            role,
            photo,
            active
        })

        await newUser.save({ validateBeforeSave: true })
        await db.disconnect()

        const userDB = JSON.parse( JSON.stringify( newUser ) )
        delete userDB.password

        return res.status(200).json(userDB)

    } catch (error) {
        console.log(error)
        await db.disconnect()
        return res.status(500).json({ message: 'Al salio mal, revisar logs del servidor' })
    }

}


const updateUser = async ( req:NextApiRequest, res:NextApiResponse<Data> ) => {

    const { _id } = req.body

    if( !isValidObjectId( _id ) ){
        return res.status(400).json({ message: 'ID de Autor no válido' })
    }

    await db.connect()
    const userUpdate = await User.findById(_id).select('-password')

    if( !userUpdate ){
        await db.disconnect()
        return res.status(400).json({ message: 'Usuario no encontrado' })
    }

    const { 
        role  = userUpdate.role, 
        name  = userUpdate.name, 
        email = userUpdate.email, 
        photo = null,
        active = userUpdate.active, 
    } = req.body


    try {
        userUpdate.role = role
        userUpdate.name = name
        userUpdate.email = email
        userUpdate.photo = photo
        userUpdate.active = active
        await userUpdate.save()

        return res.status(200).json(userUpdate)
        
    } catch (error) {

        await db.disconnect()
        console.log(error)
        return res.status(500).json({ message: 'Algo salio mal, revisar la consola del servidor' })
    }

}


const deleteUser = async ( req:NextApiRequest, res:NextApiResponse<Data> ) => {

    const { idUser } = req.body

    if( !isValidObjectId( idUser ) ){
        return res.status(400).json({ message: 'ID de Autor no válido' })
    }

    try {

        await db.connect()
        const user = await User.findById(idUser)

        if( !user ){
            return res.status(400).json({ message: 'No hay ningun usuario con ese ID' })
        }
        
        await user.deleteOne()
        await db.disconnect()

        return res.status(200).json({ message: idUser })

    } catch (error) {

        await db.disconnect()
        console.log(error)
        return res.status(500).json({ message: 'Algo salio mal, revisar la consola del servidor' })
    }
}