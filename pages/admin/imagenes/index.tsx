import { ChangeEvent, Fragment, useEffect, useRef, useState } from 'react'
import { NextPage } from 'next'

import { useAuth, useData } from '../../../hooks'

import { LayoutAdmin } from '../../../components/layouts'
import { ImageList } from '../../../components/admin/images'
import { TitlePage } from '../../../components/admin/ui'
import { LoadingAdmin, LoadingCircle } from '../../../components/admin/utilities'

import { IImage, ISectionImage } from '../../../interfaces'
import { notifyError, notifySuccess } from '../../../utils/frontend'



interface IButtonsNav {
    title: string,
    id: ISectionImage
}

const buttonsNav:IButtonsNav[] = [
    {
        title: 'Artículos',
        id: 'articles'
    },
    {
        title: 'Autores',
        id: 'authors'
    },
    {
        title: 'Perfil',
        id: 'users'
    },
]

const section_active_storage = 'images_section_active_ed4c1de1770480153a06fa2349f501f0'

const ImagenesPage: NextPage = () => {

    const [loading, setLoading] = useState(false)
    const [loadingUploadImages, setLoadingUploadImages] = useState(false)

    const [sectionActive, setSectionActive] = useState<ISectionImage>()
    const [actualPage, setActualPage] = useState<number>(0)
    const [imagesList, setImagesList] = useState<IImage[]>([])

    const [files, setFiles] = useState<FileList | null>(null)
    const fileInputRef = useRef<HTMLInputElement>(null)

    const { user } = useAuth()
    const { refreshImages, addNewImage, images } = useData()


    // Load images
    const loadImages = async () => {

        setFiles(null)

        setLoading(true)
        const { hasError, imagesResp } = await refreshImages(sectionActive as string, actualPage)
        setLoading(false)

        if(hasError){
            setImagesList([])
            return
        }

        setImagesList(imagesResp)
    }

    useEffect(()=>{
        const imagesSectionActive = localStorage.getItem(section_active_storage) || buttonsNav[0].id
        const imagesPageActive = Number(localStorage.getItem(`section_page_storage_${imagesSectionActive}_ed4c1de1770480153a06fa2349f501f0`)) || 0

        if(imagesSectionActive === 'authors' && user?.role !== 'admin'){
            setSectionActive(buttonsNav[0].id)
            setActualPage(0)
        } else {
            setSectionActive(imagesSectionActive as ISectionImage)
            setActualPage(imagesPageActive)
        }
    },[])

    useEffect(() => {
        if(!sectionActive || (!actualPage && actualPage !== 0)){ return }
        
        if (images[sectionActive].data.length <= 0) {
            loadImages()
        } else {
            setImagesList(images[sectionActive].data)
            localStorage.setItem(section_active_storage, sectionActive)
            localStorage.setItem(`section_page_storage_${sectionActive}_ed4c1de1770480153a06fa2349f501f0`, String( actualPage ) )
    
        }
    }, [sectionActive, images])


    // Change images
    const updateSection = ( section:ISectionImage ) => {
        setSectionActive(section)
        const imagesPageActive = Number(localStorage.getItem(`section_page_storage_${section}_ed4c1de1770480153a06fa2349f501f0`)) || 0
        setActualPage(imagesPageActive)
    }


    // TODO: Upload images
    const handleFilesChange = ({ target }:ChangeEvent<HTMLInputElement>) => {

        if (!target.files || target.files.length === 0) {
            setFiles(null)
            return
        }

        setFiles(target.files as FileList)
    }


    const uploadImages = async () => {

        if (!files) {
            return notifyError('No hay archivos seleccionados para subir')
        }

        setLoadingUploadImages(true)

        const imagesFormData = Array.from(files)

        // TODO:
        const imagesFormDataFns = imagesFormData.map( file => {
            const formData = new FormData()
            formData.append('file', file)
            formData.append('section', sectionActive as ISectionImage)

            return addNewImage(formData)
        })
        
        setLoadingUploadImages(false)
        // try {
        //     await Promise.all(imagesFormData)
        //     setFiles(null)
        //     setLoadingUploadImages(false)
        //     fileInputRef.current!.value = ''
        //     notifySuccess('Imagenes subidas correctamente')

        // } catch (error) {

        //     setFiles(null)
        //     setLoadingUploadImages(false)
        //     fileInputRef.current!.value = ''
        //     notifyError('Hubo un error al intentar subir la imagen')
        // }

    }




    return (
        <LayoutAdmin title={'- Categorías'} isMain={true}>
            <div className="mb-5 sm:mb-0 flex gap-2 items-center py-3">
                <TitlePage title="Imagenes" />
                <button
                    className="text-3xl text-slate-600 hover:bg-slate-200 hover:text-slate-900 py-2 px-3 rounded-full active:scale-95"
                    onClick={() => loadImages()}
                >
                    <i className='bx bx-revision'></i>
                </button>
            </div>
            {
                loading
                ? (
                    <div className="flex justify-center mt-96">
                        <LoadingAdmin />
                    </div>
                ):(
                    <section>
                        <div className="mb-5">
                            <input
                                type="file"
                                disabled={loadingUploadImages}
                                ref={fileInputRef}
                                accept="image/png, image/jpg, image/jpeg, image/gif, image/webp"
                                multiple
                                onChange={handleFilesChange}
                            />
                        </div>
                        <div className="w-full mb-5 flex flex-col gap-5 sm:flex-row sm:justify-between">
                            <div>
                                <button
                                    className={`bg-sky-500 hover:bg-sky-600 px-8 py-5 font-semibold rounded-md color-admin w-full sm:w-auto ml-auto flex justify-center min-w-[200px] gap-1 ${ loadingUploadImages ? 'disabled:bg-sky-400' : 'disabled:bg-sky-200' }`}
                                    onClick={uploadImages}
                                    disabled={!files || loadingUploadImages}
                                >
                                    {
                                        loadingUploadImages
                                            ? <>
                                                <LoadingCircle />
                                                <span className="ml-2">Subiendo...</span>
                                            </>
                                            : <>
                                                <i className='bx bx-plus text-4xl'></i>
                                                Subir imagenes
                                            </>
                                    }
                                </button>
                            </div>
                            <div className="flex items-center justify-center gap-2 lg:gap-5">
                                {   user &&
                                    buttonsNav.map(btn => {

                                        if(user.role !== 'admin' && btn.id === 'authors'){
                                            return <Fragment key={btn.id}></Fragment>
                                        }

                                        return (
                                            <button
                                                key={btn.id}
                                                disabled={loadingUploadImages}
                                                onClick={() => updateSection(btn.id)}
                                                className={`${sectionActive === btn.id ? 'bg-slate-100 shadow-md border-b-4 border-b-sky-500' : 'border-b-4 bg-white'} rounded-lg py-3 px-6 sm:px-10 lg:px-16 font-semibold border flex-1 hover:bg-slate-100 disabled:opacity-50 hover:disabled:bg-white`}
                                            >
                                                {btn.title}
                                            </button>
                                        )
                                    })
                                }
                            </div>
                        </div>

                        <div className="py-10 relative">
                            <ImageList images={imagesList} />
                            
                            {
                                loadingUploadImages &&
                                <div className="bg-admin absolute left-0 right-0 top-0 bottom-0 flex justify-center py-80 opacity-95">
                                    <LoadingAdmin/>
                                </div>
                            }
                            
                        </div>

                    </section>
                )
            }
        </LayoutAdmin>
    )
}

export default ImagenesPage