import { useEffect,useState } from "react";
import { Link } from "react-router-dom";
import api from "../../../api";
import "../../../css/maintenance.css"
import MaintenanceTable from "../../../components/MaintenanceTable";

function Maintenance(){
    const [requests, setRequests]=useState([])
    
    useEffect(() => {
        fetchRequests()
    },[])

    const fetchRequests = async()=>{
        try{
            const res = await api.get("maintenance/maintenance/")
            setRequests(res.data)
        }catch(error){
            console.log(error)
        }
    }

    return (
        <div className="renter-page">
            <div className="page-header">
                <div>
                    <h2>Maintenance Requests</h2>
                    <p>Create and track maintenance requests for your
                        rented property.
                    </p>
                </div>
                <Link to="/renter-dashboard/maintenance/create" className="primary-btn">
                ➕ Create Request
                </Link>
            </div>

            <MaintenanceTable requests={requests} isOwner={false}/>
        </div>
    )
}

export default Maintenance;