import React from 'react'
import {connect} from 'react-redux'
import {Link} from 'react-router-dom'
import {logout} from '../store'

const Navbar = ({handleClick, isLoggedIn}) => (
  <div>
    <nav>
        <div style={{textAlign: "center"}}>
        <Link to="/home" className="navbar-link">Home</Link>
        <Link to="/leaderboard" className="navbar-link">Leaderboard</Link>
        <Link to="/edit" className="navbar-link">Edit</Link>
          <a href="#" onClick={handleClick} className="navbar-link">
            Logout
          </a>
        </div>
    </nav>
    <hr />
  </div>
)

/**
 * CONTAINER
 */
const mapState = state => {
  return {
    isLoggedIn: !!state.auth.id
  }
}

const mapDispatch = dispatch => {
  return {
    handleClick() {
      dispatch(logout())
    }
  }
}

export default connect(mapState, mapDispatch)(Navbar)
