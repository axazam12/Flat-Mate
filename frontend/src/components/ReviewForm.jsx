import { useState } from "react";
import "../css/reviewform.css"

function ReviewForm({
    initialData = {
        rating:"",
        comment:"",
    }, onSubmit, loading = false,})
    {
        const [formData, setFormData] = useState(initialData)

        const handleChange = (e) => {
            setFormData({...formData,[e.target.name]: e.target.value,})
        }

        const handleSubmit = (e) => {
            e.preventDefault()
            onSubmit(formData)
        }

        return(
            <form className="review-form" onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Rating</label>

                    <select name="rating" value={formData.rating} onChange={handleChange} required>
                        <option value="">Select Rating</option>
                        <option value="5">⭐⭐⭐⭐⭐ Excellent</option>
                        <option value="4">⭐⭐⭐⭐ Very Good</option>
                        <option value="3">⭐⭐⭐ Good</option>
                        <option value="2">⭐⭐ Fair</option>
                        <option value="1">⭐ Poor</option>
                    </select>
                </div>

                <div className="form-group">
                    <label>Comment</label>
                    <textarea name="comment" rows="5" value={formData.comment} onChange={handleChange}placeholder="Write your experience..."/>

                </div>

                <button type="submit" className="review-submit-btn" disabled={loading}>
                    {loading ? "Submitting..." : "Submit Review"}
                </button>
            </form>
        )
    }

export default ReviewForm;