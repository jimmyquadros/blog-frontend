import {useState} from 'react';
import axios from '../api/axios';
import useAuth from '../hooks/useAuth';
import jwt_decode from 'jwt-decode';


const DemoLogin = () => {

    const { setAuth } = useAuth();

    const [isLoading, setIsLoading] = useState(false);
    const toggleLoading = (prevState) => setIsLoading(!prevState);

    const handleLogin = async () => {
        toggleLoading();
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
            console.log('Demo Login Error: ', err)
            toggleLoading();
        }
    }

    return (
        <button type='button' className='demo-login' disabled={isLoading} onClick={() => handleLogin()}>Tour Admin Access!</button>
    )
}

export default DemoLogin;