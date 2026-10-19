import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../api";
import ReviewCard from "../../components/ReviewCard";
import "../../css/reviews.css";
import ReviewForm from "../../components/ReviewForm";

function Reviews() {
  const [reviews, setReviews] = useState([]);
  const { id , propertyId} = useParams();
  const navigate = useNavigate();
  const [editingReview, setEditingReview] = useState(null);

  useEffect(() => {
    fetchReviews();
    if (id) {
      fetchReview(id);
    }
  }, [id]);

  const fetchReviews = async () => {
    try {
      const response = await api.get("renter/reviews/mine/");
      setReviews(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchReview = async (reviewId) => {
    try {
      const response = await api.get(`renter/reviews/${reviewId}/`);
      setEditingReview(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleUpdate = async (data) => {
    try {
      await api.put(`renter/reviews/${id}/`, data);
      alert("Review updated successfully.");
      navigate("/renter-dashboard/reviews");
    } catch (error) {
      console.log(error);
      alert("Unable to update review.");
    }
  };

  const isCreate = !!propertyId
  const isEdit = !!id

  const handleCreate = async(data) => {
    try{
        await api.post("renter/reviews/",{
            property:propertyId, review_type:"Visited Review", ...data
        })
        alert("Review submitted successfully.")
        navigate("/renter-dashboard/reviews")
    }catch(error){
        console.log(error)
        alert(error.response?.data?.error || "Unable to submit review.")
    }
  }

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Delete this review?");

    if (!confirmDelete) return;

    try {
      await api.delete(`renter/reviews/${id}/`);
      alert("Review deleted successfully.");
      fetchReviews();
    } catch (error) {
      console.log(error);
      alert("Unable to delete review.");
    }
  };

  if(isCreate){
    return(
        <div className="reviews-page">
            <div className="reviews-header">
                <h2>Write Review</h2>
            </div>
            <ReviewForm onSubmit={handleCreate}/>
        </div>
    )
  }

  if (id && editingReview) {
    return (
      <div className="reviews-page">
        <div className="reviews-header">
          <h2>Edit Review</h2>
        </div>
        <ReviewForm
          initialData={{
            rating: editingReview.rating,
            comment: editingReview.comment,
          }}
          onSubmit={handleUpdate}
        />
      </div>
    );
  }

  return (
    <div className="reviews-page">
      <div className="reviews-header">
        <h2>My Reviews</h2>
        <p>Reviews you've written for properties.</p>
      </div>

      {reviews.length === 0 ? (
        <div className="reviews-empty">
          <h3>No reviews yet.</h3>
          <p>Complete a property visit to leave a review.</p>
        </div>
      ) : (
        <div className="reviews-grid">
          {reviews.map((review) => (
            <ReviewCard
              key={review.id}
              review={review}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
}
export default Reviews;