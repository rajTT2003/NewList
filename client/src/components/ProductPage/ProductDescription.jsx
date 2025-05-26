const ProductDescription = ({ description }) => {
    return (
      <div className="product-description mt-6 p-4 border-t border-gray-300">
        <h3 className="text-xl font-semibold">Product Description</h3>
        <p className="text-sm mt-2">{description}</p>
      </div>
    );
  };
  
  export default ProductDescription;
  