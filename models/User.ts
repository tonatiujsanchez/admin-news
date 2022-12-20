import mongoose, { Model, Schema } from 'mongoose';
import { IUser } from '../interfaces';


export const userSchema = new Schema({
    name    : { type: String, required: true },
    email   : { type: String, required: true, unique: true },
    
    password: { type: String, required: true },
    role: {
        type: String,
        enum: {
            values: ['admin', 'editor'],
            message: '{VALUE} no es un role válido',
            default: 'admin',
            required: true
        }
    },
    photo: { type: String },
},{
    timestamps: true,
})

const User:Model<IUser> = mongoose.models.User || mongoose.model('User',userSchema);

export default User;