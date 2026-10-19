import StatusBadge from "../components/StatusBadge";

function LeaseCard({ lease, onAccept, onDecline }) {
  return (
    <div className="lease-card">
      <div className="property-section">
        <img src={lease.property_image} alt={lease.property_title} />

        <div className="property-info">
          <h3>{lease.property_title}</h3>
          <p>{lease.property_address}</p>
          <p>
            {lease.property_city}, {lease.property_state}
          </p>

          <StatusBadge status={lease.status} />
        </div>
      </div>
      <hr />
      <div className="details-grid">
        <div>
          <label>Owner</label>
          <span>{lease.owner_name}</span>
        </div>
        <div>
          <label>Tenant</label>
          <p>{lease.tenant_name}</p>
        </div>
        <div>
          <strong>Lease Type</strong>
          <p>{lease.lease_type}</p>
        </div>
        <div>
          <label>Monthy Rent</label>
          <span>₹{Number(lease.monthly_rent).toLocaleString()}</span>
        </div>
        <div>
          <label>Security Deposit</label>
          <span>₹{Number(lease.security_deposit).toLocaleString()}</span>
        </div>
        <div>
          <label>Lease Start </label>
          <span>{lease.lease_start}</span>
        </div>
        <div>
          <label>Lease End</label>
          <span>{lease.lease_end}</span>
        </div>
        <div>
          <strong>Status</strong>
          <StatusBadge status={lease.status} />
        </div>
      </div>

      {lease.status === "Pending Acceptance" && (
        <>
          <hr />
          <div className="action-section">
            <h3>Lease Agreement</h3>
            <p>
              Your landlord has prepared a lease agreement. Please review the
              details carefully before accepting or declining.
            </p>
            <div className="lease-buttons">
              <button className="accept-btn" onClick={onAccept}>
                Accept Lease
              </button>
              <button className="decline-btn" onClick={onDecline}>
                Decline Lease
              </button>
            </div>
          </div>
        </>
      )}
      {lease.status === "Active" && (
        <>
          <hr />
          <div className="success-message">
            <h3>Lease Active</h3>
            <p>Your lease is currently active</p>
          </div>
        </>
      )}
      {lease.status === "Completed" && (
        <>
          <hr />
          <div className="info-message">
            <h3>Lease Completed</h3>
            <p>This lease has been completed.</p>
          </div>
        </>
      )}
      {lease.status === "Terminated" && (
        <>
          <hr />
          <div className="info-message">
            <h3>Lease Terminated</h3>
            <p>
              {lease.terminated_reason || "No termination reason provided."}
            </p>
          </div>
        </>
      )}
      {lease.status === "Declined" && (
        <>
          <hr />
          <div className="info-message">
            <h3>Lease Declined</h3>
            <p>{lease.decline_reason || "No decline reason provided"}</p>
          </div>
        </>
      )}
    </div>
  );
}
export default LeaseCard;
