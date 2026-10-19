import { useEffect,useState } from "react";
import api from "../../../api";
import PropertyCard from "../../../components/PropertyCard";
import "../../../css/myproperties.css"

function MyProperties(){
    const [properties, setProperties] = useState([])

    useEffect(() => {
        fetchProperties()
    },[])

    const fetchProperties = async()=>{
        try{
            const response = await api.get("properties/properties/my_properties/")
                setProperties(response.data)
        }catch(error){
            console.error(error)
            if(error.response?.data){
                console.log(error.response.data)
            }
            alert("Failed to load properties.")
        }
    }

    const handleDelete = async(id) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this property?")
        if(!confirmDelete) return

        try{
            await api.delete(`properties/properties/${id}/`)
            setProperties((prev) =>
                prev.filter((property) => property.id !== id) 
            )
            alert("Property deleted successfully.")
        }catch(error){
            console.error(error)
            if(error.response?.data){
                console.log(error.response.data)
            }
            alert("Failed to delete property.")
        }
    }

    const handleAvailable = async (id) =>{
        try{
            await api.patch(`properties/properties/${id}/activate/`)
            await fetchProperties()
            alert("Property marked as available")
            
        }catch(error){
            console.error(error)
            if(error.response?.data){
                console.log(error.response.data)
        }
        alert("Failed to update property")
    }
}
    const handleUnavailable = async (id)=>{
        try{
            await api.patch(`properties/properties/${id}/deactivate/`)
            await fetchProperties()
            alert("Property marked as unavailable")
            
        }catch(error){
            console.error(error)
            if(error.response?.data){
                console.log(error.response.data)
            }
            alert("Failed to update property.")
        }
    }
    return(
        <div className="my-properties">
            <div>
            <h2>My Properties</h2>
            <p>Manage all your listed properties.</p>
            </div>
            {properties.length === 0 ? (
                <h3>No Properties found.</h3>
            ):(
                <div className="property-grid">
                    {properties.map((property) => (
                        <PropertyCard 
                        key={property.id} 
                        property={property} 
                        showActions={true} 
                        onDelete={handleDelete} 
                        onAvailable={handleAvailable} 
                        onUnavailable={handleUnavailable}/>
                    ))}
                </div>
            )}
        </div>
    )
}
export default MyProperties;