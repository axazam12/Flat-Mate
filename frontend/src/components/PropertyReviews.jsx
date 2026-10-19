import { useEffect,useState } from "react";
import api from "../api";
import "../css/propertyreviews.css"

function PropertyReviews({propertyId}){
    const [reviews, setReviews] = useState([])

    useEffect(() => {
        fetchReviews()
    },[propertyId])

    const fetchReviews = async() => {
        try{
            const response = await api.get(`renter/reviews/?property=${propertyId}`)
            setReviews(response.data)
        }catch(error){
            console.log(error)
        }
    }

    if(reviews.length === 0 ){
        return(
            <div className="property-reviews">
            <h3>Reviews</h3>
            <p>No reviews yet.</p>
            </div>
        )
    }

    const average = (
        reviews.reduce((sum,item) => sum + item.rating, 0) /
        reviews.length
    ).toFixed(1)

    return(
        <div className="property-reviews">
            <h3>⭐ {average} ({reviews.length} Reviews)</h3>

            {reviews.map((review) => (
                <div className="property-review-card" key={review.id}>
                    <div className="review-top">
                        <h4>{review.renter_name}</h4>
                        <span>{"⭐".repeat(review.rating)}</span>
                    </div>

                    <p className="review-date">
                        {new Date(review.created_at).toLocaleDateString("en-IN",{
                            day:"numeric",
                            month:"short",
                            year:"numeric"
                        })}
                    </p>

                    <p>{review.comment}</p>
                </div>
            ))}
        </div>
    )

}
export default PropertyReviews;