import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../api";
import "../../css/lease.css";
import LeaseCard from "../../components/LeaseCard";

function Lease() {
  const [lease, setLease] = useState(null);
  const [leaseHistory, setLeaseHistory] = useState([]);
  const [reviewedProperties, setReviewedProperties] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLease();
    fetchLeaseHistory();
    fetchMyReviews();
  }, []);

  const fetchMyReviews = async () => {
    try {
      const response = await api.get("renter/reviews/mine/");

      const reviews = Array.isArray(response.data) ? response.data : [];

      const reviewed = {};

      reviews.forEach((review) => {
        reviewed[review.property_details.id] = review.id;
      });

      setReviewedProperties(reviewed);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchLease = async () => {
    try {
      const response = await api.get("lease/lease/current/");
      console.log(response.data);
      if (response.data.has_current_lease) {
        setLease(response.data.lease);
      } else {
        setLease(null);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };
  const fetchLeaseHistory = async () => {
    try {
      const response = await api.get("lease/lease/history/");
      setLeaseHistory(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.log(error);
      setLeaseHistory([]);
    } finally {
      setLoading(false);
    }
  };

  const acceptLease = async () => {
    if (!window.confirm("Accept this lease?")) return;
    try {
      await api.post(`lease/lease/${lease.id}/accept/`);
      alert("Lease accepted successfully.");
      fetchLease();
    } catch (error) {
      console.log(error);
      alert(error.response?.data?.error || "Unable to accept lease.");
    }
  };

  const declineLease = async () => {
    if (!window.confirm("Decline this lease?")) return;
    try {
      await api.post(`lease/lease/${lease.id}/decline/`);
      alert("Lease declined.");
      fetchLease();
    } catch (error) {
      console.log(error);
      alert(error.response?.data?.error || "Unable to decline lease.");
    }
  };

  if (loading) {
    return <div className="lease-page">Loading...</div>;
  }

  return (
    <div className="lease-page">
      <div className="page-header">
        <div>
          <h2>My Lease</h2>
          <p>view your current lease agreement.</p>
        </div>
      </div>
      {lease ? (
        <div className="current-lease-section">
          <h3>Current Lease</h3>
          <LeaseCard
            lease={lease}
            onAccept={acceptLease}
            onDecline={declineLease}
          />

          {lease.status === "Active" && (
            <div className="lease-review-action">
              {reviewedProperties[lease.property] ? (
                <div className="lease-review-action">
                  <Link
                    to={`/renter-dashboard/reviews/edit/${reviewedProperties[lease.property]}`}
                    className="review-lease-btn"
                  >
                    Edit Review
                  </Link>

                  <span className="review-type-tag rented-review-tag">
                    Rented Review
                  </span>
                </div>
              ) : (
                <div className="lease-review-action">
                  <Link
                    to={`/renter-dashboard/reviews/new/${lease.property}`}
                    className="review-lease-btn"
                  >
                    Write Review
                  </Link>

                  <span className="review-type-tag rented-review-tag">
                    Rented Review
                  </span>
                </div>
              )}
            </div>
          )}
        </div>
      ) : (
        <div className="lease-empty">
          <h3>No Current Lease</h3>
          <p>You don't have any lease at the moment.</p>
        </div>
      )}
      {leaseHistory.length > 0 && (
        <div className="lease-history-section">
          <div className="lease-section-header">
            <div>
              <h3>Previous Lease</h3>
              <p>Properties you previously rented.</p>
            </div>
            <span className="lease-count">{leaseHistory.length}</span>
          </div>
          <div className="lease-history-grid">
            {leaseHistory.map((item) => (
              <div className="lease-history-card" key={item.id}>
                <LeaseCard lease={item} />
                {(item.status === "Completed" ||
                  item.status === "Terminated") &&
                  (reviewedProperties[item.property] ? (
                    <div className="lease-review-action">
                      <Link
                        to={`/renter-dashboard/reviews/edit/${reviewedProperties[item.property]}`}
                        className="review-lease-btn"
                      >
                        Edit Review
                      </Link>

                      <span className="review-type-tag rented-review-tag">
                        Rented Review
                      </span>
                    </div>
                  ) : (
                    <div className="lease-review-action">
                      <Link
                        to={`/renter-dashboard/reviews/new/${item.property}`}
                        className="review-lease-btn"
                      >
                        Write Review
                      </Link>

                      <span className="review-type-tag rented-review-tag">
                        Rented Review
                      </span>
                    </div>
                  ))}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default Lease;
