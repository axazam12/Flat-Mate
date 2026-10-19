import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../api";
import "../css/propertydetails.css";
import {
  FaBath,
  FaBed,
  FaBuilding,
  FaCar,
  FaCheckCircle,
  FaCouch,
  FaHome,
  FaLayerGroup,
  FaMapMarkedAlt,
  FaRulerCombined,
  FaShieldAlt,
  FaUser,
  FaUsers,
} from "react-icons/fa";
import { MdLocationCity, MdOutlineAttachMoney } from "react-icons/md";
import OwnerPropertyActions from "../components/OwnerPropertyActions";
import PropertyGallery from "../components/PropertyGallery";
import FavoriteButton from "../components/FavoriteButton";
import PropertyReviews from "../components/PropertyReviews";

function PropertyDetails() {
  const { id } = useParams();
  const [property, setProperty] = useState(null);
  const user = JSON.parse(localStorage.getItem("user"));

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Delete this property.");
    if (!confirmDelete) return;
    try {
      await api.delete(`properties/properties/${id}/`);
      alert("Property deleted.");
      window.location.href = `/owner-dashboard/my-properties`;
    } catch (error) {
      console.log(error);
      alert("Delete failed");
    }
  };

  const handleAvailable = async (id) => {
    console.log("Mark Available clicked", id);

    try {
      await api.patch(`properties/properties/${id}/activate/`);
      window.location.reload();
    } catch (error) {
      console.log(error.response?.data);
    }
  };

  const handleUnavailable = async (id) => {
    await api.patch(`properties/properties/${id}/deactivate/`);
    window.location.reload();
  };

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const response = await api.get(`properties/properties/${id}/`);
        setProperty(response.data);
      } catch (error) {
        console.error(error);
        alert("Unable to load property details.");
      }
    };
    fetchProperty();
  }, [id]);

  if (!property) {
    return <h2>Property not found.</h2>;
  }

  return (
    <div className="property-details-container">
      {user?.role === "Owner" && user.id === property.owner && (
        <section className="property-management-bar">
          <div className="property-management-heading">
            <span>PROPERTY MANAGEMENT</span>
            <h3>Manage this property</h3>
          </div>
          <div className="property-management-actions">
            <OwnerPropertyActions
              property={property}
              onDelete={handleDelete}
              onAvailable={handleAvailable}
              onUnavailable={handleUnavailable}
            />
          </div>
        </section>
      )}

      <section className="property-gallery-section">
        <div className="property-gallery-main">
          <PropertyGallery images={property.images} />
        </div>
      </section>

      <section className="property-header-section">
        <div className="property-header-left">
          <p className="property-details-location">
            <FaMapMarkedAlt />
            {property.city}, {property.state}, {property.country}
          </p>

          <h1 className="property-details-title">{property.title}</h1>
          <p className="property-details-address">
            <FaMapMarkedAlt />
            {property.address} {property.pincode && `, ${property.pincode}`}
          </p>
        </div>

        <div className="property-header-right">
          <div className="property-details-price">
            <MdOutlineAttachMoney />
            <strong>₹{property.monthly_rent}</strong>
            <span>/month</span>
          </div>

          {user?.role === "Renter" && (
            <div className="property-header-actions">
              <Link
                to={`/properties/${property.id}/request-visit`}
                className="property-visit-btn"
              >
                Request Visit
              </Link>
              <FavoriteButton
                propertyId={property.id}
                className="property-save-btn"
              />
            </div>
          )}

          {!user && (
            <Link to="/login" className="property-login-btn">
              Login to Continue
            </Link>
          )}
        </div>
      </section>

      <section className="property-overview-section">
        <div className="proprty-overview-main">
          <div className="property-section-heading">
            <div>
              <span className="property-section-label">PROPERTY DETAILS</span>
              <h2>Overview</h2>
            </div>
            <div className="property-status">
              <span>Status</span>
              {property.status}
            </div>
          </div>

          <div className="property-overview-stats">
            <div className="property-overview-stat">
              <FaBed />
              <div>
                <span>{property.bedrooms} Bedrooms</span>
              </div>
            </div>
            <div className="property-overview-stat">
              <FaBath />
              <div>
                <span>{property.bathrooms} Bathrooms</span>
              </div>
            </div>
            <div className="property-overview-stat">
              <FaRulerCombined />
              <div>
                <span>Area</span>
                <strong>{property.area} sq.ft</strong>
              </div>
            </div>
            <div className="property-overview-stat">
              <FaCar />
              <div>
                <span>Parking</span>
                <strong>
                  {property.parking ? "Available" : "Not Available"}
                </strong>
              </div>
            </div>
            <div className="property-overview-stat">
              <FaUser />
              <div>
                <span>Max Occupants</span>
                <strong>{property.max_occupants}</strong>
              </div>
            </div>
          </div>
        </div>

        {user?.role !== "Owner" && (
          <aside className="property-owner-sidebar">
            <div className="property-owner-sidebar-title">
              <span>PROPERTY OWNER</span>
            </div>
            <div className="property-owner-profile">
              <img
                src={
                  property.owner_profile_picture
                    ? property.owner_profile_picture
                    : "/default-profile.png"
                }
                alt={property.owner_name}
                className="property-owner-avatar"
              />
              <div className="property-owner-details">
                <h3>{property.owner_name}</h3>
                <p>Property Owner</p>
                <Link
                  to={`/owners/${property.owner}`}
                  className="property-owner-profile-btn"
                >
                  View Owner Profile
                </Link>
              </div>
            </div>
          </aside>
        )}
      </section>

      <section className="property-content-section">
        <main className="property-content-main">
          <section className="property-description-section">
            <span className="property-section-label">ABOUT THIS PROPERTY</span>
            <h2>Description</h2>
            <p>{property.description}</p>
          </section>

          <section className="property-amenities-section">
            <span className="property-section-label">PROPERTY FEATURES</span>
            <h2>Amenities</h2>
            {property.amenities?.length > 0 ? (
              <div className="property-amenities-list">
                {property.amenities.map((amenity) => (
                  <div key={amenity.id} className="property-amenity-item">
                    <FaCheckCircle />
                    <span>{amenity.name}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="property-no-amenities">No amenities added.</p>
            )}
          </section>
        </main>

        <aside className="property-infomation-sidebar">
          <div className="property-information-card">
            <span className="property-section-label">PROPERTY INFORMATION</span>
            <h2>Details</h2>

            <div className="property-information-list">
              <div className="property-information-row">
                <span>
                  <FaHome />
                  Property Type
                </span>
                <strong>{property.property_type}</strong>
              </div>

              <div className="property-information-row">
                <span>
                  <FaCouch />
                  Furnishing
                </span>
                <strong>{property.furnishing}</strong>
              </div>

              <div className="property-information-row">
                <span>
                  <FaShieldAlt />
                  Security Deposit
                </span>
                <strong> ₹{property.security_deposit}</strong>
              </div>

              <div className="property-information-row">
                <span>
                  <FaBuilding />
                  Floor
                </span>
                <strong>{property.floor}</strong>
              </div>

              <div className="property-information-row">
                <span>
                  <FaUsers /> Max Occupants
                </span>
                <strong>{property.max_occupants}</strong>
              </div>

              <div className="property-information-row">
                <span>
                  <MdLocationCity />
                  Pincode
                </span>
                <strong>{property.pincode}</strong>
              </div>

              <div className="property-information-row">
                <span>Status</span>
                <strong>{property.status}</strong>
              </div>
            </div>
          </div>
        </aside>
      </section>

      <section className="property-reviews-section">
        <div className="property-review-heading">
          <span className="property-section-label">WHAT PEOPLE SAY</span>
          <h2>Property Reviews</h2>
          <div className="property-reviews-content">
            <PropertyReviews propertyId={property.id} />
          </div>
        </div>
      </section>
    </div>
  );
}

export default PropertyDetails;
