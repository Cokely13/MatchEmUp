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

import Navbar from './components/Navbar';
import Leaderboard from './components/Leaderboard';

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
            <Route path="/home" component={Home} />
            <Route path="/edit" component={Edit} />
            <Route path="/cinema" component={GameBoardMovie} />
            <Route path="/qb" component={GameBoardQb} />
            <Route path="/music" component={GameBoardMusic} />
            <Route path="/nba" component={GameBoardNba} />
            <Route path="/state" component={GameBoardState} />
            <Route path="/show" component={GameBoardShows} />
            <Route path="/leaderboard" component={Leaderboard} />
            <Redirect to="/home" />
          </Switch>
        ) : isGuest ? (
          <Switch>
            <Route path="/home" component={Home} />
            <Route path="/cinema" component={GameBoardMovie} />
            <Route path="/qb" component={GameBoardQb} />
            <Route path="/music" component={GameBoardMusic} />
            <Route path="/nba" component={GameBoardNba} />
            <Route path="/state" component={GameBoardState} />
            <Route path="/show" component={GameBoardShows} />
            {/* Add any guest-allowed routes here */}
            <Redirect to="/home" />
          </Switch>
        ) : (
          <Switch>
            <Route path="/" exact component={Login} />
            <Route path="/login" component={Login} />
            <Route path="/signup" component={Signup} />
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

