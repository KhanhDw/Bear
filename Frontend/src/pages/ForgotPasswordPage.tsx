// src/pages/ForgotPasswordPage.tsx
import React, { useState } from "react";
import { Link } from "react-router-dom";

const ForgotPasswordPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    // Simulate API call
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // In a real app, you would send a password reset email here
      // For mock purposes, we'll just show a success message
      setSubmitted(true);
    } catch (err: any) {
      setError(err.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-container">
      <h2 className="form-title">Reset your password</h2>

      {!submitted ? (
        <>
          {error && <div className="alert alert-error">{error}</div>}

          <p className="text-center text-gray-600 mb-4">
            Enter your email address and we'll send you a link to reset your
            password.
          </p>

          <form onSubmit={handleSubmit} className="mt-1">
            <div className="form-group">
              <label htmlFor="email" className="form-label">
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="form-input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoFocus
              />
            </div>

            <button
              type="submit"
              className="form-button mt-3 mb-2"
              disabled={loading}
            >
              {loading ? "Sending..." : "Send Reset Link"}
            </button>

            <div className="text-center mt-2">
              <Link to="/login" className="form-link">
                Back to sign in
              </Link>
            </div>
          </form>
        </>
      ) : (
        <div className="text-center">
          <div className="alert alert-success mb-2">
            Password reset link sent to your email!
          </div>
          <p className="text-gray-600 mb-2">
            We've sent a password reset link to <strong>{email}</strong>. Please
            check your inbox.
          </p>
          <Link to="/login" className="form-link">
            Back to sign in
          </Link>
        </div>
      )}
    </div>
  );
};

export default ForgotPasswordPage;
