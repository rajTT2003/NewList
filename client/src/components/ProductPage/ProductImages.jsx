import { useState } from 'react';

const ProductImages = ({ images }) => {
  const [currentImage, setCurrentImage] = useState(images[0]);

  const handleImageClick = (image) => {
    setCurrentImage(image);
  };

  return (
    <div className="product-images">
      <div className="main-image mb-4">
        <img
          src={currentImage}
          alt="Product"
          className="object-contain w-full h-[400px] cursor-pointer"
          onClick={(e) => e.preventDefault()}
        />
      </div>

      <div className="thumbnail-images flex gap-2 mt-2">
        {images.map((image, index) => (
          <img
            key={index}
            src={image}
            alt={`Thumbnail ${index + 1}`}
            className="w-16 h-16 object-cover cursor-pointer"
            onClick={() => handleImageClick(image)}
          />
        ))}
      </div>
    </div>
  );
};

export default ProductImages;
