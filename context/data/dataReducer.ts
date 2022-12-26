import { DataState } from './';
import { IAuthor } from '../../interfaces/IAuthor';
import { ICategory, IImage } from '../../interfaces';


type DataActionType =
    | { type: '[DATA] - Add New Image', payload: IImage }
    
    | { type: '[DATA] - Refresh Categories', payload: ICategory[] }

    | { type: '[DATA] - Refresh Authors', payload: IAuthor[] }
    | { type: '[DATA] - Add New Author', payload: IAuthor }
    | { type: '[DATA] - Update Author', payload: IAuthor }
    | { type: '[DATA] - Delete Author', payload: string }

export const dataReducer = (state: DataState, action: DataActionType): DataState => {

    switch (action.type) {

        // Images
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

        // Categories
        case '[DATA] - Refresh Categories':
            return {
                ...state,
                categories: [...action.payload]
            }

        // Authors
        case '[DATA] - Refresh Authors':
            return {
                ...state,
                authors: [...action.payload]
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
        
        default:
            return state
    }
}