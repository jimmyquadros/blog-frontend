import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import useAxiosPrivate from '../hooks/useAxiosPrivate';
import useAuth from '../hooks/useAuth';
import jwt_decode from 'jwt-decode';
import useModal from '../hooks/useModal';
import useError from '../hooks/useError';

const USER_REGEX = /^[A-z][A-z0-9-_]{3,23}$/;
const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/;
const UPDATE_URL = '/user'

const Profile = () => {

    const { auth, setAuth } = useAuth();
    const { setErr } = useError();
    const { setModal } = useModal();

    const axiosPrivate = useAxiosPrivate();
    const isTour = auth?.roles?.includes(1000);

    const [username, setUsername] = useState(auth?.username);
    const [password, setPassword] = useState('');
    const [confPass, setConfPass] = useState('');
    const [success, setSuccess] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (isTour) {
            setModal(
                (
                    <div className='modal-note'>
                        <h1>THANK YOU!</h1>
                        <h4>The tour does not allow for updating this account, please consider <Link to='/register'><span onClick={() => setModal()}>signing up</span></Link> to get the full user experience!</h4>
                        <button type='button' onClick={() => setModal()}>Close</button>
                    </div>
                )
            )
        }
    },[isTour, setModal])

    const handleSubmit = async (e) => {
        setErr([]);
        setSuccess(false);
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
            setErr(err);
            setIsLoading(false);
            return;
        }

        if (!update.name && !update.password) {
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
                setErr(['No Server Response']);
            } else if (err.response.data === 'Unauthorized') {
                setErr(['Authorization Failure'])
            } else {
                setErr(err.response.data.message)
            }
        }
        setIsLoading(false);
    }

    return (
        <section className="update-area">
            {success ? (<h2>Updated Successfully</h2>) : (<></>)}
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
                        disabled={isLoading || isTour}
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
                        disabled={isLoading || isTour}
                    />
                    <label htmlFor="passconf">
                        Confirm Password
                    </label>
                    <input 
                        type="password"
                        id="passconf"
                        onChange={(e) => setConfPass(e.target.value)}
                        disabled={isLoading || isTour}
                    />
                </div>
                <button type='button' disabled={isLoading || isTour}>
                    Update
                </button>
            </form>
        </section>  
    )
}

export default Profile;