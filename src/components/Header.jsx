import Login from "./Login";
import User from "./User";
import useAuth from "../hooks/useAuth";
import PersistLogin from "./PersistLogin";
import { Link } from "react-router-dom";
import { Routes, Route } from "react-router"
import {useState} from "react";

const Header = () => {

    const { auth } = useAuth();
    
    return (
        <div className="header">
            <Link className='header-logo' to="/">
                <h1>Blog Name</h1>
            </Link>
            <Routes>
                <Route element={<PersistLogin />}>
                    <Route path='/*' element={auth ? (<User />) : (<Login />)} />
                </Route>
            </Routes>
        </div>
    )
}

export default Header;