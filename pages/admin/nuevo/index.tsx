import { NextPage } from "next"

import { LayoutAdmin } from "../../../components/layouts"
import { ArticleForm } from "../../../components/admin/articles"
import { TitlePage } from "../../../components/admin/ui"


const NuevoArticuloPage:NextPage = () => {
    return (
        <LayoutAdmin title={'- Nuevo Artículo'}>
            <div className="mb-5 flex gap-2 items-center py-3">
                <TitlePage title="Nuevo Artículo" />
            </div>
            <div className="max-w-[1200px] mx-auto">
                <ArticleForm />
            </div>
        </LayoutAdmin>
    )
}

export default NuevoArticuloPage
