import { FaStar } from 'react-icons/fa';

const ProductRating = ({ rating, reviews }) => {
  return (
    <div className="product-rating mt-8 px-4">
      {/* Customer Reviews Heading */}
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">Customer Reviews</h2>
      
      <div className="flex items-center">
        {/* Display Stars */}
        {[...Array(5)].map((_, i) => (
          <FaStar
            key={i}
            className={`mr-1 ${i < Math.round(rating) ? 'text-yellow-400' : 'text-gray-300'}`}
            size={20} // Slightly larger stars for better visibility
          />
        ))}

        {/* Display Rating and Number of Reviews */}
        <span className="ml-2 text-sm text-gray-800 font-semibold">
          {rating} ({reviews.length} {reviews.length === 1 ? 'review' : 'reviews'})
        </span>
      </div>

      {/* Reviews List */}
      {reviews.length > 0 ? (
        <div className="reviews mt-4 space-y-4">
          {reviews.slice(0, 3).map((review, index) => (
            <div key={index} className="review-item text-sm text-gray-800 border-b pb-4">
              {/* Review Author and Date */}
              <div className="flex justify-between">
                <p className="font-semibold">{review.author}</p>
                <p className="text-xs text-gray-500">{review.date}</p>
              </div>

              {/* Review Text */}
              <p className="text-gray-700 mt-1">{review.text}</p>
            </div>
          ))}
          {/* Link to view all reviews */}
          {reviews.length > 3 && (
            <div className="mt-2">
              <span className="text-blue-600 cursor-pointer hover:underline text-sm">
                See all reviews
              </span>
            </div>
          )}
        </div>
      ) : (
        <p className="text-gray-500 mt-2">No reviews yet.</p>
      )}
    </div>
  );
};

export default ProductRating;
