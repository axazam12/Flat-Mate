import { useEffect,useState } from "react";
import { useNavigate,useParams } from "react-router-dom";
import api from "../../../api";
import "../../../css/payment.css"

function RentPayment(){
    const {id} = useParams()
    const navigate = useNavigate()
    const [payment, setPayment] = useState(null)
    const[formData, setFormData] = useState({
        paid_amount:"",
        payment_method:"",
        transaction_id:""
    })

    useEffect(() => {
        fetchPayment()
    },[id])

    const fetchPayment = async () => {
        try{
            let response

            if(id){
                response = await api.get(`payment/rent-payment/${id}/`)
            }else{
                response = await api.get("payment/rent-payment/current/")
            }
            setPayment(response.data)
            setFormData({
                paid_amount:response.data.amount,
                payment_method:"",
                transaction_id:""
            })
        }catch(error){
            console.log(error)
        }
    }

    const handleChange = (e) => {
        setFormData({
            ...formData,[e.target.name]:e.target.value,
        })
    }

    const handleSubmit = async(e)=>{
        e.preventDefault()

        try{
            await api.patch(`payment/rent-payment/${payment.id}/pay/`,formData)
            console.log(payment)
            alert("Rent payment submitted successfully.")
            navigate("/renter-dashboard/payment-history")
        }catch(error){
            console.log(error)
            alert("Unable to process payment.")
        }
    }

    if(!payment){
        return(
            <div className="payment-page">
                <p>Loading payment....</p>
            </div>
        )
    }

    return (
        <div className="payment-page">
            <div className="page-header">
                <div>
                <h2>Rent Payment</h2>
                <p>Complete your monthly rent payment.</p>
                </div>
                <button className="secondary-btn" onClick={()=>navigate(-1)}>
                    Back
                </button>
                </div>

            <div className="payment-form-card">
                <div className="payment-summary">
                    <h3>{payment.property_title}</h3>

                    <p><strong>Owner : </strong> {" "} {payment.owner_name}</p>
                    <p>
                            <strong>Month : </strong>{" "}
                            {payment.month}/{payment.year}
                        </p>
                        <p>
                            <strong>Due Date : </strong>{" "}
                            {payment.due_date}
                        </p>
                        <p>
                            <strong>Amount : </strong>{" "}
                            ₹{Number(payment.amount).toLocaleString()}
                        </p>
                        <p>
                            <strong>Status : </strong>{" "}
                            {payment.status}
                        </p>
                </div>

                <form onSubmit={handleSubmit}>
                    <label>Payment Method</label>
                        <select name="payment_method" value={formData.payment_method} onChange={handleChange} required>
                            <option value="">Select Method</option>
                            <option value="Cash">Cash</option>
                            <option value="Card">Card</option>
                            <option value="Bank Transfer">Bank Transfer</option>
                            <option value="UPI">UPI</option>
                        </select>

                        <label>Amount Paid</label>
                        <input type="number" name="paid_amount" value={formData.paid_amount} onChange={handleChange} required/>


                        <label>Transaction ID</label>
                        <input type="text" name="transaction_id" value={formData.transaction_id} onChange={handleChange} placeholder="Enter transaction reference"/>
                        
                        <div className="form-buttons">
                            <button type="submit" className="primary-btn">
                                Pay Rent
                            </button>
                            <button type="button" className="secondary-btn" onClick={()=>navigate(-1)}>
                                Cancel
                            </button>
                        </div>
                </form>
            </div>
        </div>
    )
}
export default RentPayment;    