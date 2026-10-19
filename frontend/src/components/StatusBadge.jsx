import "../css/statusbadge.css"
function StatusBadge({ status }) {

    const statusClasses = {
        Pending: "badge pending",
        Approved: "badge approved",
        Rejected: "badge rejected",
        Paid: "badge paid",
        Late: "badge late",
        Open: "badge open",
        "In Progress": "badge progress",
        Resolved: "badge resolved",
        Cancelled: "badge cancelled",
        Active: "badge active",
        Completed: "badge completed",
        Terminated: "badge terminated",
        Declined: "badge declined",
        "Pending Acceptance": "badge pending-acceptance",
        "Reschedule Requested": "badge reschedule",
    };

    const className = status
        .toLowerCase()
        .replace(/\s+/g, "-");
        
    return (
        <span className={`status ${className}`}>
            {status}
        </span>
    );
}

export default StatusBadge;