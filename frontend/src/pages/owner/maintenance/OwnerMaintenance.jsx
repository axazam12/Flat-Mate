import { useEffect,useState } from "react";
import api from "../../../api";
import "../../../css/maintenance.css"
import MaintenanceTable from "../../../components/MaintenanceTable";

function OwnerMaintenance(){
    const [requests, setRequests] = useState([])
    const [statusFilter, setStatusFilter] = useState("All")

    useEffect(() => {
        fetchRequests()
    },[])

    const fetchRequests = async () => {
        try{
            const response = await api.get("maintenance/maintenance/");
            setRequests(response.data)
        }catch(error){
            console.log(error)
        }
    }

    const filteredRequests = statusFilter === "All"
        ? requests
        : requests.filter(request => request.status === statusFilter)

    return(
        <div className="owner-page">
            <div className="page-header">
                <div>
                    <h2>Maintenance Requests</h2>
                    <p>Manage and response to tenant maintenance requests.</p>
                </div>
                <div className="header-actions">

                <select value={statusFilter}
                    onChange={(e)=>setStatusFilter(e.target.value)}
                    className="status-filter">
                        <option value="All">All</option>
                        <option value="Open">Open</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Resolved">Resolved</option>
                        <option value="Cancelled">Cancelled</option>

                </select>
                </div>
            </div>

            <MaintenanceTable requests={filteredRequests} refreshRequests={fetchRequests}/>
        </div>
    )
}
export default OwnerMaintenance;