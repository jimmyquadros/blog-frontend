// Menu for font, image/video import for text editor

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBold, faItalic, faUnderline, faList, faListOl, faImage } from '@fortawesome/free-solid-svg-icons';
import AddMedia from './AddMedia';
import AddImage from './AddImage';
import useModal from '../../hooks/useModal'

const PostEditorTextMenu = ({ editor, loading }) => {
    const { setModal } = useModal();

    if (!editor) {
        return null;
    };

    return (
        <div className={loading ? 'editor-menu editor-loading' : 'editor-menu'}>
          <div className='editor-menu-group'>
            <button
                type="button"
                disabled={loading}
                onClick={() => editor.chain().focus().toggleBold().run()}
                className={editor.isActive('bold') ? 'editor-menu-active' : ''}
                >
                <FontAwesomeIcon icon={faBold}/>
            </button>
            <button
                type="button"
                disabled={loading}
                onClick={() => editor.chain().focus().toggleItalic().run()}
                className={editor.isActive('italic') ? 'editor-menu-active' : ''}
            >
                <FontAwesomeIcon icon={faItalic}/>
            </button>
            <button
                type="button"
                disabled={loading}
                onClick={() => editor.chain().focus().toggleUnderline().run()}
                className={editor.isActive('underline') ? 'editor-menu-active' : ''}
                >
                <FontAwesomeIcon icon={faUnderline}/>
            </button>
          </div>
          <div className='editor-menu-group'>
            <button
                type="button"
                disabled={loading}
                onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                className={editor.isActive('heading', { level: 1}) ? 'editor-menu-active' : ''}
            >
                h1
            </button>
            <button
                type="button"
                disabled={loading}
                onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                className={editor.isActive('heading', { level: 2}) ? 'editor-menu-active' : ''}
            >
                h2
            </button>
            <button
                type="button"
                disabled={loading}
                onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
                className={editor.isActive('heading', { level: 3}) ? 'editor-menu-active' : ''}
            >
                h3
            </button>
          </div>
          <div className='editor-menu-group'>
            <button
                type="button"
                disabled={loading}
                onClick={() => editor.chain().focus().toggleBulletList().run()}
                className={editor.isActive('bulletList') ? 'editor-menu-active' : ''}
                >
                <FontAwesomeIcon icon={faList}/>
            </button>
            <button
                type="button"
                disabled={loading}
                onClick={() => editor.chain().focus().toggleOrderedList().run()}
                className={editor.isActive('orderedList') ? 'editor-menu-active' : ''}
                >
                <FontAwesomeIcon icon={faListOl}/>
            </button>
          </div>
          <div className='editor-menu-group'>
            <button type='button' disabled={loading} onClick={(e) => setModal(<AddImage editor={editor} />)}>
                <FontAwesomeIcon icon={faImage}/>
            </button>
            <button type='button' disabled={loading} onClick={ (e) => setModal(<AddMedia editor={editor} />)}>
                YouTube
            </button>
          </div>
        </div>
    )
}

export default PostEditorTextMenu
