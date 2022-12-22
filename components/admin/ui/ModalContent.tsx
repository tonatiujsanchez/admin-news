import { FC, ReactNode } from "react"



interface Props {
    children: ReactNode
    maxWidth?: string
}

export const ModalContent:FC<Props> = ({ children, maxWidth = 'max-w-4xl' }) => {
    return (
        <div className="relative z-10" aria-labelledby="modal-title" role="dialog" aria-modal="true">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity">
                <div className="fixed inset-0 z-10 overflow-y-auto">
                    <div className="flex min-h-full items-center justify-center p-4 text-center sm:items-center sm:p-0">
                        <div className={`relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 w-full sm:${maxWidth}`}>
                            { children }
                        </div>
                    </div>
                </div>
            </div>
        </div>

    )
}
