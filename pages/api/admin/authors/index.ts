import type { NextApiRequest, NextApiResponse } from 'next'

import { isValidObjectId } from 'mongoose'
import slugify from "slugify"

import { db } from '../../../../database'
import { Author } from '../../../../models'
import { IAuthor } from '../../../../interfaces'


type Data = 
    | { message: string }
    | IAuthor
    

export default function handler(req: NextApiRequest, res: NextApiResponse<Data>) {

    switch (req.method) {

        case 'POST':
            return addNewAuthor(req, res)

        case 'PUT':
            return updateAuthor(req, res)

        case 'DELETE':
            return deleteAuthor(req, res)

        default:
            return res.status(400).json({ message: 'Bad request' })
    }

}


const addNewAuthor = async (req:NextApiRequest, res:NextApiResponse<Data>) => {
    const {
        name = '',
        facebook = '',
        twitter = '',
        instagram = '',
        email = '',
        phone = '',
        web = '',
        occupation = '',
        description = '',
        photo = null,
    } = req.body  

    if([name.trim()].includes('')){
        return res.status(400).json({ message: 'La propiedad nombre es requeridas' })
    }

    const slug = slugify(name, { replacement: '-', lower: true })

    const newAuthor = new Author({
        name: name.trim(),
        slug,
        facebook: facebook.trim(),
        twitter: twitter.trim(),
        instagram: instagram.trim(),
        email: email.trim(),
        phone: phone.trim(),
        web: web.trim(),
        occupation: occupation.trim(),
        description: description.trim(),
        photo,
    })


    try {
        await db.connect()
        await newAuthor.save()
        await db.disconnect()

        return res.status(201).json(newAuthor)

    } catch (error) {

        await db.disconnect()
        console.log(error)
        return res.status(500).json({ message: 'Algo salio mal, revisar la consola del servidor' })
    }
}


const updateAuthor = async (req:NextApiRequest, res:NextApiResponse<Data>) => {

    const { 
        _id, 
        name='', 
        facebook = '',
        twitter = '',
        instagram = '',
        email = '',
        phone = '',
        web = '',
        occupation = '',
        description = '', 
        photo = null
    } = req.body

    if( !isValidObjectId( _id ) ){
        return res.status(400).json({ message: 'ID de Autor no válido' })
    }

    if([name.trim()].includes('')){
        return res.status(400).json({ message: 'La propiedad nombre es requeridas' })
    }

    try {
        await db.connect()
        const authorToUpdate = await Author.findById(_id)
    
        if(!authorToUpdate){
            return res.status(400).json({ message: 'Autor no encontrado' })
        }

        if(authorToUpdate.name !== name){
            authorToUpdate.slug = slugify(name, { replacement: '-', lower: true })
        }

        authorToUpdate.name = name
        authorToUpdate.email = email
        authorToUpdate.occupation = occupation
        authorToUpdate.phone = phone
        authorToUpdate.description = description
        authorToUpdate.photo = photo
        authorToUpdate.facebook = facebook
        authorToUpdate.twitter = twitter
        authorToUpdate.instagram = instagram
        authorToUpdate.web = web

        await authorToUpdate.save()
        await db.disconnect()
        return res.status(200).json(authorToUpdate)
    
    } catch (error) {
        await db.disconnect()
        console.log( error )
        return res.status(400).json({ message: 'Algo salio mal, revisar la consola del servidor' })
    }

}


const deleteAuthor = async (req:NextApiRequest, res:NextApiResponse<Data>) => {

    const { idAuthor } = req.body
    
    if( !isValidObjectId( idAuthor ) ){
        return res.status(400).json({ message: 'ID de Autor no válido' })
    }

    try {

        await db.connect()
        const author = await Author.findById( idAuthor )

        if( !author ){
            await db.disconnect()
            return res.status(400).json({ message: 'Autor no encontrado' })
        }

        await author.deleteOne()
        await db.disconnect()

        return res.status(200).json({ message: idAuthor })

    } catch (error) {

        await db.disconnect()
        console.log( error )
        return res.status(400).json({ message: 'Algo salio mal, revisar la consola del servidor' })
    }
    
}