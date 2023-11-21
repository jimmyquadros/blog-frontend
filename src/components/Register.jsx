import { useState, useEffect } from "react";
import axios from '../api/axios';
import useError from '../hooks/useError'
import Login from './Login';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleCheck, faCircleXmark } from '@fortawesome/free-solid-svg-icons';

const USER_REGEX = /^[A-z][A-z0-9-_]{3,23}$/;
const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/;
const REGISTER_URL = '/user'

const Register = () => {

    const {setErr} = useError();

    const [email, setEmail] = useState('');
    const [validEmail, setValidEmail] = useState(false);

    const [username, setUsername] = useState('');
    const [validUser, setValidUser] = useState(false);

    const [password, setPassword] = useState('');
    const [validPass, setValidPass] = useState(false);

    const [confPass, setConfPass] = useState('');
    const [validConf, setValidConf] = useState(false);

    const [errMsg, setErrMsg] = useState([]);
    const [success, setSuccess] = useState(null);

    const [isLoading, setIsLoading] = useState(false);

    const toggleLoading = () => {
        setIsLoading((prevState) => !prevState)
    };

    useEffect(() => {
        setValidEmail(email.length);
        setValidUser(USER_REGEX.test(username));
        setValidPass(PWD_REGEX.test(password));
        setValidConf(password === confPass && password.length);
    }, [email, username, password, confPass]);

    useEffect(() => {
        setErrMsg([]);
    }, [])

    const handleSubmit = async (e) => {
        e.preventDefault();
        toggleLoading();

        const v1 = USER_REGEX.test(username);
        const v2 = PWD_REGEX.test(password);
        const v3 = password === confPass;
        if (!v1 || !v2 || !v3) {
            return;
        }

        try {
            setErr([])
            await axios.post(REGISTER_URL,
                JSON.stringify({name: username, email, password}),
                {
                    headers: { 'Content-Type': 'application/json' },
                }
            );
            setSuccess(email);
        } catch (err) {
            if (!err?.response) {
                setErr('No Server Response');
            } else {
                setErr(err.response.data.message);
            }
            toggleLoading();
        }
    }

    return success ? (
            <div className='register-success'>
                <h1>Success</h1>
                <h2>Login</h2>
                <Login addEmail={success}/>
            </div>
        ) : (
            <section className="register-area">
                <ul className='error-list'>
                    {errMsg.map((e, i) => (<li key={i}>{e}</li>))}
                </ul>
                <form className="register-form" onSubmit={handleSubmit}>
                    <h1>Register</h1>
                    <label htmlFor="email">
                        Email
                    </label>
                    <input 
                        type="email"
                        id="email"
                        onChange={(e) => setEmail(e.target.value)}
                        autoComplete="off"
                        required
                        disabled={isLoading}
                    />
                    <label htmlFor="username">
                        Username
                    </label>
                    <input 
                        type="text"
                        id="username"
                        onChange={(e) => setUsername(e.target.value)}
                        autoComplete="off"
                        required
                        disabled={isLoading}
                    />
                    <label htmlFor="password">
                        Password
                    </label>
                    <input 
                        type="password"
                        id="password"
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        disabled={isLoading}
                    />
                    <label htmlFor="passconf">
                        Confirm Password
                    </label>
                    <input 
                        type="password"
                        id="passconf"
                        onChange={(e) => setConfPass(e.target.value)}
                        required
                        disabled={isLoading}
                    />
                    <button disabled={!validUser || !validPass || !validConf || isLoading ? true : false}>
                        Sign Up
                    </button>
                </form>
                <div className="register-req">
                <div className="register-item-req">
                        {validEmail ? <FontAwesomeIcon icon={faCircleCheck} /> : <FontAwesomeIcon icon={faCircleXmark} />}
                        Include a valid email address.
                    </div>
                    <div className="register-item-req">
                        {validUser ? <FontAwesomeIcon icon={faCircleCheck} /> : <FontAwesomeIcon icon={faCircleXmark} />}
                        Username must be between 3 and 23 characters and comprised of lower case, upper case, and dashes (-).
                    </div>
                    <div className="register-item-req">
                        {validPass ? <FontAwesomeIcon icon={faCircleCheck} /> : <FontAwesomeIcon icon={faCircleXmark} />}
                        Password must be between 8-24 characters, include at least one upper case character, number, and special character (!@#$%).
                    </div>
                    <div className="register-item-req">
                        {validConf ? <FontAwesomeIcon icon={faCircleCheck} /> : <FontAwesomeIcon icon={faCircleXmark} />}
                        Password and Password Confirmation must match.
                    </div>
                </div>
            </section>
        )
    }
    
    


export default Register;