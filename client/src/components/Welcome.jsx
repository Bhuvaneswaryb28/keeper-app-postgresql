import React from "react";
import { Link } from "react-router-dom";

function Welcome(){

    return (
        <div >
            <header className="welcome-header">
            <h1>Keeper</h1>
            </header>
         
         <div className="welcome-class">
        <div className="welcome-card">
            <h2>Welcome to your personal notes space</h2>
            <p>Capture Your thoughts and keep everything in one place!!</p>
            <Link to="/register" className="welcome-button">Get started</Link>
            <p className="welcome-login">Already have an account?{""}
            <Link to="/login" >Login</Link></p>

         </div>
         </div>

        </div>
    );

}

export default Welcome;