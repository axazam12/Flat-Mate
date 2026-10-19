import { useEffect, useState } from "react";
import api from "../../../api";
import "../../../css/visitrequests.css"
import VisitRequestTable from "../visit/VisitRequestTable";

function OwnerVisitRequests() {
    const [visitRequests, setVisitRequests] = useState([])
    const [statusFilter, setStatusFilter] = useState("All")

    useEffect(() => {
        fetchVisitRequests()
    }, [])

    const fetchVisitRequests = async () => {
        try {
            const response = await api.get("visit/visit-request/")
            setVisitRequests(response.data)
        } catch (error) {
            console.log(error)
        }
    }

    const filteredVisitRequests = statusFilter === "All"
        ? visitRequests
        : visitRequests.filter(request => request.status === statusFilter)

    return (
        <div className="owner-page">
            <div className="page-header">
                <div>
                <h2>Visit Requests</h2>
                <p>Manage all requests for your properties.</p>
            </div>

            <div className="header-actions">
                <select
                    className="status-filter"
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                >
                    <option value="All">All</option>
                    <option value="Pending">Pending</option>
                    <option value="Approved">Approved</option>
                    <option value="Completed">Completed</option>
                    <option value="Rejected">Rejected</option>
                    <option value="Cancelled">Cancelled</option>
                    <option value="Reschedule Requested">
                        Reschedule Requested
                    </option>
                </select>
            </div>
           </div>
            <VisitRequestTable visitRequests={filteredVisitRequests} />
        </div>
    )
}
export default OwnerVisitRequests;