

import React, { useEffect, useState } from 'react';
import { fetchSingleUserDirectly } from './store/singleUserStore'
import { connect } from 'react-redux';
import Navbar from './components/Navbar';
import Routes from './Routes';



const App = ({ isLoggedIn, isGuest, userId, recordStreak, currentStreak}) => {



  return (
    <div className="homepage">
      <div className="title-container">
        <h1 className="title">FourCast</h1>
      </div>
      {(isLoggedIn || isGuest) && <Navbar />}
      <Routes />
    </div>
  );
};


const mapStateToProps = (state) => {

  return {
  isLoggedIn: !!state.auth.id,
  isGuest: state.auth.isGuest,
  userId: state.auth.id,
  recordStreak: state.auth.recordStreak,
  currentStreak: state.auth.currentStreak
};
}

export default connect(mapStateToProps)(App);

