import React from 'react';

interface UserProfileCardProps {
  name: string;
  username: string;
  bio: string;
  profilePictureUrl: string;
  coverImageUrl?: string;
  postsCount: number;
  followersCount: number;
  followingCount: number;
  onFollow?: () => void;
  onMessage?: () => void;
}

const UserProfileCard: React.FC<UserProfileCardProps> = ({
  name,
  username,
  bio,
  profilePictureUrl,
  coverImageUrl,
  postsCount,
  followersCount,
  followingCount,
  onFollow,
  onMessage,
}) => {
  return (
    <div className="card" style={{ maxWidth: '600px', margin: '16px auto' }}>
      {coverImageUrl && (
        <div className="h-32 overflow-hidden rounded-t-lg">
          <img 
            src={coverImageUrl} 
            alt="Cover" 
            className="w-full h-full object-cover"
          />
        </div>
      )}
      <div className="relative">
        <div className="absolute -top-12 left-4">
          <div className="w-24 h-24 rounded-full border-4 border-white bg-white overflow-hidden">
            <img 
              src={profilePictureUrl} 
              alt={name} 
              className="w-full h-full object-cover"
            />
          </div>
        </div>
        <div className="pt-16 pb-4 px-4">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-xl font-bold">{name}</h2>
              <p className="text-gray-600">@{username}</p>
            </div>
            <button 
              className="button button-primary"
              onClick={onFollow}
            >
              Follow
            </button>
          </div>
          <p className="text-gray-700 my-3">{bio}</p>
          <div className="flex gap-4">
            <span><strong>{postsCount}</strong> Posts</span>
            <span><strong>{followersCount}</strong> Followers</span>
            <span><strong>{followingCount}</strong> Following</span>
          </div>
        </div>
      </div>
      <div className="px-4 pb-4">
        <div className="flex gap-2">
          <button 
            className="button button-secondary flex items-center"
            onClick={onMessage}
          >
            ✉️ Message
          </button>
          <button className="button button-secondary">
            ⋮ More
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserProfileCard;