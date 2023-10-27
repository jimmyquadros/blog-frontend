import axios from '../api/axios';
import useAuth from './useAuth';

const useLogout = () => {
    const { setAuth } = useAuth();

    const logout = async () => {
        try {
            await axios('/user/logout', {
                withCredentials: true
            });
            setAuth();
        } catch(err) {
            console.error(err);
        }
    }
    
    return logout;
}

export default useLogout;