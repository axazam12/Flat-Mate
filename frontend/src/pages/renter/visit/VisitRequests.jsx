import { useEffect,useState } from "react";
import api from "../../../api";
import "../../../css/visitrequests.css"
import { Link } from "react-router-dom";
import StatusBadge from "../../../components/StatusBadge";

function VisitRequests(){
    const [visitRequests, setVisitRequests] = useState([])

    useEffect(() => {
        fetchVisitRequests()
    },[])

    const fetchVisitRequests = async() => {
        try{
            const response = await api.get("visit/visit-request/")
            console.log(response.data);
            setVisitRequests(response.data)
        }catch(error){
            console.log(error)
        }
    }
    return(
        <div className="visit-requests-page">
            <div className="visit-page-header">
                <h2>My Visit Requests</h2>
                <p>Track and manage all your property visit requests.</p>
            </div>

        {visitRequests.length === 0 ? (
            <div className="visit-empty-state">
            <h3>No visit requests yet.</h3>
            <p>Browse properties and request a visit.</p>
            </div>
        ):(
            <div className="table-responsive">
                <table className="visit-table">
                    <thead>
                        <tr>
                            <th>Property</th>
                            <th>City</th>
                            <th>Visit Date</th>
                            <th>Visit Time</th>
                            <th>Requested On</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {visitRequests.map((visit) => (
                            <tr key={visit.id}>
                                <td>{visit.property_details.title}</td>
                                <td>{visit.property_details.city},{" "}
                                    {visit.property_details.state}
                                </td>
                                <td>{visit.visit_date}</td>
                                <td>{visit.visit_time}</td>
                                <td>
                                    {new Date(visit.created_at).toLocaleDateString()}
                                </td>
                                <td><StatusBadge status={visit.status}/></td>
                                <td className="visit-actions">
                                    <Link className="table-btn" to={`/renter-dashboard/visit-request/${visit.id}`}>
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

export default VisitRequests;