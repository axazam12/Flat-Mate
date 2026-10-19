import { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import api from "../../api";
import { NavLink } from "react-router-dom";
import "../../css/renterdashboard.css";

function RenterDashboard() {
  const navigate = useNavigate();

  const [hasLease, setHasLease] = useState(false)

  const storedUser = localStorage.getItem("user");
  let user = null;
  try {
    user = storedUser ? JSON.parse(storedUser) : null;
  } catch (err) {
    console.log(err)
    localStorage.removeItem("user");
  }

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }
    if (user.role !== "Renter") {
      navigate("/owner-dashboard");
    }

    const checkLease = async () => {
      try {
        const res = await api.get("lease/lease/current/")
        setHasLease(res.data.has_current_lease)
      } catch (error) {
        console.log(error)
      }
    }
    checkLease()
  }, [user, navigate]);

  if (!user) {
    return null;
  }

  return (
    <div className="renter-dashboard">
      <aside className="sidebar">
        <div className="sidebar-top">
          <div className="sidebar-logo">
            <h2>{hasLease ? "Tenant Dashboard" : "Renter Dashboard"}</h2>

          </div>
          <div className="welcome">
            <p>Welcome</p>
            <h3>{user?.full_name || user?.username}</h3>
            <p>{user?.email}</p>
          </div>
          <nav>

            <NavLink to="">Dashboard</NavLink>
            <NavLink to="favorites">Saved Properties</NavLink>
            <NavLink to="visit-request">Visit Requests</NavLink>
            <NavLink to="my-application">My Applications</NavLink>
            <NavLink to="lease">Leases</NavLink>

            {hasLease && (
              <>

                <NavLink to="rent-payment">Rent Payments</NavLink>
                <NavLink to="payment-history">Payment History</NavLink>
                <NavLink to="maintenance">Maintenance</NavLink>
                <NavLink to="lease-extension">Lease Extension</NavLink>

              </>
            )}
            <NavLink to="reviews">Reviews</NavLink>
            <NavLink to="notifications">Notification</NavLink>

          </nav>
        </div>
      </aside>
      
      <div className="dashboard-content">
        <Outlet />
      </div>
    </div>
  );
}
export default RenterDashboard;
