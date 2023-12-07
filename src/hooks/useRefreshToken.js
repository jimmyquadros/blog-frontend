import axios from "../api/axios";
import useAuth from "./useAuth";
import useLogout from "./useLogout";

const useRefreshToken = () => {
    const { setAuth } = useAuth();
    const logout = useLogout();

    const refresh = async () => {
        try {
            const response = await axios.get('/user/refresh', {
                withCredentials: true
            });
            setAuth(prev => {
                return {
                    username: response.data.username,
                    roles: response.data.roles,
                    accessToken: response.data.accessToken 
                };
            });
            return response.data.accessToken;
        } catch(err) {
            await logout();
        }
    }
    return refresh;
};

export default useRefreshToken;
