import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import LoginPage from './pages/LoginPage';
import ProfilePage from './pages/ProfilePage';
import SignupPage from './pages/SignupPage';

import { BrowserRouter, Route, Switch, Redirect, NavLink } from 'react-router-dom';

class App extends Component {

  constructor(props) {
    super(props)
    this.state = {
      user: null
    };
  }

  updateUser = (user) => {
    this.setState({ user: user });
  }

  render() {
    let renderLoginPage = (routerProps) => {
      return <LoginPage {...routerProps} currentUser={this.state.user} updateUser={(user) => this.updateUser(user)} />
    };

    let renderProfilePage = (routerProps) => {
      return <ProfilePage {...routerProps} currentUser={this.state.user} updateUser={(user) => this.updateUser(user)} />
    };

    let renderSignupPage = (routerProps) => {
      return <SignupPage {...routerProps} currentUser={this.state.user} updateUser={(user) => this.updateUser(user)} />
    };

    return (
      <BrowserRouter basename={process.env.PUBLIC_URL + '/'}>
        <div className="App">
          {this.state.user &&
            <Switch>
              <Route exact path='/login' component={renderProfilePage} />
              <Route exact path='/signup' component={renderProfilePage} />
              <Route exact path='/profile' component={renderProfilePage} />
              <Redirect to="/profile" />
            </Switch>
          }
          {
            (!this.state.user) &&

            <Switch>
              <Route exact path='/login' component={renderLoginPage} />
              <Route exact path='/signup' component={renderSignupPage} />
              <Redirect to="/login" />
            </Switch>
          }
        </div>
      </BrowserRouter>
    );
  }
}

export default App;
