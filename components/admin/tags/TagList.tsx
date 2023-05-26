import { FC } from "react"
import { ITag } from '../../../interfaces';
import { TagItem } from "./TagItem";



interface Props {
    tags: ITag[]
}

export const TagList:FC<Props> = ({ tags }) => {
    return (
        <table className="table-auto w-full bg-white rounded-lg overflow-hidden">
            <thead className='bg-slate-100'>
                <tr>
                    <th className='text-slate-800 text-center px-6 py-5'>
                        <i className='bx bx-hash font-bold' ></i>
                    </th>
                    <th className='text-slate-800 text-left px-6 py-5 sm:py-4'>Título</th>
                    <th className='text-slate-800 text-left px-6 py-5 sm:py-4'>Slug</th>
                    <th className='text-slate-800 text-left px-6 py-5 sm:py-4'>Estado</th>
                    <th className='text-slate-800 text-left px-6 py-5 sm:py-4'>Acciones</th>
                </tr>
            </thead>
            <tbody>
                {
                    tags.map(( tag, index ) => (
                        <TagItem 
                            key={tag._id}
                            tag={tag}
                            index={ index }
                        />
                    ))
                }
            </tbody>
        </table>
    )
}
