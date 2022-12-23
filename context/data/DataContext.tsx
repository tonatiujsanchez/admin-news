import { createContext } from 'react';

import { IAuthor, IImage } from '../../interfaces';


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
    authors: IAuthor[]


    // Methods
    addNewImage: (formData: any) => Promise<{ hasError: boolean; urlImage: string; }>

    refreshAuthors: () => Promise<{ hasError: boolean; authors: IAuthor[]; }>
    addNewAuthor: (author: IAuthor) => Promise<{ hasError: boolean; }>
    updateAuthor: (author: IAuthor) => Promise<{ hasError: boolean; }>
    deleteAuthor: (idAuthor: string) => Promise<{ hasError: boolean; }>
}


export const DataContext = createContext({} as ContextProps)