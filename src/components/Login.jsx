// Component to handle user log-in

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import jwt_decode from 'jwt-decode';
import axios from '../api/axios';
import useAuth from '../hooks/useAuth';
import useError from '../hooks/useError'
import useInput from '../hooks/useInput';

const LOGIN_URL = '/user/login';

const Login = ({addEmail}) => {
    const { access, setAuth } = useAuth();
    const { setErr } = useError();

    const [email, setEmail, emailAttribs] = useInput('email', '');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const toggleLoading = () => {
        setIsLoading((prevState) => !prevState);
    }

    useEffect(() => {
        if (addEmail) {
            setEmail(addEmail)}
    }, [addEmail, setEmail])

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErr([]);
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
            await setAuth({ username, roles})
            access.current = accessToken;

        } catch (err) {
            setErr(err.response.data.message);
            toggleLoading();
        }
    }

    return (
        <section className='login-area'>
            <form className={addEmail ? 'login-form login-col' : 'login-form'} onSubmit={handleSubmit}>
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
            {(!addEmail) && (
                <p>
                    New user? &nbsp;
                    <Link to='/register'>Sign Up</Link>
                </p>
            )}
        </section>
    )
}

export default Login;