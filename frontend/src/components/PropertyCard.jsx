import { Link } from "react-router-dom";
import "../css/propertycard.css";
import { FaBath, FaBed, FaCalendarAlt, FaMapMarkedAlt, FaRulerCombined } from "react-icons/fa";
import FavoriteButton from "./FavoriteButton";

function PropertyCard({property}) {
  const storedUser = localStorage.getItem("user")
  const user = storedUser ? JSON.parse(storedUser):null;
  const coverImage =
    property.cover_image || "/images/no-property.jpg";
  
  return (
    <div className="property-card">
      <div className="property-card-image-wrapper">
        <img
        src={coverImage}
        alt={property.title}
        className="property-card-image"
      />
      <span className={`property-card-status ${property.status.toLowerCase()}`}>{property.status}
          </span>
        </div>
      
      <div className="property-card-content">
        <p className="property-card-location">
          <FaMapMarkedAlt className="property-card-location-icon"/>
          {property.city}, {property.state}, {property.country}
        </p>
        <p className="property-card-type">
          {property.property_type}
        </p>

        <h3 className="property-card-title">{property.title}</h3>
        <div className="property-card-price-value">
            ₹{Number(property.monthly_rent).toLocaleString("en-IN")}
            <span className="property-card-price-period">/month</span>
          </div>

        <div className="property-card-info">
          <div className="property-card-info-item">
          <FaBed className="property-card-info-icon"/> 
          <span>{property.bedrooms} {property.bedrooms === 1 ? "Bed" : "Beds"}</span>
          </div>

          <div className="property-card-info-item">
            <FaBath className="property-card-info-icon"/>
          <span> {property.bathrooms} {property.bathrooms === 1 ? "Bath" : "Baths"}</span>
          </div>
          <div className="property-card-info-item">
            <FaRulerCombined className="property-card-info-icon"/>
          <span> {property.area} sq.ft</span>
          </div>
        </div>
        
          <div className="property-card-actions">
            <Link
              to={`/properties/${property.id}`}
              className="property-card-view-btn"
            >
              View
            </Link>
            {user?.role === "Renter" && property.status==="Available" &&(
              <div className="property-card-renter-actions">

            <FavoriteButton className="property-card-save-btn" propertyId={property.id}/>

            <Link to={`/properties/${property.id}/request-visit`} className="property-card-request-visit">
            <FaCalendarAlt className="property-card-request-icon"/><span>Request Visit</span>
            </Link>            
            </div>
            )}
            
          </div>
      </div>
    </div>
  );
}
export default PropertyCard;
