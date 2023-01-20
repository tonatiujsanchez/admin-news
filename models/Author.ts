import mongoose, { Model, Schema } from 'mongoose'
import { IAuthor } from '../interfaces'



export const authorSchema = new Schema({
    name: {
        type: String,
        require: true,
    },
    slug: {
        type: String,
        require: true,
        unique: true,
    },
    facebook: {
        type: String,
    },
    twitter: {
        type: String,
    },
    instagram: {
        type: String,
    },
    email: {
        type: String,
    },
    phone: {
        type: String,
    },
    web: {
        type: String,
    },
    occupation: {
        type: String,
    },
    description: {
        type: String,
    },
    photo: {
        type: String,
    }
},{
    timestamps: true,
})

const Author:Model<IAuthor> = mongoose.models.Author || mongoose.model('Author', authorSchema)

export default Author