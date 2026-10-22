import React,{useState} from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Login.css";

function Login(){
    const [formText,setFormText] = useState({
        email : "",
        password :""
    });

    const navigate = useNavigate();

    function handleForm(event){
        const {name,value} = event.target;
        setFormText(prevValue =>{
            return ({
                ...prevValue,
                [name]:value
            });
        })

    }

    async function formSubmit(event){
        event.preventDefault();

        const response = await fetch("http://localhost:5000/login",{
            method : "POST",
            headers :{"Content-type" : "application/json"},
            credentials: "include",
            body : JSON.stringify(formText)
        });

        const data = await response.json();
        if(response.ok){
            navigate("/keeper");
        }
        console.log(data); 

    }
 return(
    <div className="login-page" >
        <header className="welcome-header">
            <h1>Keeper!!</h1>
        </header>
    <form onSubmit={formSubmit} className="login-form">
        <h2>Welcome Back</h2>
        <p>Sign in to access your notes.</p>
        
        <input type="email"
        name="email"
        value={formText.email}
        onChange={handleForm}
        placeholder="Email address"
        required
        />
       
        <input type="password"
        name="password"
        value={formText.password}
        onChange={handleForm}
        placeholder="password"
        required
        />
        <button type="submit" className="login-button">Login</button>
        <p>Don't have an account <Link to="/Register">Register</Link></p>
    </form>
    </div>
 );
}
export default Login;