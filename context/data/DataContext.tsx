import { createContext } from 'react';

import { IAuthor, ICategory, IImage, IUser } from '../../interfaces';


interface ContextProps {
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