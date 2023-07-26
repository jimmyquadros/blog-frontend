import React, { useState, useCallback, useEffect } from 'react';
import { EditorContent, useEditor } from '@tiptap/react';
import { DateTime } from 'luxon';
import useAxiosPrivate from '../hooks/useAxiosPrivate';
import Modal from './Modal';
import AddMedia from './AddMedia';
import AddImage from './AddImage';
import ImageResize from './ImageResize';
import Spinner from './Spinner';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import Image from '@tiptap/extension-image';
import Youtube from '@tiptap/extension-youtube';
import PostEditorTextMenu from './PostEditorTextMenu';
import PostEditorSaveMenu from './PostEditorSaveMenu';
import { useLocation } from 'react-router-dom';

const PostEditor = () => {

    const location = useLocation();
    const [post, setPost] =  useState(location?.state ? location.state.post : null)
    const [title, setTitle] = useState(location?.state ? location.state.post.title : '');

    const [errMsg, setErrMsg] = useState([]);
    const [loading, setLoading] = useState(false);
    const [saveMsg, setSaveMsg] = useState();
    const [modalContent, setModalContent] = useState();

    const axiosPrivate = useAxiosPrivate();

    const editor = useEditor({
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
        setErrMsg([]);
    }, [])

    useEffect(() => {
            if (saveMsg) {
            setTimeout(() => {
                setSaveMsg()
            }, 3000);
        }
    }, [saveMsg])

    const toggleLoading = () => {
        setLoading((prev) => !prev);
    };

    const clearModal = (e) => {
        if (e) e.preventDefault();
        setModalContent();
    }

    const handleErr = (err) => {
        setErrMsg(err);
        setTimeout(() => {
            setErrMsg([])
        }, 10000);
    }

    const handleSaveMsg = () => [
        setSaveMsg('saved...')
    ]

    const handleSetPost = (post) => {
        setPost(post);
    }

    const setImageModal = () => {
        setModalContent(<AddImage editor={editor} close={clearModal} />)
    }

    const setYouTubeModal = () => {
        setModalContent(<AddMedia editor={editor} close={clearModal}/>)
    }

    const handleDeleteModal = () => {
        const content = (
            <div className='modal-content'>
                <span>Delete this post?</span>
                <div className='form-submit-right'>
                    <button type='button'>Delete</button>
                    <button type='button' onClick={clearModal}>Cancel</button>
                </div>
            </div>
        )
        setModalContent(content);
    }

    const handlePublishModal = () => {
        const content = (
            <div className='modal-content'>
                <span>{post?.pub ? 'Unpublish' : 'Publish'} this post?</span>
                <p>{`(note: this will save)`}</p>
                <div className='form-submit-right'>
                    <button 
                        type='button' 
                        onClick={async (e) => {
                            setModalContent(<Spinner />)
                            const content = editor.getHTML();
                            await handleSave({ title, draft: content, pub: content });
                            clearModal();
                        }
                    }>{post?.pub ? 'Update publish' : 'Publish'}</button>
                    <button 
                        type='button' 
                        disabled={post?.pub ? false: true}
                        onClick={async (e) => {
                            setModalContent(<Spinner />);
                            await handleSave({pub: false});
                            clearModal();
                        }}
                    >Unpublish</button>
                    <button type='button' onClick={clearModal}>Cancel</button>
                </div>
            </div>
        )
        setModalContent(content);
    }

    const handleSave = async (data) => {
        toggleLoading();
        const response = await handleSaveRequest(data ? data : {title, draft: editor.getHTML()});
        if (response) setPost(response);
        toggleLoading();
        return response;
    }

    const handleSaveRequest = async (data) => {
        if (title === '') { 
            handleErr(['Post requires title']);
            return;
        }
        try {
            const response = (post?._id)
                ? await axiosPrivate.put(`/post/${post._id}`, JSON.stringify(data))
                : await axiosPrivate.post('/post', JSON.stringify(data));
            return response.data;
        } catch (err) {
            if (!err?.response) {
                handleErr(['No Server Response']);
            } else {
                handleErr(err.response.data?.message || [err.response.data]);
            }
            return false;
        }
    }

    const handleRevertModal = () => {
        const content = (
            <div className='modal-content'>
                <span>{`Revert to...`}</span>
                <p>{`(note: this will not save)`}</p>
                <div className='form-submit-col'>
                    <button type='button' 
                        onClick={() => {
                            editor.commands.setContent(post.draft)
                            clearModal();
                        }} 
                        disabled={(post) ? false : true}>Saved Draft</button>
                    <button type='button' 
                        onClick={() => {
                            editor.commands.setContent(post.pub)
                            clearModal();
                        }} 
                        disabled={(post?.pub) ? false : true }>Published</button>
                    <button type='button' onClick={clearModal}>Cancel</button>
                </div>
            </div>
        )
        setModalContent(content)
    }

    

    return (
        <section className="editor-area">
            
            <ul className='error-list'>
                {errMsg.map((e, i) => (<li key={i}>{e}</li>))}
            </ul>
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
                        setImageModal={setImageModal} 
                        setYouTubeModal={setYouTubeModal} 
                    />
                    <EditorContent editor={editor} />
                    <PostEditorSaveMenu
                        loading={loading}
                        save={handleSave}
                        modal={{
                            delete: handleDeleteModal,
                            publish: handlePublishModal,
                            revert: handleRevertModal,
                        }}
                    />
                </div>
                <div className='editor-saved'>{saveMsg ? (saveMsg) : (<></>)}</div>
            </form>
            
        </section>
    )
};

export default PostEditor;