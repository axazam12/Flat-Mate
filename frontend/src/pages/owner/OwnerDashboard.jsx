import { NavLink, useNavigate, Outlet } from "react-router-dom";
import "../../css/ownerdashboard.css"
import { useEffect } from "react";
import api from "../../api";

function OwnerDashboard() {
    const navigate = useNavigate()
    const storedUser = localStorage.getItem("user")

    let user = null;
    try{
        user = storedUser ? JSON.parse(storedUser):null
    }catch(err){
        console.error(err)
        localStorage.removeItem("user")
    }

    useEffect(() =>{
        if(!user){
            navigate("/login")
            return
        }
        if(user.role !=="Owner"){
            navigate("/renter-dashboard");
        }
    },[user, navigate])
    
    if(!user){
        return null
    }

    return (
        <div className="owner-dashboard">
            <aside className="sidebar">
                <div className="sidebar-top">
                <div className="sidebar-logo">
                   <h2>RentFlow</h2>
                   <p className="panel-title">Owner Dashboard</p>
                </div>

                <div className="welcome">
                    <p>Welcome </p> 
                    <h3>{user?.full_name || user?.username}</h3>
                    <p>{user?.email}</p>
                </div>

                <nav>
                    <NavLink to="." end>Dashboard</NavLink>
                    <NavLink to="my-properties">My Properties</NavLink>
                    <NavLink to="add-property">Add Property</NavLink>
                    <NavLink to="visit-request">Visit Requests</NavLink>
                    <NavLink to="rental-application">Rental Applications</NavLink>
                    <NavLink to="lease">Leases</NavLink>
                    <NavLink to="previous-tenants">Previous Tenants</NavLink>
                    <NavLink to="tenants">Current Tenants</NavLink>
                    <NavLink to="rent-payment">Payments</NavLink>
                    <NavLink to="maintenance">Maintenance</NavLink>
                    <NavLink to="lease-extension">Lease Extensions</NavLink>
                    <NavLink to="notifications">Notifications</NavLink>
                        
                </nav>
            </div>
            </aside>

            <div className="dashboard-content">
            <Outlet/>
            </div>

        </div>
    )
}
export default OwnerDashboard;