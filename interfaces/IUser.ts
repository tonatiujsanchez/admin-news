export interface IUser{
    _id?    :  string
    name    : string
    email   : string
    password: string
    role    : string
    photo?  :   string
    active? :   boolean

    createdAt?: string;
    updatedAt?: string;
}