import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api";
import "../../css/profile.css"

function ChangePassword(){
    const navigate = useNavigate()
    const user = JSON.parse(localStorage.getItem("user"))
    const [passwords, setPasswords] = useState({
        old_password: "",
        new_password:"",
        confirm_new_password:""
    })
    const handleChange = (e) => {
        setPasswords({
            ...passwords,[e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (passwords.new_password !== passwords.confirm_new_password){
            alert("Passwords do not match")
            return
        }
        try{
            await api.put("accounts/users/change_password/",passwords)
        alert("Password Changed successfully.");
        if(user.role === "Owner"){
            navigate("/owner-dashboard/profile");
        }else{
            navigate("/renter-dashboard/profile");
        }
      }catch(error){
        console.log(error);
        alert("unable to change password.")
      }
    }

    return(
        <div className="edit-profile-container">
            <h2>Change Password</h2>
            <form onSubmit={handleSubmit} className="change-password-form">
                <label>Current Password</label>
                <input type="password" name="old_password" value={passwords.old_password} onChange={handleChange}/>
                <label>New Password</label>
                <input type="password" name="new_password" value={passwords.new_password} onChange={handleChange}/>
                <label>Confrim New Password</label>
                <input type="password" name="confirm_new_password" value={passwords.confirm_new_password} onChange={handleChange}/>
                <button type="submit" >Change Password</button>
            </form>
        </div>
    )
}
export default ChangePassword;