import React, { useState } from "react";
import axios from 'axios';
import { useNavigate,Link } from "react-router-dom";

/// File is incomplete. You need to add input boxes to take input for users to register.
function Register() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("")


    const navigate = useNavigate();
    const userRegister = async () => {

        if (email === "" || password === "") {
            alert("Please fill the form forst")
            return
        }
        try {
            let response = await axios.post('http://localhost:3000/admin/signup', {
                username: email,
                password: password
            })
            if (response.status === 200) {
                setEmail("");
                setPassword("");
                console.log("Registered", response.data);
                localStorage.setItem("auth", JSON.stringify(response.data.token))
                navigate('/login')
            }
        } catch (error) {
            console.log(error);
        }
    }


    return <div>
        <h1>Register to the website</h1>
        <br />
        <h3>Email</h3>
        <input type={"text"} onChange={e => setEmail(e.target.value)} />
        <br />
        <h3>Password</h3>
        <input type={"text"} onChange={e => setPassword(e.target.value)} />
        <button onClick={userRegister}>Submit</button>
        <br />
        Already a user? <Link  to="/login">Login</Link>
    </div>
}

export default Register;