// Menu component for the addition of Youtube videos to blog posts

import { useState } from 'react';
import useModal from '../../hooks/useModal';
import Spinner from '../Spinner';

const AddMedia = ({editor}) => {
    
    const { setModal } = useModal();
    const [url, setUrl] = useState('');
    const [height, setHeight] = useState(0);
    const [width, setWidth] = useState(640);

    const addYoutubeVideo = async () => {
        const h = Number(height)
        const w = Number(width);
        editor.commands.setYoutubeVideo({
            src: url,
            height: (h !== 0) ? h
                : (w !== 0) ? (w * (9/16)) : 480,
            width: (w !== 0) ? w
                : (h !== 0) ? (h * (16/9)) : 640,
        })
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
                <div className="form-submit-right">
                    <button type='button' onClick={ async () => {
                        setModal(<Spinner />)
                        await addYoutubeVideo();
                        setModal();
                    }}>add</button>
                    <button type='button' onClick={() => setModal()}>close</button>
                </div>
            </form>
        </div>
    )
}

export default AddMedia;
