import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFloppyDisk, faTrashCan } from '@fortawesome/free-solid-svg-icons';
import { useDeleteRequest, useSaveRequest } from '../../api/postRequest.js';
import Spinner from '../Spinner';
import useAuth from '../../hooks/useAuth';
import useError from '../../hooks/useError';
import useModal from '../../hooks/useModal';

const PostEditorSaveMenu = ({ editor, loading, post, setPost, title, toggleLoading }) => {

    const {auth} = useAuth();
    const {setErr} = useError();
    const {setModal} = useModal();
    const deleteRequest = useDeleteRequest();
    const navigate = useNavigate();
    const saveRequest = useSaveRequest();

    const TourModal = () => {
        return (
            <div className='modal-note'>
                <h1>Not Authorized</h1>
                <p>Thank you for touring the admin features.</p> 
                <p>Unfortunately, the administrative tour is not authorized to commit any changes. Hopefully the experience has given you insight as to how this page works.</p>
                <p>For more information please consider viewing the <a href="https://github.com/jimmyquadros/blog-frontend">repository</a>.</p>
                <button type='button' onClick={() => setModal()}>Close</button>
            </div>
        )
    }

    const handleDeleteModal = () => {
        return setModal((
            <div className='modal-content'>
                <span>Delete this post?</span>
                <div className='form-submit-right'>
                    <button type='button' onClick={ async () => {
                        if (auth?.roles?.includes(1000)) return setModal(<TourModal />);
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
        setErr([]);
        const response = await deleteRequest(post?._id);
        if (response.status === 204) {
            return navigate('/admin', { replace: true });
        } else {
            return setErr(response.error)
        }
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
                            if (auth?.roles?.includes(1000)) return setModal(<TourModal />);
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
                            if (auth?.roles?.includes(1000)) return setModal(<TourModal />);
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
                            if (auth?.roles?.includes(1000)) return setModal(<TourModal />);
                            editor.commands.setContent(post.draft)
                            setModal();
                        }} 
                        disabled={(post) ? false : true}>Saved Draft</button>
                    <button type='button' 
                        onClick={() => {
                            if (auth?.roles?.includes(1000)) return setModal(<TourModal />);
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
        setErr([]);
        if (auth?.roles?.includes(1000)) return setModal(<TourModal />);
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
        }
        else {
            setErr(response.error);
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
