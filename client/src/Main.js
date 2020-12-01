import React, {Component} from 'react';
import Signin from './components/signin';
import Signup from './components/signup';
import AddProduce from './components/addproduce';
import Home from './components/home';
import Userhome from './components/userhome';
import Homepopup from './components/homepopup.js';
import Test from './components/test';
import {Router,Route,Link,browserHistory, Switch} from 'react-router';

export default class Main extends Component{
  render () {
    return (
      <div>
        <Router history={browserHistory}>
          <Route path="/" component={Signin}></Route>
          <Route path="/signup" component={Signup}></Route>
          <Route path="/home" component={Home}></Route>
          <Route path="/homepop" component={Homepopup}></Route>
          <Route path="/userhome" component={Userhome}></Route>
          <Route path="/addproduce" component={AddProduce}></Route>
          <Route path="/test" component={Test}></Route>
        </Router>
      </div>
    );
  }
}