import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../../api";
import "../../../css/leaseextension.css"

function RequestLeaseExtension(){
    const navigate = useNavigate()
    const [lease, setLease] = useState(null)
    const [formData, setFormData] = useState({
        requested_end_date: "",
        reason: "",
    })

    useEffect(() => {
        fetchLease()
    },[])

    const fetchLease = async ()=>{
        try{
            const response = await api.get("lease/lease/current/")
            if(response.data.has_current_lease){
                setLease(response.data.lease)
            }else{
                setLease(null)
            }
            
        }catch(error){
            console.log(error)
            alert("Unable to load active lease.")
        }
    }

    const handleChange = (e) => {
        setFormData({
            ...formData,[e.target.name]: e.target.value,
        })
    }

    const handleSubmit = async(e) => {
        e.preventDefault()
        if(!lease) return;
        try{
            await api.post("lease/lease-extension/request_extension/",{
                lease: lease.id,
                requested_end_date: formData.requested_end_date,
                reason: formData.reason
            })

            alert("Lease extension request submitted.")
            navigate("/renter-dashboard/lease-extension")
        }catch(error){
            console.log(error)
            alert("Unable to submit extension request.")
        }
    }

    if(!lease){
        return(
            <div>
                <p>loading...</p>
            </div>
        )
    }

    return(
        <div className="renter-page">
            <div className="page-header">
                <div>
                    <h2>Request Extension</h2>
                    <p>Request additional time for your current lease.</p>
                </div>
            </div>

            <form className="extension-form" onSubmit={handleSubmit}>
                <div className="details-card">
                    <div className="details-grid">
                        <div>
                            <label>Property</label>
                            <input type="text" value={lease.property_title} disabled/>
                        </div>

                        <div>
                            <label>Current End Date</label>
                            <input type="text" value={new Date(lease.lease_end).toLocaleDateString()} disabled/>
                        </div>
                    </div>
                    <div className="form-group">
                        <label>Requested End Date</label>
                        <input type="date" name="requested_end_date" onChange={handleChange} min={lease.lease_end}/>
                    </div>
                    <div className="form-group">
                        <label>Reason</label>
                        <textarea rows="6" name="reason" value={formData.reason} onChange={handleChange} placeholder="Why do you want to extend your lease?"/>
                    </div>
                    <div className="form-actions">
                        <button className="primary-btn" type="submit">
                            Submit Request
                        </button>
                        <button type="button" className="secondary-btn" onClick={()=>navigate(-1)}>
                            Cancel
                        </button>
                    </div>
                </div>
            </form>
        </div>
    )
}
export default RequestLeaseExtension;