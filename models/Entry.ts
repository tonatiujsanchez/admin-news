import mongoose, { Schema } from 'mongoose'


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
        default: false 
    },
    publishedAt: {
        type: Date,
        require: true,
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
    },
    category: {
        _id  : { type: mongoose.Types.ObjectId, ref: 'Category' },
        title: { type: String, require: true },
        slug : { type: String, require: true },
        tag  : { type: String, require: true },        
    },
    subcategory: {
        _id  : { type: mongoose.Types.ObjectId, ref: 'Category' },
        title: { type: String, require: true },
        slug : { type: String, require: true },
        tag  : { type: String, require: true },     
    },
    author: {
        _id  : { type: mongoose.Types.ObjectId, ref: 'Author' },
        name : { type: String, require: true },
        slug : { type: String, require: true },
        photo: { type: String, require: false },
        occupation: { type: String, require: false },
    },
    views: {
        type: Number,
        require: true,
        default: 0,
    }
},{
    timestamps: true
})

const Entry = mongoose.models.Entry || mongoose.model('Entry', entrySchema)

export default Entry