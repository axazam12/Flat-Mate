import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import api from "../api";
import PropertyCard from "../components/PropertyCard";
import SearchBar from "../components/SearchBar";
import "../css/browseproperties.css";

function BrowseProperties() {
  const [filteredProperties, setFilteredProperties] = useState([]);
  const [propertyType, setPropertyType] = useState("");
  const [search, setSearch] = useState("");
  const [ordering, setOrdering] = useState("");
  const [searchParams] = useSearchParams()

  useEffect(() => {
    fetchProperties();
  }, [searchParams]);

  const fetchProperties = async () => {
    try {
      const response = await api.get("properties/properties/",{
        params:{
          search: searchParams.get("search"),
          property_type: searchParams.get("property_type"),
        }
      });
      setFilteredProperties(response.data);
      setOrdering("");
    } catch (error) {
      console.error(error);
    }
  };

  const handleSearch = async (keyword) => {
    setSearch(keyword);
    try {
      let url = `properties/properties/?`;

      if (keyword) {
        url += `search=${keyword}`;
      }

      if (propertyType) {
        url += `${keyword ? "&" : ""}property_type=${propertyType}`;
      }

      if (ordering) {
        url += `${url.includes("?") && !url.endsWith("?") ? "&" : ""}ordering=${ordering}`;
      }

      const response = await api.get(url);
      setFilteredProperties(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleTypeFilter = async (type) => {
    setPropertyType(type);
    try {
      let url = `properties/properties/?`;
      if (search) {
        url += `search=${search}`;
      }
      if (type) {
        url += `${search ? "&" : ""}property_type=${type}`;
      }

      if (ordering) {
        url += `${url.includes("?") && !url.endsWith("?") ? "&" : ""}ordering=${ordering}`;
      }

      const response = await api.get(url);
      setFilteredProperties(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="browse-properties">
      <div className="browse-header">
        <div>
          <h2>Browse Properties</h2>
          <p>Discover apartments, houses, villas and commercial properties.</p>
        </div>
        <button className="refresh-btn" onClick={fetchProperties}>
          Refresh
        </button>
      </div>
      <div className="search-filter">
        <SearchBar onSearch={handleSearch} />
        <div className="filter-section">
          <select
            value={propertyType}
            onChange={(e) => handleTypeFilter(e.target.value)}
          >
            <option value="">All Property Types</option>
            <option value="Apartment">Apartment</option>
            <option value="House">House</option>
            <option value="Villa">Villa</option>
            <option value="Studio">Studio</option>
            <option value="Commercial">Commercial</option>
            <option value="PG">PG</option>
            <option value="Hostel">Hostel</option>
          </select>

          <select value={ordering} onChange={(e) =>{ setOrdering(e.target.value) ;handleSearch(search);}}>
            <option value="">Sort</option>
            <option value="rent_low">Price Low - High</option>
            <option value="rent_high">Price Hign - Low</option>
            <option value="latest">Latest</option>
            <option value="oldest">Oldest</option>
          </select>
        </div>
      </div>
      <p className="property-count">
        {filteredProperties.length} Properties found
      </p>

      {filteredProperties.length === 0 ? (
        <div className="empty-state">
          <h3>No properties found.</h3>
          <p>Try changing your search keyword or property type.</p>
        </div>
      ) : (
        <div className="property-grid">
          {filteredProperties.map((property) => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </div>
      )}
    </div>
  );
}

export default BrowseProperties;
