import { useEffect, useState } from "react"
import { LinkPrimary, TitlePage } from "../../../components/admin/ui"
import { UserItem } from "../../../components/admin/users"
import { LoadingAdmin } from "../../../components/admin/utilities"
import { LayoutAdmin } from "../../../components/layouts"
import { useAuth, useData } from "../../../hooks"



const UsuariosPage = () => {

    const [loading, setLoading] = useState(false)

    const { refreshUsers, users } = useData()
    const { user: userSession } = useAuth()


    const loadUsers = async () => {
        setLoading(true)
        await refreshUsers()
        setLoading(false)
    }

    useEffect(() => {
        if (users.length <= 0) {
            loadUsers()
        }
    }, [])



    return (
        <LayoutAdmin title="- Usuarios" >
            <div className="mb-5 flex gap-2 items-center py-3">
                <TitlePage title="Usuarios" />
                <button
                    className="text-3xl text-slate-600 hover:bg-slate-200 hover:text-slate-900 py-2 px-3 rounded-full active:scale-95"
                    onClick={() => loadUsers()}>
                    <i className='bx bx-revision'></i>
                </button>
            </div>

            {
                loading || !userSession
                    ? <div className="flex justify-center mt-96">
                        <LoadingAdmin />
                    </div>
                    : <section>
                        <div className="flex w-full mb-5">
                            <LinkPrimary link="/admin/usuarios/nuevo" text="Agregar nuevo usuario" />
                        </div>
                        <div className=" flex flex-col gap-5 items-center max-w-[600px] mx-auto">
                            {
                                users.map(user => {

                                    if (user._id === userSession._id) {
                                        return <div key={user._id} style={{ display: 'none' }}></div>
                                    }

                                    return (
                                        <UserItem
                                            key={user._id}
                                            user={user}
                                        />
                                    )
                                })
                            }
                        </div>
                    </section>
            }
        </LayoutAdmin>
    )

}

export default UsuariosPage
