import { DataState } from './';
import { IAuthor } from '../../interfaces/IAuthor';
import { IImage } from '../../interfaces';


type DataActionType =
    | { type: '[DATA] - Add New Image', payload: IImage }
    
    | { type: '[DATA] - Refresh Authors', payload: IAuthor[] }
    | { type: '[DATA] - Add New Author', payload: IAuthor }

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

            
        default:
            return state
    }
}