import { FC, useEffect } from 'react';

import styled from '@emotion/styled';

import { useQuill } from 'react-quilljs'
import 'quill/dist/quill.snow.css'


const modules = {
    toolbar: '#toolbarLite',
};

const formats = [
    'bold', 'italic', 'underline', 'strike',
    'color', 'background',
    'align',
    'list', 'list',
    'link', "code", "blockquote", "indent", "clean"
];

const colors = ['#000055', '#FF7600', '#222222', '#18222b', '#238633', '#0284c7']

interface Props {
    placeholder: string,
    onEditorChange: (html: string) => void, 
    content?: string, 
    label: string
}

export const QuillEditorLite:FC<Props> = ({ placeholder, onEditorChange, content, label="Descripción" }) => {

    const { quill , quillRef } = useQuill({modules, formats, placeholder })
       

    
    useEffect(()=>{
        if(content){
            if (quill) {
                quill.clipboard.dangerouslyPasteHTML(content);
            }
        }
    },[quill])

    
    useEffect(() => {
        if (quill) {
            quill.on('text-change', (delta, oldDelta, source) => {
               
                if(quill.getText().trim() === ''){
                    onEditorChange('')
                }else {
                    onEditorChange(quill.root.innerHTML)
                }              
            })
        }
    }, [quill])


    return (
        <>
            <p className="mb-2 block font-bold text-slate-800">{ label }</p>
            <EditorContent className='pb-32 sm:pb-24'>
                <div id="toolbarLite">
                    <button className="ql-bold" />
                    <button className="ql-italic" />
                    <button className="ql-underline" />
                    <button className="ql-strike" />

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

                    <button className="ql-link" />
                    <button className="ql-code" />
                    <button className="ql-blockquote" />

                    <button className="ql-indent" value="+1" />
                    <button className="ql-indent" value="-1" />

                    <button className="ql-clean bx bx-eraser text-3xl"></button>

                </div>
                <div ref={quillRef} />
            </EditorContent>
        </>
    )
}


const EditorContent = styled.div`
    width: 100%;
    height: 28rem;
    border-radius: 0.8rem;
    border: 1.5px solid rgba(229, 231, 235, 1);

    &:hover {
        border: 1.5px solid #333;
	}

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

    
    .ql-toolbar button.ql-clean svg {
        display: none;
    }
`