import { useState } from 'react';
import Header from '../components/common/Header';
import Sidebar from '../components/common/Sidebar';

const VoteHistoryPage = () => {
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  // Sample vote data
  const sampleVotes = [
    {
      id: '1',
      type: 'post',
      title: 'Beautiful sunset photo',
      author: 'Jane Smith',
      voteType: 'upvote',
      time: '2 hours ago'
    },
    {
      id: '2',
      type: 'comment',
      title: 'Great hiking spot recommendation',
      author: 'Bob Johnson',
      voteType: 'upvote',
      time: '1 day ago'
    },
    {
      id: '3',
      type: 'post',
      title: 'New recipe for dinner',
      author: 'Alice Brown',
      voteType: 'downvote',
      time: '2 days ago'
    }
  ];

  return (
    <div className="app-container">
      <Header onDrawerToggle={handleDrawerToggle} />
      <Sidebar
        mobileOpen={mobileOpen}
        handleDrawerToggle={() => setMobileOpen(!mobileOpen)}
      />
      <main className="main-content">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl font-bold mb-6">Vote History</h1>
          <div className="card mt-2">
            <ul className="list-none p-0 m-0">
              {sampleVotes.map((vote) => (
                <li key={vote.id} className="py-3 border-b border-gray-200 last:border-b-0">
                  <div className="flex items-center">
                    <div 
                      className={`w-10 h-10 rounded-full flex items-center justify-center mr-3 ${
                        vote.voteType === 'upvote' ? 'bg-green-500' : 'bg-red-500'
                      }`}
                    >
                      {vote.voteType === 'upvote' ? '👍' : '👎'}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">
                        {vote.voteType === 'upvote' ? 'Upvoted' : 'Downvoted'} {vote.type} "{vote.title}"
                      </p>
                      <p className="text-gray-600 text-sm">
                        by {vote.author} • {vote.time}
                      </p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </main>
    </div>
  );
};

export default VoteHistoryPage;