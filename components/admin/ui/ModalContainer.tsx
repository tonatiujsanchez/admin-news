import { FC, ReactNode, useEffect } from 'react';



interface Props {
    children: ReactNode
    maxWidthPx?: string
}

export const ModalContainer:FC<Props> = ({ children, maxWidthPx = 'max-w-[600px]' }) => {

    useEffect(() => {
        const body = document.querySelector('body')
        body!.classList.add('fixed-body')
    
      return () => {
        body!.classList.remove('fixed-body')
      }
    }, [])

    const maxWith = `sm:${maxWidthPx}`
    

    return (
        <div className="relative z-10" aria-labelledby="modal-title" role="dialog" aria-modal="true">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity">
                <div className="fixed inset-0 z-10 overflow-y-auto">
                    <div className="flex min-h-full items-center justify-center p-4 text-center sm:items-center sm:p-0">
                        <div className={`relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 w-full ${maxWith}`}>
                            { children }
                        </div>
                    </div>
                </div>
            </div>
        </div>

    )
}
