import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../../api";
import "../../../css/leaseextension.css";

function LeaseExtensionDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [request, setRequest] = useState(null);
  const [ownerResponse, setOwnerResponse] = useState("");

  useEffect(() => {
    fetchRequest();
  }, [id]);

  const fetchRequest = async () => {
    try {
      const response = await api.get(`lease/lease-extension/${id}/`);
      setRequest(response.data);
      setOwnerResponse(response.data.owner_response || "");
    } catch (error) {
      console.log(error);
    }
  };

  const approveRequest = async () => {
    if (!window.confirm("Approve this lease extension requests?")) return;
    try {
      await api.post(`lease/lease-extension/${id}/approve/`, {
        owner_response: ownerResponse,
      });
      alert("Lease extension approved.");
      fetchRequest();
    } catch (error) {
      console.log(error);
      alert("Unable to approve request.");
    }
  };

  const rejectRequest = async () => {
    if (!window.confirm("Reject this lease extension request?")) return;
    try {
      await api.post(`lease/lease-extension/${id}/reject/`, {
        owner_response: ownerResponse,
      });
      alert("Lease extension rejected.");
      fetchRequest();
    } catch (error) {
      console.log(error);
    }
  };
  if (!request) {
    return (
      <div>
        <p>
          loading...
        </p>
      </div>
    )
  }

  return (
    <div className="owner-page">
      <div className="details-header">
        <button className="back-btn" onClick={() => navigate(-1)}>
          Back
        </button>
        <h2>Lease Extension Request</h2>
      </div>

      <div className="details-card">
        <div className="info-card">
          <h3>Property Information</h3>

          <div className="property-cards">

            <img src={request.property_image} className="property-image" />

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
            <h3>Tenant Information</h3>
            <p>
              <strong>Name :</strong> {request.tenant_name}
            </p>
            <p>
              <strong>Email :</strong> {request.tenant_email}
            </p>
          </div>

          <div className="info-card">
            <h3>Lease Information</h3>
            <p>
              <strong>Lease Type : </strong>
              {request.lease_type}
            </p>
            <p>
              <strong>Current End Date:</strong>{" "}
              {new Date(request.current_end_date).toLocaleDateString()}
            </p>
            <p>
              <strong>Requested End Date :</strong>{" "}
              {new Date(request.requested_end_date).toLocaleDateString()}
            </p>
          </div>
        </div>

        <hr />
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

        <hr />
        <div className="info-card">
          <h3>Extension Reason</h3>
          <p>{request.reason || "No reason provided"}</p>
        </div>

        <hr />
        <div className="info-card">

          <h3>Owner Response</h3>

          {request.status === "Pending" ? (
            <>
              <textarea rows="5" value={ownerResponse} onChange={(e) => setOwnerResponse(e.target.value)} placeholder="Write your response" />
              <div className="details-actions">
                <button className="approve-btn" onClick={approveRequest}>
                  Approve
                </button>
                <button className="reject-btn" onClick={rejectRequest}>
                  Reject
                </button>
              </div>
            </>
          ) : (
            <div className="owner-response">
              {request.owner_response || "No response provided."}
            </div>
          )}
        </div>

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
export default LeaseExtensionDetails;