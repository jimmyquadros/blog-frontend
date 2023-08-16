const Revert = ({clear, editor, post}) => {
    const handleRevertDraft = () => {
        editor.commands.setContent(post.draft)
        clear();
    }

    const handleRevertPub = () => {
        editor.commands.setContent(post.pub)
        clear();
    }
    return (
        <div className='modal-content'>
            <span>{`Revert to...`}</span>
            <p>{`(note: this will not save)`}</p>
            <div className='form-submit-col'>
                <button type='button' 
                    onClick={handleRevertDraft} 
                    disabled={(post) ? false : true}>Saved Draft</button>
                <button type='button' 
                    onClick={handleRevertPub} 
                    disabled={(post?.pub) ? false : true }>Published</button>
                <button type='button' onClick={clear}>Cancel</button>
            </div>
        </div>
    )
}

export default Revert;