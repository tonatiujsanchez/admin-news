import { createContext } from 'react';

import { IAuthor, ICategory, IImage } from '../../interfaces';


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


    // Methods
    refreshImages: (section: string, page?: number) => Promise<{ hasError: boolean; }>
    addNewImage: (formData: any) => Promise<{ hasError: boolean; urlImage: string; }>

    refreshCategories: () => Promise<{ hasError: boolean; categories: ICategory[]; }>
    addNewCategory: (category: ICategory) => Promise<{ hasError: boolean; }>
    updateCategory: (category: ICategory) => Promise<{ hasError: boolean; }>
    deleteCategory: (idCategory: string) => Promise<{ hasError: boolean; }>

    refreshAuthors: () => Promise<{ hasError: boolean; authors: IAuthor[]; }>
    addNewAuthor: (author: IAuthor) => Promise<{ hasError: boolean; }>
    updateAuthor: (author: IAuthor) => Promise<{ hasError: boolean; }>
    deleteAuthor: (idAuthor: string) => Promise<{ hasError: boolean; }>
}


export const DataContext = createContext({} as ContextProps)