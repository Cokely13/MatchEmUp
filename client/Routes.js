import React, {Component, Fragment} from 'react'
import {connect} from 'react-redux'
import {withRouter, Route, Switch, Redirect} from 'react-router-dom'
import { Login, Signup } from './components/AuthForm';
import Home from './components/Home';
import Image from './components/Image';
import {me} from './store'
import GameBoard from './components/GameBoard';
import GameBoardQb from './components/GameBoardQb';
import GameBoardMusic from './components/GameBoardMusic'
import GameBoardNba from './components/GameBoardNba';
import GameBoardState from './components/GameBoardState';
import AuthForm from './components/AuthForm';

/**
 * COMPONENT
 */
class Routes extends Component {
  componentDidMount() {
    this.props.loadInitialData()
  }

  render() {
    const {isLoggedIn} = this.props

    return (
      <div>
         {isLoggedIn ?
          <Switch>
          <Route path="/auth" component={AuthForm} />
            <Route path="/home" component={Home} />
            <Route path="/image" component={Image} />
            <Route path="/cinema" component={GameBoard} />
            <Route path="/qb" component={GameBoardQb} />
            <Route path="/music" component={GameBoardMusic} />
            <Route path="/nba" component={GameBoardNba} />
            <Route path="/state" component={GameBoardState} />
            <Redirect to="/home" />
          </Switch>: (
          <Switch>
            <Route path='/' exact component={ Login } />
            <Route path="/login" component={Login} />
            <Route path="/signup" component={Signup} />
          </Switch>
        )}
      </div>
    )
  }
}

/**
 * CONTAINER
//  */
const mapState = state => {
  return {
    // Being 'logged in' for our purposes will be defined has having a state.auth that has a truthy id.
    // Otherwise, state.auth will be an empty object, and state.auth.id will be falsey
    isLoggedIn: !!state.auth.id
  }
}

const mapDispatch = dispatch => {
  return {
    loadInitialData() {
      dispatch(me())
    }
  }
}

// The `withRouter` wrapper makes sure that updates are not blocked
// when the url changes
export default withRouter(connect(mapState, mapDispatch)(Routes))
