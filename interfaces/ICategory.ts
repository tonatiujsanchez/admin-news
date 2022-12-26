
export interface ICategory{
    _id?    : string

    title    : string
    slug?    : string
    tag?     : string
    position?: number
    type     : ITypeCategory

    category: string | null
    subcategories?: ISubcategory[]

    createdAt?: string
    updatedAt?: string
}


export interface ISubcategory{
    _id?     : string

    title    : string
    slug?    : string
    tag?     : string
    position?: number
    type     : ITypeCategory

    category: string | null
    subcategories?: any[]

    createdAt?: string
    updatedAt?: string
}

export type ITypeCategory = 'category'|'subcategory';
