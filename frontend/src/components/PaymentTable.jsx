import { Link } from "react-router-dom"
import StatusBadge from "./StatusBadge";

function PaymentTable({ payments, role, onMarkPaid }) {
    if (payments.length === 0) {
        return (
            <div className="table-message">
                No rent payments found.
            </div>
        )
    }

    return (
        <div className="table-responsive">
            <table className="owner-table">
                <thead>
                    <tr>
                        <th>Tenant</th>
                        <th>Property</th>
                        <th>Month</th>
                        <th>Amount</th>
                        <th>Due Date</th>
                        <th>Paid Date</th>
                        <th>Status</th>
                        <th>ACtions</th>
                    </tr>
                </thead>
                <tbody>
                    {payments.map((payment) => (
                        <tr key={payment.id}>
                            <td>{payment.tenant_name}</td>
                            <td>{payment.property_title}</td>
                            <td>{payment.month}/{payment.year}</td>
                            <td>₹ {Number(payment.amount).toLocaleString()}</td>
                            <td>{payment.due_date || "-"}</td>
                            <td>{payment.paid_date || "-"}</td>
                            <td>
                                <StatusBadge status={payment.status} />
                            </td>
                            <td>
                                <div className="table-actions">
                                    {role === "Owner" && (
                                        <>
                                            <Link to={`/owner-dashboard/rent-payment/${payment.id}`} className="table-btn">
                                                View Details
                                            </Link>
                                        </>
                                    )}
                                    {role === "Renter" && (
                                        <Link to={`/renter-dashboard/rent-payment/${payment.id}`}  className="table-btn">
                                            View Details
                                        </Link>
                                    )}


                                </div>
                                {payment.status === "Paid" && (
                                    <span className="success-text">
                                        Paid
                                    </span>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
                </table>
        </div>
    )
}
export default PaymentTable;