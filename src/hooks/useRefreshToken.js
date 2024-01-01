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
            // console.log('Is username the same: ', auth.username === response.data.username)
            // setAccess(prev => {
            //     return {
            //         // username: response.data.username,
            //         // roles: response.data.roles,
            //         accessToken: response.data.accessToken 
            //     };
            // });

            // setAccess(response.data.accessToken);
            access.current = response.data.accessToken;
            return response.data
        } catch(err) {
            await logout();
        }
    }
    return refresh;
};

export default useRefreshToken;
