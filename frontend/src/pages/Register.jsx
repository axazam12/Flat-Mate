import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api";
import "../css/register.css"

function Register() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        username: "",
        full_name: "",
        email: "",
        phone: "",
        role: "",
        password: "",
        confirm_password: ""
    });

    const handleChange = (e) => {
        setFormData({
            ...formData, [e.target.name]: e.target.value,
        })
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (formData.password !== formData.confirm_password) {
            alert("Password do not match");
            return;
        }
        try {
            await api.post("accounts/users/register/", formData);
            alert("Registration Successful");
            navigate("/login");
        }
        catch (err) {
            console.log(err.response?.data) 
                alert("Registration Failed.")
            }
        
    }
    return (
        <div className="register-page">
            <form className="register-box" onSubmit={handleSubmit}>
                <div className="register-header">
                    <h2>Create Account</h2>
                    <p>Create your RentFlow account to get started.</p>
                </div>
                <div className="register-fields">
                    <div className="register-field">
                        <label>Username : </label>
                        <input type="text" name="username" placeholder="Username" value={formData.username} onChange={handleChange} required />
                    </div>

                    <div className="register-field">
                        <label>Full Name : </label>
                        <input type="text" name="full_name" placeholder="Full Name" value={formData.full_name} onChange={handleChange} required />
                    </div>

                    <div className="register-field">
                        <label>Email : </label>
                        <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} required />
                    </div>

                    <div className="register-field">
                        <label>Phone Number : </label>
                        <input type="tel" name="phone" placeholder="Phone Number" value={formData.phone} onChange={handleChange} required />
                    </div>

                    <div className="register-field">
                        <label>Role : </label>
                        <select name="role" value={formData.role} onChange={handleChange} required>
                            <option value="">Select Role</option>
                            <option value="Owner">Owner</option>
                            <option value="Renter">Renter</option>
                        </select>
                    </div>

                    <div className="register-field">
                        <label>Password : </label>
                        <input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} required />
                    </div>

                    <div className="register-field register-field-full">
                        <label>Confirm Password : </label>
                        <input type="password" name="confirm_password" placeholder="Confirm Password" value={formData.confirm_password} onChange={handleChange} required />
                    </div>
                </div>
                <div className="register-actions">
                <button type="submit" className="register-button">
                    Create Account
                </button>
                </div>

                <p className="register-login">Already have an account?
                    <Link to="/login">Login</Link>
                </p>

            </form>
        </div>
    )
}
export default Register;