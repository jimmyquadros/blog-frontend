import axios from '../api/axios';
import useAuth from './useAuth';
import useError from './useError';

const useLogout = () => {
    const { setAuth } = useAuth();
    const { setErr } = useError();

    const logout = async () => {
        try {
            await axios('/user/logout', {
                withCredentials: true
            });
            setAuth();
        } catch(err) {
            setErr(err);
        }
    }
    
    return logout;
}

export default useLogout;
