import { useCallback } from 'react';
import AddMedia from './AddMedia';
import AddImage from './AddImage';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBold, faItalic, faUnderline, faList, faListOl, faImage } from '@fortawesome/free-solid-svg-icons';

const PostEditorTextMenu = ({ editor, loading, setImageModal, setYouTubeModal }) => {
    
    const addImage = useCallback(() => {
        const url = window.prompt('URL');

        if (url) {
            editor.chain().focus().setImage({ src: url }).run()
        }
    }, [editor])
    
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
            <button disabled={loading} onClick={(e) => {e.preventDefault(); setImageModal()}}>
                <FontAwesomeIcon icon={faImage}/>
            </button>
            <button  disabled={loading} onClick={ (e) => {e.preventDefault(); setYouTubeModal()}}>
                YouTube
            </button>
          </div>
        </div>
    )
}

export default PostEditorTextMenu
