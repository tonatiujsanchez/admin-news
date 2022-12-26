import { FC, useReducer, useEffect, useMemo } from 'react';

import axios from 'axios'

import { DataContext, dataReducer } from './'

import { useAuth } from '../../hooks'

import { IAuthor, ICategory, IImage, ImageStateData } from '../../interfaces'
import { notifyError, notifySuccess } from '../../utils/frontend'


interface Props {
    children: JSX.Element
}


export interface DataState {
    images: {
        articles: ImageStateData,
        authors: ImageStateData,
        users: ImageStateData
    },
    categoriesList: ICategory[]
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
    categoriesList: [],
    authors: [],
}

const section_active_storage = 'images_section_active_ed4c1de1770480153a06fa2349f501f0'


export const DataProvider: FC<Props> = ({ children }) => {

    const { user } = useAuth()

    const [state, dispatch] = useReducer(dataReducer, DATA_INITIAL_STATE)


    const updateSectionAndPageInStorage = (section:string, page:number) => {
        localStorage.setItem(section_active_storage, section)
        localStorage.setItem(`section_page_storage_${section}_ed4c1de1770480153a06fa2349f501f0`, String( page ) )
    }

    const categories:ICategory[] = useMemo(() => {
        return (
            state.categoriesList.filter(category => {

                category.subcategories = state.categoriesList.filter(
                    subc => (subc.type === 'subcategory' && subc.category === category._id)
                )
                if (category.type === 'category') {
                    return category
                }
            })
        )
    }, [state.categoriesList])



    // ===== ===== ===== ===== Images ===== ===== ===== =====
    // ===== ===== ===== ===== ===== ===== ===== ===== ======
    const refreshImages = async( section:string,  page = 0 ):Promise<{ hasError: boolean }> => {        

        try {

            const skipStart = page * 10

            const { data } = await axios.get(`/api/shared/images`, { params: { section, skipStart } })

            if(data.images.length === 0){
                return { hasError: false }
            }

            dispatch({ type: '[DATA] - Refresh Images', payload: {
                section,
                data: {
                    data: data.images,
                    length: data.length,
                    pageCount: data.totalOfPages,
                }
            } })

            updateSectionAndPageInStorage(section, page)

            return { hasError: false }

        } catch (error) {
            if(axios.isAxiosError(error)){
                const { message } = error.response?.data as { message: string }
                notifyError(message)
                return { hasError: true }
            }

            notifyError('Hubo un error inesperado')
            return { hasError: true }
        }

    }


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
            dispatch({ type: '[DATA] - Refresh Categories List', payload: data })

            return {
                hasError: false,
                categories: data
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
            dispatch({ type: '[DATA] - Add New Category To List', payload: data })

            notifySuccess('Categoría creada')
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

    const updateCategory = async(category:ICategory) => {

        try {

            const { data } = await axios.put('/api/admin/categories', category)
            dispatch({ type: '[DATA] - Update Category From List', payload: data })

            notifySuccess('Categoría actualizada')
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
    
    const deleteCategory = async( idCategory:string ):Promise<{ hasError: boolean }> => {

        try {
            const { data } = await axios.delete('/api/admin/categories', { 
                data: {
                    idCategory
                }
            })
            
            dispatch({ type: '[DATA] - Delete Category From List', payload: data.message })

            notifySuccess('Categoría eliminada')
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
            categories,
            // Images
            refreshImages,
            addNewImage,

            // Categories
            refreshCategories,
            addNewCategory,
            updateCategory,
            deleteCategory,
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
