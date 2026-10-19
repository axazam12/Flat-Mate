import { useEffect,useState } from "react";
import { useNavigate,useParams } from "react-router-dom";
import api from "../../../api";
import "../../../css/rentalapplications.css";

function RentalApplication(){
    const {visitId} = useParams()
    const navigate = useNavigate()
    
    const [visit, setVisit] = useState(null)

    const [formData, setFormData] = useState({message:""})

    useEffect(() => {
        fetchVisit()
    },[visitId])

    const fetchVisit = async() => {
        try{
            const response = await api.get(`visit/visit-request/${visitId}/`)
            setVisit(response.data)
        }catch(err){
            console.log(err)
        }
    }

    const handleChange = (e) =>{
        setFormData({
            ...formData,
            [e.target.name]:e.target.value,})
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        try{
            await api.post("application/rental-application/apply/",{
                visit_request: visitId,
                message : formData.message
            })
            alert("Application submitted successfully")
            navigate("/renter-dashboard/my-application")
        }catch(err){
            alert(err.response?.data?.error || "Error")
        }
    }
    if (!visit) {
    return <div>Loading...</div>;
    }

    return (
        <div className="rental-page">
            <div className="page-header">
                <h2>Rental Application</h2>
                <p>Submit your application for this property.</p>
            </div>

            <div className="details-card">
                <div className="property-section">
                    <img src={visit.property_details.cover_image} alt={visit.property_details.title} className="property-image"/>
                    <div className="property-info">
                        <h3>{visit.property_details.title}</h3>
                        <p>{visit.property_details.city}, {" "} {visit.property_details.state}</p>
                        <p>₹ {visit.property_details.monthly_rent}/month</p>
                        <p><strong>Owner : </strong>{visit.owner_name}</p>
                        <p><strong>Visited On : </strong>{" "} {visit.visit_date}</p>
                    </div>
                </div>

                <form onSubmit={handleSubmit}>
                    <label>Message to Owner</label>
                    <textarea placeholder="Tell the owner why you're interested in renting this property..."
                    name="message" value={formData.message} onChange={handleChange}/>
                     <div className="form-buttons">
                     <button type="submit" className="primary">Submit Application</button>
                     <button type="button" className="cancel-btn" onClick={()=>navigate(-1)}>Cancel</button>
                     </div>
                </form>
            </div>
                
            </div>
        )
    
}
export default RentalApplication;