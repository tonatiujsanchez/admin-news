import { FC, useState } from 'react';
import { ITag } from "../../../interfaces"
import { ModalContainer } from './ModalContainer';
import { SelectTagsModal } from './SelectTagsModal';



interface Props {
    articleTags: ITag[]
    onSetTags: (tags: ITag[]) => void
    processing: boolean
}

export const SelectTags: FC<Props> = ({ articleTags, onSetTags, processing }) => {

    const [showModalTags, setShowModalTags] = useState(false)


    return (
        <>
            <div className="flex-1 flex flex-col">
                <label className="mb-1 block font-bold text-slate-800">
                    Etiquetas
                </label>
                <div
                    onClick={ ()=> setShowModalTags(true) }
                    className={`bg-admin border mt-2 w-full p-5 min-h-[10rem] rounded-md text-md flex items-start gap-2 flex-wrap ${processing ? 'border-slate-200' : 'hover:border-slate-800'}`}
                >
                    {
                        articleTags.map( tag => (
                            <span 
                                key={tag._id}
                                className="bg-sky-200 border border-sky-700 text-sky-800 text-xl py-2 px-5 rounded-md"
                            >
                                { tag.title }
                            </span>
                        ))
                    }
                </div>
            </div>
            {
                showModalTags && (
                    <ModalContainer>
                        <SelectTagsModal 
                            tagsArticle={articleTags}
                            setShowModalTags={ setShowModalTags }
                            onAddTags = { onSetTags }
                        />
                    </ModalContainer>
                )
            }
        </>
    )
}
