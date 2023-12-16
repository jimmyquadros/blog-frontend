import { Outlet } from "react-router";
import { useState, useEffect } from "react";
import useAuth from "../hooks/useAuth";
import useError from "../hooks/useError";
import useLocalStorage from "../hooks/useLocalStorage";
import useRefreshToken from "../hooks/useRefreshToken";


const PersistLogin = () => {

    const { auth } = useAuth();
    const { setErr } = useError();
    const refresh = useRefreshToken();

    const [isLoading, setIsLoading] = useState(true);
    const [persist] = useLocalStorage('persist', false);

    useEffect(() => {
        setErr([]);
        let isMounted = true;
        const verifyRefreshToken = async () => {
            try {
                await refresh();
            } catch (err) {
                setErr(err);                
            } finally {
                isMounted && setIsLoading(false);
            }
        }

        !auth?.accessToken ? verifyRefreshToken() : setIsLoading(false);

    }, [auth, setErr])

    return (
        <>
            {!persist
                ? <Outlet />
                :isLoading
                    ? <p>Loading...</p>
                    : <Outlet />
            }
        </>
    )
}

export default PersistLogin;
