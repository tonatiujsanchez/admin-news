
export type ISectionImage = 'articles'|'authors'|'users';

export interface IImage {
    _id?   : string

    publicId: string
    name    : string
    url     : string
    alt?    : string | null
    width   : number
    height  : number

    size?   : number
    format? : string
    section : ISectionImage
    user?   : string

    createdAt?: string
    updatedAt?: string
}

export interface IImageStateData {
    pageCount: number,
    length: number,
    data: IImage[],
}

// 
export interface IImages {
    articles: IImageStateData,
    authors: IImageStateData,
    users: IImageStateData,
}

export interface IImageState{
    section: string,
    data: IImageStateData
}