
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import ShowCourses from "./ShowCourses";
import CreateCourse from "./CreateCourse";

/// This is the landing page. You need to add a link to the login page here.
/// Maybe also check from the backend if the user is already logged in and then show them a logout button
/// Logging a user out is as simple as deleting the token from the local storage.
function Landing() {

    const [auth, setAuth] = useState("")
    useEffect(() => {
        setAuth(JSON.parse(localStorage.getItem('auth')))
    }, [])

    return <div>
        <h1>Welcome to course selling website!</h1>
        <Link to="/register">Register</Link>
        <br />
        <Link to="/login">Login</Link>
        <br />
        <h1>Our courses</h1>
        <div>
            <ShowCourses />
        </div>
        <Link to="/about">Create Course</Link>
    </div>
}

export default Landing;