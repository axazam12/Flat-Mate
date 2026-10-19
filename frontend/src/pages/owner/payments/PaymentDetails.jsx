import { useEffect,useState } from "react";
import { useNavigate,useParams } from "react-router-dom";
import api from "../../../api";
import StatusBadge from "../../../components/StatusBadge";
import "../../../css/payment.css"
import PaymentReceipt from "../../../components/PaymentReceipt";

function PaymentDetails(){
    const {id} = useParams()
    const navigate = useNavigate()
    const [payment, setPayment] = useState(null)
    const [formData, setFormData] = useState({
        paid_amount: "",
        payment_method: "",
        transaction_id:"",
        receipt:null,
    })

    useEffect(() => {
        fetchPayment()
    },[id])

    const fetchPayment = async () => {
        try{
            const response = await api.get(`payment/rent-payment/${id}/`)
            setPayment(response.data)

            setFormData({
                paid_amount: response.data.amount,
                payment_method: response.data.payment_method || "",
                transaction_id: response.data.transaction_id || "",
                receipt: null,
            })
        }catch(error){
            console.log(error)
        }
    }

    const handlechange = (e) => {
        const {name, value, files} = e.target;
        setFormData(prev=>({
            ...prev, [name]: files ? files[0] : value,
        }))
    }

    const markPaid = async () => {
        if(!window.confirm("Confirm this payment?")){
            return
        }
        try{
            const data = new FormData()
            data.append("paid_amount",formData.paid_amount);
            data.append("payment_method",formData.payment_method)
            data.append("transaction_id",formData.transaction_id);

            if(formData.receipt){
                data.append("receipt",formData.receipt)
            }

            await api.post(`payment/rent-payment/${id}/mark_paid/`,data,{
                headers:{"Content-Type":"multipart/form-data"}
            })

            alert("Payment marked as paid.")
            fetchPayment()
        }catch(error){
            console.log(error)
            alert("Unable to update payment")
        }
    }

    const uploadReceipt = async()=>{
        if(!formData.receipt){
            alert("Please select a receipt.")
            return
        }
        try{
            const data = new FormData()
                
            data.append("receipt",formData.receipt)
                
            await api.patch(`payment/rent-payment/${id}/upload_receipt/`,data,{headers:{"Content-type":"multipart/form-data"}})
            alert("Receipt uploaded successfully.")
            fetchPayment()
            setFormData(prev => ({
                ...prev,receipt:null
            }))
        }catch(error){
            console.log(error)
        }
    }

    const deleteReceipt = async () => {
        if(!window.confirm("Are you sure you want to delete this receipt?")){
            return;
        }
        try{
            await api.delete(`payment/rent-payment/${id}/delete_receipt/`)
            alert("Receipt deleted successfully.")
            fetchPayment();
        }catch(error){
            console.log(error)
            alert(error.response?.data?.error || "Unable to delete receipt")
        }
    }

    if(!payment){
        return(
            <div className="owner-page">
                <p>Loading payment details....</p>
            </div>
        )
    }

    return (
        <div className="owner-page">
            <div className="details-header">
                <button className="back-btn" onClick={()=>navigate(-1)}>
                    Back
                </button>

                <h2>Payment Details</h2>
            </div>
            <div className="details-card">
                <div>
                <StatusBadge status={payment.status}/>
                </div>
                <img src={payment.property_image} className="property-image" />
                <hr/>
                <div className="details-grid">
                    <div>
                        <h4>Tenant</h4>
                        <p><strong>Name : </strong> {" "} {payment.tenant_name}</p>
                        <p>
                            <strong>Owner : </strong>{" "} {payment.owner_name}
                        </p>
                    </div>
                    <div>
                        <h4>Property</h4>
                        <p><strong>Property : </strong>{" "} {payment.property_title}</p>
                        <p><strong>Address : </strong>{" "} {payment.property_address}</p>
                        <p>{payment.property_city},{" "} {payment.property_state}</p>
                    </div>
                </div>
                <hr/>

                <div className="details-grid">
                    <div>
                        <p>
                            <strong>Month : </strong>{" "}
                            {payment.month}/{payment.year}
                        </p>
                        <p>
                            <strong>Amount : </strong>{" "}
                            ₹{Number(payment.amount).toLocaleString()}
                        </p>
                        <p>
                            <strong>Due Date : </strong>{" "}
                            {payment.due_date || "-"}
                        </p>
                    </div>
                    <div>
                        <p>
                            <strong>Paid Amont : </strong>{" "}
                            {payment.paid_amount
                               ? `₹${Number(payment.paid_amount).toLocaleString()}`
                               : "-"
                            }
                        </p>
                        <p>
                            <strong>Paid Date : </strong>{" "}
                            {payment.paid_date || "-"}
                        </p>
                        <p>
                            <strong>Payment Method : </strong>{" "}
                            {payment.payment_method || "-"}
                        </p>
                    </div>
                </div>

                <hr/>

                <p>
                    <strong>Transaction ID : </strong>{" "}
                    {payment.transaction_id || "-"}
                </p>

                <hr/>
                <PaymentReceipt receipt={payment.receipt}/>

                {(payment.status === "Pending" || payment.status === "Late") && (
                    <div className="action-section">
                        <h3>Record Pffile Payment</h3>
                        <div className="form-group">
                            <label>Paid Amount</label>
                            <input type="number" name="paid_amount" value={formData.paid_amount} onChange={handlechange}/>
                        </div>

                        <div className="form-group">
                            <label>Payment Method</label>
                            <select name="payment_method" value={formData.payment_method} onChange={handlechange}>
                                <option value="">Select Method</option>
                                <option value="Cash">Cash</option>
                                <option value="UPI">UPI</option>
                                <option value="Bank Transfer">Bank Transfer</option>
                                <option value="Card">Card</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label>Transaction ID (Optional)</label>
                            <input type="text" name="transaction_id" value={formData.transaction_id} onChange={handlechange}/>
                        </div>

                        <div className="form-group">
                            <label>Receipt / Screenshot (Optional)</label>
                            <input type="file" accept="image/*" name="receipt" onChange={handlechange}/>
                        </div>

                        <button className="primary-btn" onClick={markPaid}>
                            Mark as paid
                        </button>
                    
                    </div>
                )}

                {payment.status === "Paid" && (
                    <div className="action-section">
                        <h3>Payment Receipt</h3>
                        <p>Upload or replace the receipt that will be visible to the renter.</p>
                        <div className="form-group">
                            <label>{payment.receipt ? "Replace Receipt" : "Upload Receipt"}</label>
                            <input type="file" accept="image/*" name="receipt" onChange={handlechange}/>
                        </div>
                        <div className="receipt-management-actions">
                        <button className="primary-btn" onClick={uploadReceipt}>
                            {payment.receipt ? "Replace Receipt" : "Upload Receipt"}
                        </button>
                        {payment.receipt && (
                            <button className="danger-btn" onClick={deleteReceipt}>Delete Receipt</button>
                        )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
export default PaymentDetails;