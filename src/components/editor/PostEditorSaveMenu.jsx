import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFloppyDisk, faTrashCan } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import Spinner from '../Spinner';

import useModal from '../../hooks/useModal';
import { useDeleteRequest, useSaveRequest } from '../../api/postRequest.js';

const PostEditorSaveMenu = ({ editor, loading, post, setMsg, setPost, title, toggleLoading }) => {

    const {setModal} = useModal();
    const deleteRequest = useDeleteRequest();
    const navigate = useNavigate();
    const saveRequest = useSaveRequest();

    

    const handleDeleteModal = () => {
        return setModal((
            <div className='modal-content'>
                <span>Delete this post?</span>
                <div className='form-submit-right'>
                    <button type='button' onClick={ async () => {
                        setModal(<Spinner />);
                        toggleLoading();                
                        await handleDeleteRequest()
                        toggleLoading();
                        setModal();
                    }}>Delete</button>
                        
                    <button type='button' onClick={() => setModal()}>Cancel</button>
                </div>
            </div>
        ))
    }

    const handleDeleteRequest = async () => {
        const response = await deleteRequest(post?._id);
        if (response.status === 204) {
            return navigate('/admin', { replace: true });
        }
        return setMsg(response.error.map((e, i) => (<li key={`err${i}`} className='editor-msg-err'>{e}</li>)))
    }

    const handlePubModal = () => {
        return setModal((
            <div className='modal-content'>
                <span>Publish this post?</span>
                <p>{`(note: this will save)`}</p>
                <div className='form-submit-right'>
                    <button 
                        type='button' 
                        onClick={ async () => {
                            setModal(<Spinner />);
                            const content = editor.getHTML();
                            await handleSaveRequest({ title, draft: content, pub: content })
                            setModal();
                        }}
                    >Publish</button>
                    <button 
                        type='button'
                        disabled={!post?.pub}
                        onClick={ async () => {
                            setModal(<Spinner />)
                            await handleSaveRequest({ pub: false })
                            setModal();
                        }}
                    >Unpublish</button>
                    <button type='button' onClick={() => setModal()}>Cancel</button>
                </div>
            </div>
        ))
    }

    const handleRevertModal = () => {
        return setModal((
            <div className='modal-content'>
                <span>{`Revert to...`}</span>
                <p>{`(note: this will not save)`}</p>
                <div className='form-submit-col'>
                    <button type='button' 
                        onClick={() => {
                            editor.commands.setContent(post.draft)
                            setModal();
                        }} 
                        disabled={(post) ? false : true}>Saved Draft</button>
                    <button type='button' 
                        onClick={() => {
                            editor.commands.setContent(post.pub)
                            setModal();
                        }} 
                        disabled={(post?.pub) ? false : true }>Published</button>
                    <button type='button' onClick={() => setModal()}>Cancel</button>
                </div>
            </div>
        ))
    }

    const handleSaveRequest = async (data) => {
        if (title === '') {
            return setModal((
                <>
                    <h2>Post Must Include a Title</h2>
                    <button type='button' onClick={() => setModal()}>Close</button>
                </>
            ))
        }
        toggleLoading();
        const response = await saveRequest(data, post?._id);
        if (response.status === 200 || response.status === 201) { 
            setPost(response.data)
            setMsg((<li key={'ok'} className='editor-msg-ok'>Saved...</li>))
        }
        else {
            const err = response.error.map((e, i) => (<li key={`err${i}`} className='editor-msg-err'>{e}</li>))
            setMsg(err);
        }
        toggleLoading();
    }

    return (
        <div className={loading ? 'editor-menu editor-loading' : 'editor-menu'}>
            <div className='editor-menu-group editor-menu-bottom'>
                <button type='button' disabled={loading} onClick={() =>  handleSaveRequest({title, draft: editor.getHTML()})}>
                    <FontAwesomeIcon icon={faFloppyDisk} />
                </button>
                <div className='editor-menu-group'>
                    <button type='button' disabled={loading} onClick={() => handlePubModal() } >Publish</button>
                    <button type='button' disabled={loading} onClick={() => handleRevertModal() }>Revert</button>
                    <button type='button' disabled={loading} onClick={() => handleDeleteModal() }>
                        <FontAwesomeIcon icon={faTrashCan} />
                    </button>
                </div>
            </div>
        </div>
    )
}

export default PostEditorSaveMenu;