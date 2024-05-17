import React, { useState } from 'react';
import { connect } from 'react-redux';
import { authenticate, loginAsGuest } from '../store';  // Ensure you have a loginAsGuest action if needed

const AuthForm = props => {
  const { name, displayName, handleSubmit, error } = props;
  const [localError, setLocalError] = useState('');

  const handleFormSubmit = evt => {
    evt.preventDefault();
    const formName = evt.target.name;
    const username = evt.target.username.value;
    const password = evt.target.password.value;

    try {
      console.log("HEY!!!!")
      handleSubmit(username, password, formName);
    } catch (err) {
      console.error('Submission error:', err);
      setLocalError('Failed to submit form. Please try again.');
    }
  };

  const handleGuestSubmit = evt => {
    evt.preventDefault();
    try {
      // Assuming loginAsGuest is a redux action you might need to implement
      props.loginAsGuest();
    } catch (err) {
      console.error('Guest login error:', err);
      setLocalError('Failed to login as guest. Please try again.');
    }
  };

//   return (
//     <div>
//       <form onSubmit={handleFormSubmit} name={name}>
//         {/* Form fields for username and password */}
//         <div>
//           <label htmlFor="username"><small>Username</small></label>
//           <input name="username" type="text" />
//         </div>
//         <div>
//           <label htmlFor="password"><small>Password</small></label>
//           <input name="password" type="password" />
//         </div>
//         <div>
//           <button type="submit">{displayName}</button>
//           <button type="button" onClick={handleGuestSubmit}>Continue as Guest</button>
//         </div>
//         {error && error.response && <div> {error.response.data} </div>}
//         {localError && <div>{localError}</div>}
//       </form>
//     </div>
//   );
// };

return (
  <div className="auth-container">
    <form onSubmit={handleFormSubmit} name={name} className="auth-form">
      <h2 className="auth-title">{displayName}</h2>
      <div className="auth-input-group">
        <label htmlFor="username" className="auth-label"><small>Username</small></label>
        <input name="username" type="text" className="auth-input" />
      </div>
      <div className="auth-input-group">
        <label htmlFor="password" className="auth-label"><small>Password</small></label>
        <input name="password" type="password" className="auth-input" />
      </div>
      <div className="auth-button-group">
        <button type="submit" className="auth-button">{displayName}</button>
        <button type="button" className="auth-button auth-button-guest" onClick={handleGuestSubmit}>Continue as Guest</button>
      </div>
      {error && error.response && <div className="auth-error">{error.response.data}</div>}
      {localError && <div className="auth-error">{localError}</div>}
    </form>
  </div>
);

}

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
    dispatch(loginAsGuest()); // Ensure this action is defined to handle guest login logic
  }
});

export const Login = connect(mapLogin, mapDispatch)(AuthForm);
export const Signup = connect(null, mapDispatch)(AuthForm);
