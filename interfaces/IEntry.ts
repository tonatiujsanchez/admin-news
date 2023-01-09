
export interface IEntry {
    _id?        : string
    
    user?       : string
    title       : string
    content     : string
    description?: string
    publishedAt?: string
    banner?     : string
    imageSocial?: string
    inFrontPage : boolean
    slug?       : string
    category    : IEntryCategory
    subcategory : IEntryCategory
    author      : IEntryAuthor
    views       : number
    
    published  : boolean

    createdAt? : string
    updatedAt? : string
}


export interface IEntryCategory {
    _id  : string
    title: string
    slug : string
    tag  : string
}

export interface IEntryAuthor {
    _id       : string
    name      : string
    slug      : string
    photo     : string
    occupation: string
}

