const SearchInput = ({ className = '', ...props }) => {
    return (
      <input
        type="text"
        placeholder="Search NewList"
        className={`px-4 py-2 text-black w-full border border-gray-300  ${className}`}
        {...props}
      />
    );
  };
  
  export default SearchInput;
  
// // This SearchInput component is a styled input field for search functionality. It accepts a placeholder, className, and other props. The input has full width, padding, a border, rounded corners, and a focus effect that changes the border color to yellow. The className prop allows for additional custom styling when using the component.