import { useState, useEffect } from "react";
import "../css/propertygallery.css";

function PropertyGallery({ images = [] }) {
  const [selectedImage, setSelectedImage] = useState("");

  useEffect(() => {
    if (images.length > 0) {
      const cover = images.find((img) => img.is_cover) || images[0];

      setSelectedImage(
        cover.image.startsWith("http")
          ? cover.image
          : `http://localhost:8000${cover.image}`,
      );
    }
  }, [images]);

  if (images.length === 0) {
    return <div className="gallery-placeholder">No image Available</div>;
  }

  return (
    <div className="property-gallery">
      <div className="main-image">
        <img src={selectedImage} alt="property" />
      </div>
      <div className="thumbnail-container">
        {images.map((image) => (
          <img
            key={image.id}
            src={
              image.image.startsWith("http")
                ? image.image
                : `http://localhost:8000${image.image}`
            }
            alt="Thumbnial"
            className={
              selectedImage ===
              (image.image.startsWith("http")
                ? image.image
                : `http://localhost:8000${image.image}`)
                ? "thumbnail active"
                : "thumbnail"
            }
            onClick={() =>
              setSelectedImage(
                image.image.startsWith("http")
                  ? image.image
                  : `http://localhost:8000${image.image}`,
              )
            }
          />
        ))}
      </div>
    </div>
  );
}

export default PropertyGallery;
