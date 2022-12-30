import { NextPage } from 'next'

import { LayoutAdmin } from '../../../components/layouts'
import { UserForm } from '../../../components/admin/users'
import { TitlePage } from '../../../components/admin/ui'

const NuevoUsuarioPage:NextPage = () => {


    return (
        <LayoutAdmin title="- Nuevo Usuario" >
            <div className="mb-5 flex gap-2 items-center py-3">
                <TitlePage title="Nuevo usuario" />
            </div>
            <UserForm />
        </LayoutAdmin>
    )
}

export default NuevoUsuarioPage