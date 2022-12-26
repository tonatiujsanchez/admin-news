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

        default:
            return res.status(400).json({ message: 'Endpoint NO existente' })
    }

}

const addNewCategory = async (req:NextApiRequest, res:NextApiResponse<Data>) => {

    const {
        title = '',
        tag = '',
        position = null,
        type = '',
        category = null
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

    const newCategory = new Category({
        title: title.trim(),
        tag: tag.trim(),
        position,
        slug,
        type,
        category
    })

    try {

        await db.connect()
        await newCategory.save()
        await db.disconnect()

        return res.status(201).json(newCategory)
        
    } catch (error) {
        await db.disconnect()
        console.log(error);
        return res.status(500).json({ message: 'Algo salio mal, revisar la consola del servidor' })

    }

}