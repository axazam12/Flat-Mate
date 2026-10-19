import { useEffect, useState } from "react";
import api from "../../../api";
import "../../../css/leaseextension.css";
import LeaseExtensionTable from "../../../components/LeaseExtensionTable";

function OwnerLeaseExtensions(){
    const [requests, setRequests] = useState([])
    const [statusFilter, setStatusFilter] = useState("All")
    
    useEffect(() => {
        fetchRequests()
    },[])

    const fetchRequests = async () => {
        try{
            const response = await api.get("lease/lease-extension/")
            setRequests(response.data)
        }catch(error){
            console.log(error)
        }
    }

    const approveRequest = async(id)=>{
        try{
            await api.post(`lease-extension/${id}/approve/`)
            alert("Lease extension approved.")
            fetchRequests()
        }catch(error){
            console.log(error)
            alert("Unable to approve request.")
        }
    }

    const rejectRequest = async(id)=>{
        try{
            await api.post(`lease-extension/${id}/reject/`)
            alert("Lease extension rejected.")
            fetchRequests()
        }catch(error){
            console.log(error)
            alert("Unable to reject request.")
        }
    }

    const filteredRequests = statusFilter === "All"
        ? requests
        : requests.filter(request => request.status === statusFilter)

    return(
        <div className="owner-page">
            <div className="page-header">
                <div>
                    <h2>Lease Extension Requests</h2>
                    <p>Review and amange lease extension requests from tenants.</p>
                </div>
            </div>

            <LeaseExtensionTable requests={requests} isOwner={true} onApprove={approveRequest} onReject={rejectRequest}/>
        </div>
    )
}
export default OwnerLeaseExtensions;