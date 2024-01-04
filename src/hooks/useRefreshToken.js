import axios from "../api/axios";
import useAuth from "./useAuth";
import useLogout from "./useLogout";

const useRefreshToken = () => {
    const { auth, setAuth, access } = useAuth();
    const logout = useLogout();

    const refresh = async () => {
        try {
            const response = await axios.get('/user/refresh', {
                withCredentials: true
            });
            access.current = response.data.accessToken;
            return response.data
        } catch(err) {
            await logout();
        }
    }
    return refresh;
};

export default useRefreshToken;
