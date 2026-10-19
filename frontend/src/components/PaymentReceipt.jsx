import "../css/paymentreceipt.css"

function PaymentReceipt({receipt}){
    return(
        <div className="receipt-card">
            <div className="receipt-header">
                <h3>Payment Receipt</h3>
                <p>Receipt uploaded by the proeprty owner after payment verification.</p>
            </div>

            {receipt ? (
                <>
                    <img src={receipt} alt="Payment Receipt" className="receipt-image"/>
                    <div className="receipt-actions">
                        <a href={receipt} target="_blank" rel="noopener noreferrer" className="primary-btn">
                            View Full Size
                        </a>
                        <a href={receipt} download className="secondary-btn">
                            Download
                        </a>
                    </div>
                </>
            ):(
                <div className="receipt-empty">
                    <div className="receipt-icon">
                        📄
                    </div>
                    <h4>No Receipt Available</h4>
                    <p>A receipt has not been uploaded for this payment.</p>
                </div>
            )}
        </div>
    )
}
export default PaymentReceipt;