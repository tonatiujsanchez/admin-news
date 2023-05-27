import { FC } from "react"
import { ITag } from "../../../interfaces"


interface Props {
    tag: ITag,
    tagsArticle: ITag[]
    onToggleSelectedTag: (tag: ITag) => void
}

export const SelectTagsModalItem: FC<Props> = ({ tag, tagsArticle, onToggleSelectedTag }) => {
    
    return (
        <button
            type="button"
            onClick={()=> onToggleSelectedTag(tag) }
            className={`border border-sky-700 text-xl py-2 px-5 rounded-md ${ tagsArticle.some( tagArticle => tagArticle._id === tag._id ) ? 'bg-sky-400 text-white' : 'text-sky-900' }`}
        >
            {tag.title}
        </button>
    )
}
