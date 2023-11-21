import {useState} from 'react';
import axios from '../api/axios';
import useAuth from '../hooks/useAuth';
import jwt_decode from 'jwt-decode';
import useError from '../hooks/useError'

const DemoLogin = () => {

    const { setAuth } = useAuth();
    const { setErr } = useError();

    const [isLoading, setIsLoading] = useState(false);
    const toggleLoading = () => setIsLoading(prevState => !prevState);

    const handleLogin = async () => {
        toggleLoading();
        setErr([]);
        try {
            const response = await axios.post(
                process.env.REACT_APP_LOGIN_URL,
                JSON.stringify({
                    email: process.env.REACT_APP_DEMO_USER,
                    password: process.env.REACT_APP_DEMO_PSWD
                }),
                {
                    headers: { 'Content-Type': 'application/json' },
                    withCredentials: true
                }
            );
            const accessToken = response?.data.token;
            const { roles, username } = jwt_decode(accessToken);
            await setAuth({ username, roles, accessToken});
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