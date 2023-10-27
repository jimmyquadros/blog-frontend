import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Paginator from './Paginator';

const Admin = () => {
    const [msg, setMsg] = useState([]);
    const handleMsg = (msg) => {
        setMsg(msg);
    }

    useEffect(() => {
        if (msg.length) {
            setTimeout(() => {
                setMsg([])
            }, 10000);
        }
    }, [msg])

    return (
        <div className='admin-container'>
            <div className='msg-box'>
                <ul>
                    {msg.map((m, i) => (<li key={i}>{m}</li>))}
                </ul>
            </div>
            <Link to="/editor">
                <button>New Post</button>
            </Link>
            <Paginator setMsg={handleMsg} />
        </div>
    )
}

export default Admin;