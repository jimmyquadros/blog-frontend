import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import jwt_decode from 'jwt-decode';
import axios from '../api/axios';
import useAuth from '../hooks/useAuth';
import useInput from '../hooks/useInput';

const LOGIN_URL = '/user/login';

const Login = () => {
    const { setAuth } = useAuth();

    const [email, resetEmail, emailAttribs] = useInput('email', '');
    const [password, setPassword] = useState('');
    const [errorMsg, setErrorMsg] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const toggleLoading = () => {
        setIsLoading((prevState) => !prevState);
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        toggleLoading();
        try {
            const response = await axios.post(
                LOGIN_URL,
                JSON.stringify({ email, password }),
                {
                    headers: { 'Content-Type': 'application/json' },
                    withCredentials: true
                }
            )
            const accessToken = response?.data.token;
            const { roles, username } = jwt_decode(accessToken);
            await setAuth({ username, roles, accessToken})
            navigate('/', {replace: true});
            

        } catch (err) {
            if (err.response.status !== 401) console.log('Login Error: ', err.response.status);
            setErrorMsg(err.response.data.message)
            toggleLoading();
        }
    }

    return (
        <>
            <section className='login-area'>
                <form className='login-form' onSubmit={handleSubmit}>
                    <div>
                        <label htmlFor='email'>Email</label>
                        <input 
                            type="email"
                            id="email"
                            {...emailAttribs}
                            autoComplete="off"
                            required
                            disabled={isLoading}
                        />
                    </div>
                    <div>
                    <label htmlFor='password'>Password</label>
                        <input 
                                type="password"
                                id="password"
                                onChange={(e) => setPassword(e.target.value)}
                                value={password}
                                required
                                disabled={isLoading}
                        />
                    </div>
                    <button disabled={isLoading}>Log In</button>
                </form>
                <p>
                    New user? &nbsp;
                    <Link to='/register'>Sign Up</Link>
                </p>
                <ul className='error-list'>
                    {errorMsg.map((e, i) => (<li key={i}>{e}</li>))}
                </ul>
            </section>
            
        </>
    )
}

export default Login;