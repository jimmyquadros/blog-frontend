const Delete = ({clear, deletePost}) => {
    return (
        <div className='modal-content'>
            <span>Delete this post?</span>
            <div className='form-submit-right'>
                <button type='button' onClick={deletePost}>Delete</button>
                <button type='button' onClick={clear}>Cancel</button>
            </div>
        </div>
    )
}

export default Delete;