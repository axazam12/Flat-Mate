import { useEffect, useState } from "react";
import api from "../api";
import { FaHeart, FaRegHeart } from "react-icons/fa";

function FavoriteButton({ propertyId, className="property-card-save-btn" }) {
  const storedUser = localStorage.getItem("user");
  const user = storedUser ? JSON.parse(storedUser) : null;

  const [favorite, setFavorite] = useState(false);
  const [favoriteId, setFavoriteId] = useState(null);

  useEffect(() => {
    if (user?.role === "Renter") {
      checkFavorite();
    }
  }, []);

  const checkFavorite = async () => {
    try {
      const response = await api.get("renter/favorites/");

      const fav = response.data.find((item) => item.property === propertyId);

      if (fav) {
        setFavorite(true);
        setFavoriteId(fav.id);
      }
    } catch (error) {
      console.log(error);
    }
  };
  const handleFavorite = async () => {
    try {
      if (favorite) {
        await api.delete(`renter/favorites/${favoriteId}/`);
        setFavorite(false);
        setFavoriteId(null);
      } else {
        const response = await api.post("renter/favorites/", {
          property: propertyId,
        });

        setFavorite(true);
        setFavoriteId(response.data.id);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return(
    <button className={`${className} ${favorite ? "saved" : ""}`} onClick={handleFavorite}>
        {favorite ? 
            <FaHeart/> : <FaRegHeart/>
        }
        {favorite ? "Saved":"Save"}
    </button>
  )
}

export default FavoriteButton;