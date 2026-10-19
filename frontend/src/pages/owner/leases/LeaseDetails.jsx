import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import api from "../../../api";
import StatusBadge from "../../../components/StatusBadge";
import "../../../css/ownerleases.css"

function LeaseDetails() {
    const { id } = useParams()
    const navigate = useNavigate()
    const [lease, setLease] = useState(null)
    const [showTerminateForm, setShowTerminateForm] = useState(false)
    const [terminationReason, setTerminationReason] = useState("")

    useEffect(() => {
        fetchLease()
    }, [id])

    const fetchLease = async () => {
        try {
            const response = await api.get(`lease/lease/${id}/`)
            setLease(response.data)
        } catch (error) {
            console.log(error)
        }
    }

    const completeLease = async () => {
        if (!window.confirm("Mark this lease as completed?")) return;
        try {
            await api.post(`lease/lease/${id}/complete/`)
            alert("Lease completed successfully.")
            fetchLease()
        } catch (error) {
            console.log(error)
        }
    }

    const terminateLease = async () => {
        if (!terminationReason) {
            alert("Termination reason is required.")
            return
        }
        try {
            await api.post(`lease/lease/${id}/terminate/`, {
                reason: terminationReason
            })
            fetchLease()
            setShowTerminateForm(false)
        } catch (error) {
            console.log(error)
        }
    }

    if (!lease) {
        return (
            <div className="owner-page">
                <p>Loading lease.....</p>
            </div>
        )
    }

    return (
        <div className="owner-page">
            <div className="page-header">
                <div>
                    <h2>Lease Details</h2>
                    <p>Complete information about this lease.</p>
                </div>
                <button className="seconadry-btn" onClick={() => navigate(-1)}>
                    Back
                </button>
            </div>

            <div className="details-card">
                <div className="lease-status-card">
                    <h3>Current Status</h3>

                    <div className="status-row">
                        <StatusBadge status={lease.status} />
                    </div>

                    <div className="details-grid">
                        <div>
                            <p>
                                <strong>Lease Type : </strong>
                                {lease.lease_type}
                            </p>
                            <p>
                                <strong>Created : </strong>
                                {new Date(lease.created_at).toLocaleDateString()}
                            </p>
                        </div>
                        <div>
                            <p>
                                <strong>Accepted : </strong>
                                {lease.accepted_at ? new Date(lease.accepted_at).toLocaleDateString() : "-"}
                            </p>

                            <p>
                                <strong>Ends : </strong>
                                {lease.lease_end}
                            </p>
                        </div>
                    </div>
                </div>

                <hr />

                <div className="property-section">
                    <h3>Property Information</h3>

                    <img src={lease.property_image} className="property-image" />

                    <div className="property-info">
                        <h3>{lease.property_title}</h3>
                        <p>{lease.property_city}, {lease.property_state}</p>

                        <p><strong>Monthly Rent : </strong>
                            ₹ {Number(lease.monthly_rent).toLocaleString()} / month
                        </p>
                    </div>
                </div>

                <hr />

                <div className="details-grid">
                    <div>
                        <h3>Tenant Information</h3>
                        <p><strong>Name :</strong> {lease.tenant_name}</p>
                        <p><strong>Email :</strong> {lease.tenant_email}</p>
                        <Link className="table-btn"
                            to={`/owner-dashboard/tenants/${lease.id}`}>View Tenant</Link>
                    </div>

                    <div>
                        <h3>Lease Information</h3>
                        <p><strong>Start Date :</strong>{" "} {lease.lease_start}</p>
                        <p><strong>End Date :</strong>{" "} {lease.lease_end}</p>
                        <p><strong>Security Deposite :</strong>₹ {lease.security_deposit}</p>

                    </div>
                </div>

                <hr />
                <div className="lease-timeline">
                    <h3>Lease Timeline</h3>
                    <div className="timeline">
                        <div className="timeline-item completed">✓ Created</div>
                        <div className="timeline-item completed">✓ Sent to Tenant</div>

                        <div className={lease.accepted_at
                            ? "timeline-item completed"
                            : "timeline-item"
                        }>
                            {lease.accepted_at ? "✓ Accepted" : "○ Accepted"}
                        </div>

                        <div className={
                            lease.status === "Active" || lease.status === "Completed" ? "timeline-item completed" : "timeline-item"
                        }>
                            ✓ Active
                        </div>

                        <div className={
                            lease.status === "Completed"
                                ? "timeline-item completed"
                                : lease.status === "Terminated"
                                    ? "timeline-item failed"
                                    : "timeline-item"
                        }>
                            {lease.status === "Terminated"
                                ? "✕ Terminated"
                                : "✓ Completed"
                            }
                        </div>
                    </div>
                </div>

                <hr />
                <div className="details-grid">

                    {lease.accepted_at && (
                        <div className="info-card">
                            <h4>Accepted Date</h4>
                            <p>{new Date(lease.accepted_at).toLocaleDateString()}</p>
                        </div>
                    )}
                    {lease.completed_at && (
                        <div className="info-card">
                            <h4>Completed Date</h4>
                            <p>{new Date(lease.completed_at).toLocaleDateString()}</p>
                        </div>
                    )}
                </div>

                {lease.termination_reason && (
                    <>
                        <hr />
                        <div className="info-card">
                            <h4>Termination Reason</h4>
                            <p>{lease.termination_reason}</p>
                        </div>
                    </>
                )}
                {lease.decline_reason && (
                    <>
                        <hr />
                        <div className="info-card">
                            <h4>Decline Reason</h4>
                            <p>{lease.decline_reason}</p>
                        </div>
                    </>
                )}

                <hr />
                <div className="documents-section">
                    <h3>Documents</h3>
                    <div className="documents-grid">
                        <div className="document-card">
                            <h4>Rental Agreement</h4>
                            <p>Available soon</p>
                        </div>
                        <div className="document-card">
                            <h4>Rent Receipt</h4>
                            <p>Available soon</p>
                        </div>
                        <div className="document-card">
                            <h4>Payment History</h4>
                            <p>Available soon</p>
                        </div>
                    </div>
                </div>

                {lease.status === "Active" && (
                    <>
                        <hr />
                        <div className="management-section">
                            <h3>Lease Actions</h3>
                            <div className="action-buttons">
                                <button className="complete-btn" onClick={completeLease}>
                                    Complete Lease
                                </button>
                                <button className="terminate-btn" onClick={() => setShowTerminateForm(true)}>
                                    Terminate Lease
                                </button>
                            </div>
                        </div>
                    </>
                )}

                {showTerminateForm && (
                    <div className="terminate-form">
                        <h3>Terminate Lease</h3>
                        <textarea value={terminationReason}
                            onChange={(e) => setTerminationReason(e.target.value)}
                            placeholder="Enter termination reason..." />

                        <div className="modal-actions">
                            <button className="secondary-btn" onClick={() => setShowTerminateForm(false)}>
                                Cancel
                            </button>
                            <button className="reject-btn" onClick={terminateLease}>
                                Confirm Termination
                            </button>
                        </div>
                    </div>
                )}

            </div>
        </div>

    )

}
export default LeaseDetails;