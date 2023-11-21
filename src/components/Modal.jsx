// Migrate utility of this to modal wrapper then remove

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';

const Modal = ({ content, close }) => {

    return !content ? (<></>) : ( 
        <div className='modal-frame' onClick={close}>
            <div className='modal-container' onClick={e => e.stopPropagation()}>
                <div className='modal-container-close'>
                    <FontAwesomeIcon icon={faXmark} onClick={close} />
                </div>
                <div className='modal-container-content'>
                    {content}
                </div>
            </div> 
        </div>
    )
}

export default Modal;