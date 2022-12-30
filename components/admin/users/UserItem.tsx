import { FC, useState } from "react"
import { useRouter } from "next/router"

import styled from "@emotion/styled"

import { useData } from "../../../hooks/useData"
import { IUser } from "../../../interfaces"
import Image from "next/image"


interface Props {
    user: IUser
}


export const UserItem:FC<Props> = ({ user }) => {

    const router = useRouter()
    const [showDeleteModal, setShowDeleteModal] = useState(false)
    const [loadingDelete, setLoadingDelete] = useState(false)

    // const { deleteUser } = useData()

    
    const handleShowModalDelete = () => {
        // const body = document.querySelector('body')
        // body.classList.add('fixed-body')
        setShowDeleteModal(true)
    }

    const handleHiddenModalDelete = () => {
        // const body = document.querySelector('body')
        // body.classList.remove('fixed-body')
        setShowDeleteModal(false)
    }

    const onDeleteAuthor = async() => {
        setLoadingDelete(true)
        // const { hasError } = await deleteUser(user._id)

        // if(hasError){
        //     setLoadingDelete(false)
        //     return
        // }
        handleHiddenModalDelete()
    }

    const onEditUser = () => {
        router.push(`/admin/usuarios/editar/${user._id}`)
    }

    return (
        <>
            <div className="flex flex-col sm:flex-row sm:justify-between gap-5 sm:gap-20 sm:items-center shadow p-5 sm:p-10 bg-white rounded-lg w-full">
                <div className="flex flex-wrap gap-5 items-center">
                    <div className="relative">
                        <div className="relative w-24 h-24 rounded-full overflow-hidden cursor-pointer group border">
                            {
                                user.photo 
                                ?(
                                    <Image
                                        priority
                                        fill
                                        sizes="(max-width: 125px) 125px"
                                        src={user.photo}
                                        alt={user.name}
                                        className='cover bg-gray-200 aspect-w-1 aspect-h-1 rounded-md overflow-hidden group-hover:opacity-75 lg:aspect-none'
                                    />
                                ):(
                                    <div className='w-full h-full flex justify-center items-center bg-gray-200 aspect-w-1 aspect-h-1 rounded-md overflow-hidden group-hover:opacity-75 lg:aspect-none'>
                                        <p className="font-bold text-4xl text-slate-800 uppercase">{user.name.slice(0, 1)}</p>
                                    </div>
                                )
                            }

                        </div>
                        <RoleTag className={`text-lg px-2 rounded-md ${user.role === 'admin' ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-200'}`}>
                            {user.role === 'admin' ? 'Administrador' : 'Editor'}
                        </RoleTag>
                    </div>
                    <div className="flex-1">
                        <p className="font-bold">{user.name}</p>
                        <p className="text-slate-600 text-2xl w-auto">{user.email}</p>
                    </div>
                </div>
                <div className="flex gap-5 self-end sm:self-center">
                    <button
                        className='flex items-center text-sky-600 hover:text-white bg-sky-100 hover:bg-sky-500 font-bold text-3xl py-2 px-3 rounded-md'
                        onClick={onEditUser}>
                        <i className='bx bx-edit'></i>
                    </button>
                    <button
                        className='flex items-center text-red-600 hover:text-white bg-red-100 hover:bg-red-500 font-bold text-3xl py-2 px-3 rounded-md'
                        onClick={ handleShowModalDelete }>
                        <i className='bx bx-trash' ></i>
                    </button>
                </div>
            </div>
            {/* <Modal
                isOpen={showDeleteModal}
                style={customStyles}>
                <div className="p-5">
                    <header className="text-center">
                        <div className='text-center text-7xl mb-2 text-red-600'>
                            <i className='bx bx-trash'></i>
                        </div>
                        <h3 className='font-bold text-4xl mb-5'>Eliminar usuario</h3>
                        <p className="text-center text-2xl mb-2">{`Desea eliminar a: ${user.name}`}</p>
                    </header>
                    <div className='flex items-center justify-center gap-2 mt-10'>
                        <button
                            disabled={loadingDelete}
                            onClick={handleHiddenModalDelete}
                            className="py-3 px-5 uppercase w-full rounded-md cursor-pointer transition-colors">
                            Cancelar
                        </button>
                        <button
                            onClick={onDeleteAuthor}
                            disabled={loadingDelete}
                            className="bg-red-500 hover:bg-red-600 text-white font-bold py-3 px-6 uppercase w-full rounded-md cursor-pointer transition-colors min-w-[110px] flex justify-center disabled:bg-red-300">
                            { loadingDelete 
                                ?<LoadingCircle />
                                :<span>
                                    Eliminar
                                 </span>
                            }
                        </button>
                    </div>
                </div>
            </Modal> */}
        </>
    )
}


const RoleTag = styled.span`
    position: absolute;
    bottom: -1rem;
    left: 50%;
    transform: translateX(-50%);
`
