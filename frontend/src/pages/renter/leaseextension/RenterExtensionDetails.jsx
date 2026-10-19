import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../../api";
import "../../../css/leaseextension.css";

function RenterLeaseExtensionDetails() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [request, setRequest] = useState(null);

  useEffect(() => {
    fetchRequest();
  }, [id]);

  const fetchRequest = async () => {
    try {
      const res = await api.get(`lease/lease-extension/${id}/`);
      setRequest(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleCancel = async () => {
    if (!window.confirm("Cancel this lease extension request")) return;

    try {
      await api.delete(`lease/lease-extension/${id}/cancel_request/`);
      alert("Lease extension request cancelled.")
      navigate("/renter-dashboard/lease-extension")
    } catch (error) {
      console.log(error);
      alert("Unable to cancel request.");
    }
  }

  if (!request) {
    return (
      <div>
        <p>loading....</p>
      </div>
    )
  }

  return (
    <div className="renter-page">
      <div className="details-header">
        <button className="back-btn" onClick={() => navigate(-1)}>
          Back
        </button>
        <h2>Lease Extension Details</h2>
      </div>

      <div className="details-card">

        <div className="info-card">
          <h3>Property Information</h3>

          <div className="property-cards">
            <img
              src={request.property_image}
              alt={request.property_title}
              className="property-image"
            />

            <div className="property-content">
              <h3>{request.property_title}</h3>

              <p>
                <strong>City :</strong> {request.property_city}
              </p>

              <p>
                <strong>State :</strong> {request.property_state}
              </p>
            </div>
          </div>
        </div>

        <hr />

        <div className="details-grid">

          <div className="info-card">
            <h3>Lease Information</h3>

            <p>
              <strong>Lease Type :</strong> {request.lease_type}
            </p>

            <p>
              <strong>Current End Date :</strong>{" "}
              {new Date(request.current_end_date).toLocaleDateString()}
            </p>

            <p>
              <strong>Requested End Date :</strong>{" "}
              {new Date(request.requested_end_date).toLocaleDateString()}
            </p>
          </div>

          <div className="info-card">
            <h3>Request Status</h3>

            <p>
              <strong>Status :</strong>{" "}
              <span
                className={`status-badge ${request.status
                  .toLowerCase()
                  .replace(/\s+/g, "-")}`}
              >
                {request.status}
              </span>
            </p>

            <p>
              <strong>Requested On :</strong>{" "}
              {new Date(request.created_at).toLocaleDateString()}
            </p>

            {request.updated_at && (
              <p>
                <strong>Last Updated :</strong>{" "}
                {new Date(request.updated_at).toLocaleDateString()}
              </p>
            )}
          </div>

        </div>

        <hr />

        {/* Reason */}
        <div className="info-card">
          <h3>Extension Reason</h3>

          <p>{request.reason || "No reason provided."}</p>
        </div>

        <hr />

        {/* Owner Response */}
        <div className="info-card">

          <h3>Owner Response</h3>

          {request.owner_response ? (
            <div className="owner-response">
              {request.owner_response}
            </div>
          ) : (
            <div className="owner-response">
              Waiting for owner's response...
            </div>
          )}

        </div>

        {request.status === "Pending" && (
          <>
            <hr />

            <div className="details-actions">
              <button className="reject-btn" onClick={handleCancel}>
                Cancel Request
              </button>
            </div>
          </>
        )}

        {request.status !== "Pending" && (
          <>
            <hr />

            <div className="info-box">
              This request has already been processed.
            </div>
          </>
        )}

      </div>
    </div>
  );
}
export default RenterLeaseExtensionDetails;  