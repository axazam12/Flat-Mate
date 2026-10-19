import { useState,useEffect } from "react";
import "../css/propertyform.css"

const defaultFormData = {
        title:"",
        description:"",
        property_type:"Apartment",
        security_deposit:"",
        monthly_rent:"",
        address:"",
        city:"",
        state:"",
        country:"India",
        pincode:"",
        max_occupants:1,
        bedrooms:"",
        bathrooms:"",
        area:"",
        latitude:"",
        longitude:"",
        floor:"",
        total_floors:1,
        furnishing: "Unfurnished",
        parking:false,
        status:"Available",
        amenities:[],
        images:[],
    }
function PropertyForm({initialData={},onSubmit}){
    const [amenity, setAmenity] = useState("")
    const [formData, setFormData] = useState(defaultFormData)

    useEffect(() => {
        if(initialData.id){
            setFormData({
                ...defaultFormData,
                ...initialData,
                floor: initialData.floor ?? 0,
                total_floors: initialData.total_floors ?? 1,
                latitude: initialData.latitude ?? "",
                longitude: initialData.longitude ?? "",
                area: initialData.area ?? "",
                bedrooms: initialData.bedrooms ?? "",
                bathrooms: initialData.bathrooms ?? "",
                amenities: initialData.amenities || [],
                images: initialData.images || []
            })
        }
    },[initialData])

    const handleAddAmenity = () => {
        if(!amenity) return
        if (formData.amenities.includes(amenity)){
            return
        }
        setFormData(prev => ({
            ...prev,
            amenities: [...prev.amenities,amenity],
        }))
        setAmenity("")
    }

    const handleChange = (e) => {
        const {name, value, type, checked} = e.target
        setFormData({
            ...formData,
            [name]:type==="checkbox"?checked:value,
        })
    }

    const handleSubmit=(e)=>{
        e.preventDefault();

        const data = new FormData()
        data.append("title",formData.title);
        data.append("description",formData.description)
        data.append("property_type",formData.property_type)
        data.append("security_deposit",formData.security_deposit)
        data.append("monthly_rent",formData.monthly_rent)
        data.append("address",formData.address)
        data.append("city",formData.city)
        data.append("state",formData.state)
        data.append("country",formData.country)
        data.append("pincode",formData.pincode)
        data.append("max_occupants",formData.max_occupants)
        data.append("bedrooms",formData.bedrooms)
        data.append("bathrooms",formData.bathrooms)
        data.append("area",formData.area)
        data.append("latitude",formData.latitude)
        data.append("longitude",formData.longitude)
        data.append("floor",formData.floor)
        data.append("total_floors",formData.total_floors)
        data.append("status",formData.status)
        data.append("furnishing",formData.furnishing)
        data.append("parking",formData.parking)
        
        formData.amenities.forEach((item) => {
            data.append("amenities",
                typeof item === "string" ? item :item.name
            );
        })
        formData.images.forEach((image) => {
            if (image instanceof File){
                data.append("images",image)
            }
        })
        onSubmit(data);
    }

    return(
        <div className="property-form-container">
        <h2>{initialData.id ?  "Edit Property" : "Add New Property"  }</h2>
        <form className="property-form" onSubmit={handleSubmit}>
            <div className="form-section">
                <h3>Basic Information</h3>
            </div>
            <div className="form-group">
                <label>Title</label>
                <input type="text" name="title" value={formData.title} onChange={handleChange} required/>
            </div>
            <div className="form-group full-width">
                <label>Description</label>
                <textarea name="description" value={formData.description} onChange={handleChange} required/>
            </div>
            <div className="form-group">
                <label>Property Type</label>
                <select name="property_type" value={formData.property_type} onChange={handleChange} required>
                    <option value="Apartment">Apartment</option>
                    <option value="House">House</option>
                    <option value="Villa">Villa</option>
                    <option value="Studio">Studio</option>
                    <option value="Commercial">Commercial</option>
                    <option value="PG">PG</option>
                    <option value="Hostel">Hostel</option>
                </select>
            </div>

            <div className="form-section">
                <h3>Pricing</h3>
            </div>
            <div className="form-group">
                <label>Security Deposit</label>
                <input type="number" name="security_deposit" value={formData.security_deposit} onChange={handleChange}/>
            </div>
             <div className="form-group">
                <label>Monthly Rent</label>
                <input type="number" name="monthly_rent" value={formData.monthly_rent} onChange={handleChange} required/>
            </div>

            <div className="form-section">
                <h3>Location</h3>
            </div>
            <div className="form-group full-width">
                <label>Address</label>
                <textarea name="address" value={formData.address} onChange={handleChange} required/>
            </div>
            <div className="form-group">
                <label>City</label>
                <input type="text" name="city" value={formData.city} onChange={handleChange} required/>
            </div>
            <div className="form-group">
                <label>State</label>
                <input type="text" name="state" value={formData.state} onChange={handleChange} required/>
            </div>
            <div className="form-group">
                <label>Country</label>
                <input type="text" name="country" value={formData.country} onChange={handleChange} required/>
            </div>
            <div className="form-group">
                <label>Pincode</label>
                <input type="text" name="pincode" value={formData.pincode} onChange={handleChange} required/>
            </div>

            <div className="form-section">
                <h3>Property Details</h3>
            </div>
            <div className="form-group">
                <label>Bedrooms</label>
                <input type="number" min="1" name="bedrooms" value={formData.bedrooms} onChange={handleChange} required/>
            </div>
            <div className="form-group">
                <label>Bathrooms</label>
                <input type="number" min="1" name="bathrooms" value={formData.bathrooms} onChange={handleChange} required/>
            </div>
            <div className="form-group">
                <label>Area (sq.ft)</label>
                <input type="number" min="1" step="0.01" name="area" value={formData.area} onChange={handleChange} required/>
            </div>
            <div className="form-group">
                <label>Maximum Occupants</label>
                <input type="number" min="1" name="max_occupants" value={formData.max_occupants} onChange={handleChange} />
            </div>
            <div className="form-group">
                <label>Latitude</label>
                <input type="number" step="0.000001" name="latitude" value={formData.latitude} onChange={handleChange} />
            </div>
            <div className="form-group">
                <label>Longitude</label>
                <input type="number" step="0.000001" name="longitude" value={formData.longitude} onChange={handleChange} />
            </div>
            <div className="form-group">
                <label>Floor</label>
                <input type="number" min="0"  name="floor" value={formData.floor} onChange={handleChange} />
            </div>
            <div className="form-group">
                <label>Total Floors</label>
                <input type="number" min="1" name="total_floors" value={formData.total_floors} onChange={handleChange} />
            </div>

            <div className="form-group">
                <label>Status</label>
                <select name="status" value={formData.status} onChange={handleChange}>
                    <option value="Available">Available</option>
                    <option value="Occupied">Occupied</option>
                    <option value="Deactivated">Deactivated</option>
                </select>
            </div>

            <div className="form-section">
                <h3>Images</h3>
            </div>

            <div className="form-group full-width">
                <label>Property Images</label>
                <input type="file" multiple accept="image/*" name="images" 
                onChange={(e) => 
                    setFormData((prev) => ({
                        ...prev,
                        images: [...prev.images,...Array.from(e.target.files)],
                        }))
                    }/>
                <div className="image-preview">

                    {formData.images.map((image,index) =>{
                        let imageUrl = ""
                        if(image instanceof File){
                            imageUrl = URL.createObjectURL(image)
                        }else if(image.image){
                            imageUrl = `http://localhost:8000${image.image}`;
                        }
                    return (
                        <div className="image-card" key={index}>
                            <img key={index} src={imageUrl} alt="property"/>
                            <button type="button" className="image-remove" onClick={()=> 
                                setFormData(prev => ({
                                    ...prev,images:prev.images.filter((_, i) => i !== index)
                                }))
                            }>
                                 ×
                            </button>
                        </div>
                    )})}
                </div>
            </div>

            <div className="form-section">
                <h3>Amenities</h3>
            </div>

            <div className="form-group full-width">
                <label>Amenities</label>
                <div className="amenity-input">
                    <select value={amenity} onChange={(e) => setAmenity(e.target.value)}>
                        <option value="">Select Amenities</option>
                        <option value="WiFi">WiFi</option>
                        <option value="AC">Air Conditioning</option>
                        <option value="Swimming Pool">Swimming Pool</option>
                        <option value="Gym">Gym</option>
                        <option value="Power Backup">Power Backup</option>
                        <option value="Lift">Lift</option>
                        <option value="Garden">Garden</option>
                        <option value="Security">Security</option>
                        <option value="Pet Friendly">Pet Friendly</option>
                        <option value="Children Play Area">Children Play Area</option>
                        <option value="Club House">Club House</option>
                        <option value="Water Supply">24x7 Water Supply</option>
                        <option value="Balcony">Balcony</option>
                    </select>
                    <button type="button" className="amenity-btn" onClick={handleAddAmenity}>Add</button>
                </div>
            
            
            <div className="selected-amenities">
                {formData.amenities.map((item,index) => (
                    <div key={index} className="amenity-chip">
                        {typeof item === "string" ? item : item.name}
                        <button type="button" onClick={() => setFormData(prev => ({
                            ...prev,amenities:prev.amenities.filter((
                                amenity) => (typeof amenity === "string" ? amenity :amenity.name) !==
                                (typeof item === "string" ? item : item.name)
                            )
                        }))
                    }>
                        ×
                    </button>
                    </div>
                ))}
            </div>
            </div>
            
            <div className="checkbox-group">
                
                <select name="furnishing" value={formData.furnishing} onChange={handleChange}>
                    <option value="Unfurnished">Unfurnished</option>
                    <option value="Semi furnished">Semi furnished</option>
                    <option value="Fully furnished">Fully furnished</option>
                </select>
                <label>
                <input type="checkbox" name="parking" checked={formData.parking} onChange={handleChange}/>
                    Parking
                </label>
            </div>
            <button type="submit" className="submit-btn" >
                {initialData.id ? "Update Property" : "Add Property"}
            </button>
        </form>
        </div>
    )
}
export default PropertyForm;