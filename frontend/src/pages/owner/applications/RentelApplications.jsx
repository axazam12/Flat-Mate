import { useEffect,useState } from "react";
import api from "../../../api"
import "../../../css/rentalapplications.css"
import ApplicationTable from "../../../components/ApplcationTable";

function RentalApplications(){
    const [applications, setApplications] = useState([])
    const [statusFilter, setStatusFilter] = useState("All")


    useEffect(() => {
        fetchApplications()
    },[])
    const fetchApplications = async() => {
        try{
            const response = await api.get("application/rental-application/")
            setApplications(response.data)
        }catch(error){
            console.log(error)
        }
    }

    const filteredApplications = statusFilter === "All"
        ? applications
        : applications.filter(request => request.status === statusFilter)

    return (
        <div className="owner-page">
            <div className="page-header">
                <div>
                <h2>Rental Applications</h2>
                <p>Review and manage property applications.</p>
                </div>
                <div className="header-actions">

                <select value={statusFilter}
                    onChange={(e)=>setStatusFilter(e.target.value)}
                    className="status-filter">
                        <option value="All">All</option>
                        <option value="Pending">Pending</option>
                        <option value="Rejected">Rejected</option>
                        <option value="Approved">Approved</option>
                        <option value="Cancelled">Cancelled</option>

                </select>
                </div>
            </div>
            <ApplicationTable 
               applications={filteredApplications}
               refreshApplications={fetchApplications}
            />
        </div>
    )

}
export default RentalApplications;