import { useState } from 'react';
import Header from '../components/common/Header';
import Sidebar from '../components/common/Sidebar';
import SearchBar from '../components/ui/SearchBar';

const SearchResultsPage = () => {
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  return (
    <div className="app-container">
      <Header onDrawerToggle={handleDrawerToggle} />
      <Sidebar
        mobileOpen={mobileOpen}
        handleDrawerToggle={() => setMobileOpen(!mobileOpen)}
      />
      <main className="main-content">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl font-bold mb-6">Search</h1>
          <div className="card mb-6">
            <SearchBar />
          </div>
          <h2 className="text-xl font-bold mb-4">Search Results</h2>
          <p>This is the search results page where search results will be displayed.</p>
        </div>
      </main>
    </div>
  );
};

export default SearchResultsPage;