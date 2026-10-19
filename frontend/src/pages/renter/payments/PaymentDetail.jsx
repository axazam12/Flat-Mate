import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../../api";
import "../../../css/payment.css";
import PaymentReceipt from "../../../components/PaymentReceipt";

function PaymentDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [payment, setPayment] = useState(null);

  useEffect(() => {
    fetchPayment();
  },[id]);

  const fetchPayment = async () => {
    try {
      const res = await api.get(`payment/rent-payment/${id}/`);
      console.log(Response.data)
      setPayment(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  if(!payment){
    return(
        <div className="payment-page">
            <p>Loading payment...</p>
        </div>
    )
  }
  return(
    <div className="payment-page">
        <div className="page-header">
            <div>
                <h2>Payment Details</h2>
                <p>View complete information about this rent payment.</p>
            </div>
            <button className="secondary-btn" onClick={() => navigate(-1)}>
                Back
            </button>
        </div>
        <div className="payment-details-card">
            <div className="payment-summary">
                <h3>{payment.property_title}</h3>
                <span className={`status ${payment.status.toLowerCase().replace(/\s+/g,"-")}`}>
                {payment.status}
                </span>
            </div>

            <div className="details-grid">
                    <div>
                        <strong>Owner</strong>
                        <p>{payment.owner_name}</p>
                    </div>

                    <div>
                        <strong>Amount</strong>
                        <p>₹{Number(payment.amount).toLocaleString()}</p>
                    </div> 

                    <div>
                        <strong>Paid Amount</strong>
                        <p>
                            {payment.paid_amount
                                ? `₹${Number(payment.paid_amount).toLocaleString()}`
                                : "-"}
                        </p>
                    </div> 

                    <div>
                        <strong>Month</strong>
                        <p>{payment.month}/{payment.year}</p>
                    </div>

                    <div>
                        <strong>Due Date</strong>
                        <p>
                            {payment.due_date || "-"}
                        </p>
                    </div>

                    <div>
                        <strong>Paid Date</strong>
                        <p>
                            {payment.paid_date || "-"}
                        </p>
                    </div>

                    <div>
                        <strong>Payment Method</strong>
                        <p>
                            {payment.payment_method || "-"}
                        </p>
                    </div>

                    <div>
                        <strong>Transaction ID</strong>
                        <p>
                            {payment.transaction_id || "-"}
                        </p>
                    </div>
            </div>

            <PaymentReceipt receipt={payment.receipt}/>

            {payment.status !== "Paid" && (
                <div className="payment-actions">
                    <button className="primary-btn" 
                            onClick={() => 
                                navigate(`/renter-dashboard/rent-payment/${payment.id}`)
                            }
                    >
                        Pay Rent
                    </button>
                </div>
            )}
        </div>
    </div>
  )
}
export default PaymentDetail;