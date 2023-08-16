import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import Youtube from '@tiptap/extension-youtube';
import { DateTime } from 'luxon';
import ImageResize from '../ImageResize';
import Modal from '../Modal';
import PostEditorTextMenu from './PostEditorTextMenu';
import PostEditorSaveMenu from './PostEditorSaveMenu';
import { useDeleteRequest, useSaveRequest } from '../../api/postRequest.js';


const PostEditor = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [post, setPost] =  useState(location?.state ? location.state.post : null)
    const [title, setTitle] = useState(location?.state ? location.state.post.title : '');
    const [loading, setLoading] = useState(false);
    const [modalContent, setModalContent] = useState();
    const [msg, setMsg] = useState();

    const editor = useEditor({
        editorProps: {
            attributes: {
                class: 'editor-post'
            }
        },
        extensions: [
            StarterKit,
            Underline,
            ImageResize,
            Youtube.configure({
                controls: false,
            }),
        ],
        content: post ? post.draft : 'This is where we write things...',
    });

    useEffect(() => {
        if (!msg) return;
        setTimeout(() => {
            setMsg()
        }, 5000);      
    }, [msg])

    const clearModal = () => {
        setModalContent();
    }

    const toggleLoading = () => {
        setLoading((prev) => !prev);
    };

    const deleteRequest = useDeleteRequest();
    const handleDelete = async () => {
        toggleLoading();
        const response = await deleteRequest(post?._id);
        if (response.status === 204) {
            return navigate('/admin', { replace: true });
        }
        toggleLoading();
        clearModal();
        return setMsg(response.error.map((e, i) => (<li key={`err${i}`} className='editor-msg-err'>{e}</li>)))
    }

    const saveRequest = useSaveRequest();
    const handleSaveRequest = async (data) => {

        toggleLoading();
        const response = await saveRequest(data, post?._id);
        if (response.status === 200 || 201) { 
            setPost(response.data)
            setMsg((<li key={'ok'} className='editor-msg-ok'>Saved...</li>))
        }
        else {
            const err = response.error.map((e, i) => (<li key={`err${i}`} className='editor-msg-err'>{e}</li>))
            setMsg(err);
        }
        toggleLoading();
    }

    const handlePublish = () => {
        if (title === '') return setMsg((<li key={'err0'} className='editor-msg-err'>Post requires a title.</li>))
        const content = editor.getHTML();
        return handleSaveRequest({ title, draft: content, pub: content });
    }

    const handleUnPublish = () => {
        return handleSaveRequest({ pub: false });
    }

    const handleSave = () => {
        if (title === '') return setMsg((<li key={'err0'} className='editor-msg-err'>Post requires a title.</li>))
        return handleSaveRequest({title, draft: editor.getHTML()})
    }

    return (
        <section className="editor-area">
            <form action="" className="editor-form">
                {(post) ? (
                    <div className='editor-info'>
                        <div className='editor-info-item'>
                            <span className='editor-info-label'>Post: </span>
                            <span className='editor-info-data'>{post.title}</span>
                        </div>
                        <div className='editor-info-item'>
                            <span className='editor-info-label'>Upated: </span>
                            <span className='editor-info-data'>{DateTime.fromISO(post.updatedAt).toLocaleString(DateTime.DATETIME_MED)}</span>
                        </div>
                        <div className='editor-info-item'>
                            <span className='editor-info-label'>Published: </span>
                            <span className='editor-info-data'>{post.pub ? 'Yes' : 'No'}</span>
                        </div>
                    </div>
                ) : (
                    <div className='editor-info'>
                        <span>Unsaved Post</span>
                    </div>
                )}
                <div className="flex gap-min">
                    <label htmlFor="title">Title </label>
                    <input 
                        type="text" 
                        name="title" 
                        id="title"
                        disabled={loading} 
                        value={title}
                        autoComplete="off"
                        onChange={(e) => setTitle(e.target.value)} />
                </div>
                <div className="editor-container">
                    <Modal content={modalContent} close={clearModal} editor={editor} />
                    <PostEditorTextMenu 
                        editor={editor}
                        loading={loading}
                        modalClose={clearModal}
                        modalSet={setModalContent}
                    />
                    <EditorContent editor={editor} />
                    <PostEditorSaveMenu
                        clear={clearModal}
                        deletePost={handleDelete}
                        loading={loading}
                        editor={editor}
                        post={post}
                        publish={handlePublish}
                        save={handleSave}
                        unpub={handleUnPublish}
                        modal={setModalContent}
                    />
                </div>
                <ul className='editor-msg-list'>{msg}</ul>
            </form>
            
        </section>
    )
};

export default PostEditor;