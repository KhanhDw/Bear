import React from 'react';
import styles from './Loader.module.css';

interface LoaderProps {
  size?: number;
  thickness?: number;
}

const Loader: React.FC<LoaderProps> = ({ size = 40, thickness = 4 }) => {
  return (
    <div className={styles.loaderContainer}>
      <div 
        className={styles.spinner} 
        style={{ 
          width: `${size}px`, 
          height: `${size}px`, 
          borderWidth: `${thickness}px` 
        }}
      />
    </div>
  );
};

export default Loader;