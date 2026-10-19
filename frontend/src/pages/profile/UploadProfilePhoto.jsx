import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api";
import "../../css/profile.css"

function UploadProfileImage(){
    const navigate = useNavigate()
    const user = JSON.parse(localStorage.getItem("user"))
    const [image, setImage] = useState(null)

    const handleChange = (e) =>{
        setImage(e.target.files[0])
    }
    const handleSubmit = async (e) => {
        e.preventDefault()
        if(!image) {
            alert("Please Select an image.")
            return
        }
        const formData = new FormData();
        formData.append("profile_picture",image)
        try{
            const response = await api.put("accounts/users/upload_profile_picture/",formData,
                {
                    headers:{"Content-Type":"multipart/form-data"}
                }
            )

            localStorage.setItem("user",JSON.stringify(response.data.user))

        alert("Profile picture uploaded successfully.")

        if(user.role === "Owner"){
            navigate("/owner-dashboard/profile")
        }else{
            navigate("/renter-dashboard/profile")
        }
        }catch(error){
            console.log(error)
            alert("Upload failed.")
        }
    }

    return(
        <div className="edit-profile-container">
            <h2>Upload Profile Picture</h2>
            <form onSubmit={handleSubmit} className="upload-form">
                <input type="file" accept="image/*" onChange={handleChange}/>
                {image && (
                    <p>Selected: {image.name}</p>
                )}
                <button type="submit">Upload Image</button>
            </form>
        </div>
    )
}
export default  UploadProfileImage