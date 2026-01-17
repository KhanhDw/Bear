import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

interface SearchResult {
  id: string;
  type: 'user' | 'post';
  title: string;
  subtitle?: string;
  avatar?: string;
}

interface SearchBarProps {
  onSearch?: (query: string) => void;
  searchResults?: SearchResult[];
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch, searchResults = [] }) => {
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const searchBarRef = useRef<HTMLDivElement>(null);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch?.(query);
      navigate(`/search?q=${encodeURIComponent(query)}`);
      setOpen(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);

    // Only show results if there's a query and results available
    if (value.trim() && searchResults.length > 0) {
      setOpen(true);
    } else {
      setOpen(false);
    }
  };

  const handleResultClick = (result: SearchResult) => {
    if (result.type === 'user') {
      navigate(`/user/${result.id}`);
    } else {
      navigate(`/post/${result.id}`);
    }
    setOpen(false);
    setQuery('');
  };

  const clearSearch = () => {
    setQuery('');
    setOpen(false);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchBarRef.current && !searchBarRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="relative w-full" ref={searchBarRef}>
      <form 
        onSubmit={handleSearch}
        className="flex items-center w-full border border-gray-300 rounded-md overflow-hidden focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500"
      >
        <button 
          type="submit"
          className="p-3 text-gray-500 hover:text-gray-700"
          aria-label="search"
        >
          🔍
        </button>
        <input
          type="text"
          placeholder="Search posts, people..."
          className="flex-1 p-2 outline-none"
          value={query}
          onChange={handleInputChange}
          onFocus={() => query && searchResults.length > 0 && setOpen(true)}
        />
        {query && (
          <button
            type="button"
            className="p-3 text-gray-500 hover:text-gray-700"
            onClick={clearSearch}
            aria-label="clear"
          >
            ✕
          </button>
        )}
      </form>

      {open && (
        <div className="absolute left-0 right-0 mt-1 bg-white border border-gray-300 rounded-md shadow-lg z-50 max-h-80 overflow-auto">
          <ul>
            {searchResults.length > 0 ? (
              searchResults.map((result) => (
                <li 
                  key={result.id}
                  className="p-3 hover:bg-gray-100 cursor-pointer flex items-center"
                  onClick={() => handleResultClick(result)}
                >
                  {result.avatar && (
                    <div className="w-8 h-8 rounded-full overflow-hidden mr-2">
                      <img src={result.avatar} alt={result.title} className="w-full h-full object-cover" />
                    </div>
                  )}
                  <div>
                    <div className="font-medium">{result.title}</div>
                    {result.subtitle && <div className="text-sm text-gray-600">{result.subtitle}</div>}
                  </div>
                </li>
              ))
            ) : (
              <li className="p-3 text-gray-600">No results found</li>
            )}
          </ul>
          <hr />
          <li 
            className="p-3 hover:bg-gray-100 cursor-pointer"
            onClick={() => navigate(`/search?q=${encodeURIComponent(query)}`)}
          >
            See all results for "{query}"
          </li>
        </div>
      )}
    </div>
  );
};

export default SearchBar;