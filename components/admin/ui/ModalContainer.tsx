import { FC, ReactNode, useEffect } from 'react';



interface Props {
    children: ReactNode
    heightFull?: boolean
}

export const ModalContainer:FC<Props> = ({ children, heightFull }) => {

    useEffect(() => {
        const body = document.querySelector('body')
        body!.classList.add('fixed-body')
    
      return () => {
        body!.classList.remove('fixed-body')
      }
    }, [])

    return (
        <div className="relative z-50" aria-labelledby="modal-title" role="dialog" aria-modal="true">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity">
                <div className="fixed inset-0 z-50 overflow-y-auto">
                    <div className="flex min-h-full items-center justify-center px-4 text-center sm:items-center sm:p-0">
                        <div className={`relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all w-full sm:max-w-[600px] sm:h-auto ${heightFull?'h-[97vh]':'h-auto'}`}>
                            { children }
                        </div>
                    </div>
                </div>
            </div>
        </div>

    )
}
