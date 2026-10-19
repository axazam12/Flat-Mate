import { Link } from "react-router-dom";
import StatusBadge from "./StatusBadge";

function ApplicationTable({applications}){
    if(!applications.length) {
        return(
            <div className="table-message">
                No rental applications found.
            </div>
        )
    }

    return(
        <div className="table-responsive">
            <table className="application-table">
                <thead>
                    <tr>
                        <th>Applicant</th>
                        <th>Property</th>
                        <th>Loaction</th>
                        <th>Applied On</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>

                <tbody>
                    {applications.map((application) => (
                        <tr key={application.id}>
                            <td>{application.renter_name}</td>
                            <td>{application.property_title}</td>
                            <td>{application.property_city},{" "} {application.property_state}</td>
                            <td>
                                {new Date(application.created_at).toLocaleDateString()}
                            </td>
                            <td>
                                <StatusBadge status={application.status}/>
                            </td>
                            <td>
                                <div className="table-actions">
                                    <Link to={`/owner-dashboard/rental-application/${application.id}`} className="table-btn">View Details</Link>
                                    <Link to={`/properties/${application.property}`} className="table-btn secondary-btn">View Property</Link>   
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}

export default ApplicationTable;