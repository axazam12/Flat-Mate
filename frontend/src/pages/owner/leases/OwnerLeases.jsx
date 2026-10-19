import { useEffect, useState } from "react";
import api from "../../../api";
import "../../../css/ownerleases.css";
import LeaseTable from "../../../components/LeaseTable";
import CreateLease from "./CreateLease";
import CreateDirectLease from "./CreateDirectLease";

function OwnerLeases() {
  const [leases, setLeases] = useState([]);
  const [statusFilter, setStatusFilter] = useState("All")

  const [approvedApplications, setApprovedApplications] = useState([]);
  const [showDirectLease, setShowDirectLease] = useState(false);

  useEffect(() => {
    fetchLeases();
    fetchApprovedApplications();
  }, []);

  const fetchLeases = async () => {
    try {
      const response = await api.get("lease/lease/");

      setLeases(response.data);
    } catch (error) {
      console.log(error);
    } 
  };

  const fetchApprovedApplications = async () => {
    try {
      const res = await api.get("application/rental-application/");
      console.log("Approved Applications:", res.data);
      setApprovedApplications(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const completeLease = async (id) => {
    try {
      await api.post(`lease/lease/${id}/complete/`);
      fetchLeases();
    } catch (error) {
      console.log(error);
    }
  };

  const terminatedLease = async (id) => {
    try {
      await api.post(`lease/lease/${id}/terminate/`);
      fetchLeases();
    } catch (error) {
      console.log(error);
    }
  };

  const filteredLeases = statusFilter === "All"
        ? leases
        : leases.filter(request => request.status === statusFilter)

  return (
    <div className="owner-page">
      <div className="page-header">
        <div>
          <h2>Lease Management</h2>
          <p>Create and manage property leases.</p>
        </div>

        <div className="header-actions">
    <select
        className="status-filter"
        value={statusFilter}
        onChange={(e) => setStatusFilter(e.target.value)}
    >
        <option value="All">All</option>
        <option value="Pending Acceptance">Pending Acceptance</option>
        <option value="Active">Active</option>
        <option value="Completed">Completed</option>
        <option value="Terminated">Terminated</option>
        <option value="Declined">Declined</option>
    </select>

    <button
        className="secondary-btn"
        onClick={() => setShowDirectLease(true)}
    >
        Direct Lease
    </button>
</div>
</div>
      <LeaseTable
        leases={filteredLeases}
        onComplete={completeLease}
        onTerminate={terminatedLease}
      />
      {showDirectLease  && (
        <CreateDirectLease
          applications={approvedApplications}
          onClose={() => setShowDirectLease(false)}
          refresh={() => {
            fetchLeases();
          }}
        />
      )}
    </div>
  );
}
export default OwnerLeases;
