import mongoose, { Model, Schema } from 'mongoose'
import { IImage } from '../interfaces'


export const imageSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    url: {
        type: String,
        required: true
    },
    size: {
        type: Number
    },
    format: {
        type: String
    },
    section: {
        type: String,
        enum: {
            values: ['articles', 'authors', 'users'],
            message: '{VALUE} no es una sección válida',
            default: 'article',
            required: true
        },
    },
    user: { 
        type: mongoose.Types.ObjectId,
        ref: 'User',
        required: false
    },
},{
    timestamps: true,
})



const Image:Model<IImage> = mongoose.models.Image || mongoose.model('Image', imageSchema)

export default Image