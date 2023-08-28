import axios from "axios";
import React, { useState } from "react";
import { useNavigate,Link } from "react-router-dom";

/// File is incomplete. You need to add input boxes to take input for users to login.
function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("")

    const navigate=useNavigate();
    const getLogin=async()=>{
        try {
            console.log(email,password)
            const response=await axios.post('http://localhost:3000/admin/login',{
                username:email,
                password:password
            })
            if(response.status===200){
                console.log("Logged in");
                localStorage.setItem('auth',JSON.stringify(response.data.token))
                navigate('/');
            }
        } catch (error) {
            console.log(error);
        }
    }
    return <div>
        <h1>Login to admin dashboard</h1>
        <br />
        Email - <input type={"text"} onChange={e => setEmail(e.target.value)} />
        <br />
        Password - <input type={"text"} onChange={e => setPassword(e.target.value)} />
        <button onClick={getLogin}>Login</button>
        <br />
        New here? <Link to="/register">Register</Link>
    </div>
}

export default Login;