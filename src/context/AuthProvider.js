// Context holder for user authorization

import { createContext, useState, useEffect, useMemo, useRef } from 'react';
// import useRefreshToken from "../hooks/useRefreshToken";

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
    const [auth, setAuth] = useState();
    // const [access, setAccess] = useState();
    // const refresh = useRefresh();
    const access = useRef();

    const authControl = useMemo(() => ({
        auth,
        setAuth,
        access,
        // setAccess,
    }), [auth, access])

    useEffect(() => {
        console.log('updated access.current: ', access.current)
    }, [access.current])

    useEffect(() => {
        console.log('authControl: ', authControl.auth)
    }, [authControl.auth])

    return (
        <AuthContext.Provider value = {authControl}>
            {children}
        </AuthContext.Provider>
    )
}

export default AuthContext;
