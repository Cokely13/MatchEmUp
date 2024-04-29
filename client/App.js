import React from 'react'

import Navbar from './components/Navbar'
import Routes from './Routes'



const App = () => {
  return (
    <div  className="homepage">
      <div className="title-container">
        <h1 className="title">MatchEmUp</h1>
      </div>
      <Routes />
    </div>
  );
}

export default App;
