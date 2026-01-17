// src/pages/WelcomePage.tsx
import React from 'react';
import { Link } from 'react-router-dom';

const WelcomePage: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-20 bg-gray-50">
      <div className="max-w-4xl w-full">
        <div className="text-center mb-20">
          <h1 className="text-4xl font-bold mb-6">Welcome to Bear Social</h1>
          <p className="text-xl text-gray-600 mb-8">
            Connect, share, and engage with our community
          </p>
          <div className="flex justify-center gap-4">
            <Link 
              to="/register" 
              className="button button-primary px-8 py-3 text-lg"
            >
              Join Now
            </Link>
            <Link 
              to="/login" 
              className="button button-secondary px-8 py-3 text-lg"
            >
              Sign In
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 justify-items-center">
          <div className="card w-full max-w-xs">
            <div className="text-center">
              <div className="text-3xl mb-4">🌍</div>
              <h3 className="text-lg font-semibold mb-2">Share Your Thoughts</h3>
              <p className="text-gray-600">
                Post updates, ideas, and connect with people who share your interests.
              </p>
            </div>
          </div>
          
          <div className="card w-full max-w-xs">
            <div className="text-center">
              <div className="text-3xl mb-4">💬</div>
              <h3 className="text-lg font-semibold mb-2">Engage in Conversations</h3>
              <p className="text-gray-600">
                Comment, like, and discuss posts with our vibrant community.
              </p>
            </div>
          </div>
          
          <div className="card w-full max-w-xs">
            <div className="text-center">
              <div className="text-3xl mb-4">🏆</div>
              <h3 className="text-lg font-semibold mb-2">Earn Recognition</h3>
              <p className="text-gray-600">
                Gain recognition for your contributions and expertise in topics you love.
              </p>
            </div>
          </div>
        </div>

        <div className="text-center mt-20">
          <h3 className="text-lg font-semibold mb-4">
            Already have an account?
          </h3>
          <Link 
            to="/login" 
            className="button button-primary px-6 py-2"
          >
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
};

export default WelcomePage;