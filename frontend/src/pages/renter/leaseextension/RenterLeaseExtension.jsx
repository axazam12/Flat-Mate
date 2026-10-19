import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../../api";
import "../../../css/leaseextension.css";
import LeaseExtensionTable from "../../../components/LeaseExtensionTable";

function RenterLeaseExtension() {
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const res = await api.get("lease/lease-extension/");
      setRequests(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="renter-page">
      <div className="page-header">
        <div>
        <h2>Lease Extension Requests</h2>
        <p>Manage all your lease extension requests.</p>
      </div>
      <Link
        to="/renter-dashboard/lease-extension/request"
        className="primary-btn"
      >
        ➕ Request Extension
      </Link>
      </div>
      <LeaseExtensionTable requests={requests} isOwner={false}/>
    </div>
  );
}
export default RenterLeaseExtension;