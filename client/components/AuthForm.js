import React, { useState } from 'react';
import { connect } from 'react-redux';
import { authenticate, loginAsGuest } from '../store';

const AuthForm = props => {
  const { name, displayName, handleSubmit, error } = props;
  const [localError, setLocalError] = useState('');
  const [isSignup, setIsSignup] = useState(false);

  const handleFormSubmit = evt => {
    evt.preventDefault();
    const formName = evt.target.name;
    const username = evt.target.username.value;
    const password = evt.target.password.value;

    if (isSignup) {
      const confirmPassword = evt.target.confirmPassword.value;

      if (password !== confirmPassword) {
        setLocalError('Passwords do not match');
        return;
      }
    }

    try {
      handleSubmit(username, password, formName);
    } catch (err) {
      console.error('Submission error:', err);
      setLocalError('Failed to submit form. Please try again.');
    }
  };

  const handleGuestSubmit = evt => {
    evt.preventDefault();
    try {
      props.loginAsGuest();
    } catch (err) {
      console.error('Guest login error:', err);
      setLocalError('Failed to login as guest. Please try again.');
    }
  };

  return (
    <div className="auth-container">
      <form onSubmit={handleFormSubmit} name={isSignup ? 'signup' : name} className="auth-form">
        <h2 className="auth-title">{isSignup ? 'Sign Up' : displayName}</h2>
        <div className="auth-input-group">
          <label htmlFor="username" className="auth-label"><small>Username</small></label>
          <input name="username" type="text" className="auth-input" />
        </div>
        <div className="auth-input-group">
          <label htmlFor="password" className="auth-label"><small>Password</small></label>
          <input name="password" type="password" className="auth-input" />
        </div>
        {isSignup && (
          <div className="auth-input-group">
            <label htmlFor="confirmPassword" className="auth-label"><small>Confirm Password</small></label>
            <input name="confirmPassword" type="password" className="auth-input" />
          </div>
        )}
        <div className="auth-button-group">
          <button type="submit" className="auth-button">{isSignup ? 'Sign Up' : displayName}</button>
          {!isSignup && (
            <button type="button" className="auth-button" onClick={() => setIsSignup(true)}>Sign Up</button>
          )}
          <button type="button" className="auth-button auth-button-guest" onClick={handleGuestSubmit}>Continue as Guest</button>
        </div>
        {error && error.response && <div className="auth-error">{error.response.data}</div>}
        {localError && <div className="auth-error">{localError}</div>}
      </form>
    </div>
  );
};

const mapLogin = state => ({
  name: 'login',
  displayName: 'Login',
  error: state.auth.error
});

const mapDispatch = dispatch => ({
  handleSubmit(username, password, formName) {
    dispatch(authenticate(username, password, formName));
  },
  loginAsGuest() {
    dispatch(loginAsGuest());
  }
});

const mapSignup = state => ({
  name: 'signup',
  displayName: 'Sign Up',
  error: state.auth.error
});

export const Login = connect(mapLogin, mapDispatch)(AuthForm);
export const Signup = connect(mapSignup, mapDispatch)(AuthForm);
