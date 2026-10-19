import { useEffect,useState } from "react";
import { useNavigate,useParams } from "react-router-dom";
import api from "../../../api";
import "../../../css/maintenance.css"

function MaintenanceDetails(){
    const {id} = useParams()
    const navigate = useNavigate()

    const [request, setRequest] = useState(null)
    const [ownerResponse, setOwnerResponse] = useState("")

    useEffect(() => {
        fetchRequest()
    },[id])

    const fetchRequest= async() => {
        try{
            const response = await api.get(`maintenance/maintenance/${id}/`)
            setRequest(response.data)
            setOwnerResponse(response.data.owner_response || "")
        }catch(error){
            console.log(error)
        }
    }

    const updateStatus = async(status) => {
        try{
            await api.post(`maintenance/maintenance/${id}/update_status/`,{status})

            alert("Maintenance status updated.")
            fetchRequest()
        }catch(error){
            console.log(error)
            alert(error.response?.data?.error || "Unable to updated status.")
        }
    }

    const submitResponse = async() => {
        try{
            await api.post(`maintenance/maintenance/${id}/respond/`,{owner_response:ownerResponse,})

            alert("Response sent successfully.")
            fetchRequest()
        }catch(error){
            console.log(error);
            alert(error.response?.data?.error || "Unable to send response.")
        }
    }
    if(!request){
        return(
            <div>
                <p>loading...</p>
            </div>
        )
    }

    return(
        <div className="owner-page">
            <div className="details-header">
                <button className="back-btn" onClick={()=>navigate(-1)}>
                    Back
                </button>
                <h2>Maintenance Request</h2>
            </div>

            <div className="details-card">
                {request.image && (
                    <img src={request.image} alt={request.title} className="maintenance-image"/>
                )}

                <div className="details-grid">
                    <div>
                        <h3>{request.title}</h3>
                        <p>
                            <strong>Property :</strong>{" "}
                            {request.property_title}
                        </p>

                        <p>
                            <strong>Location :</strong>{" "}
                            {request.property_city},{" "}
                            {request.property_state}
                        </p>

                        <p>
                            <strong>Tenant : </strong>{" "}
                            {request.tenant_name}
                        </p>

                        <p>
                            <strong>Email :</strong>{" "}
                            {request.tenant_email}
                        </p>
                    </div>

                    <div>
                        <p>
                            <strong>Maintenance Type :</strong>{" "}
                            {request.maintenance_type}
                        </p>

                        <p>
                            <strong>Priority :</strong>{" "}
                            <span className={`priority-badge ${request.priority.toLowerCase().replace(/\s+/g,"-")}`}>
                            {request.priority}
                            </span>
                        </p>

                        <p>
                            <strong>Status :</strong>{" "}
                            <span className={`status-bdg ${request.status.toLowerCase().replace(/\s+/g,"-")}`}>
                            {request.status}
                            </span>
                        </p>

                        <p>
                            <strong>Created :</strong>{" "}
                            {new Date(request.created_at).toLocaleDateString()}
                        </p>

                        {request.resolved_at &&(
                            <p>
                                <strong>Resolved :</strong>{" "}
                                {new Date(request.resolved_at).toLocaleDateString()}
                            </p>
                        )}
                    </div>
                </div>
                <hr/>

                <h3>Description</h3>
                <p>{request.description}</p>
                <hr/>

                <div className="response-section">
                    <div className="section-title">
                        <h3>Owner Response</h3>
                        {request.owner_response && (
                            <span className="response-status">
                                Response Sent
                            </span>
                        )}
                    </div>
                    {request.owner_response && (
                        <div className="owner-response">
                            {request.owner_response}
                        </div>
                    )}
                    <label className="response-label">
                        {request.owner_response
                            ? "Update Response"
                            : "write Response"
                        }
                    </label>
                    <textarea rows="5" value={ownerResponse} onChange={(e)=>setOwnerResponse(e.target.value)} placeholder="Write a response"/>
                    
                <button className="primary-btn" onClick={submitResponse}>
                    {request.owner_response ? "Update Response" : "Send Response"}
                </button>
                </div>

                <hr/>

                <h3>Update Status</h3>
                <div className="status-actions">
                    <button className="status-btn" onClick={()=>updateStatus("Open")}>
                        Open
                    </button>
                    <button className="status-btn" onClick={()=>updateStatus("In Progress")}>
                        In Progress
                    </button>
                    <button className="status-btn" onClick={()=>updateStatus("Resolved")}>
                        Resolved
                    </button>
                    <button className="status-btn" onClick={()=>updateStatus("Cancelled")}>
                        Cancelled
                    </button>
                </div>
            </div>
        </div>
    )
}
export default MaintenanceDetails;