import { useEffect,useState } from "react"
import { useNavigate,useParams } from "react-router-dom"
import api from "../../../api"
import StatusBadge from "../../../components/StatusBadge";
import "../../../css/visitrequests.css"

function OwnerVisitRequestDetails(){
    const {id} = useParams()
    const navigate = useNavigate()
    const [visit, setVisit] = useState(null)
    const [rejectReason, setRejectReason] = useState("")
    const [rescheduleDate, setRescheduleData] = useState({visit_date:"",visit_time:"",reason:""})

    useEffect(()=>{
        fetchVisit()
    },[id])

    const fetchVisit= async()=>{
        try{
            const response = await api.get(`visit/visit-request/${id}/`)
            setVisit(response.data)
        }catch(error){
            console.log(error)
        }
    }
    const approveVisit = async() => {
        try{
            await api.patch(`visit/visit-request/${id}/approve/`)
             alert("Visit approved successfully.")
            fetchVisit()
        }catch(error){
            console.log(error)
        }
    }

    const rejectVisit = async() => {
        try{
            await api.patch(`visit/visit-request/${id}/reject/`,{reason:rejectReason})
             alert("Visit rejected successfully.")
             setRejectReason("")
            fetchVisit()
        }catch(error){
            console.log(error)
        }
    }

    const completeVisit = async() => {
        try{
            await api.patch(`visit/visit-request/${id}/complete/`)
             alert("Visit completed successfully.")
            fetchVisit()
        }catch(error){
            console.log(error)
        }
    }
    const requestReschedule = async() => {
        try{
            await api.patch(`visit/visit-request/${id}/request_reschedule/`,rescheduleDate)
             alert("Reschedule request sent.")
             setRescheduleData({visit_date:"",visit_time:"",reason:""})
            fetchVisit()
        }catch(error){
            console.log(error)
        }
    }
    const acceptReschedule = async() => {
        try{
            await api.patch(`visit/visit-request/${id}/accept_reschedule/`,rescheduleDate)
            fetchVisit()
        }catch(error){
            console.log(error)
        }
    }
    const declineReschedule = async() => {
        try{
            await api.patch(`visit/visit-request/${id}/decline_reschedule/`,rescheduleDate)
            fetchVisit()
        }catch(error){
            console.log(error)
        }
    }
    if(!visit){
        return <div className="loading">Loading....</div>
    }

    return(
        <div className="visit-details-page">
            <div className="details-header">
                <button className="back-btn" onClick={()=>navigate(-1)}>Back</button>
                <h2>Visit Request Details</h2>
            </div>
            <div className="details-card">
                <div className="property-section">
                    <img src={visit.property_details.cover_image} alt={visit.property_details.title} className="property-image"/>

                    <div className="property-info">
                        <h3>{visit.property_details.title}</h3>
                        <p>{visit.property_details.city},{" "} {visit.property_details.state}</p>
                        <p>₹ {visit.property_details.monthly_rent}/month</p>
                    </div>
                </div>
                 <StatusBadge status={visit.status} />
                 <hr/>
                 <div className="details-grid">
                    <div>
                        <h4>Renter</h4>
                        <p><strong>Name : </strong>{" "} {visit.renter_name}</p>
                        <p><strong>Email : </strong>{visit.renter_email}</p>
                    </div>
                    <div>
                        <h4>Visit Information</h4>
                        <p><strong>Date : </strong>{" "} {visit.visit_date}</p>
                        <p><strong>Time : </strong>{" "} {visit.visit_time}</p>
                        <p><strong>Requested On : </strong>{" "} {new Date(visit.created_at).toLocaleDateString()}</p>
                        <p><strong>Updated On : </strong>{" "} {new Date(visit.updated_at).toLocaleDateString()}</p>
                    </div>
                 </div>

                 <hr/>
                 <h4>Meassage from Renter</h4>
                 <p>{visit.message || "No message provided."}</p>
                 {visit.status === "Rejected" && visit.rejection_reason &&(
                    <>
                    <hr/>
                    <h4>Rejection Reason</h4>
                    <p>{visit.rejection_reason}</p>
                    </>
                 )}
                 {visit.status === "Cancelled" && visit.cancellation_reason &&(
                    <>
                    <hr/>
                    <h4>Cancellation Reason</h4>
                    <p>{visit.cancellation_reason}</p>
                    </>
                 )}
                 {visit.status === "Reschedule Requested" && (
                    <>
                    <hr/>
                    <h4>Reschedule Details</h4>
                    <p><strong>Requested BY : </strong>{" "} {visit.requested_by}</p>
                    <p><strong>Current Date : </strong>{" "} {visit.visit_date}</p>
                    <p><strong>Current Time : </strong>{" "} {visit.visit_time}</p>
                    <p><strong>Proposed Date : </strong>{" "} {visit.proposed_visit_date}</p>
                    <p><strong>Proposed Time : </strong>{" "} {visit.proposed_visit_time}</p>
                    <p><strong>Reason : </strong>{" "} {visit.reschedule_reason}</p>
                    </>
                 )}
                 <hr/>

                 {visit.status === "Pending" &&(
                    <div className="action-section">
                        <h3>Actions</h3>
                        <div className="action-buttons">
                            <button className="approve-btn" onClick={approveVisit}>
                                Approve Visit
                            </button>
                        </div>
                        <div className="form-section">
                            <h4>Reject Visit</h4>
                            <textarea rows="4" placeholder="Enter rejection reason.." value={rejectReason} onChange={(e)=>setRejectReason(e.target.value)}/>
                            <button className="reject-btn"onClick={rejectVisit}>Reject Visit</button>
                        </div>
                        <div className="form-section">
                            <h4>Request Reschedule</h4>
                            <input 
                            type="date" 
                            value={rescheduleDate.visit_date} 
                            onChange={(e)=>
                                 setRescheduleData({
                                    ...rescheduleDate,
                                    visit_date: e.target.value
                                })
                            }/>

                            <input type="time" value={rescheduleDate.visit_time} 
                            onChange={(e)=>setRescheduleData({...rescheduleDate,visit_time: e.target.value,})}/>

                            <textarea rows="4" placeholder="Reason for reschedule" value={rescheduleDate.reason} 
                            onChange={(e)=>setRescheduleData({...rescheduleDate,reason:e.target.value})}/>

                            <button className="primary-btn" onClick={requestReschedule}>Send Reschedule Request</button>
                        </div>
                    </div>
                 )}

                 {visit.status === "Approved" && (
                    <div className="action-section">
                        <h3>Actions</h3>
                        <button className="complete-btn" onClick={completeVisit}>
                            Mark as Completed
                        </button>

                        <div className="form-section">
                            <h4>Request Reschedule</h4>
                            <input type="date" value={rescheduleDate.visit_date} 
                            onChange={(e)=>setRescheduleData({...rescheduleDate,visit_date: e.target.value,})}/>

                            <input type="time" value={rescheduleDate.visit_time} 
                            onChange={(e)=>setRescheduleData({...rescheduleDate,visit_time: e.target.value,})}/>

                            <textarea rows="4" placeholder="Reason for reschedule" value={rescheduleDate.reason} 
                            onChange={(e)=>setRescheduleData({...rescheduleDate,reason:e.target.value})}/>

                            <button className="primary-btn"onClick={requestReschedule}>Send Reschedule Request</button>
                        </div>
                    </div>
                 )}

                 {visit.status === "Reschedule Requested" && (
                    <div className="action-section">
                        <h3>Reschedule Request</h3>
                        {visit.requested_by === "Renter" ? (
                            <div className="action-buttons">
                                <button className="approve-btn" onClick={acceptReschedule}>
                                    Accept Reschedule
                                </button>
                                <button className="reject-btn" onClick={declineReschedule}>
                                    Decline Reschedule
                                </button>
                            </div>
                        ):(
                            <div className="waiting-message">
                                <p>Waiting for renter to respond to your
                                    reschedule request
                                </p>
                            </div>
                        )}
                    </div>
                 )}
                {visit.status === "Completed" && (
                    <div className="success-message">
                        <h3>Visit Completed</h3>
                        <p>
                            This property visit has been completed successfully.
                        </p>
                    </div>
                )}

                {visit.status === "Rejected" && (
                    <div className="info-message">
                        <h3>Visit Rejected</h3>
                        <p>No further actions are available.</p>
                    </div>
                )}
                {visit.status === "Cancelled" && (
                    <div className="info-message">
                        <h3>Visit Cancelled</h3>
                        <p>This visit request has been cancelled.</p>
                    </div>
                )}

            </div>
        </div>
    );
}

export default OwnerVisitRequestDetails;