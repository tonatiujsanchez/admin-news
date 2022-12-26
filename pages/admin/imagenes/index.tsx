import { NextPage } from 'next';
import { TitlePage } from '../../../components/admin/ui';

import { LayoutAdmin } from '../../../components/layouts';
import { useData } from '../../../hooks';




const ImagenesPage: NextPage = () => {


    const { refreshImages, addNewImage, images } = useData()

    // TODO:

    return (
        <LayoutAdmin title={'- Categorías'} isMain={true}>
            <div className="mb-5 sm:mb-0 flex gap-2 items-center py-3">
                <TitlePage title="Imagenes" />
                <button
                    className="text-3xl text-slate-600 hover:bg-slate-200 hover:text-slate-900 py-2 px-3 rounded-full active:scale-95"
                    // onClick={() => loadCategories()}
                >
                    <i className='bx bx-revision'></i>
                </button>
            </div>
            {
                
            }
        </LayoutAdmin>
    )
}

export default ImagenesPage