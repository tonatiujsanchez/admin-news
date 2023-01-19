import { FC } from 'react';
import { IEntry } from '../../../interfaces/IEntry';
import { ArticleItem } from './ArticleItem';



interface Props {
    articles: IEntry[]
}

export const ArticleList:FC<Props> = ({ articles }) => {
    return (
        <table className="table-auto w-full bg-white rounded overflow-hidden">
            <thead className='bg-slate-100 border-b'>
                <tr>
                    <th className='text-slate-800 text-left px-6 py-2 w-20'>Destacado</th>
                    <th className='text-slate-800 text-left px-6 py-2 w-20'>Imagen</th>
                    <th className='text-slate-800 text-left px-6 py-2'>Título</th>
                    <th className='text-slate-800 text-left px-6 py-2'>Categoría</th>
                    <th className='text-slate-800 text-left px-6 py-2 min-w-[144px]'>Fecha creación</th>
                    <th className='text-slate-800 text-left px-6 py-2 min-w-[144px] leading-8'>Fecha publicación</th>
                    <th className='text-slate-800 text-left px-6 py-2'>Estado</th>
                    <th className='text-slate-800 text-left px-6 py-2'>Visitas</th>
                    <th className='text-slate-800 text-left px-6 py-2'>Acciones</th>
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
