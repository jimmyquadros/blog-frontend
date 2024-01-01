// Container componenet for top header bar

import { Link } from "react-router-dom";
import { Routes, Route } from "react-router"
import { ErrorProvider } from '../context/ErrorProvider';
import DemoLogin from "./DemoLogin";
import Login from "./Login";
import User from "./User";
import useAuth from "../hooks/useAuth";
import PersistLogin from "./PersistLogin";

const Header = () => {

    const { auth } = useAuth();
    
    return (
        <div className="header">
            <Link className='header-logo' to="/">
                <h1>Blog Name</h1>
            </Link>

            <ErrorProvider>
                {!auth && (<DemoLogin />)}
            </ErrorProvider>

            <ErrorProvider>
                <Routes>
                    {/* <Route element={<PersistLogin />}> */}
                    <Route path='/*' element={auth ? (<User />) : (<Login />)} />
                    {/* </Route> */}
                </Routes>
            </ErrorProvider>
        </div>
    )
}

export default Header;
