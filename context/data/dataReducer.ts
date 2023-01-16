import { DataState } from './'
import { ICategory, IAuthor, IImage, IImageState, IUser, IEntry } from '../../interfaces'


type DataActionType =

    | { type: '[DATA] - Refresh Entries', payload: IEntry[] }
    | { type: '[DATA] - Add New Entry', payload: IEntry }

    | { type: '[DATA] - Refresh Images', payload: IImageState }
    | { type: '[DATA] - Add New Image', payload: IImage }
    | { type: '[DATA] - Delete Image', payload: IImage }
    
    | { type: '[DATA] - Refresh Categories List', payload: ICategory[] }
    | { type: '[DATA] - Add New Category To List', payload: ICategory }
    | { type: '[DATA] - Update Category From List', payload: ICategory }
    | { type: '[DATA] - Delete Category From List', payload: string }

    | { type: '[DATA] - Refresh Authors', payload: IAuthor[] }
    | { type: '[DATA] - Add New Author', payload: IAuthor }
    | { type: '[DATA] - Update Author', payload: IAuthor }
    | { type: '[DATA] - Delete Author', payload: string }
    
    | { type: '[DATA] - Refresh Users', payload: IUser[] }
    | { type: '[DATA] - Add New User', payload: IUser }
    | { type: '[DATA] - Update User', payload: IUser }
    | { type: '[DATA] - Delete User', payload: string }



export const dataReducer = (state: DataState, action: DataActionType): DataState => {

    switch (action.type) {

        // Images
        case '[DATA] - Refresh Entries':
            return {
                ...state,
                entries: [ ...state.entries ]
            }

        case '[DATA] - Add New Entry':
            return {
                ...state,
                entries: [ action.payload, ...state.entries ]
            }        
        
        // Images
        case '[DATA] - Refresh Images':
            return {
                ...state,
                images: {
                    ...state.images,
                    [action.payload.section]: {
                        ...action.payload.data
                    }
                }
            }

        case '[DATA] - Add New Image':
            return {
                ...state,
                images: {
                    ...state.images,
                    [action.payload.section]: {
                        ...state.images[action.payload.section],
                        data: [ action.payload, ...state.images[action.payload.section].data ]
                    }
                }
            }
            
        case '[DATA] - Delete Image':
            return {
                ...state,
                images: {
                    ...state.images,
                    [action.payload.section]: {
                        ...state.images[action.payload.section],
                        data: state.images[action.payload.section].data.filter( image => ( image._id !== action.payload._id ) )
                    }
                }
            }
    

        // Categories List
        case '[DATA] - Refresh Categories List':
            return {
                ...state,
                categoriesList: [ ...action.payload ]
            }

        case '[DATA] - Add New Category To List':
            return {
                ...state,
                categoriesList: [...state.categoriesList, action.payload]
            }

        case '[DATA] - Update Category From List':
            return {
                ...state,
                categoriesList: state.categoriesList.map( category => category._id === action.payload._id ? action.payload : category )
            }
        
        case '[DATA] - Delete Category From List':
            return {
                ...state,
                categoriesList: state.categoriesList.filter( category => category._id !== action.payload )
            }        

        // Authors
        case '[DATA] - Refresh Authors':
            return {
                ...state,
                authors: [ ...action.payload ]
            }
            
        case '[DATA] - Add New Author':
            return {
                ...state,
                authors: [...state.authors, action.payload]
            }

        case '[DATA] - Update Author':
            return {
                ...state,
                authors: state.authors.map( author => author._id === action.payload._id ? action.payload : author )
            }
        
        case '[DATA] - Delete Author':
            return {
                ...state,
                authors: state.authors.filter( author => author._id !== action.payload )
            }
        
        // Users
        case '[DATA] - Refresh Users':
            return {
                ...state,
                users: [ ...action.payload ]
            }

        case '[DATA] - Add New User':
            return {
                ...state,
                users: [ ...state.users, action.payload ]
            }

        case '[DATA] - Update User':
            return {
                ...state,
                users: state.users.map( user => user._id === action.payload._id ? action.payload : user )
            }

        case '[DATA] - Delete User':
            return {
                ...state,
                users: state.users.filter( user => ( user._id !== action.payload ) )
            }
        default:
            return state
    }
}