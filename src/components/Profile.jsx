import { useState, useEffect } from 'react';
import useAxiosPrivate from '../hooks/useAxiosPrivate';
import useAuth from '../hooks/useAuth';
import jwt_decode from 'jwt-decode';



const USER_REGEX = /^[A-z][A-z0-9-_]{3,23}$/;
const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/;
const UPDATE_URL = '/user'

const Profile = () => {

    const { auth, setAuth } = useAuth();
    const axiosPrivate = useAxiosPrivate();

    const [username, setUsername] = useState(auth?.username);
    // const [validUser, setValidUser] = useState(false);

    const [password, setPassword] = useState('');
    // const [validPass, setValidPass] = useState(false);

    const [confPass, setConfPass] = useState('');
    // const [validConf, setValidConf] = useState(false);

    const [errMsg, setErrMsg] = useState([]);
    const [success, setSuccess] = useState(false);

    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        setErrMsg([]);
    },[])

    const clearMsg = () => {
        setErrMsg([]);
        setSuccess(false);
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        clearMsg();
        setIsLoading(true);

        const controller = new AbortController();

        const update = {};
        const err = [];

        if (username !== auth.username) {
            if (!USER_REGEX.test(username)) {
                err.push("Invalid username");
            }
            update.name = username;
        };

        if (password !== '') {
            if (!PWD_REGEX.test(password)) {
                err.push("Invalid password");
            }
            if (password !== confPass) {
                err.push("Password must match confirmation");
            }
            update.password = password;
        }

        if (err.length) {
            setErrMsg(err);
            setIsLoading(false);
            return;
        }

        if (!update.name && !update.password) {
            console.log('no update')
            setIsLoading(false);
            return;
        }
        update.signal = controller.signal;

        try {
            const response = await axiosPrivate.put(UPDATE_URL, JSON.stringify(update))
            const accessToken = response?.data.token;
            const { roles, username } = jwt_decode(accessToken);
            await setAuth({ username, roles, accessToken})
            setSuccess(true);
            setPassword('');
            setConfPass('');
        } catch (err) {
            if (!err?.response) {
                console.log('err no response')
                setErrMsg(['No Server Response']);
            } else if (err.response.data === 'Unauthorized') {
                setErrMsg(['Authorization Failure'])
            } else {
                console.log('other error')
                console.log('err.response.data: ', err.response.data)
                setErrMsg(err.response.data.message)
            }
        }
        setIsLoading(false);
    }

    return (
        <div>
            <section className="update-area">
                {success ? (<h2>Updated Successfully</h2>) : (<></>)}
                <ul className='error-list'>
                    {errMsg.map((e, i) => (<li key={i}>{e}</li>))}
                </ul>
                <form className="update-form" onSubmit={handleSubmit}>
                    <h1>Update User</h1>
                    <div className="update-sub-form">
                        <label htmlFor="username">
                            Username
                        </label>
                        <input 
                            type="text"
                            id="username"
                            onChange={(e) => setUsername(e.target.value)}
                            autoComplete="off"
                            value={username}
                            disabled={isLoading}
                        />
                    </div>
                    <div className="update-sub-form">
                        <label htmlFor="password">
                            Password
                        </label>
                        <input 
                            type="password"
                            id="password"
                            onChange={(e) => setPassword(e.target.value)}
                            disabled={isLoading}
                        />
                        <label htmlFor="passconf">
                            Confirm Password
                        </label>
                        <input 
                            type="password"
                            id="passconf"
                            onChange={(e) => setConfPass(e.target.value)}
                            disabled={isLoading}
                        />
                    </div>
                    <button disabled={isLoading ? true : false}>
                        Update
                    </button>
                </form>
            </section>  
        </div>
    )
}

export default Profile;