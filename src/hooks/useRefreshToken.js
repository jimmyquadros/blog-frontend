import axios from "../api/axios";
import useAuth from "./useAuth";

const useRefreshToken = () => {
    const { setAuth } = useAuth();

    const refresh = async () => {
        let response;
        try {
            response = await axios.get('/user/refresh', {
                withCredentials: true
            });
        } catch(err) {
            if (err.response.status !== 401) console.log('ERROR: ', err.rsponse.status);
            return;
        }
        setAuth(prev => {
            return {
                username: response.data.username,
                roles: response.data.roles,
                accessToken: response.data.accessToken 
            };
        });
        return response.data.accessToken;
    }
    return refresh;
};

export default useRefreshToken;