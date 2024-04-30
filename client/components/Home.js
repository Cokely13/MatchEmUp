
import React, { useState } from 'react';
import { connect } from 'react-redux';
import { useHistory } from 'react-router-dom'; // Import useHistory for navigation
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
    if (selection === 'Cinema') {
      history.push('/cinema'); // Redirect to /cinema
    } else if (selection === 'QB') {
      history.push('/qb'); // Redirect to /qb
    } else if (selection === 'Music') {
      history.push('/music'); // Redirect to /music
    } else if (selection === 'Random') {
      // Randomly choose between '/cinema' and '/qb'
      const randomPath = Math.random() < 0.5 ? '/cinema' : '/qb';
      history.push(randomPath);
    }
  };

  return (
    <div>
      <nav>
        <ul>
          <li><Link to="/cinema">Cinema</Link></li> {/* Link to /cinema */}
          <li><Link to="/qb">QB</Link></li>        {/* Link to /qb */}
        </ul>
      </nav>
      <form onSubmit={handleSubmit}>
        <label>
          What Do You Want to Match?:
          <select value={selection} onChange={handleDropdownChange}>
            <option value="">Select...</option>
            <option value="Cinema">Cinema</option>
            <option value="QB">QB</option>
            <option value="Music">Music</option>
            <option value="Random">Random</option>
          </select>
        </label>
        <button type="submit">Go</button>
      </form>
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

