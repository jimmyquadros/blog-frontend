// Text editor for comment posts

import { useState } from 'react';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import axios from '../../api/axios';
import useAuth from '../../hooks/useAuth';
import useAxiosPrivate from '../../hooks/useAxiosPrivate';
import useModal from '../../hooks/useModal';
import TourModal from '../TourModal';
import Spinner from '../Spinner';
import useError from '../../hooks/useError';

const CommentEditor = ({ cancel, edit, id, parent, addReply }) => {
    const axiosPrivate = useAxiosPrivate();
    const { auth } = useAuth();
    const { setErr } = useError();
    const { setModal } = useModal();

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

    const handleEdit = async () => {
        setErr([]);
        if (auth?.roles?.includes(1000)) return setModal(<TourModal />);
        toggleLoading()
        const data = { content: editor.getHTML() };
        try {
            const updatedComment = await axiosPrivate.put(`/comment/${id}`, data);
            edit.update(updatedComment.data);
            return cancel();
        } catch (err) {
            toggleLoading();
            if (!err.response) return setErr(['An Error Occured']);
            return setErr(err.response.data.message)
        }
    }

    const handlePost = async () => {
        setErr([]);
        if (auth?.roles?.includes(1000)) return setModal(<TourModal />);
        toggleLoading()
        const data = { content: editor.getHTML() };
        try {
            data.root = id;
            if (parent) data.parent = parent;
            await axiosPrivate.post(`/comment/`, data);
            const response = await axios.get(parent ? `/comment/${parent}` : `/post/comments/${id}`);
            const comments = parent ? response.data[0].children : response.data
            addReply(comments);
            if (cancel) return cancel()
            else {
                toggleLoading();
                editor.commands.setContent('');
            }
        } catch (err) {
            // console.log('err in handlepost')
            toggleLoading();
            if (!err.response) return setErr(['An Error Occured']);
            return setErr(err.response.data.message)
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
                                onClick={() => handleEdit()}>Update</button>
                        ) : (
                            <button
                                type='button'
                                onClick={() => handlePost()}>Post</button>
                        )}
                        {cancel ? (
                            <button type='button' onClick={() => cancel()}>Cancel</button>
                        ) : (<></>)}
                    </div>
                </div>
            )}
        </div>
    )
}

export default CommentEditor;
