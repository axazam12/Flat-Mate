import { Link } from "react-router-dom";

function VisitRequestTable({visitRequests,onComplete,onReject,onApprove}){
    
    return (
        <div className="table-responsive">
            <table className="owner-table">
                <thead>
                    <tr>
                        <th>Property</th>
                        <th>Renter</th>
                        <th>City</th>
                        <th>Visit Date</th>
                        <th>Visit Time</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {visitRequests.map((visit)=> (
                        <tr key={visit.id}>
                            <td>{visit.property_details.title}</td>
                            <td>{visit.renter_name}</td>
                            <td>{visit.property_details.city},{" "} {visit.property_details.state}</td>
                            <td>{visit.visit_date}</td>
                            <td>{visit.visit_time}</td>
                            
                            <td>
                                <span className={`status ${visit.status.toLowerCase().replace(/\s+/g,"-")}`}>{visit.status}</span>
                            </td>
                            <td>
                                <div className="table-actions">
                                    <Link to={`/owner-dashboard/visit-request/${visit.id}`} className="table-btn">View</Link>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}

export default VisitRequestTable;