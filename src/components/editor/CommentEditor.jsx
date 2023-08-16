import { useState } from 'react';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import useAxiosPrivate from '../../hooks/useAxiosPrivate';
import Spinner from '../Spinner';

const CommentEditor = ({ cancel, edit, id, parent, addReply }) => {
    const axiosPrivate = useAxiosPrivate();
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
        try {
            if (edit) {
                const updatedComment = await axiosPrivate.put(`/comment/${id}`, data);
                edit.update(updatedComment.data.content);
                cancel();
            } else {
                data.root = id;
                if (parent) data.parent = parent;
                const postedComment = await axiosPrivate.post(`/comment/`, data);
                addReply(postedComment.data);
                if (cancel) cancel()
                else {
                    toggleLoading();
                    editor.commands.setContent('');
                }
            }
        } catch (err) {
            toggleLoading();
            console.error(err);
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