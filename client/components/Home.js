import React from 'react'
import {connect} from 'react-redux'
import { Link } from 'react-router-dom';


/**
 * COMPONENT
 */
export const Home = props => {
  const {username} = props

  return (
    <div>
   <nav>
        <ul>
          <li><Link to="/cinema">Cinema</Link></li> {/* Link to /cinema */}
          <li><Link to="/Qb">QB</Link></li>        {/* Link to /Qb */}
        </ul>
      </nav>
    </div>
  )
}

/**
 * CONTAINER
 */
const mapState = state => {
  return {
    username: state.auth.username
  }
}

export default connect(mapState)(Home)
