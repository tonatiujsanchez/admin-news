import { Dispatch, FC, SetStateAction, useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useData } from '../../../hooks';
import { ITag } from "../../../interfaces"
import { LoadingAdmin, LoadingCircle } from '../utilities';
import { SelectTagsModalItem } from './SelectTagsModalItem';



interface Props {
    tagsArticle: ITag[]
    onAddTags: ( tags:ITag[] )=> void
    setShowModalTags: Dispatch<SetStateAction<boolean>>

}

export const SelectTagsModal: FC<Props> = ({ tagsArticle, onAddTags, setShowModalTags }) => {

    const [loading, setLoading] = useState(false)
    const [loadingAddTag, setLoadingAddTag] = useState(false)

    const [titleTag, setTitleTag] = useState('')

    const [tagSelectedList, setTagSelectedList] = useState<ITag[]>([])


    const { tags, refreshTags, addNewTag } = useData()


    const loadTags = async () => {
        setLoading(true)
        await refreshTags()
        setLoading(false)
    }

    useEffect(() => {
        if( tags.length === 0 ){
            loadTags()
        } 
    }, [])

    useEffect(()=> {
        setTagSelectedList([...tagsArticle])
    },[])
    

    const handleToggleSelectedTag = ( tag: ITag ) => {
        
        const existTag = tagSelectedList.find( tagState => tagState._id === tag._id )
        
        if(existTag){
            setTagSelectedList( tagSelectedList.filter( tagState => tagState._id !== tag._id ) )            
        }else {
            setTagSelectedList( [...tagSelectedList, tag] )
        }

    }

    const handleAddTags = () => {
        onAddTags(tagSelectedList)
        setShowModalTags( false )
    }    

    const handleAddTag = async() => {

        if( titleTag.trim() === '' ){ return }

        const newTag = { 
            title: titleTag, 
            slug: '',
            active: true
        }

        setLoadingAddTag(true)
        setLoading(true)        
        const { hasError } = await addNewTag( newTag )
        setLoadingAddTag(false)
        setLoading(false)

        if( hasError ) { return }
        
        setTitleTag('')
    }


    return (
        <div className="flex flex-col h-screen sm:max-h-[75vh] md:w-[600px]">
            <header className="relative bg-white z-50 w-full py-3 sm:py-5 px-3 sm:px-5 border-b flex justify-center items-center gap-2">
                <p className="text-3xl font-bold py-3 text-center">Seleccionar etiquetas</p>
                <button
                    type="button"
                    disabled={loading}
                    className={`text-2xl text-slate-600 py-1 px-2 rounded-full mt-1 ${loading ? '' : 'active:scale-95 hover:bg-slate-200 hover:text-slate-900'}`}
                    onClick={ () => loadTags() }
                >
                    <i className='bx bx-revision'></i>
                </button>
                <button
                    type="button"
                    disabled={loading}
                    onClick={() => setShowModalTags(false)}
                    className={`absolute right-5 top-5 rounded-full w-12 h-12 sm:w-14 sm:h-14 text-gray-500 flex items-center justify-center transition-all ${loading ? '' : 'hover:bg-slate-200 hover:text-gray-700'}`}
                >
                    <i className='bx bx-x text-4xl sm:text-5xl'></i>
                </button>
            </header>
            <div className='p-5'>
                <input
                    type="text"
                    id="titleTag"
                    disabled={loading}
                    className={`bg-admin w-full rounded-md flex-1 border px-5 py-4 disabled:border-slate-200 hover:border-slate-800 mb-4`}
                    value={titleTag}
                    onChange={ ({ target })=> setTitleTag( target.value ) }
                />

                <button
                    type="button"
                    className={`bg-sky-500 hover:bg-sky-600 px-8 py-3 font-semibold rounded-md color-admin mt-5 sm:mt-0 sm:w-auto flex justify-center min-w-[200px] gap-1 ${ loading ? 'disabled:bg-sky-200' : 'disabled:bg-sky-200' }`}
                    onClick={handleAddTag}
                    disabled={!titleTag.trim() || loading}
                >
                    {
                        loadingAddTag
                            ? <>
                                <LoadingCircle />
                                <span className="ml-2">Agregando...</span>
                            </>
                            : <>
                                <i className='bx bx-plus text-4xl mr-1'></i>
                                Agregar
                            </>
                    }
                </button>
            </div>
            <div className='flex-1 overflow-y-auto custom-scroll p-5'>
                {
                    loading
                        ? (
                            <div className="h-full flex justify-center items-center">
                                <LoadingAdmin />
                            </div>
                        ):(
                            <div className="flex items-start gap-4 flex-wrap">
                                {
                                    tags.map( tag => (
                                        <SelectTagsModalItem 
                                            key={tag._id}
                                            tag={tag} 
                                            tagsArticle={tagSelectedList}
                                            onToggleSelectedTag={ handleToggleSelectedTag } 
                                        />
                                    ))
                                }
                            </div>
                        )
                }
            </div>
            <div className="bg-white px-5 py-7 sm:py-5 mb-8 sm:mb-0 flex flex-col items-center justify-end gap-4 sm:flex sm:flex-row border-t sm:px-8">
                <button
                    type="button"
                    onClick={() => setShowModalTags(false)}
                    disabled={loading}
                    className="py-4 px-6 border border-gray-300 w-full sm:w-auto rounded-md cursor-pointer transition-colors hover:bg-slate-100 active:scale-95 disabled:scale-100 disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:bg-white"
                >
                    Cancelar
                </button>
                <button
                    type="button"
                    onClick={handleAddTags}
                    disabled={loading}
                    className="bg-sky-500 hover:bg-sky-600 text-white font-semibold py-4 px-8 w-full sm:w-auto rounded-md cursor-pointer transition-colors min-w-[120px] flex justify-center disabled:bg-sky-300 disabled:cursor-not-allowed disabled:hover:bg-sky-300"
                >
                    Aceptar
                </button>
            </div>
        </div>
    )
}
