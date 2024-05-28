import React, { useState, useEffect } from 'react';
import { connect, useSelector, useDispatch } from 'react-redux';
import { fetchSingleUser } from '../store/singleUserStore';
import { useHistory } from 'react-router-dom';
import { Link } from 'react-router-dom';

/**
 * COMPONENT
 */
export const Home = props => {
  const dispatch = useDispatch();
  const user = useSelector(state => state.singleUser);
  const { username, userId} = props;
  const history = useHistory(); // Use the useHistory hook for redirection
  const [selection, setSelection] = useState(''); // State to keep track of the dropdown selection

  useEffect(() => {
    dispatch(fetchSingleUser(userId));
  }, [dispatch]);

  const handleDropdownChange = (event) => {
    setSelection(event.target.value); // Update state when the dropdown value changes
  };

  const handleSubmit = (event) => {
    event.preventDefault(); // Prevent the default form submit behavior
    navigateToSelection();
  };

  const navigateToSelection = () => {
    const paths = {
      'Movies': '/cinema',
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

//   return (
//     <div className="home">
//       <h1>Welcome {username || 'Guest'}!</h1>
//       <form onSubmit={handleSubmit} className="match-form">
//         <div className="match-heading">What Do You Want to Match?</div>
//         <select value={selection} onChange={handleDropdownChange} className="match-select">
//           <option value="">Select...</option>
//           <option value="Movies">Movies</option>
//           <option value="QB">QB</option>
//           <option value="Music">Music</option>
//           <option value="NBA">NBA</option>
//           <option value="STATE">STATE</option>
//           <option value="TV">TV</option>
//           <option value="Random">Random</option>
//         </select>
//         <button type="submit" className="match-button">Go</button>
//       </form>
//       {(username) && (
//         <div className='streak-display'>
//           <div>Current Streak: {user.currentStreak}</div>
//           <div>Record Streak: {user.recordStreak}</div>
//         </div>
//       )}
//       {/* <button onClick={handleGuestEntry} className="guest-entry-button">Enter As Guest</button> */}
//     </div>
//   );
// }

return (
  <div className="home">
      <div className="photo-column left">
      <Link to={`/music`}> <img src="records.jpg" alt="Description1" /></Link>
      <Link to={`/show`}>   <img src="tvShow.jpg" alt="Description2" /></Link>
      <Link to={`/qb`}>   <img src="nflimage.jpg" alt="Description3" /></Link>
      </div>

      <div className="content">
          <h1>Welcome {username || 'Guest'}!</h1>
          <form onSubmit={handleSubmit} className="match-form">
              <div className="match-heading">What Do You Want to Match?</div>
              <select value={selection} onChange={handleDropdownChange} className="match-select">
                  <option value="">Select...</option>
                  <option value="Movies">Movies</option>
                  <option value="QB">NFL</option>
                  <option value="Music">Music</option>
                  <option value="NBA">NBA</option>
                  <option value="STATE">States</option>
                  <option value="TV">Television</option>
                  <option value="Random">Random</option>
              </select>
              <button type="submit" className="match-button">Go</button>
          </form>
          {username && (
              <div className='streak-display'>
                  <div>Current Streak: {user.currentStreak}</div>
                  <div>Record Streak: {user.recordStreak}</div>
              </div>
          )}
      </div>

      <div className="photo-column right">
      <Link to={`/nba`}>   <img src="nbaimage.jpg" alt="Description4" /></Link>
      <Link to={`/cinema`}>     <img src="movies.jpg" alt="Description5" /></Link>
      <Link to={`/state`}>    <img src="statemap.jpg" alt="Description6" /></Link>
      </div>
  </div>
);
}

/**
 * CONTAINER
 */
const mapState = state => {
  return {
    username: state.auth.username,
    userId: state.auth.id,
  }
}

export default connect(mapState)(Home);


