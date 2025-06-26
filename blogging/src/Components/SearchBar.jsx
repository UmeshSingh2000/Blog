'use client';
import React, { useState, useRef } from 'react';
import { Search, X } from 'lucide-react';

const SearchBar = () => {
  const [searchValue, setSearchValue] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef(null);

  const handleClear = () => {
    setSearchValue('');
    inputRef.current?.focus();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (searchValue.trim()) {
      console.log('Searching for:', searchValue);
      // Implement actual search logic here
    }
  };

  return (
    <div className="w-full px-3 sm:px-4 md:px-0 max-w-sm sm:max-w-md md:max-w-lg mx-auto">
      <div className="relative">
        <form
          onSubmit={handleSubmit}
          className={`relative flex items-center bg-white rounded-full shadow-md border-2 transition-all duration-300 overflow-hidden
            ${isFocused 
              ? 'border-blue-500 shadow-xl shadow-blue-100' 
              : 'border-gray-200 hover:border-gray-300'
            }
          `}
        >
          {/* Search Icon */}
          <div className="pl-4 pr-2 sm:pl-5 sm:pr-3">
            <Search
              className={`
                w-5 h-5 sm:w-6 sm:h-6 transition-colors duration-300
                ${isFocused ? 'text-blue-500' : 'text-gray-400'}
              `}
            />
          </div>

          {/* Input Field */}
          <input
            ref={inputRef}
            type="text"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            onKeyDown={(e) => e.key === 'Enter' && handleSubmit(e)}
            placeholder="Search for blogs"
            className="flex-1 text-sm sm:text-base text-gray-700 placeholder-gray-400 py-2 sm:py-3 pr-2 sm:pr-4 bg-transparent focus:outline-none"
          />

          {/* Clear Button */}
          {searchValue && (
            <button
              type="button"
              onClick={handleClear}
              className="mr-2 sm:mr-3 p-1.5 sm:p-2 rounded-full hover:bg-gray-100 transition-colors duration-200"
            >
              <X className="w-4 h-4 text-gray-400 hover:text-gray-600" />
            </button>
          )}

          {/* Search Button */}
          <button
            type="submit"
            disabled={!searchValue.trim()}
            className={`
              flex items-center gap-1 sm:gap-2 mr-2 sm:mr-3 px-3 sm:px-5 py-1.5 sm:py-2 rounded-full font-medium transition-all duration-300 text-sm sm:text-base
              ${searchValue.trim()
                ? 'bg-blue-500 text-white hover:bg-blue-600 shadow-md hover:shadow-xl transform hover:scale-105'
                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
              }
            `}
          >
            <Search className="w-4 h-4 sm:hidden" />
            <span className="hidden sm:inline">Search</span>
          </button>
        </form>

        {/* Animated Focus Glow */}
        <div
          className={`
            absolute inset-0 rounded-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 transition-opacity duration-300 -z-10 blur-sm
            ${isFocused ? 'opacity-20' : 'opacity-0'}
          `}
        />
      </div>
    </div>
  );
};

export default SearchBar;
