import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BiSearch, BiX } from 'react-icons/bi';
import styles from './SearchBar.module.css';

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
    <div className={styles.searchContainer} ref={searchBarRef}>
      <form 
        onSubmit={handleSearch}
        className={styles.searchForm}
      >
        <button 
          type="submit"
          className={styles.searchButton}
          aria-label="search"
        >
          <BiSearch size={18} />
        </button>
        <input
          type="text"
          placeholder="Search posts, people..."
          className={styles.searchInput}
          value={query}
          onChange={handleInputChange}
          onFocus={() => query && searchResults.length > 0 && setOpen(true)}
        />
        {query && (
          <button
            type="button"
            className={styles.clearButton}
            onClick={clearSearch}
            aria-label="clear"
          >
            <BiX size={18} />
          </button>
        )}
      </form>

      {open && (
        <div className={styles.dropdown}>
          <ul>
            {searchResults.length > 0 ? (
              searchResults.map((result) => (
                <li 
                  key={result.id}
                  className={styles.resultItem}
                  onClick={() => handleResultClick(result)}
                >
                  {result.avatar && (
                    <div className={styles.avatar}>
                      <img src={result.avatar} alt={result.title} className={styles.avatarImage} />
                    </div>
                  )}
                  <div>
                    <div className={styles.resultTitle}>{result.title}</div>
                    {result.subtitle && <div className={styles.resultSubtitle}>{result.subtitle}</div>}
                  </div>
                </li>
              ))
            ) : (
              <li className={styles.noResults}>No results found</li>
            )}
          </ul>
          <hr className={styles.divider} />
          <li 
            className={styles.seeAllResults}
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