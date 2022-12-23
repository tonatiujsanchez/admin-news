import { NextPage } from 'next';
import { LayoutAdmin } from '../../../components/layouts';




const CategoriasPage:NextPage = () => {


    
    return (
        <LayoutAdmin title={'- Categorías'} isMain={true}>
            <h2>Categorias</h2>
        </LayoutAdmin>
    )
}

export default CategoriasPage