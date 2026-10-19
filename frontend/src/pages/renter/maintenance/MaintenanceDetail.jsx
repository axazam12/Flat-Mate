import { useEffect,useState } from "react";
import { Link, useNavigate,useParams } from "react-router-dom";
import api from "../../../api";
import "../../../css/maintenance.css"

function MaintenanceDetail(){
    const {id} = useParams()
    const navigate = useNavigate()

    const [request, setRequest] = useState(null)

    useEffect(() => {
        fetchRequest()
    },[id])

    const fetchRequest = async() => {
        try{
            const response = await api.get(`maintenance/maintenance/${id}/`)
            setRequest(response.data)
        }catch(error){
            console.log(error)
        }
    }

     const handleDelete = async() => {
        if(!window.confirm("Cancel this maintenance request?")) return

        try{
            await api.delete(`maintenance/maintenance/${id}/`)
            alert("Maintenance request cancelled.")
            navigate("/renter-dashboard/maintenance")
        }catch(error){
            console.log(error)
            alert("Unable to delete request")
        }
    }

    if(!request){
        return (
            <div>
                <p>Loading...</p>
            </div>
        )
    }
    return(
        <div className="maintenance-page">
            <div className="details-header">
                <button className="back-btn" onClick={()=>navigate(-1)}>
                    Back
                </button>
                <h2>Maintenance Details</h2>
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
                            <strong>Owner : </strong>{" "}
                            {request.owner_name}
                        </p>

                        <p>
                            <strong>Maintenance Type :</strong>{" "}
                            {request.maintenance_type}
                        </p>
                    </div>

                    <div>
                        <p>
                            <strong>Priority :</strong>{" "}
                            <span className={`priority-bagde ${request.priority.toLowerCase().replace(/\s+/g,"-")}`}>
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

                {request.owner_response && (
                    <>
                    <hr/>
                    <h3>Owner Response</h3>
                    <div className="owner-response">
                        {request.owner_response}
                    </div>
                    </>
                )}

                {request.status === "Open" && (
                    <>
                    <hr/>
                    <div className="details-actions">
                        <Link to={`/renter-dashboard/maintenance/edit/${request.id}`} className="edit-btn">
                        Edit Request
                        </Link>
                        <button className="delete-btn" onClick={handleDelete}>
                            Cancel Request
                        </button>
                    </div>
                    </>
                )}
            </div>
        </div>
    )
}
export default MaintenanceDetail;