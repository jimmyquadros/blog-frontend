import { useState } from 'react';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import useAxiosPrivate from '../../hooks/useAxiosPrivate';
import Spinner from '../Spinner';
import useError from '../../hooks/useError';

import axios from '../../api/axios'; 


const CommentEditor = ({ cancel, edit, id, parent, addReply }) => {
    const axiosPrivate = useAxiosPrivate();
    const { setErr } = useError();
    const [loading, setLoading] = useState(false);

    const toggleLoading = () => {
        setLoading(prev => !prev);
    };

    const editor = useEditor({
        editorProps: {
            attributes: {
                class: 'editor-comment'
            }
        },
        extensions: [
            StarterKit,
        ],
        content: edit ? edit.content : '',
    });

    const handlePost = async () => {
        toggleLoading()
        const data = { content: editor.getHTML() };
        if (edit) {
            try {
                const updatedComment = await axiosPrivate.put(`/comment/${id}`, data);
                edit.update(updatedComment.data);
                cancel();
            } catch (err) {
                toggleLoading();
                if (!err.response) return setErr(['An Error Occured']);
                return setErr(err.response.data.message)
            }
        } else {
            try {
                data.root = id;
                if (parent) data.parent = parent;
                await axiosPrivate.post(`/comment/`, data);
                const comments = await axios.get(parent ? `/comment/${parent}` : `/post/comments/${id}`);
                addReply(parent ? comments.data[0].children : comments.data);
                if (cancel) cancel()
                else {
                    toggleLoading();
                    editor.commands.setContent('');
                }
            } catch (err) {
                toggleLoading();
                if (!err.response) return setErr(['An Error Occured']);
                return setErr(err.response.data.message)
            }
        }
    }

    return (
        <div className='editor-comment-box'>
            {loading ? (<div className='spin-box'><Spinner /></div>) : (
                <div>
                    <div className='editor-container'>
                        <EditorContent editor={editor} />
                    </div>
                    <div className='editor-comment-buttons'>
                        {edit ? (
                            <button
                                type='button'
                                onClick={handlePost}>Update</button>
                        ) : (
                            <button
                                type='button'
                                onClick={handlePost}>Post</button>
                        )}
                        {cancel ? (
                            <button type='button' onClick={cancel}>Cancel</button>
                        ) : (<></>)}
                    </div>
                </div>
            )}
        </div>
    )
}

export default CommentEditor;