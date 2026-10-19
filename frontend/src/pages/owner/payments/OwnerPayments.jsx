import { useEffect, useState } from "react";
import api from "../../../api";
import "../../../css/payment.css";
import PaymentTable from "../../../components/PaymentTable";

function OwnerPayments() {
    const [payments, setPayments] = useState([]);
    const [statusFilter, setStatusFilter] = useState("All");

    useEffect(() => {
        fetchPayments();
    }, []);

    const fetchPayments = async () => {
        try {
            const response = await api.get("payment/rent-payment/");

            setPayments(
                Array.isArray(response.data)
                    ? response.data
                    : []
            );
        } catch (error) {
            console.log(error);
            setPayments([]);
        }
    };

    const markPaid = async (id) => {
        if (!window.confirm("Mark this payment as paid?")) {
            return;
        }

        try {
            await api.post(
                `payment/rent-payment/${id}/mark_paid/`
            );

            fetchPayments();
        } catch (error) {
            console.log(error);
            alert("Unable to update payment.");
        }
    };

    const filteredPayments =
        statusFilter === "All"
            ? payments
            : payments.filter(
                payment => payment.status === statusFilter
            );

    const activePayments = filteredPayments.filter(
        payment => payment.lease_status === "Active"
    );

    const closedPayments = filteredPayments.filter(
        payment =>
            payment.lease_status === "Completed" ||
            payment.lease_status === "Terminated"
    );

    return (
        <div className="payment-page">

            <div className="page-header">

                <div>
                    <h2>Rent Payments</h2>
                    <p>
                        View and manage rent payments from your tenants.
                    </p>
                </div>

                <select
                    className="status-filter"
                    value={statusFilter}
                    onChange={(e) =>
                        setStatusFilter(e.target.value)
                    }
                >
                    <option value="All">All</option>
                    <option value="Pending">Pending</option>
                    <option value="Paid">Paid</option>
                    <option value="Late">Late</option>
                </select>

            </div>

            <div className="payment-section">

                <div className="payment-section-header">

                    <div>
                        <h3>Active Lease Payments</h3>
                        <p>
                            Payments associated with current active leases.
                        </p>
                    </div>

                    <span className="payment-count">
                        {activePayments.length}
                    </span>

                </div>

                {activePayments.length > 0 ? (

                    <PaymentTable
                        payments={activePayments}
                        role="Owner"
                        onMarkPaid={markPaid}
                        refreshPayments={fetchPayments}
                    />

                ) : (

                    <div className="empty-payment-state">
                        <p>No active lease payments found.</p>
                    </div>

                )}

            </div>

            <div className="payment-section closed-payment-section">

                <div className="payment-section-header">

                    <div>
                        <h3>Closed Lease Payments</h3>
                        <p>
                            Payment records from completed or terminated leases.
                        </p>
                    </div>

                    <span className="payment-count">
                        {closedPayments.length}
                    </span>

                </div>

                {closedPayments.length > 0 ? (

                    <PaymentTable
                        payments={closedPayments}
                        role="Owner"
                        onMarkPaid={markPaid}
                        refreshPayments={fetchPayments}
                    />

                ) : (

                    <div className="empty-payment-state">
                        <p>
                            No closed lease payment records found.
                        </p>
                    </div>

                )}

            </div>

        </div>
    );
}

export default OwnerPayments;