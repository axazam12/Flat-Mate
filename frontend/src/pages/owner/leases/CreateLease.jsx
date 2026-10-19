import { useEffect, useState } from "react";
import api from "../../../api";
import "../../../css/ownerleases.css";
import { useNavigate, useParams } from "react-router-dom";

function CreateLease() {
    const { applicationId } = useParams();
    const navigate = useNavigate();

    const [application, setApplication] = useState(null);
    const [leaseStart, setLeaseStart] = useState("");
    const [leaseEnd, setLeaseEnd] = useState("");

    useEffect(() => {
        fetchApplication();
    }, [applicationId]);

    const fetchApplication = async () => {
        try {
            const res = await api.get(`application/rental-application/${applicationId}/`);
            setApplication(res.data);
        } catch (error) {
            console.log(error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            await api.post("lease/lease/create_lease/", {
                application: applicationId,
                lease_start: leaseStart,
                lease_end: leaseEnd,
            });

            alert("Lease created successfully.");
            navigate("/owner-dashboard/lease");
        } catch (error) {
            console.log(error);
            alert(error.response?.data?.error || "Unable to create lease.");
        }
    };

    if (!application) {
        return <p>Loading...</p>;
    }

    return (
        <div className="application-details-page">
            <div className="details-header">
                <button className="back-btn" onClick={() => navigate(-1)}>
                    Back
                </button>
                <h2>Create Lease</h2>
            </div>

            <div className="details-card">

                <div className="property-section">
                    <img
                        src={application.property_image}
                        alt={application.property_title}
                        className="property-image"
                    />

                    <div className="property-info">
                        <h3>{application.property_title}</h3>
                        <p>
                            {application.property_city}, {application.property_state}
                        </p>
                        <p>₹ {application.monthly_rent}/month</p>
                    </div>
                </div>

                <hr />

                <div className="details-grid">
                    <div>
                        <strong>Tenant</strong>
                        <p>{application.renter_name}</p>
                    </div>

                    <div>
                        <strong>Email</strong>
                        <p>{application.renter_email}</p>
                    </div>
                </div>

                <hr />

                <form onSubmit={handleSubmit}>

                    <div className="form-group">
                        <label>Lease Start Date</label>
                        <input
                            type="date"
                            value={leaseStart}
                            onChange={(e) => setLeaseStart(e.target.value)}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Lease End Date</label>
                        <input
                            type="date"
                            value={leaseEnd}
                            onChange={(e) => setLeaseEnd(e.target.value)}
                            required
                        />
                    </div>

                    <div className="modal-actions">
                        <button
                            type="button"
                            className="secondary-btn"
                            onClick={() => navigate(-1)}
                        >
                            Cancel
                        </button>

                        <button type="submit" className="primary-btn">
                            Create Lease
                        </button>
                    </div>

                </form>

            </div>
        </div>
    );
}

export default CreateLease;