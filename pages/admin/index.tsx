import { NextPage } from 'next'


import { LayoutAdmin } from '../../components/layouts'

const AdminPage:NextPage = () => {
    return (
        <LayoutAdmin title={'- Dashboard'} isMain={true}>
            <h2>Hola</h2>
        </LayoutAdmin>
    )
}

export default AdminPage