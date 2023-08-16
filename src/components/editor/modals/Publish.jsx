const Publish = ({dsblUnpub, publish, unpub, clear}) => {
    return (
        <div className='modal-content'>
            <span>Publish this post?</span>
            <p>{`(note: this will save)`}</p>
            <div className='form-submit-right'>
                <button 
                    type='button' 
                    onClick={publish}
                >Publish</button>
                <button 
                    type='button'
                    disabled={dsblUnpub}
                    onClick={unpub}
                >Unpublish</button>
                <button type='button' onClick={clear}>Cancel</button>
            </div>
        </div>
    )
}

export default Publish;