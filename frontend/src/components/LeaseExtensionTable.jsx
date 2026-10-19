import { Link } from "react-router-dom";
import StatusBadge from "./StatusBadge";

function LeaseExtensionTable({requests, isOwner=true}){
    if(!requests.length) {
        return(
            <div className="table-message">
                No lease extension requests found.
            </div>
        )
    }

    return(
        <div className="table-responsive">
            <table className="application-table">
                <thead>
                    <tr>
                        {isOwner ? <th>Tenant</th> : <th>Property</th>}
                        <th>Current End</th>
                        <th>Requested End</th>
                        <th>Status</th>
                        <th>Requested On</th>
                        <th>Actions</th>
                    </tr>
                </thead>

                <tbody>
                    {requests.map((request) => (
                        <tr key={request.id}>
                            {isOwner ? (
                            <td>{request.tenant_name}</td>
                            ):(
                                <td>{request.property_title}</td>
                            )}
                            
                            <td>
                                {new Date(request.current_end_date).toLocaleDateString()}
                            </td>
                            <td>
                                {new Date(request.requested_end_date).toLocaleDateString()}
                            </td>
                            <td>
                                <StatusBadge status={request.status}/>
                            </td>
                            <td>
                                {new Date(request.created_at).toLocaleDateString()}
                            </td>
                            <td>
                                <Link to={
                                    isOwner
                                     ? `/owner-dashboard/lease-extension/${request.id}`
                                     : `/renter-dashboard/lease-extension/${request.id}`
                                    }
                                    className="table-btn">
                                    View
                                </Link>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}

export default LeaseExtensionTable;