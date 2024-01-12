// Display component for logged in users

import { useState } from 'react';
import useLogout from '../hooks/useLogout';
import useAuth from '../hooks/useAuth';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGear, faPenToSquare } from '@fortawesome/free-solid-svg-icons';

const User = () => {
    const {auth} = useAuth();
    const navigate = useNavigate();
    const logout = useLogout();
    const [isDisable, setIsDisable] = useState(false);

    const signOut = async () => {
        setIsDisable(true);
        navigate('/');
        await logout();
    }

    return (
        <div className='header-user'>
            <h2>{auth.username}</h2>
            <button disabled={isDisable} onClick={signOut}>Log Out</button>
            <Link to='/profile'>
                <div className='header-user-nav'>
                    <FontAwesomeIcon icon={faGear} />
                    <p>User</p>
                </div>
            </Link>
            {auth?.roles?.includes(9000) || auth?.roles?.includes(1000) 
                ? (<Link to='/admin'>
                        <div className='header-user-nav'>
                            <FontAwesomeIcon icon={faPenToSquare} />
                            <p>Admin</p>
                        </div>
                    </Link>
                ) : ( <></>)}
        </div>
    )
}

export default User;
