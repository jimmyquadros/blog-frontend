import useLogout from '../hooks/useLogout';
import useAuth from '../hooks/useAuth';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserGear, faPenToSquare } from '@fortawesome/free-solid-svg-icons';


const User = () => {
    const navigate = useNavigate();
    const logout = useLogout();

    const signOut = async () => {
        navigate('/');
        await logout();
    }
    const {auth} = useAuth();

    return (
        <div className='header-user'>
            <h2>{auth.username}</h2>
            <button onClick={signOut}>Log Out</button>
            <Link to='/profile'>
                <FontAwesomeIcon icon={faUserGear} />
            </Link>
            {auth?.roles?.includes(9000) 
                ? (<Link to='/admin'>
                        <FontAwesomeIcon icon={faPenToSquare} />
                    </Link>
                ) : ( <></>)}
        </div>
    )
}

export default User;