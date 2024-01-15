import {useState} from 'react';
import { Link } from 'react-router-dom';
import axios from '../api/axios';
import useAuth from '../hooks/useAuth';
import jwt_decode from 'jwt-decode';
import useError from '../hooks/useError';
import useModal from '../hooks/useModal';

const DemoLogin = () => {
    const { setAuth } = useAuth();
    const { setErr } = useError();
    const { setModal } = useModal();

    const [isLoading, setIsLoading] = useState(false);
    const toggleLoading = () => setIsLoading(prevState => !prevState);

    const handleLogin = async () => {
        toggleLoading();
        setErr([]);
        try {
            const response = await axios.post(
                process.env.REACT_APP_LOGIN_URL,
                JSON.stringify({
                    email: process.env.DEMO_USER ? process.env.DEMO_USER : process.env.REACT_APP_DEMO_USER,
                    password: process.env.DEMO_PSWD ? process.env.DEMO_PSWD : process.env.REACT_APP_DEMO_PSWD
                }),
                {
                    headers: { 'Content-Type': 'application/json' },
                    withCredentials: true
                }
            );
            const accessToken = response?.data.token;
            const { roles, username } = jwt_decode(accessToken);
            await setAuth({ username, roles, accessToken});
            setModal((
                <div className='modal-note'>
                    <h1>Welcome to the Administrative Tour!</h1>
                    <p>Thank you for taking the time to check out a tour of administrative privledges.</p>
                    <p>This level of access permits chekcing out the <Link to='/admin'>administrative dashboard</Link>. While this level of authorization doesn't allow the creation or editing of posts, hopefully it provides some insight into how the page is structured.</p>
                    <p>Please consider <Link to='/register'><span onClick={() => setModal()}>signing up</span></Link> to get the full user experience!</p>
                    <button type='button' onClick={() => setModal()}>Close</button>
                </div>
            ))
        } catch (err) {
            toggleLoading();
            setErr(err.response.data.message);
        }
    }

    return (
        <div className='demo-login-container'>
            <button type='button' className='demo-login' disabled={isLoading} onClick={() => handleLogin()}>Tour Admin Access!</button>
        </div>
    )
}

export default DemoLogin;