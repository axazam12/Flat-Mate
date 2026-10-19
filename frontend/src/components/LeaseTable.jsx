import { Link } from "react-router-dom";
import StatusBadge from "../components/StatusBadge";

function LeaseTable({leases,onComplete,onTerminate}){
    return(
        <div className="table-responsive">
            <table className="lease-table">
                <thead>
                    <tr>
                        <th>Property</th>
                        <th>Tenant</th>
                        <th>Location</th>
                        <th>Lease Type</th>
                        <th>Start Date</th>
                        <th>End Date</th>
                        <th>Monthly Rent</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {leases.map((lease) => (
                            <tr key={lease.id}>
                                <td>{lease.property_title}</td>
                                <td>{lease.tenant_name}</td>
                                <td>{lease.property_city}, {lease.property_state}</td>
                                <td>{lease.lease_type}</td>
                                <td>{lease.lease_start}</td>
                                <td>{lease.lease_end || "-"}</td>
                                <td>₹ {Number(lease.monthly_rent).toLocaleString()}</td>
                                <td>
                                    <StatusBadge status={lease.status}/>
                                </td>
                                <td>
                                    <div className="table-actions">
                                        <Link className="table-btn" to={`/owner-dashboard/lease/${lease.id}`}>Details</Link>

                                        {lease.status === "Pending Acceptance" && (
                                            <span className="waiting-text">
                                                Waiting Tenant
                                            </span>
                                        )}

                                        {lease.status === "Completed" && (
                                            <span className="completed-text">Completed</span>
                                        ) }
                                         {lease.status === "Terminated" && (
                                            <span className="terminated-text">Terminated</span>
                                        ) }
                                         {lease.status === "Declined" && (
                                            <span className="rejected-text">Declined</span>
                                        ) }
                                    </div>
                                </td>
                            </tr>
                        ))}
                </tbody>
            </table>
        </div>
    )
}
export default LeaseTable;