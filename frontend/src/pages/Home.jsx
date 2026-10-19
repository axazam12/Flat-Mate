import { Link, useNavigate } from "react-router-dom";
import "../css/home.css";
import Accordion from "react-bootstrap/Accordion";
import api from "../api";
import { useEffect, useState } from "react";
import PropertyCard from "../components/PropertyCard";
import {
  FaHome,
  FaSearch,
  FaCalendarCheck,
  FaFileContract,
  FaTools,
  FaStar,
  FaBuilding,
  FaUsers,
  FaArrowRight,
  FaCity,
  FaStore,
  FaBed,
  FaUserFriends,
  FaHotel,
} from "react-icons/fa";

function Home() {
  const [properties, setProperties] = useState([]);
  useEffect(() => {
    fetchFeaturedProperties();
    fetchreviews();
  }, []);

  const fetchFeaturedProperties = async () => {
    try {
      const response = await api.get("properties/properties/");
      setProperties(response.data.slice(0, 3));
    } catch (error) {
      console.error(error);
    }
  };
  const [reviews, setReviews] = useState([]);
  const fetchreviews = async () => {
    try {
      const response = await api.get("renter/reviews/");
      const allReviews = Array.isArray(response.data) ? response.data : [];
      const rentedReviews = allReviews.filter(
        (review) => review.review_type === "Rented Review",
      );
      setReviews(rentedReviews.slice(0, 4));
    } catch (error) {
      console.error("Error fetching reviews:",error);
    }
  };

  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [propertyType, setPropertyType] = useState("");

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (search.trim()) {
      params.append("search", search.trim());
    }
    if (propertyType) {
      params.append("property_type", propertyType);
    }
    navigate(`/properties?${params.toString()}`);
  };

  return (
    <div className="home-page">
      <section id="home" className="home-hero">
        <div className="home-hero-overlay">
          <div className="home-hero-content">
            <h1>Find Your Perfect Rental Home</h1>
            <p>
              Discover apartments, villas, independent house, and commercial
              properties from trusted owners. Search, schedule visits, and rent
              your dream property with ease.
            </p>
            <div className="home-hero-search">
              <input
                type="text"
                placeholder="Search by city, location or property...."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <select
                value={propertyType}
                onChange={(e) => setPropertyType(e.target.value)}
              >
                <option value="">Property Type</option>
                <option value="Apartment">Apartment</option>
                <option value="Villa">Villa</option>
                <option value="House">House</option>
                <option value="Commercial">Commercial</option>
                <option value="Studio">Studio</option>
                <option value="PG">PG</option>
                <option value="Hostel">Hostel</option>
              </select>
              <button onClick={handleSearch}>
                <FaSearch />
                Search
              </button>
            </div>
            <div className="home-hero-buttons">
              <Link to="/properties" className="home-btn btn-primary">
                Explore Properties
              </Link>
              <Link to="/register" className="home-btn btn-outline">
                Register Now
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="home-about" id="about">
        <div className="home-container">
          <div className="home-about-left">
            <img
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ4hiaf-2bqo3y47ITyVK7xbga1Z2Fm2V4ijlh3gktBwGMtDjI4nehHk3I&s=10"
              alt="About RentFlow"
              className="home-about-image"
            />
          </div>
          <div className="home-about-right">
            <h2>About RentFlow</h2>
            <p>
              RentFlow is a complete Rental Property Management System that
              connects property owners, renters, and current tenants on one
              platform. Owners can list and manage their rental properties,
              while renters can search, schedule property visits, and apply for
              rentals. Current tenants can manage lease details, request lease
              extensions, and submit maintenance or service requests with ease.
            </p>
            <p>
              whether you are looking for your next home or managing multiple
              rental properties, RentFlow helps you save time through a secure
              and user-friendly platform.
            </p>
            <div className="home-about-buttons">
              <Link to="/properties" className="home-btn btn-primary">
                Explore Properties
              </Link>
              <Link to="/register" className="home-btn btn-outline">
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="home-why-us">
        <div className="home-container">
          <h2>Why Choose RentFlow</h2>
          <p className="home-section-description">
            Everything you need to find, manage, and maintain rental properties
            in one secure platform.
          </p>
          <div className="home-why-grid">
            <div className="home-why-card">
              <FaSearch className="home-why-icon" />
              <h3>Smart Search</h3>
              <p>
                Search properties using city, location, property type, and
                budget.
              </p>
            </div>
            <div className="home-why-card">
              <FaCalendarCheck className="home-why-icon" />
              <h3>Easy Visit Booking</h3>
              <p>
                Schedule property visits and recevice approval updates
                instantly.
              </p>
            </div>
            <div className="home-why-card">
              <FaFileContract className="home-why-icon" />
              <h3>Lease Management</h3>
              <p>
                Manage rental agreements and request lease extensions online.
              </p>
            </div>
            <div className="home-why-card">
              <FaTools className="home-why-icon" />
              <h3>Maintenance Support</h3>
              <p>Raise maintenance request and track their status easly.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="home-features" id="features">
        <div className="home-container">
          <h2>Our Features</h2>
          <p className="home-feature-description">
            Everything you need to manage rental properties efficiently, from
            searching homes to managing tenants and maintenance requests.
          </p>
          <div className="home-feature-grid">
            <div className="home-feature-card">
              <FaHome className="home-feature-icon" />
              <h3>Property Listings</h3>
              <p>
                Browse verified apartments, villas, independent houses, and
                commercial properties.
              </p>
            </div>
            <div className="home-feature-card">
              <FaSearch className="home-feature-icon" />
              <h3>Search & Filters</h3>
              <p>
                Find properties quickly using city, location, property type,
                budget, and amenities.
              </p>
            </div>
            <div className="home-feature-card">
              <FaStar className="home-feature-icon" />
              <h3>Reviews & Ratings</h3>
              <p>
                Share your experience through ratings and reviews to help future
                renters.
              </p>
            </div>
            <div className="home-feature-card">
              <FaCalendarCheck className="home-feature-icon" />
              <h3>Visit Booking</h3>
              <p>
                Schedule property visits with owners and receive instant
                approval updates.
              </p>
            </div>
            <div className="home-feature-card">
              <FaFileContract className="home-feature-icon" />
              <h3>Lease Management</h3>
              <p>
                Manage rental agreements, request lease extensions, and track
                lease status.
              </p>
            </div>
            <div className="home-feature-card">
              <FaTools className="home-feature-icon" />
              <h3>Maintenance Requests</h3>
              <p>
                Submit maintenance and service requests directly to property
                owners.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="home-featured-properties">
        <div className="home-section-header">
          <h2>Featured Properties</h2>
          <Link to="/properties" className="home-view-all-btn">
            View All
          </Link>
        </div>
        <div className="home-property-grid">
          {properties.map((property) => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </div>
      </section>

      <section className="home-categories" id="properties">
        <div className="home-container">
          <h2>Browse by Property Type</h2>
          <p className="home-section-description">
            Explore a wide range of rental properties that match your lifestyle,
            business, and budget requirements.
          </p>
          <div className="home-category-grid">
            <div className="home-category-card">
              <FaBuilding className="home-category-icon" />
              <h3>Apartment</h3>
              <p>Modern apartments for families and professionals.</p>
              <Link
                to="/properties?property_type=Apartment"
                className="home-category-btn"
              >
                Browse
                <FaArrowRight />
              </Link>
            </div>
            <div className="home-category-card">
              <FaHome className="home-category-icon" />
              <h3>Villas</h3>
              <p>Luxury villas with premium facilities.</p>
              <Link
                to="/properties?property_type=Villa"
                className="home-category-btn"
              >
                Browse
                <FaArrowRight />
              </Link>
            </div>
            <div className="home-category-card">
              <FaCity className="home-category-icon" />
              <h3>Houses</h3>
              <p>Comfortable homes for long-term rentals.</p>
              <Link
                to="/properties?property_type=House"
                className="home-category-btn"
              >
                Browse
                <FaArrowRight />
              </Link>
            </div>
            <div className="home-category-card">
              <FaStore className="home-category-icon" />
              <h3>Commercial</h3>
              <p>Shops, offices and commercial spaces.</p>
              <Link
                to="/properties?property_type=Commercial"
                className="home-category-btn"
              >
                Browse
                <FaArrowRight />
              </Link>
            </div>
            <div className="home-category-card">
              <FaBed className="home-category-icon" />
              <h3>Studio</h3>
              <p>Compact and comfortable spaces for individuals and professionals.</p>
              <Link
                to="/properties?property_type=Studio"
                className="home-category-btn"
              >
                Browse
                <FaArrowRight />
              </Link>
            </div>
            <div className="home-category-card">
              <FaUserFriends className="home-category-icon" />
              <h3>PG</h3>
              <p>Affordable shared accommodation with convenient facilities.</p>
              <Link
                to="/properties?property_type=PG"
                className="home-category-btn"
              >
                Browse
                <FaArrowRight />
              </Link>
            </div>
            <div className="home-category-card">
              <FaHotel className="home-category-icon" />
              <h3>Hostel</h3>
              <p>Budget-friendly accommodation suitable for students and professionals.</p>
              <Link
                to="/properties?property_type=Hostel"
                className="home-category-btn"
              >
                Browse
                <FaArrowRight />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section id="services" className="home-services">
        <div className="home-container">
          <h2>Our Services</h2>
          <p className="home-section-description">
            We provide everything you need to simplify property renting,
            management, and maintenance.
          </p>
          <div className="home-services-grid">
            <div className="home-service-card">
              <FaBuilding className="home-service-icon" />
              <h3>Property Listing</h3>
              <p>Owners can publish rental properties with complete details.</p>
            </div>
            <div className="home-service-card">
              <FaCalendarCheck className="home-service-icon" />
              <h3>Visit Scheduling</h3>
              <p>Book property visits directly with owners</p>
            </div>
            <div className="home-service-card">
              <FaFileContract className="home-service-icon" />
              <h3>Lease Extension</h3>
              <p>Current tenants can request lease extension online.</p>
            </div>
            <div className="home-service-card">
              <FaTools className="home-service-icon" />
              <h3>Maintenance Requests</h3>
              <p>Raise maintenance requests and track progress.</p>
            </div>
          </div>
        </div>
      </section>

      <section id="reviews" className="home-reviews">
        <div className="home-review-grid">
          {reviews.length > 0 ? (
            reviews.map((review) => (
              <div className="home-review-card" key={review.id}>
                <div className="home-review-header">
                  <img
                    src={
                      review.renter_profile_picture ||
                      "https://cdn-icons-png.flaticon.com/512/149/149071.png"
                    }
                    alt={review.renter_name}
                    className="home-review-avatar"
                  />

                  <div className="home-review-info">
                    <h3>{review.renter_name}</h3>
                    <span>{review.property_title}</span>

                    <div className="home-review-rating">
                      {Array.from({ length: review.rating }).map((_, index) => (
                        <FaStar key={index} />
                      ))}
                    </div>
                  </div>
                </div>

                <p>"{review.comment}"</p>
              </div>
            ))
          ) : (
            <p className="home-text-center">No reviews available.</p>
          )}
        </div>
      </section>

      <section id="faq" className="home-faq">
        <div className="home-container">
          <h2>Frequently Asked Questions</h2>
          <p className="home-section-description">
            Find answers to the most common questions about RentFlow
          </p>
          <div className="home-faq-container">
            <Accordion>
              <Accordion.Item eventKey="0">
                <Accordion.Header>How do i list my property?</Accordion.Header>
                <Accordion.Body>
                  Register as an owner and add your property details from your
                  dashboard.
                </Accordion.Body>
              </Accordion.Item>
              <Accordion.Item eventKey="1">
                <Accordion.Header>How do i book a visit?</Accordion.Header>
                <Accordion.Body>
                  Select a property and send a visit request.
                </Accordion.Body>
              </Accordion.Item>
              <Accordion.Item eventKey="2">
                <Accordion.Header>
                  Can tenants request maintenance?
                </Accordion.Header>
                <Accordion.Body>
                  Yes, current tenants can submit maintenance requests.
                </Accordion.Body>
              </Accordion.Item>
              <Accordion.Item eventKey="3">
                <Accordion.Header>
                  Can I request a lease extension?
                </Accordion.Header>
                <Accordion.Body>
                  Yes. Current tenants can submit lease extension requests
                  through their dashboard.
                </Accordion.Body>
              </Accordion.Item>
            </Accordion>
          </div>
        </div>
      </section>

      <section id="policies" className="home-policies">
        <div className="home-container">
          <h2>Privacy Policy & Terms of Services</h2>
          <p className="home-section-description">
            We are committed to providing a secrue, transparent, and reliable
            rental property management platform for all users.
          </p>
          <div className="home-policy-grid">
            <div className="home-policy-card">
              <h3>Privacy Policy</h3>
              <p>
                At RentFlow , propecting your personal information is one of our
                highest priorties. We collect only the information required to
                provide rental management services and improve your experience
              </p>
              <ul>
                <li>Personal information is stored securely.</li>
                <li>
                  Your data is never shared with unauthorized third parties.
                </li>
                <li>
                  Property information is visible only as ncessary for rental
                  services.
                </li>
                <li>Uploaded images are protected within the platform.</li>
                <li>
                  users can update their profile information whenever required.
                </li>
              </ul>
            </div>
            <div className="home-policy-card">
              <h3>Terms & Conditions</h3>
              <p>
                By using RentFlow, users agree to follow the platform guidelines
                and provide accurate information during registration and
                property management.
              </p>
              <ul>
                <li>
                  User must provide genuine personal and property information.
                </li>
                <li>
                  Property owners are responsible for the accuracy of their
                  property listings.
                </li>
                <li>
                  Renters should submit genuine visit request and applications.
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
export default Home;
