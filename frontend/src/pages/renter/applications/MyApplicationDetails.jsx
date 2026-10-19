import { useState,useEffect } from "react";
import { useNavigate,useParams } from "react-router-dom";
import api from "../../../api";
import StatusBadge from "../../../components/StatusBadge";
import "../../../css/rentalapplications.css";

function MyApplicationDetails(){

    const {id} = useParams()
    const navigate = useNavigate()
    const [application, setApplication]=useState(null)
    const [cancelReason, setCancelReason]=useState("")

    useEffect(()=>{
        fetchApplication()
    },[id])

    const fetchApplication = async()=>{
        try{
            const response = await api.get(`application/rental-application/${id}/`)
            setApplication(response.data)
        }catch(error){
            console.log(error)
        }
    }

    const cancelApplication = async() => {
        try{
            await api.patch(`application/rental-application/${id}/cancel/`,{
                cancellation_reason: cancelReason
            })
            alert("Application cancelled.")
            fetchApplication()
            setCancelReason("")
        }catch(err){
            console.log(err)
        }
    }

    if(!application){
        return(
            <div className="application-details-page">
                <p>Loading...</p>
            </div>
        )
    }

    return (
        <div className="application-details-page">
            <div className="details-header">
                <button className="back-btn" onClick={()=>navigate(-1)}>
                    Back
                </button>
                <h2>Rental Application Deatils</h2>
            </div>

            <div className="details-card">
                <div className="property-section">
                    <img src={application.property_image} className="property-image" alt={application.property_title}/>
                    
                    <div className="property-info">
                        <h3>{application.property_title}</h3>
                        <p>{application.property_city},{" "} {application.property_state}</p>
                        <p>₹ {application.monthly_rent}/month</p>
                        <p>
                            <strong>Property Status :</strong>{" "} {application.property_status}
                        </p>
                    </div>
                </div>

                <hr/>
                <h3>Application Overview</h3>
                <div className="details-grid">
                    <div>
                        <p>
                            <strong>Application ID :</strong> # {application.id}
                        </p>
                        <p>
                            <strong>Current Status : </strong>
                        </p>
                        <StatusBadge status={application.status}/>

                    </div>

                    <div >
                        <p>
                            <strong>Applied on :</strong>{" "} {new Date(application.created_at).toLocaleDateString()}
                        </p>
                        <p>
                            <strong>Last Updated :</strong>{" "} {new Date(application.updated_at).toLocaleDateString()}
                        </p>
                    </div>
                </div>

                <hr/>
                <h3>Owner & Visit Information</h3>

                <div className="details-grid">
                    <div>
                        <p><strong>Owner :</strong>{" "} {application.owner_name}</p>
                        
                    </div>
                    <div>
                        <p>
                            <strong>Visit Date :</strong>
                            {new Date(application.visit_date).toLocaleDateString()}
                        </p>
                        <p>
                            <strong>Last Updated</strong>
                            {new Date(application.updated_at).toLocaleDateString()}
                        </p>
                    </div>
                </div>

                <hr/>

                <h4>Application Message</h4>
                <p>{application.message || "No message provided."}</p>

                {application.owner_message && (
                    <>
                    <hr/>
                    <h4>Owner Message</h4>
                    <p>{application.owner_message}</p>
                    </>
                )}

                {application.status === "Rejected" && application.rejection_reason &&(
                    <>
                    <hr/>
                    <h4>Rejection Reason</h4>
                    <p>{application.rejection_reason}</p>
                    </>
                )}

                {application.status === "Cancelled" && application.cancellation_reason &&(
                    <>
                    <h4>Cancellation Request</h4>
                    <p>{application.cancellation_reason}</p>
                    </>
                )}

                {application.status === "Pending" &&(
                    <>
                    <hr/>
                    <div className="action-section">
                        <h4>Cancel Application</h4>
                        <textarea rows="4" placeholder="Reason for cancellation" value={cancelReason} onChange={(e)=>setCancelReason(e.target.value)}/>
                        <button className="cancel-btn" onClick={cancelApplication}>
                            Cancel Application
                        </button>
                    </div>
                    </>
                )}

                {application.status === "Approved" && (
                    <>
                    <hr/>
                    <div className="success-message">
                        <h3>
                            Application Approved
                        </h3>
                        <p>Your rental application has
                            been approved.
                        </p>
                        <p>The property owner will prepare your lease
                            agreement. You will be notified once it is 
                            ready for your review.
                        </p>
                    </div>
                    </>
                )}

                {application.status === "Rejected" && (
                    <>
                    <hr/>
                    <div className="info-message">
                        <h3>Application Rejected</h3>
                        <p>Your rental application was not approved.</p>
                    </div>
                    </>
                )}

                {application.status === "Cancelled" && (
                    <>
                    <hr/>
                    <div className="info-message">
                        <h3>Application Cancelled</h3>
                        <p>You cancelled this rental application.</p>
                    </div>
                    </>
                )}
            </div>
        </div>
    )
}
export default MyApplicationDetails
