import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../api";
import "../css/publicprofile.css"

function OwnerProfile(){
    const {id} = useParams()
    const [owner, setOwner] = useState(null)
    const [properties, setProperties] = useState([])

    useEffect(() =>{
        fetchOwner()
        fetchProperties()
    },[id])

    const fetchOwner = async()=>{
        try{
            const response = await api.get(`accounts/users/${id}/public_profile/`)
            setOwner(response.data)
        }catch(error){
            console.log(error)
        }
    }

    const fetchProperties = async()=>{
        try{
            const response = await api.get(`accounts/users/${id}/properties/`)
            setProperties(response.data)
        }catch(error){
            console.log(error)
        }
    }

if (!owner) {
    return (
        <div className="profile-page">
            <p>Owner not found.</p>
        </div>
    );
}

    return(
        <div className="profile-page">
            
            <div className="profile-card">
                <img src={owner.profile_picture || "/default-profile.png"} alt="Profile" className="profile-image"/>

                <div className="profile-details">
                <h2>{owner?.full_name}</h2>
                <p>{owner.bio || "No bio available"}</p>
                <p>📍{owner.city}, {owner.state}</p>
                <p>{owner.email}</p>
                <div className="profile-stats">
                    <div>
                        <h3>{owner.total_properties}</h3>
                        <span>
                            Properties
                        </span>
                    </div>
                    <div>
                        <h3>{owner.available_properties}</h3>
                        <span>Available</span>
                    </div>
                </div>
            </div>
            </div>

            <div className="property-section">
                <h2>
                    Properties Listed
                </h2>
                {properties.length === 0 ? (
                    <p>No properties available</p>
                ):(
                    <div className="property-grid">
                        {properties.map(property=>(
                            <div className="property-card" key={property.id}>
                                <img src={property.cover_image}/>
                                <h3>{property.title}</h3>
                                <p>📍{property.city}</p>
                                <p>₹ {property.monthly_rent}</p>
                                <Link to={`/properties/${property.id}`}>
                                  View Property
                                </Link>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}
export default OwnerProfile;