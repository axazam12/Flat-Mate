import { Link,useNavigate,useParams } from "react-router-dom";
import { useState,useEffect } from "react";
import api from "../../../api";
import "../../../css/visitrequests.css"
import StatusBadge from "../../../components/StatusBadge"

function VisitRequestDetails(){
    const {id} =useParams()
    const navigate = useNavigate()

    const [visit, setVisit] = useState(null)
    const [cancelReason, setCancelReason] = useState("")
    const [rescheduleData, setRescheduleData] = useState({
        visit_date:"",
        visit_time:"",
        reason:""
    })
    
    useEffect(() => {
        fetchVisit();
    },[])

    const fetchVisit = async () =>{
        try{
            const response = await api.get(`visit/visit-request/${id}/`)
            setVisit(response.data)
        }catch(error){
            console.log(error)
        }
    }

    const cancelVisit = async () =>{
        try{
            await api.patch(`visit/visit-request/${id}/cancel/`,{cancellation_reason: cancelReason},)
            alert("Visit request cancelled.")
            fetchVisit()
        }catch(error){
            alert(error.response?.data?.error)
        }
    }

    const requestReschedule = async () =>{
        try{
            await api.patch(`visit/visit-request/${id}/request_reschedule/`,
            rescheduleData)
            alert("reschedule request sent.")
            fetchVisit()
        }catch(error){
            alert(error.response?.data?.error)
        }
    }

    const  acceptReschedule = async()=>{
        try{
            await api.patch(`visit/visit-request/${id}/accept_reschedule/`)
            fetchVisit()
        }catch(error){
            alert(error.response?.data?.error)
        }
    }

    const declineReschedule =async()=>{
        try{
            await api.patch(`visit/visit-request/${id}/decline_reschedule/`)
            fetchVisit()
        }catch(error){
            alert(error.response?.data?.error)
        }
    }
    if(!visit){
        return <div className="loading">Loading....</div>
    }

    return(
        <div className="visit-details-page">
            <div className="details-header">
            <button className="back-btn" onClick={() => navigate(-1)}>
                Back
            </button>
            <h2>Visit Request Details</h2>
            </div>
            <div className="details-card">
                <h2>Visit Request Details</h2>
                <img src={visit.property_details.cover_image || "https://via.placeholder.com/700x350"}
                alt={visit.property_details.title} className="property-image"/>

                <h3>{visit.property_details.title}</h3>
                <p>{visit.property_details.city},{" "} {visit.property_details.state}</p>
                <p> ₹ {visit.property_details.monthly_rent}/month</p>
                <StatusBadge status={visit.status}/>
                <hr/>
                <div className="details-grid">
                    <div>
                        <strong>Owner</strong>
                        <p>{visit.owner_name}</p>
                    </div>
                    <div>
                        <strong>Visit Date</strong>
                        <p>{visit.visit_date}</p>
                    </div>
                    <div>
                        <strong>Visit Time</strong>
                        <p>{visit.visit_time}</p>
                    </div>
                    <div>
                        <strong>Requested On</strong>
                        <p>{new Date(visit.created_at).toLocaleDateString()}</p>
                    </div>
                </div>
                <hr/>
                <h4>Message</h4>
                <p>{visit.message || "Now message provided."}</p>
                {visit.status === "Rejected" &&(
                    <>
                    <hr/>
                    <h4>Rejection Reason</h4>
                    <p>{visit.rejection_reason}</p>
                    </>
                )}
                {visit.status === "Cancelled" &&(
                    <>
                    <hr/>
                    <h4>Cancellation Reason</h4>
                    <p>{visit.cancellation_reason}</p>
                    </>
                )}

                {visit.status ==="Reschedule Requested" &&(
                    <>
                    <hr/>
                    <h4>Reschedule Details</h4>
                    <p>Requested BY : {visit.requested_by}</p>
                    <p>Proposed Date : {visit.proposed_visit_date}</p>
                    <p>Proposed Time : {visit.proposed_visit_time}</p>
                    <p>Reason : {visit.reschedule_reason}</p>
                    </>
                )}
                <hr/>
                {visit.status === "Pending" &&(
                    <div className="action-section">
                        <h4>Cancel Visit</h4>
                        <div className="action-form">
                            <div className="action-field">
                                <label>Cancellation Reason</label>
                        <textarea rows="4" placeholder="Cancellation reason" value={cancelReason} onChange={(e)=>setCancelReason(e.target.value)}/>
                            </div>

                            <button className="cancel-btn" onClick={cancelVisit}>
                                Cancel Request
                            </button>
                            </div>
                    </div>
                )}

                {(visit.status === "Pending" || visit.status ==="Approved") && (
                    <div className="action-section">
                        <h4>Request Reschedule</h4>
                        <div className="action-form">
                            <div className="action-field">
                                <label>New Date</label>
                                    <input type="date" value={rescheduleData.visit_date} 
                                        onChange={(e) => setRescheduleData({
                                        ...rescheduleData,visit_date: e.target.value
                                    })}/>
                            </div>

                             <div className="action-field">
                                <label>New Time</label>
                        <input type="time" value={rescheduleData.visit_time} 
                        onChange={(e) => setRescheduleData({
                            ...rescheduleData,visit_time: e.target.value
                        })}/>
                        </div>
                         <div className="action-field">
                                <label>Reason</label>
                        <textarea rows="4"
                        placeholder="Reason" value={rescheduleData.reason}
                        onChange={(e) => setRescheduleData({
                            ...rescheduleData,reason: e.target.value,
                        })}/>
                        </div>
                        <button className="primary-btn" onClick={requestReschedule}>
                            Send Request
                        </button>
                    </div>
                    </div>
                )}

                {visit.status ==="Reschedule Requested" && visit.requested_by === "Owner" &&(
                    <div className="action-buttons">
                        <button onClick={acceptReschedule} className="approve-btn">
                            Accept Reschedule
                        </button>
                        <button className="reject-btn" onClick={declineReschedule}>
                            Decline
                        </button>
                    </div>
                )}

                {visit.status ==="Completed" &&(
                    <div className="action-buttons">
                        <Link className="table-btn" to={`/renter-dashboard/reviews/new/${visit.property}`}>
                        Write Review
                        </Link>
                        <Link className="table-btn" to={`/renter-dashboard/rental-application/new/${visit.id}`}>
                        Apply for Rental
                        </Link>
                    </div>
                )}
            </div>
        </div>
    )
}
export default VisitRequestDetails;