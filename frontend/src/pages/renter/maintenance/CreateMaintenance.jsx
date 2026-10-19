import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../../api";
import "../../../css/maintenance.css"

function CreateMaintenance() {
    const navigate = useNavigate()

    const [formData, setFormData] = useState({
        maintenance_type:"General",
        title:"",
        description:"",
        priority:"Medium",
        image:null
    })

    const [preview, setPreview] = useState(null)

    const handleChange =(e) => {
        const {name, value, files} = e.target;
        if(name==="image"){
            const file = files[0]
            setFormData({...formData,image:file})

            if(file){
                setPreview(URL.createObjectURL(file))
            }else{
                setPreview(null)
            }
        }else{
            setFormData({...formData,[name]:value,})
        }
    }

    const handleSubmit = async(e) => {
        e.preventDefault()
        try{
         const data = new FormData()

         data.append("maintenance_type",formData.maintenance_type)
         data.append("title",formData.title)
         data.append("description",formData.description)
         data.append("priority",formData.priority)

         if(formData.image){
            data.append("image",formData.image)
         }

            await api.post("maintenance/maintenance/create_request/",data,{
                headers:{
                    "Content-Type":"multipart/form-data",
                },
            })

            alert("Maintenance request submitted successfully.")
            navigate("/renter-dashboard/maintenance")
        }catch(error){
            console.log(error)
            alert("Unable to submit maintenance request.")
        }
    }
    return (
            <div className="maintenance-page">
                <div className="page-header">
                    <h2>Create Maintenance Request</h2>
                    <p>Report any issue related to your rented property.</p>
                </div>

                <form className="maintenance-form" onSubmit={handleSubmit}>
    
                        <div className="form-group">

                            <label>Maintenance Type</label>
                            <select name="maintenance_type" value={formData.maintenance_type} onChange={handleChange}>
                                <option>Plumbing</option>
                                <option>Electrical</option>
                                <option>Painting</option>
                                <option>Cleaning</option>
                                <option>Appliance Repair</option>
                                <option>Furniture Repair</option>
                                <option>AC Service</option>
                                <option>Water Leakage</option>
                                <option>Pest Control</option>
                                <option>Internet</option>
                                <option>Security</option>
                                <option>Garden</option>
                                <option>General</option>
                                <option>Other</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label>Issue Title</label>
                            <input type="text" name="title" placeholder="Enter issue title.." value={formData.title} onChange={handleChange} required/>
                        </div>
                        <div className="form-group">
                            <label>Description</label>
                            <textarea rows="6" name="description" placeholder="Describe the issue.." value={formData.description} onChange={handleChange} required/>
                        </div>

                        <div className="form-group">
                            <label>Priority</label>
                            <select name="priority" value={formData.priority} onChange={handleChange}>
                                <option>Low</option>
                                <option>Medium</option>
                                <option>High</option>
                                <option>Emergency</option>
                            </select>
                        </div>
                    
                    <div className="form-group">
                        <label>Upload Image (Optional)</label>
                        <input type="file" name="image"  accept="image/*" onChange={handleChange}/>
                    </div>

                    {preview && (
                        <div className="image-preview">
                            <img src={preview} alt="preview"/>
                        </div>
                    )}

                    <div className="form-buttons">
                        <button type="submit" className="primary-btn">
                            Submit Request
                        </button>

                        <button type="button" className="cancel-btn" onClick={() => navigate(-1)}>
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        )
}
export default CreateMaintenance;