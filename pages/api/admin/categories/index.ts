import { isValidObjectId } from 'mongoose'
import type { NextApiRequest, NextApiResponse } from 'next'

import slugify from "slugify"
import { db } from '../../../../database'

import { ICategory } from '../../../../interfaces'
import { Category } from '../../../../models'


type Data = 
    | { message: string }
    | ICategory


export default function handler(req: NextApiRequest, res: NextApiResponse<Data>) {

    switch (req.method) {

        case 'POST':
            return addNewCategory(req, res)

        case 'PUT':
            return updateCategory(req, res)

        case 'DELETE':
            return deleteCategory(req, res)

        default:
            return res.status(400).json({ message: 'Bad request' })
    }

}


const addNewCategory = async (req:NextApiRequest, res:NextApiResponse<Data>) => {

    const {
        title = '',
        tag = '',
        position = null,
        type = '',
        category = null,
        active = true
    } = req.body

    if ([title.trim(), tag.trim(), type.trim()].includes('')) {
        return res.status(400).json({ message: 'La propiedades title, tag y type son requeridas' })
    }

    if (!position) {
        return res.status(400).json({ message: 'La propiedad position es requerida' })
    }

    if (type.type === 'subcategory' && !category ) {
        return res.status(400).json({ message: 'La categoria es requerida' })
    }

    const slug = slugify(title, { replacement: '-', lower: true })   

    try {
        await db.connect()

        const categoryDB = await Category.findOne({slug, type, category})        

        if(categoryDB){
            return res.status(400).json({ message: 'Ya exite una categoría con ese nombre' })
        }

        const newCategory = new Category({
            title: title.trim(),
            tag: tag.trim(),
            position,
            slug,
            type,
            category,
            active
        })
    
        await newCategory.save()
        await db.disconnect()

        return res.status(201).json(newCategory)
        
    } catch (error) {
        await db.disconnect()
        console.log(error);
        return res.status(500).json({ message: 'Algo salio mal, revisar la consola del servidor' })

    }

}


const updateCategory = async (req:NextApiRequest, res:NextApiResponse<Data>) => {
    
    const { _id = '', } = req.body

    if( !isValidObjectId( _id ) ){
        return res.status(400).json({ message: 'ID de Categoría no válido' })
    }

    try {
        await db.connect()
        const categoryToUpdate = await Category.findById(_id)

        if (!categoryToUpdate) {
            await db.disconnect()
            return res.status(400).json({ message: 'Categoría no encontrada' })
        }
    
        const {
            title = categoryToUpdate.title,
            tag = categoryToUpdate.tag,
            position = categoryToUpdate.position,
            type = categoryToUpdate.type,
            category = categoryToUpdate.category,
            active = categoryToUpdate.active,
        } = req.body

        if (title !== categoryToUpdate.title) {
            categoryToUpdate.slug = slugify(title, { replacement: '-', lower: true })
        }

        
        const categoryBySlug = await Category.findOne({slug: categoryToUpdate.slug, type: categoryToUpdate.type, category})
               
        if( categoryBySlug && JSON.parse(JSON.stringify(categoryBySlug._id)) !== JSON.parse(JSON.stringify(categoryToUpdate._id)) ){
            return res.status(400).json({ message: 'Ya exite una categoría con ese nombre' })
        }


        if (type === 'subcategory') {
            categoryToUpdate.category = category
        } else {
            categoryToUpdate.category = null
        }

        categoryToUpdate.title = title
        categoryToUpdate.tag = tag
        categoryToUpdate.position = position
        categoryToUpdate.type = type
        categoryToUpdate.active = active
        
        await categoryToUpdate.save()
        await db.disconnect()

        return res.status(200).json(categoryToUpdate)
    
    } catch (error) {

        await db.disconnect()
        console.log(error)
        return res.status(500).json({ message: 'Algo salio mal, revisar la consola del servidor' })
    }

}


const deleteCategory = async (req:NextApiRequest, res:NextApiResponse<Data>) => {

    const { idCategory } = req.body

    if( !isValidObjectId( idCategory ) ){
        return res.status(400).json({ message: 'ID de Categoría no válido' })
    }

    try {

        await db.connect()
        const category = await Category.findById(idCategory)

        if (!category) {
            await db.disconnect()
            return res.status(400).json({ message: 'Categoría NO encontrada' })
        }

        await category.deleteOne()
        await db.disconnect()

        return res.status(200).json({ message: idCategory })

    } catch (error) {

        await db.disconnect()
        console.log(error)
        return res.status(500).json({ message: 'Algo salio mal, revisar la consola del servidor' })
    }

} 
