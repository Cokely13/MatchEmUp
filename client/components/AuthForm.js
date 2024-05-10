// import React, { useState } from 'react';
// import { connect } from 'react-redux';
// import { authenticate } from '../store';

// /**
//  * COMPONENT
//  */
// const AuthForm = props => {
//   const { name, displayName, handleSubmit, error } = props;
//   const [localError, setLocalError] = useState(''); // State to manage local error messages

//   const handleFormSubmit = evt => {
//     evt.preventDefault();
//     const formName = evt.target.name;
//     const username = evt.target.username.value;
//     const password = evt.target.password.value;
//     try {
//       console.log(`Submitting form ${formName} for user ${username}`);
//       handleSubmit(username, password, formName);
//     } catch (err) {
//       console.error('Submission error:', err);
//       setLocalError('Failed to submit form. Please try again.'); // Set local error message
//       alert('Error during form submission. Check console for details.'); // Popup alert for debugging
//     }
//   };

//   return (
//     <div>
//       <form onSubmit={handleFormSubmit} name={name}>
//         <div>
//           <label htmlFor="username">
//             <small>Username</small>
//           </label>
//           <input name="username" type="text" />
//         </div>
//         <div>
//           <label htmlFor="password">
//             <small>Password!!</small>
//           </label>
//           <input name="password" type="password" />
//         </div>
//         <div>
//           <button type="submit">{displayName}</button>
//         </div>
//         {error && error.response && <div> {error.response.data} </div>}
//         {localError && <div>{localError}</div>} {/* Display local error */}
//       </form>
//     </div>
//   );
// };

// /**
//  * CONTAINER
//  */
// const mapLogin = state => {
//   return {
//     name: 'login',
//     displayName: 'Login',
//     error: state.auth.error
//   };
// };

// const mapSignup = state => {
//   return {
//     name: 'signup',
//     displayName: 'Sign Up',
//     error: state.auth.error
//   };
// };

// const mapDispatch = dispatch => {
//   return {
//     handleSubmit(username, password, formName) {
//       dispatch(authenticate(username, password, formName));
//     }
//   };
// };

// export const Login = connect(mapLogin, mapDispatch)(AuthForm);
// export const Signup = connect(mapSignup, mapDispatch)(AuthForm);

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

  return (
    <div>
      <form onSubmit={handleFormSubmit} name={name}>
        {/* Form fields for username and password */}
        <div>
          <label htmlFor="username"><small>Username</small></label>
          <input name="username" type="text" />
        </div>
        <div>
          <label htmlFor="password"><small>Password</small></label>
          <input name="password" type="password" />
        </div>
        <div>
          <button type="submit">{displayName}</button>
          <button type="button" onClick={handleGuestSubmit}>Continue as Guest</button>
        </div>
        {error && error.response && <div> {error.response.data} </div>}
        {localError && <div>{localError}</div>}
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
    dispatch(loginAsGuest()); // Ensure this action is defined to handle guest login logic
  }
});

export const Login = connect(mapLogin, mapDispatch)(AuthForm);
export const Signup = connect(null, mapDispatch)(AuthForm);
