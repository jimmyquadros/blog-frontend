import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFloppyDisk, faTrashCan } from '@fortawesome/free-solid-svg-icons';
import Delete from './modals/Delete';
import Publish from './modals/Publish';
import Revert from './modals/Revert';
import Spinner from '../Spinner';

const PostEditorSaveMenu = ({ clear, deletePost, editor, loading, post, publish, save, unpub, modal }) => {

    const handlePublish = async (e) => {
        modal(<Spinner />)
        await publish();
        clear();
    }

    const handleUnpub = async () => {
        modal(<Spinner />);
        await unpub();
        clear();
    }

    const handleDelete = async () => {
        modal(<Spinner />)
        await deletePost();
    }

    return (
        <div className={loading ? 'editor-menu editor-loading' : 'editor-menu'}>
            <div className='editor-menu-group editor-menu-bottom'>
                <button type='button' disabled={loading} onClick={() => save()}>
                    <FontAwesomeIcon icon={faFloppyDisk} />
                </button>
                <div className='editor-menu-group'>
                    <button type='button' disabled={loading} onClick={() => modal(<Publish clear={clear} dsblUnpub={(post?.pub) ? false : true} publish={handlePublish} unpub={handleUnpub} />)} >Publish</button>
                    <button type='button' disabled={loading} onClick={() => modal(<Revert clear={clear} editor={editor} post={post} />)}>Revert</button>
                    <button type='button' disabled={loading} onClick={() => modal(<Delete clear={clear} deletePost={handleDelete} />)}>
                        <FontAwesomeIcon icon={faTrashCan} />
                    </button>
                </div>
            </div>
        </div>
    )
}

export default PostEditorSaveMenu;