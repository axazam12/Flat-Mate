import { useNavigate } from "react-router-dom";
import api from "../../../api";
import PropertyForm from "../../../components/PropertyForm";

function AddProperty(){
    const navigate = useNavigate();

    const handleAddProperty = async (formData)=>{
        try{
            await api.post(`properties/properties/`,formData,{
                headers:{
                    "Content-Type":"multipart/form-data"
                }
            })
            alert("Property added successfully")
            navigate("/owner-dashboard/my-properties")
        } catch(error){
            console.error(error);
            if (error.response){
                console.log(error.response.data)
                alert(JSON.stringify(error.response.data,null,2))
            }else{
                alert("Failed to add")
            }
        }
    }

    return(
        <div className="property-form-page">
            <div className="page-header">
            <h2>Add Property</h2>
            <p>Fill in all property details to publish your listing</p>
            </div>
            <PropertyForm onSubmit={handleAddProperty}/>
        </div>
    )
}
export default AddProperty;