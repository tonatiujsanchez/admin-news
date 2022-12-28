import { FC, ReactNode } from "react"


interface Props {
    processing?: boolean
    title: string
    subtitle: ReactNode
    onResult: ( result: () => Promise<{ confirm: boolean }> ) => void
}

export const ModalDelete:FC<Props> = ({ processing = false, title, subtitle, onResult }) => {
    
    const resultConfirm = async() => {
        return { confirm: true }
    }
    
    const resultCancel = async() => {
        return { confirm: false }
    }

    return (
        <>
            <div className="bg-white px-4 pt-8 pb-6 sm:py-10 sm:px-8 sm:w-[600px]">
                <div className="sm:flex sm:items-start sm:gap-2">
                    <div className="mx-auto flex h-20 w-20 flex-shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0">
                        <i className='bx bx-trash text-red-600 text-3xl'></i>
                    </div>
                    <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                        <h3 className="text-3xl font-medium leading-6 text-gray-900" id="modal-title">{ title }</h3>
                        <div className="mt-4">
                            { subtitle }
                        </div>
                    </div>
                </div>
            </div>
            <div className="px-4 py-6 sm:flex sm:flex-row-reverse sm:px-6">
                <button 
                    type="button" 
                    disabled={processing}
                    onClick={ ()=> onResult( resultConfirm ) }
                    className="flex w-full justify-center items-center rounded-md border border-transparent bg-red-600 text-2xl font-semibold py-3 px-10 text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 sm:ml-3 sm:w-44 disabled:bg-red-400 disabled:cursor-not-allowed">
                    {
                        processing
                        ? (
                                <svg className="animate-spin h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle 
                                        className="opacity-25" 
                                        cx="12" 
                                        cy="12" 
                                        r="10" 
                                        stroke="currentColor" 
                                        strokeWidth="4">   
                                    </circle>
                                    <path 
                                        className="opacity-75" 
                                        fill="currentColor" 
                                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
                                    </path>
                                </svg>
                        )
                        : 'Eliminar'
                    }
                </button>
                <button
                    type="button"
                    disabled={processing} 
                    onClick={ ()=> onResult( resultCancel ) } 
                    className="mt-3 inline-flex w-full justify-center rounded-md border border-gray-300 bg-white py-3 px-8 text-gray-700 shadow-sm hover:bg-gray-100 focus:outline-none sm:mt-0 sm:ml-3 sm:w-auto text-2xl disabled:opacity-70 disabled:cursor-not-allowed">
                    Cancelar
                </button>
            </div>
        </>
    )
}
