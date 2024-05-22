import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter, Route, Switch, Redirect } from 'react-router-dom';
import { Login, Signup } from './components/AuthForm';
import Home from './components/Home';
import { me } from './store';
import GameBoardMovie from './components/GameBoardMovie';
import GameBoardQb from './components/GameBoardQb';
import GameBoardMusic from './components/GameBoardMusic';
import GameBoardNba from './components/GameBoardNba';
import GameBoardState from './components/GameBoardState';
import GameBoardShows from './components/GameBoardShows';
import Edit from './components/Edit';
import Profile from './components/Profile';
import UserDetails from './components/UserDetails';
import Leaderboard from './components/Leaderboard';
import Password from './components/Password';
import Users from './components/Users';

class Routes extends Component {
  componentDidMount() {
    this.props.loadInitialData();
  }

  render() {
    const { isLoggedIn, isGuest } = this.props;

    return (
      <div>
        {isLoggedIn ? (
          <Switch>
            <Route  path="/home" component={Home} />
            <Route exact path="/users" component={Users} />
            <Route exact path="/edit" component={Edit} />
            <Route exact path="/profile" component={Profile} />
            <Route exact path="/password" component={Password} />
            <Route exact path="/cinema" component={GameBoardMovie} />
            <Route exact path="/qb" component={GameBoardQb} />
            <Route exact path="/music" component={GameBoardMusic} />
            <Route exact path="/nba" component={GameBoardNba} />
            <Route exact path="/state" component={GameBoardState} />
            <Route exact path="/show" component={GameBoardShows} />
            <Route exact path="/leaderboard" component={Leaderboard} />
            <Route exact  path="/users/:userId" component={UserDetails} />
            <Redirect to="/home" />
          </Switch>
        ) : isGuest ? (
          <Switch>
            <Route  path="/home" component={Home} />
            <Route exact path="/cinema" component={GameBoardMovie} />
            <Route exact path="/qb" component={GameBoardQb} />
            <Route exact path="/music" component={GameBoardMusic} />
            <Route exact path="/nba" component={GameBoardNba} />
            <Route exact path="/state" component={GameBoardState} />
            <Route exact path="/show" component={GameBoardShows} />
            {/* Add any guest-allowed routes here */}
            <Redirect to="/home" />
          </Switch>
        ) : (
          <Switch>
            <Route  path="/" exact component={Login} />
            <Route exact path="/login" component={Login} />
            <Route exact path="/signup" component={Signup} />
            <Redirect to="/login" />
          </Switch>
        )}
      </div>
    );
  }
}

const mapState = state => ({
  isLoggedIn: !!state.auth.id,
  isGuest: !!state.auth.isGuest
});

const mapDispatch = dispatch => ({
  loadInitialData() {
    dispatch(me());
  }
});

export default withRouter(connect(mapState, mapDispatch)(Routes));

