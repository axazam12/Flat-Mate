import { useEffect,useState } from "react";
import api from "../../api";
import PropertyCard from "../../components/PropertyCard"
import "../../css/favorites.css"

function Favorites(){
    const [favorites, setFavorites] =useState([])

    useEffect(() => {
        fetchFavorites()
    },[])

    const fetchFavorites = async()=>{
        try{
            const response = await api.get("renter/favorites/")
            console.log(response.data)
            setFavorites(response.data)
        }catch(error){
            console.log(error)
        }
    }

    return(
        <div className="favorites-page">
            <div className="favorites-header">
                <h1>Saved Properties</h1>
                <p>View all the rpoperies you have saved.</p>
            </div>

            {favorites.length === 0 ? (
                <div className="favorites-empty">
                    <h2>
                        No Saved Properties
                    </h2>
                    <p>Save your favorite properties to view them here.</p>
                </div>
            ) : (
                <div className="favorites-grid">
                    {favorites.map((favorite) => (
                        <PropertyCard key={favorite.id} property={favorite.property_details}/>
                    ))}
                </div>
            )}
        </div>
    )
}

export default Favorites