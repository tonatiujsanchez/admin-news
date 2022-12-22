import { FC, useReducer } from 'react'

import axios from 'axios'
import { toast } from 'react-toastify'

import { DataContext, dataReducer } from './'

import { IAuthor, IImage } from '../../interfaces'
import { useAuth } from '../../hooks'


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
    authors: [],
}


export const DataProvider: FC<Props> = ({ children }) => {

    const { user } = useAuth()

    const [state, dispatch] = useReducer(dataReducer, DATA_INITIAL_STATE)


    const notifySuccess = ( msg:string ) => toast.success(msg, {
        theme: "colored",
        autoClose: 1000
    })
    const notifyError = ( msg:string ) => toast.error(msg, {
        theme: "colored",
        autoClose: 3000
    })


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

    

    return (
        <DataContext.Provider value={{
            ...state,

            // Images
            addNewImage,

            // Authors
            refreshAuthors,
            addNewAuthor
        }}>
            {children}
        </DataContext.Provider>
    )
}
