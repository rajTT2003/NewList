import { useState } from 'react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { useProducts } from '../../context/ProductContext'; // Ensure correct path

const Banner = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const bannerImages = [
    '/Images/BannerImage1.jpeg',
    '/Images/BannerImage2.jpg',
    '/Images/BannerImage3.jpg',
  ];

  const handleNext = () => {
    setCurrentSlide((prevSlide) => (prevSlide + 1) % bannerImages.length);
  };

  const handlePrev = () => {
    setCurrentSlide((prevSlide) =>
      prevSlide === 0 ? bannerImages.length - 1 : prevSlide - 1
    );
  };

  return (
    <div className="relative">
      {/* Carousel */}
      <div className="relative w-full h-[500px] flex justify-center items-center">
        <img
          src={bannerImages[currentSlide]}
          alt="Banner"
          className="object-cover w-full h-full"
        />
        {/* Gradient Overlay */}
        <div className="absolute top-0 left-0 right-0 bottom-0 bg-gradient-to-t from-gray-100 via-transparent to-transparent opacity-99"></div>

        {/* Navigation Buttons */}
        <div className="absolute top-1/2 left-2 text-white">
          <button onClick={handlePrev} className="bg-black p-2 rounded-full">
            <FaChevronLeft size={30} />
          </button>
        </div>
        <div className="absolute top-1/2 right-2 text-white">
          <button onClick={handleNext} className="bg-black p-2 rounded-full">
            <FaChevronRight size={30} />
          </button>
        </div>
      </div>

      {/* Deal Boxes */}
      <div className="absolute md:top-[45%] top-[25%] left-1/4 right-1/4 flex flex-wrap justify-center gap-4 md:gap-8">
        <div className="bg-yellow-500 text-black p-6 rounded-md w-full sm:w-5/12 md:w-3/12 text-center">
          <h3 className="font-semibold text-lg md:text-xl">Deal of the Day</h3>
          <p className="text-xs md:text-sm">Best discounts today!</p>
        </div>
        <div className="bg-yellow-500 text-black p-6 rounded-md w-full sm:w-5/12 md:w-3/12 text-center">
          <h3 className="font-semibold text-lg md:text-xl">Today's Best Sellers</h3>
          <p className="text-xs md:text-sm">Hot items now!</p>
        </div>
        <div className="bg-yellow-500 text-black p-6 rounded-md w-full sm:w-5/12 md:w-3/12 text-center">
          <h3 className="font-semibold text-lg md:text-xl">New Arrivals</h3>
          <p className="text-xs md:text-sm">Check out the latest products.</p>
        </div>
      </div>
    </div>
  );
};

const Categories = () => {
  const { categories, loading } = useProducts();

  if (loading) {
    return (
      <div className="bg-gray-100 py-4 text-center">
        <p className="text-lg text-gray-600">Loading categories...</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-100 py-4">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl font-semibold text-center mb-4">Shop by Category</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {categories.map((category) => {
            if (!category || !category.name) return null;

            // Ensure unique key for each category
            const categoryImage = category.image || '/Images/default-category.jpg';

            return (
              <Link
                to={`/search?category=${encodeURIComponent(category.name.toLowerCase())}`}
                key={category.id || category.name}  // Use a unique key (id or name)
                className="flex flex-col items-center hover:scale-105 transition-transform"
              >
                <img
                  src={categoryImage}
                  alt={category.name}
                  className="rounded-full mb-2 w-24 h-24 object-cover"
                />
                <p className="text-sm font-medium">{category.name}</p>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
};

const BannerSection = () => {
  return (
    <div>
      <Banner />
      <Categories />
    </div>
  );
};

export default BannerSection;
