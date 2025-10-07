import React, { useState, useRef } from "react";
import { BiSearch } from "react-icons/bi";
import { useNavigate } from "react-router-dom";
import { useSearchProducts } from "../../api/component/productApi";

const SearchInput = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const { data: searchResults = [] } = useSearchProducts(searchQuery);
  const navigate = useNavigate();
  const inputRef = useRef(null);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setShowDropdown(e.target.value.length > 0);
    setHighlightedIndex(-1);
  };

  const handleSelectProduct = (slug) => {
    navigate(`/products/${slug}`);
    setSearchQuery("");
    setShowDropdown(false);
    setHighlightedIndex(-1);
  };

  const handleKeyDown = (e) => {
    if (!showDropdown || searchResults.length === 0) return;

    if (e.key === "ArrowDown") {
      setHighlightedIndex((prev) =>
        prev < searchResults.length - 1 ? prev + 1 : 0
      );
    } else if (e.key === "ArrowUp") {
      setHighlightedIndex((prev) =>
        prev > 0 ? prev - 1 : searchResults.length - 1
      );
    } else if (e.key === "Enter") {
      if (highlightedIndex >= 0) {
        handleSelectProduct(searchResults[highlightedIndex].slug);
      }
    } else if (e.key === "Escape") {
      setShowDropdown(false);
      setHighlightedIndex(-1);
    }
  };

  return (
    <div className="relative w-full max-w-xl">
      <input
        ref={inputRef}
        type="text"
        value={searchQuery}
        onChange={handleSearchChange}
        onKeyDown={handleKeyDown}
        placeholder="Search products..."
        className="w-full border rounded-2xl pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
      />
      <BiSearch className="absolute left-3 top-2.5 text-gray-500" />

      {showDropdown && searchResults.length > 0 && (
        <div className="absolute top-full left-0 w-full bg-white border rounded-b-xl shadow-lg max-h-60 overflow-y-auto z-50">
          {searchResults.map((item, index) => (
            <div
              key={item._id}
              onClick={() => handleSelectProduct(item.slug)}
              className={`px-4 py-2 cursor-pointer flex items-center gap-2 ${
                highlightedIndex === index ? "bg-indigo-100" : ""
              }`}
            >
              <img
                src={item.thumbnail}
                alt=""
                className="w-12 h-12 object-cover rounded"
              />
              <div>
                <p className="font-semibold">{item.productName}</p>
                <p className="text-sm text-gray-500">{item.brand}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchInput;
