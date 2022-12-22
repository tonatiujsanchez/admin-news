
import { NextPage } from 'next'

import { LayoutAdmin } from '../../../components/layouts'
import { AuthorForm } from '../../../components/admin/authors'
import { TitlePage } from '../../../components/admin/ui'


const AutorNuevoPage:NextPage = () => {
    return (
        <LayoutAdmin title="- Nuevo Autor" >
        <div className="mb-5 flex gap-2 items-center py-3">
            <TitlePage title="Nuevo autor" />
        </div>
        <div className='max-w-[1200px] mx-auto'>
            <AuthorForm />
        </div>
    </LayoutAdmin>
    )
}

export default AutorNuevoPage