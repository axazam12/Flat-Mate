import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api";
import "../css/login.css"

function Login(){
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        username:"",
        password: "",
    })

    const handleChange = (e) =>{
        setFormData({
            ...formData,[e.target.name]: e.target.value,
        })
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        try{
            
            const response = await api.post("accounts/users/user_login/",formData)
            const user = response.data.user

            localStorage.setItem("user",JSON.stringify(user))

            alert("Login Successfully")
            
            if(user.role === "Owner"){
                navigate("/owner-dashboard");
            }else{
                navigate("/renter-dashboard")
            }
        } catch(error){
            if(error.response?.data?.error){
                alert(error.response.data.error)
            }
            else{
                alert("Login failed.")
            }
            
        }        
    }

    return(
        <div className="login-page">
            <form className="login-box" onSubmit={handleSubmit}>
                <div className="login-header">
                <h2>Welcome Back</h2>
                <p className="subtitle">
                    Login to access your RentFlow account.
                </p>
                </div>
                <div className="login-field">
                    <label>Username</label>
                    <input type="text" name="username" placeholder="Enter Your Username" value={formData.username} onChange={handleChange} required/>
                </div>

                <div className="login-field">
                    <label>Password</label>
                    <input type="password" name="password" placeholder="Enter Your Password" value={formData.password} onChange={handleChange} required/>
                </div>
                
                <div className="login-forgot">
                    <Link to="/forgot-password">
                    Forgot Password</Link>
                </div>
                
                <button type="submit" className="login-button">
                    Login
                </button>
                <p className="login-register">Don't have an account?{" "}
                    <Link to="/register">Register</Link>
                </p>
            </form>
        </div>
    )
}
export default Login;