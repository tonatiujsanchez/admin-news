import mongoose, { Model, Schema } from 'mongoose'
import { IEntry } from '../interfaces/IEntry';


const entrySchema = new Schema({
    user: { 
        type: mongoose.Types.ObjectId,
        ref: 'User',
        require: false,
    },
    title: { 
        type: String, 
        require: true,
    },
    content: { 
        type: String, 
        require: true,
    },
    summary: { 
        type: String, 
    },
    published: { 
        type: Boolean, 
        default: true 
    },
    publishedAt: {
        type: Date,
        require: true,
        default: new Date()
    },
    banner: {
        type: String,
        require: false,
    },
    imageSocial: {
        type: String,
        require: false,
    },
    inFrontPage: {
        type: Boolean,
        require: true,
        default: true,
    },
    slug: {
        type: String,
        require: true,
        unique: true,
    },
    category: {
        type: mongoose.Types.ObjectId,
        ref: 'Category'    
    },
    subcategory: {
        type: mongoose.Types.ObjectId, 
        ref: 'Category'
    },
    author: {
        type: mongoose.Types.ObjectId,
        ref: 'Author'
    },
    tags: [{ 
        type: mongoose.Types.ObjectId,
        ref: 'Tag'
    }],
    views: {
        type: Number,
        require: true,
        default: 0,
    }
},{
    timestamps: true
})

entrySchema.index({ title:'text', slug:'text', tags:'text' })

const Entry:Model<IEntry> = mongoose.models.Entry || mongoose.model('Entry', entrySchema)

export default Entry