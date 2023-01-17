import { FC, useEffect, useState } from 'react';

import styled from '@emotion/styled';

import { useQuill } from 'react-quilljs'
import 'quill/dist/quill.snow.css'

import { ImagesSelectModal } from "./ImagesSelectModal"
import { ModalContainer } from './ModalContainer';


const modules = {
    toolbar: '#toolbar'
};

const formats = [
    'header',
    'bold', 'italic', 'underline', 'strike', 'size',
    'color', 'background',
    'align',
    'list', 'list',
    'image', 'link', "code-block", "code", "video", "blockquote", "script", "indent", "direction", "clean"
];

const colors = ['#000055', '#FF7600', '#222222', '#18222b', '#238633', '#0284c7']


interface Props {
    placeholder: string,
    onEditorChange: (html: string) => void, 
    content: string, 
    label  : string
    error? : boolean
    labelError?: string
    processing?: boolean
}

export const QuillEditor:FC<Props> = ({ 
    placeholder, 
    onEditorChange, 
    content, 
    label="Contenido", 
    error=false, 
    labelError="Este campo es requerido" ,
    processing=false
}) => {

    const [showImagesModal, setShowImagesModal] = useState(false)
    const [positionEditor, setPositionEditor] = useState<number>()
    const { quill, quillRef } = useQuill({ modules, formats, placeholder })
    

    const insertToEditor = (url:string) => {

        if( !positionEditor ){ return }

        quill?.insertEmbed((positionEditor - 1), 'image', url)
    }

    useEffect(()=>{
        if(content){
            if (quill) {
                quill.clipboard.dangerouslyPasteHTML(content)
            }
        }
    },[quill])
    

    useEffect(() => {
        if (quill) {
            quill.getModule('toolbar').addHandler('image', openImagesModal)
        }
    }, [quill])


    useEffect(() => {
        if (quill) {
            quill.on('text-change', (delta, oldDelta, source) => {
                //console.log(quill.getText()); // Get text only
                // console.log(quill.getContents()); // Get delta contents
                // console.log(quill.root.innerHTML); // Get innerHTML using quill
                if(quill.getText().trim() === ''){
                    onEditorChange('')
                }else {
                    onEditorChange(quill.root.innerHTML)
                }     
                // console.log(quill.root); // Get innerHTML using quill
            })
        }
    }, [quill])

    useEffect(()=>{

        quill?.enable(!processing)

    },[quill, processing])


    const hiddenImagesModal = () => {

        setPositionEditor(undefined)
        setShowImagesModal(false)
    }

    const openImagesModal = () => {

        if( !quill ){ return }

        const range = quill.getSelection()
        setPositionEditor(range!.index)

        setShowImagesModal(true)
    }

    const handleSelectedImage = async ( fnSelectedImage:()=> Promise<string | undefined> ) => {

        const image = await fnSelectedImage()

        if (image) {
            insertToEditor(image)
        }

        hiddenImagesModal()
    }

    const handleCustomButton = () => {
        console.log('Click custom buttom on editon');
       
    }

    // TODO: Insertar videos de facebook y otras redes sociales. 

    return (
        <>
            <p className="mb-2 block font-bold text-slate-800">{ label }</p>
            <EditorContent className={`pb-52 sm:pb-24 mb-3 ${ processing ? 'opacity-75' : error ? 'outline outline-2 outline-red-500' : 'hover:border-slate-800' }`}>
                <div id="toolbar">
                    <select className="ql-header" defaultValue={""} onChange={e => e.persist()}>
                        <option value="2" >Título 2</option>
                        <option value="3" >Título 3</option>
                        <option value="4" >Título 4</option>
                        <option value="" >Parrafo</option>
                    </select>
                    <button className="ql-bold" />
                    <button className="ql-italic" />
                    <button className="ql-underline" />
                    <button className="ql-strike" />

                    <select className="ql-size" defaultValue={""} onChange={e => e.persist()}>
                        <option value="small">Pequeño</option>
                        <option value="">Normal</option>
                        <option value="large">Grande</option>
                        <option value="huge">Ext grande</option>
                    </select>

                    <select className="ql-color" defaultValue={"black"} onChange={e => e.persist()}>
                        <option value="black" />
                        <option value="white" />
                        {
                            colors.map( color => (<option key={color} value={color} />) )
                        }
                    </select>
                    <select className="ql-background" defaultValue={"black"} onChange={e => e.persist()}>
                        <option value="black" />
                        <option value="white" />
                        {
                            colors.map( color => (<option key={color} value={color} />) )
                        }
                    </select>

                    <select className="ql-align" defaultValue={""} onChange={e => e.persist()}>
                        <option value="" />
                        <option value="center" />
                        <option value="right" />
                        <option value="justify" />
                    </select>

                    <button className="ql-list" value="bullet" />
                    <button className="ql-list" value="ordered" />
  
                    <button className="ql-image" disabled={ processing }/>
                    <button className="ql-video" disabled={ processing } />

                    <button className="ql-link" />
                    <button className="ql-code-block bx bx-code-block" />
                    <button className="ql-code" />
                    <button className="ql-blockquote" />

                    <button className="ql-script" value="sub" />
                    <button className="ql-script" value="super" />

                    <button className="ql-indent" value="+1" />
                    <button className="ql-indent" value="-1" />

                    <button className="ql-direction" value="rtl" />

                    <button className="ql-clean bx bx-eraser text-3xl"></button>
                    
                    <button type='button' id="custom-button" onClick={handleCustomButton}>
                        <i className='bx bxl-react'></i>
                    </button>

                </div>
                <div ref={quillRef} />
            </EditorContent>
            {
                error &&
                <p className="text-xl text-red-600 mt-2">{labelError}</p>
            }

            {
                showImagesModal && (
                    <ModalContainer heightFull={true} widthLg={true}>
                        <ImagesSelectModal
                            sectionImages="articles" 
                            handleSelectedImage={handleSelectedImage}
                        />
                    </ModalContainer>
                )
            }

        </>
    )
}


const EditorContent = styled.div`
    width: 100%;
    height: 80rem;
    border-radius: 0.8rem;
    border: 1.5px solid rgba(229, 231, 235, 1);

    .ql-toolbar {
        border-radius: 0.8rem;
        border: none;
        border-bottom: 1.5px solid rgba(229, 231, 235, 1);
        background-color: rgb(250, 250, 255);
        padding-top: 1.2rem;
        padding-bottom: 1.2rem;
    }

    .ql-container{
        border: none;
        font-size: 1.6rem;
    }
    
    .ql-editor{
        line-height: 2.5rem;
        h2, h3, h4, h5, h6 {
            font-weight: bold;
        }
    }

    .ql-editor::-webkit-scrollbar {
        -webkit-appearance: none;
    }

    .ql-editor::-webkit-scrollbar:vertical {
        width:8px;
    }

    .ql-editor::-webkit-scrollbar-button:increment,.contenedor::-webkit-scrollbar-button {
        display: none;
    } 

    .ql-editor::-webkit-scrollbar:horizontal {
        height: 8px;
    }

    .ql-editor::-webkit-scrollbar-thumb {
        background-color: #dbdbdb;
        border-radius: 20px;
        border: 2px solid #f1f2f3;
    }

    .ql-editor::-webkit-scrollbar-track {
        border-radius: 8px;  
    }


    .ql-toolbar button.ql-code-block svg {
        display: none;
    }
    .ql-toolbar button.ql-clean svg {
        display: none;
    }
`