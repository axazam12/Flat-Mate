import { useEffect,useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../../api";
import "../../../css/maintenance.css"

function EditMaintenance() {
    const{id} = useParams()
    const navigate = useNavigate()
    const [formData, setFormDate] = useState({
        maintenance_type:"",title:"",description:"",priority:"",image:null
    })

    const [preview, setPreview] = useState("")

    useEffect(() => {
        fetchRequest()
    },[id])

    const fetchRequest = async()=>{
        try{
            const response = await api.get(`maintenance/maintenance/${id}/`)
            const request = response.data

            if(request.status !=="Open"){
                alert("Only open maintenance requests can be edited.")
                navigate("/renter-dashboard/maintenance")
                return
            }
            setFormDate({
                maintenance_type: request.maintenance_type,
                title: request.title,
                description: request.description,
                priority: request.priority,
                image:null
            })
            setPreview(request.image)
        }catch(error){
            console.log(error)
        }
    }

    const handleChange = (e) => {
        const {name, value, files} = e.target;
        if(name==="image"){
            setFormDate({...formData,image: files[0]})

            if(files[0]){
                setPreview(URL.createObjectURL(files[0]))
            }
            return
        }

        setFormDate({...formData,[name]: value})
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        try{
            const data = new FormData()

            data.append("maintenance_type", formData.maintenance_type)
            data.append("title",formData.title);
            data.append("description", formData.description);
            data.append("priority", formData.priority);

            if(formData.image){
                data.append("image", formData.image)
            }
            await api.patch(`maintenance/maintenance/${id}/`,data,{
                headers:{
                    "Content-Type" : "multipart/form-data",
                }
            })

            alert("Maintenance request updated successfully.")
            navigate(`/renter-dashboard/maintenance/${id}`)
        }catch(error){
            console.log(error)
            alert("Unable to update request")
        }
    }

    return(
        <div className="maintenance-page">
            <div className="page-header">
                <h2>Edot Maintenance Request</h2>
            </div>

            <form className="maintenance-form" onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Maintenance Type</label>
                    <select name="maintenance_type" value={formData.maintenance_type} onChange={handleChange} required>
                        <option value="Plumbing">Plumbing</option>
                        <option value="Electrical">Electrical</option>
                        <option value="Painting">Painting</option>
                        <option value="Cleaning">Cleaning</option>
                        <option value="Appliance Repair">Appliance Repair</option>
                        <option value="Furniture Repair">Furniture Repair</option>
                        <option value="AC Service">AC Service</option>
                        <option value="Water Leakage">Water Leakage</option>
                        <option value="Pest Control">Pest Control</option>
                        <option value="Internet">Internet</option>
                        <option value="Security">Security</option>
                        <option value="Garden">Garden</option>
                        <option value="General">General</option>
                        <option value="Other">Other</option>
                    </select>
                </div>

                <div className="form-group">
                    <label>Title</label>
                    <input type="text" name="title" value={formData.title} onChange={handleChange} required/>
                </div>

                <div className="form-group">
                            <label>Description</label>
                            <textarea rows="6" name="description" value={formData.description} onChange={handleChange} required/>
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
                        <label>Replace Image</label>
                        <input type="file" name="image"  accept="image/*" onChange={handleChange}/>
                    

                    {preview && (
                            <img src={preview} alt="Preview" className="maintenance-preview"/>
                    )}
                    </div>

                    <div className="form-actions">
                        <button type="submit" className="primary-btn">
                            Update Request
                        </button>

                        <button type="button" className="secondary-btn" onClick={() => navigate(-1)}>
                            Cancel
                        </button>
                    </div>
            </form>
        </div>
        
    )
}
export default EditMaintenance;