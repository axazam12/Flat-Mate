import { Link } from "react-router-dom";
import "../css/payment.css"

function PaymentCard({payment, role="renter"}){

    return (
        <div className="payment-card">
            <div className="payment-card-header">
                <div>
                    <h3>{payment.property_title}</h3>
                    <p>{payment.month}/{payment.year}</p>
                </div>
                <span className={`status ${payment.status.toLowerCase().replace(/\s+/g,"-")}`}>
                    {payment.status}
                </span>
            </div>

            <div className="payment-card-body">
                {role === "Owner" ? (
                    <p>
                        <strong>Tenant : </strong>{" "}
                        {payment.tenant_name}
                    </p>
                ):(
                    <p>
                        <strong>Owner : </strong>{" "}
                        {payment.owner_name}
                    </p>
                )}
                <p>
                    <strong>Amount : </strong>{" "}
                    ₹ {payment.amount}
                </p>
                <p>
                    <strong>Due Date : </strong>{" "}
                    {payment.due_date || "-"}
                </p>
                {payment.paid_date && (
                <p>
                    <strong>Paid On : </strong>{" "}
                    {payment.paid_date}
                </p>
                )}
                {payment.payment_method && (
                <p>
                    <strong>Method : </strong>{" "}
                    {payment.payment_method || "-"}
                </p>
                )}
            </div>
            <div className="payment-card-footer">
                <Link className="table-btn" to={
                    role === "Owner"
                       ? `/owner-dashboard/payments/${payment.id}`
                       : `/renter-dashboard/payment-history/${payment.id}`
                }>View Detials</Link>

                {role === "Renter" && payment.status !== "Paid" && (
                    <Link className="primary-btn" to={`/renter-dashboard/pay-rent/${payment.id}`}>
                        Pay Rent
                    </Link>
                )}

                {role === "Owner" && payment.status !== "Paid" && (
                    <Link className="primary-btn" to={`/owner-dashboard/payments/${payment.id}/mark`}>
                        Mark Paid
                    </Link>
                )}
            </div>
        </div>
    )
}
export default PaymentCard