import { NextPage } from "next"

import { LayoutAdmin } from "../../../components/layouts"
import { TitlePage } from "../../../components/admin/ui"



const NuevoArticuloPage:NextPage = () => {
    return (
        <LayoutAdmin title={'- Nuevo Artículo'} isMain={true}>
            <div className="mb-5 flex gap-2 items-center py-3">
                <TitlePage title="Nuevo Artículo" />
            </div>
        </LayoutAdmin>
    )
}

export default NuevoArticuloPage
