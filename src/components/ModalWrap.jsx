// Wrapper to render modal pop-ups throughout all rendered pages
// Any component sent to the modal context will be rendered within modal

import {useEffect, useState} from 'react';
import useModal from '../hooks/useModal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';

const ModalWrap = ({children}) => {

    const {modal, setModal} = useModal();
    const [mod, setMod] = useState((<></>));

    useEffect(() => {
        setMod(modal ? 
            (<div className='modal-frame' style={{visibility: (modal) ? 'visible' : 'hidden'}} onClick={() => setModal(null)}>
                <div className='modal-container' onClick={e => e.stopPropagation()}>
                    <div className='modal-container-close'>
                        <FontAwesomeIcon icon={faXmark} onClick={() => setModal(null)} />
                    </div>
                    <div className='modal-container-content'>
                        {modal}
                    </div>
                </div> 
            </div>) : (<></>)
            )
    }, [modal, setMod, setModal])

    return (
        <>
            {mod}
            {children}
        </>
    )
}

export default ModalWrap;
