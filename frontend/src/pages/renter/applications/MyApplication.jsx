import { Link } from "react-router-dom";
import api from "../../../api";
import StatusBadge from "../../../components/StatusBadge";
import "../../../css/rentalapplications.css";
import { useEffect, useState } from "react";

function MyApplication() {
    const [applications, setApplications] = useState([])

    useEffect(() => {
        fetchApplications()
    },[])

    const fetchApplications = async() => {
        try{
            const res = await api.get("application/rental-application/")
            setApplications(res.data)
        }catch(err){
            console.log(err)
        }
    }
    return(
        <div className="rental-page">
            <div className="page-header">
            <h2>My Rental Applications</h2>
            <p>Track all your rental applications.</p>
            </div>

            {applications.length === 0? (
                <div className="table-message">
                    No rental applications found.
                </div>
            ):(
                <div className="table-container">
                    <table className="application-table">
                <thead>
                    <tr>
                        <th>Property</th>
                        <th>Location</th>
                        <th>Property Status</th>
                        <th>Status</th>
                        <th>Applied</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {applications.map((application) => (
                        <tr key={application.id}>
                            <td>{application.property_title}</td>
                            <td>{application.property_city}, {" "} {application.property_state}</td>
                            <td>
                                <StatusBadge status={application.status}/>
                            </td>
                            <td>
                                {application.property_status}
                            </td>
                            <td>
                                {new Date(application.created_at).toLocaleDateString()}
                            </td>
                            <td>
                                <Link to={`/renter-dashboard/my-application/${application.id}`} className="table-btn">
                                View Details
                                </Link>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
                </div>
            )}
            
        </div>
    )
}

export default MyApplication