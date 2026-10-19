import "../css/footer.css"
import { Link } from "react-router-dom";
function Footer(){
    return(
        <footer className="footer">
            <div className="footer-container">
                <div className="footer-section">
                    <h2 className="footer-logo" >RentFlow</h2>
                    <p>A complete Rental Property Management System that 
                       connects property owners, renters, and tenants on one
                       secure platform.
                    </p>
                </div>
                <div className="footer-section">
                    <h4>Quick Links</h4>
                    <Link to="/">Home</Link>
                    <Link to="/properties">Properties</Link>
                    <Link to="/login">Login</Link>
                    <Link to="/register">Register</Link>
                </div>
                <div className="footer-section">
                    <h4>Services</h4>
                    <p>Property Listings</p>
                    <p>Visit Booking</p>
                    <p>Lease Management</p>
                    <p>Maintenance Requests</p>
                </div>
                <div className="footer-section">
                    <h4>Contact</h4>
                    <p>Thrissur, Kerala</p>
                    <p>+91 8374629478</p>
                    <p>support@rentflow.com</p>
                    <div className="footer-links">
                        <Link to ="#policies">Privacy Policy</Link>
                        <Link to="#policies">Terms & Conditions</Link>
                    </div>
                </div>
                
            </div>
            <hr/>
            <div className="footer-botton">
                <p>© 2026 RentFlow. All Rights Reserved.</p>
            </div>
        </footer>
    )
}
export default Footer;