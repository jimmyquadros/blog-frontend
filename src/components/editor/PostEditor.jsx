import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import Youtube from '@tiptap/extension-youtube';
import { DateTime } from 'luxon';
import ImageResize from '../ImageResize';
import PostEditorTextMenu from './PostEditorTextMenu';
import PostEditorSaveMenu from './PostEditorSaveMenu';


const PostEditor = () => {
    const location = useLocation();
    const [post, setPost] =  useState(location?.state ? location.state.post : null)
    const [title, setTitle] = useState(location?.state ? location.state.post.title : '');
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
        if (!msg) return;
        setTimeout(() => {
            setMsg()
        }, 5000);      
    }, [msg])

    const toggleLoading = () => {
        setLoading((prev) => !prev);
    };

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
                    <PostEditorTextMenu 
                        editor={editor}
                        loading={loading}
                    />
                    <EditorContent editor={editor} />
                    <PostEditorSaveMenu
                        
                        editor={editor}
                        loading={loading}
                        post={post}
                        setMsg={setMsg}
                        setPost={setPost}
                        title={title}
                        toggleLoading={toggleLoading}

                    />
                </div>
                <ul className='editor-msg-list'>{msg}</ul>
            </form>
            
        </section>
    )
};

export default PostEditor;