// Display component for logged in users

import useLogout from '../hooks/useLogout';
import useAuth from '../hooks/useAuth';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGear, faPenToSquare } from '@fortawesome/free-solid-svg-icons';

// import axios from '../api/axios';


const User = () => {
    
    const {auth} = useAuth();
    const navigate = useNavigate();
    const logout = useLogout();

    const signOut = async () => {
        navigate('/');
        // const loggedOut = await axios.post('/user/logout/')
        await logout();
    }

    return (
        <div className='header-user'>
            <h2>{auth.username}</h2>
            <button onClick={signOut}>Log Out</button>
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
