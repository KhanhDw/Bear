import React from 'react';
import { BiEnvelope, BiDotsHorizontalRounded } from 'react-icons/bi';
import styles from './UserProfileCard.module.css';

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
    <div className={styles.userProfileCard}>
      {coverImageUrl && (
        <div className={styles.coverImage}>
          <img 
            src={coverImageUrl} 
            alt="Cover" 
            className={styles.coverImg}
          />
        </div>
      )}
      <div className={styles.profileInfo}>
        <div className={styles.profilePictureContainer}>
          <img 
            src={profilePictureUrl} 
            alt={name} 
            className={styles.profilePicture}
          />
        </div>
        <div className={styles.userInfo}>
          <div className={styles.userHeader}>
            <div>
              <h2 className={styles.userName}>{name}</h2>
              <p className={styles.userHandle}>@{username}</p>
            </div>
            <button 
              className={styles.followButton}
              onClick={onFollow}
            >
              Follow
            </button>
          </div>
          <p className={styles.userBio}>{bio}</p>
          <div className={styles.stats}>
            <span><strong>{postsCount}</strong> Posts</span>
            <span><strong>{followersCount}</strong> Followers</span>
            <span><strong>{followingCount}</strong> Following</span>
          </div>
        </div>
      </div>
      <div className={styles.actions}>
        <div className={styles.actionButtons}>
          <button 
            className={styles.messageButton}
            onClick={onMessage}
          >
            <BiEnvelope size={16} /> Message
          </button>
          <button className={styles.moreButton}>
            <BiDotsHorizontalRounded size={16} /> More
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserProfileCard;