
// import React, { useState } from 'react';
// import { connect } from 'react-redux';
// import { useHistory } from 'react-router-dom'; // Import useHistory for navigation
// import { Link } from 'react-router-dom';

// /**
//  * COMPONENT
//  */
// export const Home = props => {
//   const { username } = props;
//   const history = useHistory(); // Use the useHistory hook for redirection
//   const [selection, setSelection] = useState(''); // State to keep track of the dropdown selection

//   const handleDropdownChange = (event) => {
//     setSelection(event.target.value); // Update state when the dropdown value changes
//   };

//   const handleSubmit = (event) => {
//     event.preventDefault(); // Prevent the default form submit behavior
//     if (selection === 'Cinema') {
//       history.push('/cinema'); // Redirect to /cinema
//     } else if (selection === 'QB') {
//       history.push('/qb'); // Redirect to /qb
//     } else if (selection === 'Music') {
//       history.push('/music'); // Redirect to /music
//     } else if (selection === 'NBA') {
//       history.push('/nba'); // Redirect to /nba
//     } else if (selection === 'STATE') {
//       history.push('/state'); // Redirect to /state
//     } else if (selection === 'Random') {
//       // Randomly choose between '/cinema', '/qb', and '/music'
//       const paths = ['/cinema', '/qb', '/music', '/nba', '/state'];
//       const randomIndex = Math.floor(Math.random() * paths.length);
//       const randomPath = paths[randomIndex];
//       history.push(randomPath);
//   }
//   };

//   return (
//     <div className="homepage">
//       <form onSubmit={handleSubmit} className="match-form">
//         <div className="match-heading">What Do You Want to Match?</div>
//         <select value={selection} onChange={handleDropdownChange} className="match-select">
//           <option value="">Select...</option>
//           <option value="Cinema">Cinema</option>
//           <option value="QB">QB</option>
//           <option value="Music">Music</option>
//           <option value="NBA">NBA</option>
//           <option value="STATE">STATE</option>
//           <option value="Random">Random</option>
//         </select>
//         <button type="submit" className="match-button">Go</button>
//       </form>
//     </div>
//   );
// }


// /**
//  * CONTAINER
//  */
// const mapState = state => {
//   return {
//     username: state.auth.username
//   }
// }

// export default connect(mapState)(Home);

import React, { useState } from 'react';
import { connect } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { Link } from 'react-router-dom';

/**
 * COMPONENT
 */
export const Home = props => {
  const { username } = props;
  const history = useHistory(); // Use the useHistory hook for redirection
  const [selection, setSelection] = useState(''); // State to keep track of the dropdown selection

  const handleDropdownChange = (event) => {
    setSelection(event.target.value); // Update state when the dropdown value changes
  };

  const handleSubmit = (event) => {
    event.preventDefault(); // Prevent the default form submit behavior
    navigateToSelection();
  };

  const navigateToSelection = () => {
    const paths = {
      'Cinema': '/cinema',
      'QB': '/qb',
      'Music': '/music',
      'NBA': '/nba',
      'STATE': '/state',
      'TV': '/show',
      'Random': getRandomPath()
    };
    history.push(paths[selection] || '/');
  };

  const getRandomPath = () => {
    const paths = ['/cinema', '/qb', '/music', '/nba', '/state', '/show'];
    const randomIndex = Math.floor(Math.random() * paths.length);
    return paths[randomIndex];
  };

  // const handleGuestEntry = () => {
  //   history.push('/home'); // Redirect guests to the homepage
  // };

  return (
    <div className="homepage">
      <h1>Welcome {username || 'Guest'}!</h1>
      <form onSubmit={handleSubmit} className="match-form">
        <div className="match-heading">What Do You Want to Match?</div>
        <select value={selection} onChange={handleDropdownChange} className="match-select">
          <option value="">Select...</option>
          <option value="Cinema">Cinema</option>
          <option value="QB">QB</option>
          <option value="Music">Music</option>
          <option value="NBA">NBA</option>
          <option value="STATE">STATE</option>
          <option value="STATE">TV</option>
          <option value="Random">Random</option>
        </select>
        <button type="submit" className="match-button">Go</button>
      </form>
      {/* <button onClick={handleGuestEntry} className="guest-entry-button">Enter As Guest</button> */}
    </div>
  );
}

/**
 * CONTAINER
 */
const mapState = state => {
  return {
    username: state.auth.username
  }
}

export default connect(mapState)(Home);


