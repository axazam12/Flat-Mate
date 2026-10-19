import { Link } from "react-router-dom";
import StatusBadge from "../components/StatusBadge";

function TenantTable({leases=[],onComplete,onTerminate}){
    if(leases.length === 0){
        return(
            <div className="table-message">
                No active tenants found.
            </div>
        )
    }

    return (
        <div className="table-container">
            <table className="tenant-table">
                <thead>
                    <tr>
                        <th>Tenant</th>
                        <th>Property</th>
                        <th>Location</th>
                        <th>Monthly Rent</th>
                        <th>Lease Start</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {leases.map((lease)=> (
                        <tr key={lease.id}>
                            <td>{lease.tenant_name}</td>
                            <td>{lease.property_title}</td>
                            <td>{lease.property_city},{" "} {lease.property_state}</td>
                            <td>{lease.monthly_rent}</td>
                            <td>
                                {new Date(lease.lease_start).toLocaleDateString()}
                            </td>
                            <td>
                                <StatusBadge status={lease.status}/>
                            </td>
                            <td>
                                <div className="table-actions">
                                    <Link to={`/owner-dashboard/tenants/${lease.id}`} className="view-btn">Details</Link>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}

export default TenantTable;