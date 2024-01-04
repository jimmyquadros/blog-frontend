// Context holder for user authorization

import { createContext, useState, useEffect, useMemo, useRef } from 'react';

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
    const [auth, setAuth] = useState();
    const access = useRef();

    const authControl = useMemo(() => ({
        auth,
        setAuth,
        access,
    }), [auth, access])

    return (
        <AuthContext.Provider value = {authControl}>
            {children}
        </AuthContext.Provider>
    )
}

export default AuthContext;
