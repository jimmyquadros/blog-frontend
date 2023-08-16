import { useState } from 'react';

const AddMedia = ({editor, close}) => {
    
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
        close();
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
                    <button onClick={(e) => {
                        e.preventDefault();
                        addYoutubeVideo();
                        close()
                    }}>add</button>
                    <button onClick={(e) => close(e)}>close</button>
                </div>
            </form>
        </div>
    )
}

export default AddMedia;