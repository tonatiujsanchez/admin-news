
import { NextPage } from 'next'

import { LayoutAdmin } from '../../../components/layouts'
import { ArticleForm } from '../../../components/admin/articles'
import { TitlePage } from '../../../components/admin/ui'


const ArticuloPage: NextPage = () => {




    return (
        <LayoutAdmin title={'- Editar Artículo'}>
            <div className="mb-5 flex gap-2 items-center py-3">
                <TitlePage title="Editar Artículo" />
            </div>
            <div className="max-w-[1240px] mx-auto">
                <ArticleForm />
            </div>
        </LayoutAdmin>
    )
}

export default ArticuloPage