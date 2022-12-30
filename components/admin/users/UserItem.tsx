import { FC, useState } from "react"
import { useRouter } from "next/router"

import styled from "@emotion/styled"

import { useData } from "../../../hooks/useData"
import { IUser } from "../../../interfaces"
import Image from "next/image"
import { ModalContainer } from '../ui/ModalContainer';
import { ModalDelete } from "../ui"


interface Props {
    user: IUser
}


export const UserItem:FC<Props> = ({ user }) => {

    const [showDeleteModal, setShowDeleteModal] = useState(false)
    const [loadingDelete, setLoadingDelete] = useState(false)

    const router = useRouter()

    const { deleteUser } = useData()


    const onDeleteUser = async( result: () => Promise<{ confirm: boolean; }> ) => {

        const { confirm } = await result()

        if( !confirm ){
            return setShowDeleteModal(false)
        }
        
        setLoadingDelete(true)
        const { hasError } = await deleteUser(user._id!)
        setLoadingDelete(false)

        if(hasError){ return }

        setShowDeleteModal(false)
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
                        onClick={ ()=> setShowDeleteModal(true) }>
                        <i className='bx bx-trash' ></i>
                    </button>
                </div>
            </div>
            {
                showDeleteModal && (
                    <ModalContainer>
                        <ModalDelete
                            processing={loadingDelete} 
                            title={"Eliminar usuario"} 
                            subtitle={
                                <p className="text-2xl text-gray-500">
                                    ¿Desdea eliminar al usuario <span className='font-semibold italic'>{`"${user.name}"`}</span>?
                                </p>
                            } 
                            onResult={onDeleteUser}
                        />
                    </ModalContainer>
                )
            }
        </>
    )
}


const RoleTag = styled.span`
    position: absolute;
    bottom: -1rem;
    left: 50%;
    transform: translateX(-50%);
`
