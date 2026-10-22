import React,{useState} from "react";
import { useNavigate } from "react-router-dom";
import "./Register.css";
import { Link } from "react-router-dom";

function Register(){

    const [formData,setFormdate] = useState({
        name :"",
        email :"",
        password :""

    });
    const navigate =useNavigate();

    function formValues(event){
        const {name,value} = event.target;

        setFormdate(prevValue =>{
            return ({
                ...prevValue,
                [name]:value
            });
        });
    }

  async function submitForm(event){
        event.preventDefault();
        const response =await fetch("http://localhost:5000/register",{
            method : "POST",
            headers:{"Content-Type":"application/json"},
            body:JSON.stringify(formData)

        });

        if(response.ok){
             setFormdate({
            name :"",
            email :"",
            password :""
        });

        navigate("/login");

        }

       
    }


return (
     <div className="register-page">
      <header className="welcome-header">
        <h1>Keeper!!</h1>
      </header>
      

      <form  onSubmit={submitForm} className="register-form">
        <h2>Register</h2>
        <p>Start organizing your thoughts in one place.</p>
        <input
          type="text"
          placeholder="Name"
          name="name"
          value={formData.name}
          onChange={formValues}
        />

        <input
          type="email"
          placeholder="Email"
          name="email"
          value={formData.email}
          onChange={formValues}
        />

        <input
          type="password"
          placeholder="Password"
          name="password"
          value={formData.password}
          onChange={formValues}
        />

        <button type="submit" className="register-button">Create Account</button>
        <p>Already have an acount <Link to="/login" >Login</Link></p>
      </form> 
    </div>
);

}

export default Register;