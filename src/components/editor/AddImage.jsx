import { useState } from 'react';
import useModal from '../../hooks/useModal';

const AddImage = ({editor}) => {
    
    const { setModal } = useModal();
    const [url, setUrl] = useState('');
    const [height, setHeight] = useState(0);
    const [width, setWidth] = useState(640);
    const [alt, setAlt] = useState('');


    const addImage = (data) => {
        editor.commands.setImage({ 
            src: url, 
            height: (height === 0) ? 'auto' : height, 
            width: (width === 0) ? 'auto' : width, 
            alt, })
    }
    
    return (
        <div className='modal-content'>
            <form action="">
                <label htmlFor="media-url">URL:</label>
                <input 
                  type="text"
                  name="media-url"
                  id="media-url"
                  onChange={(e) => setUrl(e.target.value)} 
                />
                <div className="form-next-to" >
                    <div>
                        <label htmlFor="height">Height:</label>
                        <input
                          className="form-number"
                          type="number"
                          value={height}
                          onChange={(e) => setHeight(e.target.value)}
                          name="height"
                          id="height"
                        />
                    </div>
                    <div>
                        <label htmlFor="width">Width:</label>
                        <input
                         className="form-number"
                         type="number"
                         value={width}
                         onChange={(e) => setWidth(e.target.value)}
                         name="width"
                         id="width"
                        />
                    </div>
                </div>
                <label htmlFor="media-alt">Alt Text:</label>
                <input 
                    type="text"
                    name="media-alt"
                    id="media-alt"
                    onChange={(e) => setAlt(e.target.value)}
                />
                <div className="form-submit-right">
                    <button type='button' onClick={() => {
                        addImage()
                        setModal();
                    }}>add</button>
                    <button type='button' onClick={() => setModal()}>close</button>
                </div>
            </form>
        </div>
    )
}

export default AddImage;