export interface IImage {
    _id?   : string

    name    : string
    url     : string
    size?   : number
    format? : string
    section : ISectionImage
    user?   : string

    createdAt?: string
    updatedAt?: string
}

export type ISectionImage = 'articles'|'authors'|'users';
