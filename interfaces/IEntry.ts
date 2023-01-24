import { IAuthor } from "./IAuthor"
import { ICategory, ISubcategory } from "./ICategory"

export interface IEntry {
    _id?        : string
    
    user?       : string
    title       : string
    content     : string
    summary?    : string
    publishedAt : string
    banner?     : string
    imageSocial?: string
    inFrontPage : boolean
    slug?       : string
    category    : ICategory
    subcategory : ISubcategory | null
    author      : IAuthor
    tags        : string[]
    views       : number
    
    published  : boolean

    createdAt? : string
    updatedAt? : string
}


// export interface IEntryCategory {
//     _id  : string
//     title: string
//     slug : string
//     tag  : string
// }

// export interface IEntryAuthor {
//     _id        : string
//     name       : string
//     slug       : string
//     photo?     : string
//     occupation?: string
// }

