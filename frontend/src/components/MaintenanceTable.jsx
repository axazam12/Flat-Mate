import {Link} from "react-router-dom";

function MaintenanceTable({requests, isOwner=true}){
    if(!requests.length){
        return(
            <div className="table-message">
                No maintenance requests found.
            </div>
        )
    }

    return(
        <div className="table-responsive">
            <table className="maintenance-table">
                <thead>
                    <tr>
                        <th>Tenant</th>
                        <th>Property</th>
                        <th>Type</th>
                        <th>Priority</th>
                        <th>Status</th>
                        <th>Created</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {requests.map((request) => (
                        <tr key={request.id}>
                            <td>{request.tenant_name}</td>
                            <td>{request.property_title}</td>
                            <td>{request.maintenance_type}</td>
                            <td>
                                <span className={`priority-badge ${request.priority.toLowerCase().replace(/\s+/g,"-")}`}>
                                {request.priority}
                                </span>
                            </td>

                            <td>
                                <span className={`status-bdg ${request.status.toLowerCase().replace(/\s+/g,"-")}`}>
                                {request.status}
                                </span>
                            </td>       

                            <td>
                                {new Date(request.created_at).toLocaleDateString()}
                            </td>

                            <td>
                                <Link className="table-btn"
                                 to={
                                    isOwner
                                      ? `/owner-dashboard/maintenance/${request.id}`
                                      : `/renter-dashboard/maintenance/${request.id}`}
                                >
                                View Details
                                </Link>
                            </td>                     
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}
export default MaintenanceTable;