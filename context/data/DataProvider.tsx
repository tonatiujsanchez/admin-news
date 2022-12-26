import { FC, useReducer } from 'react'

import axios from 'axios'

import { DataContext, dataReducer } from './'

import { useAuth } from '../../hooks'

import { IAuthor, ICategory, IImage } from '../../interfaces'
import { notifyError, notifySuccess } from '../../utils/frontend'


interface Props {
    children: JSX.Element
}

export interface DataState {
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
    authors: IAuthor[];

}

const DATA_INITIAL_STATE: DataState = {
    images: {
        articles: {
            pageCount: 1,
            length: 0,
            data: [],
        },
        authors: {
            pageCount: 1,
            length: 0,
            data: [],
        },
        users: {
            pageCount: 1,
            length: 0,
            data: [],
        }
    },
    categories: [],
    authors: [],
}


export const DataProvider: FC<Props> = ({ children }) => {

    const { user } = useAuth()

    const [state, dispatch] = useReducer(dataReducer, DATA_INITIAL_STATE)


    const resetCategories = async( categories: ICategory[] ):Promise< ICategory[] > => {

        const categoriesMemo = categories.filter( category => {
            category.subcategories = categories.filter(
                subc => (subc.type === 'subcategory' && subc.category === category._id)
            )
            if (category.type === 'category') {
                return category
            }
        })
        dispatch({ type: '[DATA] - Refresh Categories', payload: categoriesMemo })
        
        return categoriesMemo
    }


    // ===== ===== ===== ===== Images ===== ===== ===== =====
    // ===== ===== ===== ===== ===== ===== ===== ===== =====
    const addNewImage = async( formData:any ):Promise<{ hasError:boolean; urlImage: string }> => {

        formData.append('user', user!._id)

        try {
            const { data } = await axios.post('/api/shared/images', formData)
            dispatch({ type: '[DATA] - Add New Image', payload: data })

            return { 
                hasError: false,
                urlImage: data.url
            }

        } catch (error) {
            if(axios.isAxiosError(error)){
                const { message } = error.response?.data as {message : string}
                notifyError(message)
                return {
                    hasError: true,
                    urlImage: ''
                }
            }

            notifyError('Hubo un error inesperado')
            return {
                hasError: true,
                urlImage: ''
            }
        }
    }


    // ===== ===== ===== ===== Categories ===== ===== ===== =====
    // ===== ===== ===== ===== ========== ===== ===== ===== =====
    const refreshCategories = async(): Promise<{ hasError: boolean; categories:ICategory[] }> => {

        try {

            const { data } = await axios.get(`/api/public/categories`)
            const categories = await resetCategories(data)
            dispatch({ type: '[DATA] - Refresh Categories', payload: categories })

            return {
                hasError: false,
                categories: categories
            }  
        } catch (error) {

            if(axios.isAxiosError(error)){
                const { message } = error.response?.data as {message : string}

                notifyError(message)
                return {
                    hasError: true,
                    categories: []
                }
            }

            notifyError('Hubo un error inesperado')
            return {
                hasError: true,
                categories: []
            }    

        }
    }

    const addNewCategory = async(category:ICategory):Promise<{ hasError: boolean }> => {
        try {
            
            const { data } = await axios.post('/api/admin/categories', category)


            if ( data.type === 'category' ){

                dispatch({ type: '[DATA] - Refresh Categories', payload: [ ...state.categories, data ] })

            } else {

                const categories = state.categories.map( cat => {
                    if( cat._id === data.category ){
                        cat.subcategories?.push( data )
                    }
                    return cat
                })
                dispatch({ type: '[DATA] - Refresh Categories', payload: categories })

            }

            notifySuccess('Categorías creada')

            return { hasError: false }

        } catch (error) {
            if(axios.isAxiosError(error)){
                const { message } = error.response?.data as {message : string}
                notifyError(message)
                return { hasError: true }
            }

            notifyError('Hubo un error inesperado')
            return { hasError: true }
        }
    }




    // ===== ===== ===== ===== Authors ===== ===== ===== =====
    // ===== ===== ===== ===== ======= ===== ===== ===== =====
    const refreshAuthors = async(): Promise<{ hasError:boolean; authors: IAuthor[] }> => {

        try {

            const { data } = await axios.get(`/api/public/authors`)
            dispatch({ type: '[DATA] - Refresh Authors', payload: data })

            return {
                hasError: false,
                authors: data
            }

        } catch (error) {
            if(axios.isAxiosError(error)){
                const { message } = error.response?.data as {message : string}

                notifyError(message)
                return {
                    hasError: true,
                    authors: []
                }
            }

            notifyError('Hubo un error inesperado')
            return {
                hasError: true,
                authors: []
            }
        }
    }

    const addNewAuthor = async( author: IAuthor ):Promise<{ hasError: boolean }> => {        

        try {

            const { data } = await axios.post('/api/admin/authors',{
                ...author
            })

            if( state.authors.length > 0 ){
                dispatch({ type: '[DATA] - Add New Author', payload: data })
            }
            
            notifySuccess('Autor creado')
            return { hasError: false }

        } catch (error) {

            if(axios.isAxiosError(error)){
                const { message } = error.response?.data as {message : string}
                notifyError(message)
                return { hasError: true }
            }
            notifyError('Hubo un error inesperado')
            return { hasError: true }
        }
    }

    const updateAuthor = async ( author:IAuthor ):Promise<{ hasError: boolean }> => {

        try {
            
            const { data } = await axios.put('/api/admin/authors', author)
            dispatch({ type: '[DATA] - Update Author', payload: data })
            
            notifySuccess('Autor actualizado')
            return { hasError: false }

        } catch (error) {
            if(axios.isAxiosError(error)){
                const { message } = error.response?.data as {message : string}
                notifyError(message)
                return { hasError: true }
            }

            notifyError('Hubo un error inesperado')
            return { hasError: true }
        }

    }

    const deleteAuthor = async( idAuthor:string ):Promise<{ hasError: boolean }> => {
    
        try {
            
            const { data } = await axios.delete('/api/admin/authors',{
                data: {
                    idAuthor
                }
            })

            dispatch({ type: '[DATA] - Delete Author', payload: data.message })
            notifySuccess('Autor eliminado')
            return { hasError: false }

        } catch (error) {

            if(axios.isAxiosError(error)){
                const { message } = error.response?.data as {message : string}
                notifyError(message)
                return { hasError: true }
            }

            notifyError('Hubo un error inesperado')
            return { hasError: true }
        }

    }

    

    return (
        <DataContext.Provider value={{
            ...state,

            // Images
            addNewImage,

            // Categories
            refreshCategories,
            addNewCategory,
            // Authors
            refreshAuthors,
            addNewAuthor,
            updateAuthor,
            deleteAuthor
        }}>
            {children}
        </DataContext.Provider>
    )
}
