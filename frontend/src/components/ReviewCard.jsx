import { Link } from "react-router-dom";
import "../css/reviewcard.css";

function ReviewCard({ review, onDelete }) {
  const property = review.property_details;

  const stars = "⭐".repeat(review.rating);
  const isRentedReview = review.review_type === "Rented Review";
  const isPropertyAvailable = property.status === "Available";
  const propertyStatus = property.status || "Unknown"; 

  return (
    <div className="review-card">
      <div className="review-image-wrapper">
      <img
        src={
          property.cover_image
            ? property.cover_image
            : "https://via.placeholder.com/250x180?text=No+Image"
        }
        alt={property.title}
        className="review-property-image"
      />
      <span className={`property-status-badge ${isPropertyAvailable ? "available" : "unavailable"}`}>{propertyStatus}</span>
      </div>

      <div className="review-content">
        <div className="review-header">
          <div>
            <h3>{property.title}</h3>
            <p>
              {property.city}, {property.state}
            </p>
          </div>

          <span className="review-rating">{stars}</span>
        </div>
        <div className="review-type-row">
          <span className={isRentedReview
            ? "review-type rented"
            : "review-type visited"
          }>
            {isRentedReview ? "Rented Review" : "Visited Review"}
          </span>
          {!isPropertyAvailable && (
            <span className="property-unavailable-tag">Property Currently Unavailable</span>
          )}
        </div>

        <div className="review-comment">
          <strong>Your Review</strong>
          {review.comment ? (
            <p>{review.comment}</p>
          ) : (
            <p className="no-comment">No comment added.</p>
          )}
        </div>

        <div className="review-footer">
          <small>
            Reviewed on {new Date(review.created_at).toLocaleDateString()}
          </small>

          <div className="review-actions">
            {isPropertyAvailable ? (
              <Link
              to={`/properties/${property.id}`}
              className="view-property-btn"
            >
              View Property
            </Link>
            ):(
              <span className="property-unavailable-btn">Property Unavailable</span>
            )}
      
            <Link
              to={`/renter-dashboard/reviews/edit/${review.id}`}
              className="edit-review-btn"
            >
              Edit
            </Link>
            
            <button
              className="review-delete-btn"
              onClick={() => onDelete(review.id)}
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ReviewCard;
