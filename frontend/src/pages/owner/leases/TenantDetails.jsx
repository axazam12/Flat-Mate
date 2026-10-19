import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../../api";
import StatusBadge from "../../../components/StatusBadge";
import "../../../css/tenants.css";

function TenantDetails() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [tenant, setTenant] = useState(null);

    useEffect(() => {
        fetchTenant();
    }, [id]);

    const fetchTenant = async () => {
        try {
            const response = await api.get(`lease/lease/${id}/`);
            setTenant(response.data);
        } catch (error) {
            console.log(error);
        }
    };

    const completeLease = async () => {
        if (!window.confirm("Complete this lease?")) return;

        try {
            await api.post(`lease/lease/${id}/complete/`);
            alert("Lease completed successfully.");
            fetchTenant();
        } catch (error) {
            console.log(error);
        }
    };

    const terminateLease = async () => {
        const reason = window.prompt("Enter termination reason:");
        if (!reason) return;

        try {
            await api.post(`lease/${id}/terminate/`, {
                reason,
            });

            alert("Lease terminated successfully.");
            fetchTenant();
        } catch (error) {
            console.log(error);
        }
    };

    if (!tenant) {
        return (
            <div className="owner-page">
                <p>Loading...</p>
            </div>
        );
    }

    const leaseDuration =
        tenant.lease_start && tenant.lease_end
            ? `${tenant.lease_start} - ${tenant.lease_end}`
            : "-";

    return (
        <div className="owner-page">
            <div className="page-header">
                <div>
                    <h2>Tenant Details</h2>
                    <p>View tenant and current lease information.</p>
                </div>

                <button
                    className="secondary-btn"
                    onClick={() => navigate(-1)}
                >
                    Back
                </button>
            </div>

            <div className="details-card">

                <h3>Profile</h3>

                <div className="tenant-profile-header">
                    <div className="tenant-avatar">
                        {tenant.profile_picture ? (
                            <img
                                src={tenant.profile_picture}
                                alt={tenant.tenant_name} className="tenant-profile"
                            />
                        ) : (
                            <div className="avatar-placeholder">
                                {tenant.tenant_name?.charAt(0)}
                            </div>
                        )}
                    </div>

                    <div>
                        <h2>{tenant.tenant_name}</h2>
                        <StatusBadge status={tenant.status} />
                    </div>
                </div>

                <div className="details-grid">
                    <div>
                        <p><strong>Name:</strong> {tenant.tenant_name}</p>
                        <p><strong>Email:</strong> {tenant.tenant_email}</p>
                        <p><strong>Phone:</strong> {tenant.phone || "-"}</p>
                    </div>

                    <div>
                        <p><strong>Occupation:</strong> {tenant.occupation || "-"}</p>
                        <p><strong>Budget:</strong> ₹ {tenant.budget || "-"}</p>
                    </div>
                </div>

                <hr />

                <h3>Current Property</h3>

                <div className="property-section">
                    <img
                        src={tenant.property_image}
                        alt={tenant.property_title}
                        className="property-image"
                    />

                    <div className="property-info">
                        <h3>{tenant.property_title}</h3>

                        <p>{tenant.property_address}</p>

                        <p>
                            ₹ {Number(tenant.monthly_rent).toLocaleString()} /
                            month
                        </p>
                    </div>
                </div>

                <hr />

                <h3>Lease Information</h3>

                <div className="details-grid">
                    <div>
                        <p>
                            <strong>Status:</strong>{" "}
                            <StatusBadge status={tenant.status} />
                        </p>

                        <p>
                            <strong>Lease Type:</strong>{" "}
                            {tenant.lease_type || "-"}
                        </p>

                        <p>
                            <strong>Security Deposit:</strong> ₹{" "}
                            {Number(
                                tenant.security_deposit || 0
                            ).toLocaleString()}
                        </p>
                    </div>

                    <div>
                        <p>
                            <strong>Start Date:</strong>{" "}
                            {tenant.lease_start}
                        </p>

                        <p>
                            <strong>End Date:</strong>{" "}
                            {tenant.lease_end}
                        </p>

                        <p>
                            <strong>Duration:</strong>{" "}
                            {leaseDuration}
                        </p>
                    </div>
                </div>

                <hr />

                <h3>Quick Actions</h3>

                <div className="action-buttons">
                    {tenant.status === "Active" && (
                        <>
                            <button
                                className="complete-btn"
                                onClick={completeLease}
                            >
                                Complete Lease
                            </button>

                            <button
                                className="reject-btn"
                                onClick={terminateLease}
                            >
                                Terminate Lease
                            </button>
                        </>
                    )}

                    {tenant.status !== "Active" && (
                        <StatusBadge status={tenant.status} />
                    )}
                </div>

            </div>
        </div>
    );
}

export default TenantDetails;