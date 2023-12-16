// Text editor component for creating/editing blog posts

import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import Youtube from '@tiptap/extension-youtube';
import { DateTime } from 'luxon';
import { ErrorProvider } from '../../context/ErrorProvider';
import ImageResize from '../ImageResize';
import PostEditorTextMenu from './PostEditorTextMenu';
import PostEditorSaveMenu from './PostEditorSaveMenu';

import useAxiosPrivate from '../../hooks/useAxiosPrivate';

const PostEditor = () => {

    const axiosPrivate = useAxiosPrivate();

    
    const location = useLocation();

    const [post, setPost] =  useState(location?.state ? location.state.post : null)
    const [title, setTitle] = useState(location?.state ? location.state.post.title : '');
    const [loaded, setLoaded] = useState(false);
    const [loading, setLoading] = useState(false);
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
                controls: true,
                enableIFrameApi: 'true',
                origin: process.env.REACT_APP_URL ? process.env.REACT_APP_URL : 'http://localhost:3000'
            }),
        ],
        content: post ? post.draft : 'This is where we write things...',
    });

    useEffect(() => {
        if (!post) return;
        if (!loaded) {
            return setLoaded(true);
        }
        setMsg('saved...')
    }, [post, setMsg])

    useEffect(() => {
        if (!msg) return;
        setTimeout(() => {
            setMsg()
        }, 5000);      
    }, [msg])

    const toggleLoading = () => {
        setLoading((prev) => !prev);
    };

    const saveRequest = async() => {
        console.log('calling...')
        // const controller = new AbortController();
        try {
            const response = (post?._id)
                ? await axiosPrivate.put(`/post/${post._id}`, JSON.stringify({title, draft: editor.getHTML()}))
                : await axiosPrivate.post('/post', JSON.stringify({title, draft: editor.getHTML()}));
            return {
                status: response.status,
                data: response.data
            }
        } catch (err) {
            if (!err.response) {
                return {
                    status: 500,
                    error: ['No server response'],
                }
            } else {
                return {
                    status: err.response.status,
                    error: err.response.data?.message || [err.response.data] 
                }
            }
        }
    }
       

    return (
        <section className="editor-area">
            <ErrorProvider>
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
                            <PostEditorTextMenu 
                                editor={editor}
                                loading={loading}
                            />
                            <EditorContent editor={editor} />
                            <PostEditorSaveMenu
                                editor={editor}
                                loading={loading}
                                post={post}
                                setPost={setPost}
                                title={title}
                                toggleLoading={toggleLoading}
                                save={saveRequest}
                            />
                        </div>
                        <ul className='editor-msg-list'>{msg}</ul>
                    </form>
            </ErrorProvider>
        </section>
    )
};

export default PostEditor;
