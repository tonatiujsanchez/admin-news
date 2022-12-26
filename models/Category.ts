import mongoose, { Model, Schema } from 'mongoose'
import { ICategory } from '../interfaces'


export const categorySchema = new Schema({
    title: {
        type: String,
    },
    slug: {
        type: String
    },
    tag: {
        type: String,
    },
    position: {
        type: Number,
        required: true,
    },
    type: {
        type: String,
        enum: {
            values: ['category', 'subcategory'],
            message: '{VALUE} no es un tipo válido',
            default: 'category',
            required: true
        },
        required: true,
    },
    category: {
        type: mongoose.Types.ObjectId,
        default: null
    }
},{
    timestamps: true,
})



const Category:Model<ICategory> = mongoose.models.Category || mongoose.model('Category', categorySchema)

export default Category