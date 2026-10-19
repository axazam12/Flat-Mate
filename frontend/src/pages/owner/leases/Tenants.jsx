import { useEffect,useState } from "react";
import api from "../../../api";
import "../../../css/tenants.css"
import TenantTable from "../../../components/TenantTable";

function Tenants(){
    const [leases, setLeases] = useState([])

    useEffect(() => {
        fetchTenants()
    },[])

    const fetchTenants = async() =>{
        try{
            const response = await api.get("lease/lease/")
            setLeases(response.data)
        }catch(error){
            console.log(error)
        }
    }

    const completeLease = async(id) => {
        try{
            await api.post(`lease/lease/${id}/complete/`)

            fetchTenants()
        }catch(error){
            console.log(error)
        }    
    }

    const terminateLease = async(id) => {
        const reason = window.prompt("Enter termination reason:")
        if(!reason) return
        try{
            await api.post(`lease/lease/${id}/terminate/`,{reason})

            fetchTenants()
        }catch(error){
            console.log(error)
        }    
    }

    const activeTenants = leases.filter(
        lease => lease.status === "Active"
    )

    return (
        <div className="owner-page">
            <div className="page-header">
                <div>
                <h2>Current Tenants</h2>
                <p>View and manage all tenants.</p>
                </div>
            </div>
            <TenantTable leases={activeTenants} onComplete={completeLease} onTerminate={terminateLease}/>
        </div>
    )
}
export default Tenants;