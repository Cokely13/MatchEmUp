

import React, { useEffect, useState } from 'react';
import { fetchSingleUserDirectly } from './store/singleUserStore'
import { connect } from 'react-redux';
import Navbar from './components/Navbar';
import Routes from './Routes';



const App = ({ isLoggedIn, isGuest, userId, recordStreak, currentStreak}) => {

  // const [userDetails, setUserDetails] = useState({
  //   currentStreak: 0,
  //   recordStreak: 0
  // });


  // useEffect(() => {
  //   if (isLoggedIn) {
  //     fetchSingleUserDirectly(userId)
  //       .then(data => {
  //         setUserDetails({
  //           currentStreak: data.currentStreak,
  //           recordStreak: data.recordStreak
  //         });
  //       })
  //       .catch(error => console.error('Failed to fetch user details:', error));
  //   }
  // }, [isLoggedIn, userId]);

  return (
    <div className="homepage">
      <div className="title-container">
        <h1 className="title">MatchEmUp</h1>
      </div>
      {(isLoggedIn || isGuest) && <Navbar />}
      {/* {(isLoggedIn) && (
        <div className='streak-display'>
          <div>Current Streak: {currentStreak}</div>
          <div>Record Streak: {recordStreak}</div>
        </div>
      )} */}
      <Routes />
    </div>
  );
};


const mapStateToProps = (state) => {

  // console.log("CHECK", state)
  return {
  isLoggedIn: !!state.auth.id,
  isGuest: state.auth.isGuest,
  userId: state.auth.id,
  recordStreak: state.auth.recordStreak,
  currentStreak: state.auth.currentStreak
};
}

export default connect(mapStateToProps)(App);

