import { useEffect,useState } from "react";
import { useNavigate,useParams } from "react-router-dom";
import api from "../../../api";
import PropertyForm from "../../../components/PropertyForm";

function EditProperty(){
    const {id} = useParams()

    const navigate = useNavigate()
    const[property, setProperty] = useState({})

    useEffect(() => {
        const fetchProperty = async() => {
        try{
            const response = await api.get(`properties/properties/${id}/`)
            setProperty(response.data)
        }catch(error){
            console.error(error)
            alert("Property not found.")
            navigate("/owner-dashboard/my-properties")
        }
        
    }
        fetchProperty();
    },[id])

    const handleUpdateProperty = async(formData) => {
        try{
          
            await api.patch(`properties/properties/${id}/`,formData,{
                headers:{
                    "Content-Type":"multipart/form-data"
                },
            })
            alert("Property updated successfully")
            navigate("/owner-dashboard/my-properties");
        }catch(error){
            console.error(error)
            if (error.response?.data){
                console.log(error.response.data)
            }
            alert("Failed to update property")
        }
    }

    return(
        <div className="property-form-page">
            <div className="page-header">
            <h2>Edit Property</h2>
            <p>Update your property indormations.</p>
            </div>
            {property && (
            <PropertyForm initialData={property} onSubmit={handleUpdateProperty}  />
            )}
        </div>
    )
}
export default EditProperty;