import { createContext } from 'react';

import { IAuthor, ICategory, IEntry, IImage, IUser } from '../../interfaces';


interface ContextProps {
    entries: {
        pageCount: number,
        length: number,
        page: number,
        data: IEntry[]
    },
    images: {
        articles: {
            pageCount: number,
            length: number,
            data: IImage[],
        },
        authors: {
            pageCount: number,
            length: number,
            data: IImage[],
        },
        users: {
            pageCount: number,
            length: number,
            data: IImage[],
        }
    },
    categories: ICategory[],
    categoriesList: ICategory[],
    authors: IAuthor[],
    users: IUser[],

    // Methods
    refreshEntries: ( page:number ) => Promise<{ hasError: boolean; entriesResp: IEntry[]; }>
    addNewEntry: (entry: IEntry) => Promise<{ hasError: boolean; entryResp?: IEntry; }>
    updateEntry: (entry: IEntry) => Promise<{ hasError: boolean; }>
    deleteEntry: (idEntry: string) => Promise<{ hasError: boolean; }>

    refreshImages: (section: string, page?: number) => Promise<{ hasError: boolean; imagesResp: IImage[]; }>
    addNewImage: (formData: any) => Promise<{ hasError: boolean; urlImage: string; }>
    deleteImage: (image: IImage) => Promise<{ hasError: boolean; }>

    refreshCategories: () => Promise<{ hasError: boolean; categories: ICategory[]; }>
    addNewCategory: (category: ICategory) => Promise<{ hasError: boolean; }>
    updateCategory: (category: ICategory) => Promise<{ hasError: boolean; }>
    deleteCategory: (idCategory: string) => Promise<{ hasError: boolean; }>

    refreshAuthors: () => Promise<{ hasError: boolean; authors: IAuthor[]; }>
    addNewAuthor: (author: IAuthor) => Promise<{ hasError: boolean; }>
    updateAuthor: (author: IAuthor) => Promise<{ hasError: boolean; }>
    deleteAuthor: (idAuthor: string) => Promise<{ hasError: boolean; }>

    refreshUsers: () => Promise<{ hasError: boolean; users: IUser[]; }>
    addNewUser: (user: IUser) => Promise<{ hasError: boolean; }>
    updateUser: (user: IUser) => Promise<{ hasError: boolean; }>
    deleteUser: (idUser: string) => Promise<{ hasError: boolean; }>
    updatePassword: (userId: string, password: string) => Promise<{ hasError: boolean; }>
}


export const DataContext = createContext({} as ContextProps)