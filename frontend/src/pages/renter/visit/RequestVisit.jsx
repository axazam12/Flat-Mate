import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../../api";
import "../../../css/visitrequests.css";

function RequestVisit() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [property, setProperty] = useState(null);

  const [formData, setFormData] = useState({
    visit_date: "",
    visit_time: "",
    message: "",
  });

  useEffect(() => {
    fetchProperty();
  }, []);

  const fetchProperty = async () => {
    try {
      const response = await api.get(`properties/properties/${id}/`);
      setProperty(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post("visit/visit-request/", {
        property: id,
        ...formData,
      });
      alert("Visit request submitted.");
      navigate("/renter-dashboard/visit-request");
    } catch (error) {
      alert(error.response?.data?.error || "Unable to submit request.");
    }
  };

  if (!property) {
    return <h2>Loading...</h2>;
  }

  return (
    <div className="request-visit-page">
        <h2 className="request-visit-title">Request Property Visit</h2>
        <div className="request-visit-property">
          <div className="request-visit-property-info">
            <h3>{property.title}</h3>
            <p>{property.city}, {property.state}</p>
            <p>₹ {property.monthly_rent}/month</p>
          </div>

            <img
    src={
        property.cover_image
            ? property.cover_image
            : "https://via.placeholder.com/700x350?text=No+Image"
    }
    alt={property.title}
    className="request-visit-image"
/>
        </div>
       <div className="request-visit-form-wrapper">
        <form onSubmit={handleSubmit} className="request-visit-form">
          <div className="request-visit-field">
            <label>Date</label>
            <input type="date" name="visit_date" value={formData.visit_date} onChange={handleChange} required/>
          </div>
          <div className="request-visit-field">
            <label>Time</label>
            <input type="time"  name="visit_time" value={formData.visit_time} onChange={handleChange} required/>
          </div>
          <div className="request-visit-field">
            <label>Message</label>
            <textarea rows="4" name="message" value={formData.message} onChange={handleChange}/>
          </div>

            <div className="request-visit-buttons">

            <button type="submit" className="request-visit-submit">
                Submit Request
            </button>

            <button type="button" className="request-visit-cancel" onClick={()=>navigate(-1)}>
                Cancel
            </button>
            </div>
        </form>
        </div>
    </div>
  )
}

export default RequestVisit;
