// import React from 'react'

// import Navbar from './components/Navbar'
// import Routes from './Routes'



// const App = () => {
//   return (
//     <div  className="homepage">
//       <div className="title-container">
//         <h1 className="title">MatchEmUp</h1>
//       </div>
//       <Navbar />
//       <Routes />
//     </div>
//   );
// }

// export default App;

import React from 'react';
import { connect } from 'react-redux';
import Navbar from './components/Navbar';
import Routes from './Routes';

const App = ({ isLoggedIn, isGuest }) => {
  return (
    <div className="homepage">
      <div className="title-container">
        <h1 className="title">MatchEmUp</h1>
      </div>
      {(isLoggedIn || isGuest) && <Navbar />}
      <Routes />
    </div>
  );
};

const mapStateToProps = (state) => ({
  isLoggedIn: !!state.auth.id,
  isGuest: state.auth.isGuest
});

export default connect(mapStateToProps)(App);

