import { useRef, useState, useEffect } from "react";
import axios from '../api/axios';

const USER_REGEX = /^[A-z][A-z0-9-_]{3,23}$/;
const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/;
const REGISTER_URL = '/user'

const Register = () => {

    const [email, setEmail] = useState('');

    const [username, setUsername] = useState('');
    const [validUser, setValidUser] = useState(false);

    const [password, setPassword] = useState('');
    const [validPass, setValidPass] = useState(false);

    const [confPass, setConfPass] = useState('');
    const [validConf, setValidConf] = useState(false);

    const [errMsg, setErrMsg] = useState([]);
    const [success, setSuccess] = useState(false);

    const [isLoading, setIsLoading] = useState(false);

    const toggleLoading = () => {
        setIsLoading((prevState) => !prevState)
    };

    useEffect(() => {
        setValidUser(USER_REGEX.test(username));
    }, [username]);

    useEffect(() => {
        setValidPass(PWD_REGEX.test(password));
        setValidConf(password === confPass);
    }, [password, confPass]);

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
            // console.log('Invalid Entry');
            return;
        }

        try {
            const response = await axios.post(REGISTER_URL,
                JSON.stringify({name: username, email, password}),
                {
                    headers: { 'Content-Type': 'application/json' },
                }
            );
            setSuccess(true);
        } catch (err) {
            if (!err?.response) {
                setErrMsg('No Server Response');
            } else {
                setErrMsg(err.response.data.message);
            }
            toggleLoading();
        }

    }

    return (
        <>
            { success ? (
                <section>
                    <h1>Success</h1>
                    <p>
                        <a href="#">Sign In</a>
                    </p>
                </section>
            ) :(
                <>
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
                    </section>
                </>
            )}
        </>
    )
}

export default Register;