import DemoLogin from "./DemoLogin";
import Login from "./Login";
import User from "./User";
import useAuth from "../hooks/useAuth";
import PersistLogin from "./PersistLogin";
import { Link } from "react-router-dom";
import { Routes, Route } from "react-router"

const Header = () => {

    const { auth } = useAuth();
    
    return (
        <div className="header">
            <Link className='header-logo' to="/">
                <h1>Blog Name</h1>
            </Link>

            {!auth && (<DemoLogin />)}

            <Routes>
                <Route element={<PersistLogin />}>
                    <Route path='/*' element={auth ? (<User />) : (<Login />)} />
                </Route>
            </Routes>
        </div>
    )
}

export default Header;