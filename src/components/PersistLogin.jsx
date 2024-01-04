import { Outlet } from "react-router";
import { useState, useEffect } from "react";
import useAuth from "../hooks/useAuth";
import useError from "../hooks/useError";
import useLocalStorage from "../hooks/useLocalStorage";
import useRefreshToken from "../hooks/useRefreshToken";


const PersistLogin = ({children}) => {
    const { access, setAuth } = useAuth();
    const { setErr } = useError();
    const refresh = useRefreshToken();

    const [isLoading, setIsLoading] = useState(true);
    const [persist] = useLocalStorage('persist', false);

    useEffect(() => {
        setErr([]);
        let isMounted = true;
        const verifyRefreshToken = async () => {
            try {
                const data = await refresh();
                setAuth({ username: data.username, roles: data.roles })
            } catch (err) {
                setErr(err);                
            } finally {
                isMounted && setIsLoading(false);
            }
        }

        verifyRefreshToken();

        // !access ? verifyRefreshToken() : setIsLoading(false);

    }, [])

    return (
        <div className='persist-login'>
            {/* <Outlet /> */}
            {children}
        </div>
        // <>
        //     {!persist
        //         ? <Outlet />
        //         :isLoading
        //             ? <p>Loading...</p>
        //             : <Outlet />
        //     }
        // </>
    )
}

export default PersistLogin;
