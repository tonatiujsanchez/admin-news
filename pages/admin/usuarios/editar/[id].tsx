import { useEffect, useState } from "react"
import { NextPage } from 'next';
import { useRouter } from "next/router"

import { useData } from "../../../../hooks/useData"

import { LayoutAdmin } from "../../../../components/layouts"
import { UserForm } from "../../../../components/admin/users"
import { TitlePage } from "../../../../components/admin/ui"
import { LoadingAdmin } from "../../../../components/admin/utilities"

import { IUser } from "../../../../interfaces"



const EditarUsuario:NextPage = () => {

    const [userEdit, setUserEdit] = useState<IUser>()
    const [loading, setLoading] = useState(false)
    
    const router = useRouter()
    const { id } = router.query
    
    const { users, refreshUsers } = useData()


    const loadUsersAndGetById = async() => {

        const { hasError, users:usersResp } = await refreshUsers()

        if( hasError ){
            return router.replace('/admin/usuarios')
        }

        const userResp = usersResp.find( user => user._id === id )

        if( !userResp ){
            return router.replace('/admin/usuarios')
        }

        setUserEdit( userResp )
        setLoading( false )
    }

    const getUserById = async() => {

        setLoading( false )

        if ( users.length === 0 ){

            await loadUsersAndGetById()
        } else {

            const userView = users.find( user => user._id === id )

            if( !userView ){
                return router.replace('/admin/usuarios')
            }

            setUserEdit( userView )
            setLoading(false)
        }

    }

    useEffect(()=>{

        if( !id ){ return }
        getUserById()

    },[id, getUserById])


    return (
        <LayoutAdmin title="- Editar Usuario" >
            {
                loading || !userEdit
                ? (
                    <div className="flex justify-center mt-96">
                        <LoadingAdmin />
                    </div>
                ):(
                    <>
                        <div className="mb-5 flex gap-2 items-center py-3">
                            <TitlePage title="Editar Usuario" />
                        </div>
                        <UserForm userEdit={userEdit} />
                    </>
                )
            }
        </LayoutAdmin>
    )
}

export default EditarUsuario