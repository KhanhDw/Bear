import React from 'react';
import { BiUser } from 'react-icons/bi';
import styles from './UserAvatar.module.css';

interface UserAvatarProps {
  name: string;
  size?: 'small' | 'medium' | 'large';
  src?: string;
  className?: string;
}

const UserAvatar: React.FC<UserAvatarProps> = ({ 
  name, 
  size = 'medium', 
  src, 
  className = '' 
}) => {
  const sizeClasses = {
    small: styles.small,
    medium: styles.medium,
    large: styles.large
  };

  return (
    <div className={`${styles.avatar} ${sizeClasses[size]} ${className}`}>
      {src ? (
        <img src={src} alt={name} className={styles.avatarImage} />
      ) : (
        <div className={styles.avatarPlaceholder}>
          <BiUser size={size === 'small' ? 14 : size === 'large' ? 24 : 18} />
        </div>
      )}
      <span className={styles.avatarInitials}>
        {name.charAt(0).toUpperCase()}
      </span>
    </div>
  );
};

export default UserAvatar;