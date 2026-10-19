import { useEffect, useState } from "react"
import { Link, useNavigate, useParams } from "react-router-dom"
import api from "../../../api"
import StatusBadge from "../../../components/StatusBadge";
import "../../../css/rentalapplications.css";

function OwnerApplicationDetails() {
    const { id } = useParams()
    const navigate = useNavigate()
    const [application, setApplication] = useState(null)
    const [ownerMessage, setOwnerMessage] = useState("")
    const [rejectReason, setRejectReason] = useState("")

    useEffect(() => {
        fetchApplication()
    }, [id])

    const fetchApplication = async () => {
        try {
            const response = await api.get(`application/rental-application/${id}/`)
            setApplication(response.data)
            setOwnerMessage(response.data.owner_message || "")
            setRejectReason(response.data.rejection_reason || "")
        } catch (error) {
            console.log(error)
        }
    }

    const approvedApplication = async () => {
        try {
            await api.patch(`application/rental-application/${id}/approve/`, {
                owner_message: ownerMessage
            })
            alert("Application approved")
            fetchApplication()
        } catch (error) {
            console.log(error)
        }
    }

    const rejectApplication = async () => {
        try {
            await api.patch(`application/rental-application/${id}/reject/`, {
                owner_message: ownerMessage,
                reason: rejectReason
            })
            alert("Application rejected.")
            setRejectReason("")
            fetchApplication()
        } catch (error) {
            console.log(error)
        }
    }
    if (!application) {
        return (
            <div className="application">
                <p>Loading....</p>
            </div>
        )
    }

    return (
        <div className="application-details-page">
            <div className="details-header">
                <button className="back-btn" onClick={() => navigate(-1)}>
                    Back
                </button>
                <h2>Rental Application Details</h2>
            </div>

            <div className="details-card">
                <div className="property-section">

                    <img src={application.property_image} className="property-image" alt={application.property_title} />

                    <div className="property-info">
                        <h3>{application.property_title}</h3>
                        <p>{application.property_city},{" "} {application.property_state}</p>
                        <p>₹ {application.monthly_rent}/month</p>
                        <p>
                            <strong>Property Status :</strong>{application.property_status}

                        </p>
                    </div>
                </div>
                <hr />

                <h3>Application Overview</h3>
                <div className="details-grid">
                    <div>
                        <p><strong>Application ID :</strong> #{application.id}</p>
                        <p><strong>Current Status :</strong></p>
                        <StatusBadge status={application.status} />
                    </div>

                        <div>
                            <p><strong>Applied on : </strong>{" "} {new Date(application.created_at).toLocaleDateString()}</p>
                            <p><strong>Last Updated : </strong>{" "} {new Date(application.updated_at).toLocaleDateString()}</p>

                        </div>
                    </div>

                    <hr />

                    <h3>Applicant Details</h3>
                    <div className="details-grid">
                        <div>
                            <p><strong>Name : </strong>{" "} {application.renter_name}</p>
                            <p><strong>Email : </strong>{" "} {application.renter_email}</p>
                        </div>
                        <div>
                            <p><strong>Visit Date : </strong>{" "} {new Date(application.visit_date).toLocaleDateString()}</p>
                            <p><strong>Visit Time : </strong>{application.visit_time}</p>
                        </div>
                    </div>

                    <hr />

                    <h3>Application Message</h3>
                    <p>{application.message || "No message provided."}</p>

                    {application.owner_message && (
                        <>
                            <hr />
                            <h4>Owner Message</h4>
                            <p>{application.owner_message}</p>
                        </>
                    )}

                    {application.status === "Rejected" && application.rejection_reason && (
                        <>
                            <hr />
                            <h4>Rejection Reason</h4>
                            <p>{application.rejection_reason}</p>
                        </>
                    )}

                    {application.status === "Cancelled" && application.cancellation_reason && (
                        <>
                            <hr />
                            <h4>Cancellation Reason</h4>
                            <p>{application.cancellation_reason}</p>
                        </>
                    )}

                    {application.status === "Pending" && (
                        <>
                            <hr />

                            <div className="action-section">
                                <h3>Approve Application</h3>
                                <textarea rows="4" placeholder="Message to renter(Optional)" value={ownerMessage} onChange={(e) => setOwnerMessage(e.target.value)} />
                                <button className="approve-btn" onClick={approvedApplication}>
                                    Approve Application
                                </button>

                                <hr />
                                <h3>Reject Application</h3>
                                <textarea rows="4" placeholder="Reason for rejection" value={rejectReason} onChange={(e) => setRejectReason(e.target.value)} />
                                <textarea rows="4" placeholder="Message to renter(optional)" value={ownerMessage} onChange={(e) => setOwnerMessage(e.target.value)} />
                                <button className="reject-btn" onClick={rejectApplication}>
                                    Reject Application
                                </button>
                            </div>
                        </>
                    )}

                    {application.status === "Approved" && (
                        <>
                            <hr />
                            <div className="success-message">
                                <h3>
                                    Application Approved
                                </h3>
                                <p>This application has been approved.
                                    You can now prepare the lease agreement.
                                </p>
                                <Link className="table-btn"
                                    to={`/owner-dashboard/lease/create/${application.id}`}>
                                    Create Lease
                                </Link>
                            </div>
                        </>
                    )}

                    {application.status === "Rejected" && (
                        <>
                            <hr />
                            <div className="info-message">
                                <h3>
                                    Application Rejected
                                </h3>
                                {application.owner_message && (
                                    <>
                                        <hr />
                                        <h4>Owner Message</h4>
                                        <p>{application.owner_message}</p>
                                    </>
                                )}
                            </div>
                        </>

                    )}

                    {application.status === "Cancelled" && (
                        <>
                            <hr />
                            <div className="info-message">
                                <h3>
                                    Application Cancelled
                                </h3>
                                <p>Then renter cancelled this application.</p>
                            </div>
                        </>
                    )}
                </div>
            </div>
            )

}
export default OwnerApplicationDetails;