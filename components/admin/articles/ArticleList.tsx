import { FC } from 'react';
import { IEntry } from '../../../interfaces/IEntry';
import { ArticleItem } from './ArticleItem';



interface Props {
    articles: IEntry[]
}

export const ArticleList:FC<Props> = ({ articles }) => {
    return (
        <table className="table-auto w-full bg-white rounded overflow-hidden">
            <thead className='bg-sky-50 border'>
                <tr>
                    <th className='text-slate-800 text-center px-6 py-2 w-20'><i className='bx bxs-bookmarks'></i></th>
                    <th className='text-slate-800 text-left px-6 py-2 sm:py-4 w-20'>Foto</th>
                    <th className='text-slate-800 text-left px-6 py-2 sm:py-4'>Título</th>
                    <th className='text-slate-800 text-left px-6 py-2 sm:py-4'>Categoría</th>
                    <th className='text-slate-800 text-left px-6 py-2 sm:py-4 min-w-[144px]'>Fecha creación</th>
                    <th className='text-slate-800 text-left px-6 py-2 sm:py-4 min-w-[144px] leading-8'>Fecha publicación</th>
                    <th className='text-slate-800 text-left px-6 py-2 sm:py-4'>Estado</th>
                    <th className='text-slate-800 text-left px-6 py-2 sm:py-4'>Visitas</th>
                    <th className='text-slate-800 text-left px-6 py-2 sm:py-4'>Acciones</th>
                </tr>
            </thead>
            <tbody>
                {
                    articles.map( article => (
                        <ArticleItem key={ article._id } article={article} />
                    ))
                }
            </tbody>
        </table>
    )
}
