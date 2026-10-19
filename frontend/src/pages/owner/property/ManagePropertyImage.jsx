import { useState,useEffect } from "react";
import { useParams } from "react-router-dom";
import api from "../../../api";
import "../../../css/managepropertyimages.css"

function ManagePropertyImages(){
    const {id} = useParams()

    const [property, setProperty] = useState(null)
    const[ image, setImage] = useState(null)

    useEffect(() => {
        fetchProperty()
    },[])

    const fetchProperty = async() => {
        try{
            const response = await api.get(`properties/properties/${id}/`)
            setProperty(response.data)
        } catch(error){
            console.log(error)
        }
    }

    const handleImageChange = (e) => {
        setImage(e.target.files[0])
    }

    const handleUpload = async() => {
        if(!image){
            alert("Select an image.")
            return
        }

        const formData = new FormData()

        formData.append("property",id)
        formData.append("image",image)
        try{
            await api.post("properties/property-images/",formData,{
                headers:{
                    "Content-Type" : "multipart/form-data"
                },
            })

            setImage(null)
            await fetchProperty()
            alert("Image uploaded")
        }catch(error){
            console.log(error)
            alert("Upload failed.")
        }
    }

    const handleDelete = async(imageId) => {
        if(!window.confirm("Delete image?")) return

        try{
            await api.delete(`properties/property-images/${imageId}/`)
            await fetchProperty()
        }catch(error){
            console.log(error)
        }
    }

    const handleCover = async(imageId) => {
        try{
            await api.patch(`properties/property-images/${imageId}/set_cover/`)

            await fetchProperty()
        }catch(error){
            console.log(error)
        }
    }

    return(
        <div className="manage-property-images-page">
            <h2 className="manage-property-images-title">Manage Property Images</h2>
            <div className="manage-property-images-upload">
                <input type="file" onChange={handleImageChange}/>
                <button onClick={handleUpload}>
                    Upload Image
                </button>
            </div>
            <div className="manage-property-images-grid">
                {property?.images?.map((img) => (
                    <div className="manage-property-image-card" key={img.id}>
                        <div className="manage-property-image-wrapper">
                        <img className="manage-property-image" src={img.image.startsWith("http")
                            ? img.image
                            : `http://localhost:8000${img.image}`
                        }/>

                        {img.is_cover &&(
                            <span className="manage-property-cover-badge">
                                Cover Image
                            </span>
                        )}
                        </div>
                        <div className="manage-property-image-actions">
                            {!img.is_cover && (
                                <button className="manage-property-cover-btn" onClick={() => handleCover(img.id)}>
                                    Set Cover
                                </button>
                            )}
                            <button className="manage-property-delete-btn" onClick={() => handleDelete(img.id)}>
                                Delete
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
export default ManagePropertyImages;