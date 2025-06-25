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
      // Handle search submission here
    }
  };

  return (
    <div className="w-full max-w-lg">
      <div className="relative">
        {/* Search Input Container */}
        <div className={`
          relative flex items-center bg-white rounded-2xl shadow-lg border-2 transition-all duration-300 overflow-hidden
          ${isFocused 
            ? 'border-blue-500 shadow-xl shadow-blue-100' 
            : 'border-gray-200 hover:border-gray-300'
          }
        `}>
          {/* Search Icon */}
          <div className="pl-6 pr-3">
            <Search className={`
              w-5 h-5 transition-colors duration-300
              ${isFocused ? 'text-blue-500' : 'text-gray-400'}
            `} />
          </div>

          {/* Input Field */}
          <input
            ref={inputRef}
            type="text"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            onKeyPress={(e) => e.key === 'Enter' && handleSubmit(e)}
            placeholder="Search for Blogs"
            className="flex-1 py-3 pr-4 text-gray-700 placeholder-gray-400 bg-transparent focus:outline-none text-lg"
          />

          {/* Clear Button */}
          {searchValue && (
            <button
              type="button"
              onClick={handleClear}
              className="mr-3 p-2 rounded-full hover:bg-gray-100 transition-colors duration-200"
            >
              <X className="w-4 h-4 text-gray-400 hover:text-gray-600" />
            </button>
          )}

          {/* Search Button */}
          <button
            onClick={handleSubmit}
            disabled={!searchValue.trim()}
            className={`
              mr-2 px-6 py-2 rounded-xl font-medium transition-all duration-300
              ${searchValue.trim()
                ? 'bg-blue-500 text-white hover:bg-blue-600 shadow-lg cursor-pointer hover:shadow-xl transform hover:scale-105'
                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
              }
            `}
          >
            Search
          </button>
        </div>

        {/* Animated Focus Ring */}
        <div className={`
          absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 transition-opacity duration-300 -z-10 blur-sm
          ${isFocused ? 'opacity-20' : 'opacity-0'}
        `} />
      </div>
    </div>
  );
};

export default SearchBar;