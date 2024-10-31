import { FC, useReducer, useEffect, useMemo } from 'react';

import axios from 'axios'

import { DataContext, dataReducer } from './'

import { useAuth } from '../../hooks'

import { IAuthor, ICategory, IEntry, IImage, IImages, ITag, IUser } from '../../interfaces'
import { notifyError, notifySuccess } from '../../utils/frontend'


interface Props {
    children: JSX.Element
}


export interface DataState {
    entries: {
        pageCount: number,
        length: number,
        page: number,
        data: IEntry[]
    },
    images: IImages
    categoriesList: ICategory[]
    authors: IAuthor[]
    tags   : ITag[]
    users: IUser[]
}

const DATA_INITIAL_STATE: DataState = {
    entries: {
        pageCount: 1,
        length: 0,
        page: 1,
        data: [],
    },
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
    tags   : [],
    users: [],
}

const section_active_storage = 'images_section_active_ed4c1de1770480153a06fa2349f501f0'


export const DataProvider: FC<Props> = ({ children }) => {

    const { user } = useAuth()

    const [state, dispatch] = useReducer(dataReducer, DATA_INITIAL_STATE)


    const updateSectionAndPageInStorage = (section:string, page:number) => {
        localStorage.setItem(section_active_storage, section)
        localStorage.setItem(`section_page_storage_${section}_ed4c1de1770480153a06fa2349f501f0`, String( page ) )
    }

    const updateArticlesPageInStorage = ( page: number ) => {
        localStorage.setItem(`articles_page_storage_ed4c1de1770480153a06fa2349f501f0`, String( page ) )
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



    
    // ===== ===== ===== ===== Entries ===== ===== ===== =====
    // ===== ===== ===== ===== ====== ===== ===== ===== ======
    const refreshEntries = async( page:number = 0, searchTerm?:string, category?:string, status?:string ):Promise<{ hasError: boolean; entriesResp: IEntry[] }> => {

        try {
            const { data } = await axios.get('/api/shared/entries', { params: { page, searchTerm, category, status } })
            dispatch({ type:'[DATA] - Refresh Entries', payload: {
                data: data.entries,
                length: data.length,
                page: data.page,
                pageCount: data.totalOfPages
            }})

            updateArticlesPageInStorage( page )
        
            return{
                hasError: false,
                entriesResp: data.entries
            }

        } catch (error) {
            if(axios.isAxiosError(error)){
                const { message } = error.response?.data as { message: string }
                notifyError(message)
                return {
                    hasError: true,
                    entriesResp:[]
                }
            }

            notifyError('Hubo un error inesperado')
            return {
                hasError: true,
                entriesResp: []
            }
        }
    }

    const getEntry = async( idEntry:string ):Promise<{ hasError:boolean; entryResp?: IEntry  }> => {

        try {
            
            const { data } = await axios.get<IEntry>(`/api/shared/entries/${ idEntry }`)            
            return {
                hasError: false,
                entryResp: data
            }
        } catch (error) {
            
            if(axios.isAxiosError(error)){
                const { message } = error.response?.data as { message: string }
                notifyError(message)
                return {
                    hasError: true,
                    entryResp:undefined
                }
            }
            
            notifyError('Artículo no encontrado')
            return {
                hasError: true,
                entryResp: undefined
            }
        }
    }
    
    const addNewEntry = async( entry:IEntry ):Promise<{ hasError:boolean; entryResp?: IEntry  }> => {
        
        try {

            const { data } = await axios.post<IEntry>('/api/shared/entries', entry)            

            if( state.entries.length > 0 ){
                dispatch({ type: '[DATA] - Add New Entry', payload: data })         
            }

            if( data.published ){
                notifySuccess('Artículo publicado')
            } else {
                notifySuccess('Artículo guardado')
            }
            // Añadir Mensaje de Artículo programado

            return {
                hasError: false,
                entryResp:data
            }
            
        } catch (error) {
            if(axios.isAxiosError(error)){
                const { message } = error.response?.data as { message: string }
                notifyError(message)
                return {
                    hasError: true,
                    entryResp:undefined
                }
            }

            notifyError('Hubo un error inesperado')
            return {
                hasError: true,
                entryResp: undefined
            }
        }
    
        
    }

    const updateEntry = async( entry: IEntry ):Promise<{ hasError: boolean }>=> {

        try {

            const { data } = await axios.put('/api/shared/entries', entry)
            dispatch({ type: '[DATA] - Update Entry', payload: data })

            notifySuccess('Artículo actualizado')
            return { 
                hasError: false
            }

        } catch (error) {
            if(axios.isAxiosError(error)){
                const { message } = error.response?.data as { message: string }
                notifyError(message)
                return {
                    hasError: true
                }
            }

            notifyError('Hubo un error inesperado')
            return {
                hasError: true
            }
        }
    }

    const deleteEntry = async( idEntry: string ):Promise<{ hasError: boolean }>=> {
        
        try {
            const { data } = await axios.delete('/api/shared/entries', { 
                data: {
                    idEntry
                }
            })
            dispatch({ type: '[DATA] - Delete Entry', payload: data.message })

            notifySuccess('Categoría eliminada')
            return{
                hasError: false
            }
            
        } catch (error) {
            if(axios.isAxiosError(error)){
                const { message } = error.response?.data as { message: string }
                notifyError(message)
                return {
                    hasError: true
                }
            }

            notifyError('Hubo un error inesperado')
            return {
                hasError: true
            }
        }
    }

    // ===== ===== ===== ===== Images ===== ===== ===== =====
    // ===== ===== ===== ===== ===== ===== ===== ===== ======
    const refreshImages = async( section:string,  page = 0 ):Promise<{ hasError: boolean, imagesResp: IImage[] }> => {        

        try {

            const skipStart = page * 20

            const { data } = await axios.get(`/api/shared/images`, { params: { section, skipStart } })

            if(data.images.length === 0){
                return { 
                    hasError: false,
                    imagesResp: data
                }
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

            return { 
                hasError: false,
                imagesResp:[]
            }

        } catch (error) {
            if(axios.isAxiosError(error)){
                const { message } = error.response?.data as { message: string }
                notifyError(message)
                return {
                    hasError: true,
                    imagesResp:[]
                }
            }

            notifyError('Hubo un error inesperado')
            return {
                hasError: true,
                imagesResp:[]
            }
        }

    }


    const addNewImage = async( formData:FormData ):Promise<{ hasError:boolean; urlImage: string }> => {

        formData.append('user', user!._id as string)

        try {
            const { data } = await axios.post('/api/shared/images/upload', formData)
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

    const deleteImage = async( image: IImage ):Promise<{ hasError: boolean }> => {

        try {            

            const { data } = await axios.delete('/api/shared/images', { 
                data: {
                    idImage: image._id 
                }
            })

            dispatch({ type: '[DATA] - Delete Image', payload: image })

            notifySuccess('Imagen eliminada')
            return { hasError: false }
            
        } catch (error) {
            if(axios.isAxiosError(error)){
                const { message } = error.response?.data as { message: string }
                notifyError(message)
                return { hasError: true }
            }

            notifyError('Hubo un error inesperado')
            console.log(error);
            return { hasError: true }
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

    const updateCategory = async(category:ICategory):Promise<{ hasError: boolean }> => {

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

    // ===== ===== ===== ===== Tags ===== ===== ===== ======
    // ===== ===== ===== ===== ===== ===== ===== ===== ======
    const refreshTags = async(): Promise<{ hasError:boolean; tagsResp: ITag[] }> => {
        
        try {

            const { data } = await axios.get<ITag[]>('/api/public/tags')
            dispatch({ type:'[DATA] - Refresh Tags', payload: data })

            return {
                hasError: false,
                tagsResp: data
            }  
            
        } catch (error) {
            if(axios.isAxiosError(error)){
                const { message } = error.response?.data as {message : string}

                notifyError(message)
                return {
                    hasError: true,
                    tagsResp: []
                }
            }

            notifyError('Hubo un error inesperado')
            return {
                hasError: true,
                tagsResp: []
            }  
        }
    }


    const addNewTag = async( tag: ITag ):Promise<{ hasError: boolean }>  => {

        try {

            const { data } = await axios.post<ITag>('/api/shared/tags', tag)

            dispatch({ type: '[DATA] - Add New Tag', payload: data })
            notifySuccess('Etiqueta agregada')
            
            return { 
                hasError: false
            }
        } catch (error) {

            if(axios.isAxiosError(error)){
                const { message } = error.response?.data as {message : string}
                notifyError(message)
                return { 
                    hasError: true,
                }
            }

            notifyError('Hubo un error inesperado')
            return { 
                hasError: true,
            }
        }
    }

    const updateTag = async( tag:ITag ):Promise<{ hasError: boolean }> => {
    
        try {
            const { data } = await axios.put('/api/shared/tags', tag)
            dispatch({ type: '[DATA] - Update Tag', payload: data })

            notifySuccess('Etiqueta actualizada')
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

    const deleteTag = async( idTag:string ):Promise<{ hasError: boolean }> => {

        try {

            const { data } = await axios.delete('/api/shared/tags', { 
                data: {
                    idTag
                }
            })
            dispatch({ type: '[DATA] - Delete Tag', payload: data.message })

            notifySuccess('Etiqueta eliminada')
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



    // ===== ===== ===== ===== users ===== ===== ===== ======
    // ===== ===== ===== ===== ===== ===== ===== ===== ======
    const refreshUsers = async(): Promise<{ hasError:boolean; users: IUser[] }> => {

        try {

            const { data } = await axios.get('/api/admin/users')
            dispatch({ type: '[DATA] - Refresh Users', payload: data })

            return { 
                hasError: false,
                users: data
            }

        } catch (error) {

            if(axios.isAxiosError(error)){
                const { message } = error.response?.data as {message : string}
                notifyError(message)
                return { 
                    hasError: true,
                    users: []
                }
            }

            notifyError('Hubo un error inesperado')
            return { 
                hasError: true,
                users: []
            }

        }
    }

    const addNewUser = async( user: IUser  ):Promise<{ hasError: boolean }> => {

        try {
            const { data } = await axios.post(`/api/admin/users`, user )
            dispatch({ type: '[DATA] - Add New User', payload: data })

            notifySuccess('Usuario agregado')
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

    const updateUser = async (user: IUser):Promise<{ hasError: boolean }> => {
        try {
            
            const { data } = await axios.put('/api/admin/users', user)
            dispatch({ type: '[DATA] - Update User', payload: data })

            notifySuccess('Usuario actualizado')
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

    const deleteUser = async( idUser:string ):Promise<{ hasError: boolean }> => {

        try {
            
            const { data } = await axios.delete('/api/admin/users', {
                data: {
                    idUser
                }
            })
            dispatch({ type: '[DATA] - Delete User', payload: data.message })

            notifySuccess('Usuario eliminado')
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

    const updatePassword = async( userId:string, password:string ):Promise<{ hasError: boolean }> => {       

        try {

            const { data } = await axios.put('/api/admin/users/change-password',{ userId, password })

            notifySuccess(data.message)
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


    return (
        <DataContext.Provider value={{
            ...state,
            categories,
            
            // Entry
            refreshEntries,
            getEntry,
            addNewEntry,
            updateEntry,
            deleteEntry,
            // Images
            refreshImages,
            addNewImage,
            deleteImage,
            // Categories
            refreshCategories,
            addNewCategory,
            updateCategory,
            deleteCategory,
            // Authors
            refreshAuthors,
            addNewAuthor,
            updateAuthor,
            deleteAuthor,
            // Tags
            refreshTags,
            addNewTag,
            updateTag,
            deleteTag,
            // Users
            refreshUsers,
            addNewUser,
            updateUser,
            deleteUser,
            updatePassword,
        }}>
            {children}
        </DataContext.Provider>
    )
}
