import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFloppyDisk, faTrashCan } from '@fortawesome/free-solid-svg-icons';


const PostEditorSaveMenu = ({ loading, save, modal }) => {
    return (
        <div className={loading ? 'editor-menu editor-loading' : 'editor-menu'}>
            <div className='editor-menu-group editor-menu-bottom'>
                <button type='button' disabled={loading} onClick={() => save()}>
                    <FontAwesomeIcon icon={faFloppyDisk} />
                </button>
                <div className='editor-menu-group'>
                    <button type='button' disabled={loading} onClick={modal.publish}>Publish</button>
                    <button type='button' disabled={loading} onClick={modal.revert}>Revert</button>
                    <button type='button' disabled={loading} onClick={modal.delete}>
                        <FontAwesomeIcon icon={faTrashCan} />
                    </button>
                </div>
            </div>
        </div>
    )
}

export default PostEditorSaveMenu;