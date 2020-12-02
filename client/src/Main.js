import React, {Component} from 'react';
import Signin from './components/signin';
import Signup from './components/signup';
import AddProduce from './components/addproduce';
import Home from './components/home';
import Userhome from './components/userhome';
import Produce from './components/produce.js';
import Test from './components/test';
import {Router,Route,Link,browserHistory, Switch} from 'react-router';
import AddCustomer from './components/addcustomer';
import Customer from './components/customer';
import UserCustomer from './components/usercus';


export default class Main extends Component{
  render () {
    return (
      <div>
        <Router history={browserHistory}>
          <Route path="/" component={Signin}></Route>
          <Route path="/signup" component={Signup}></Route>
          <Route path="/produce" component={Produce}></Route>
          <Route path="/addproduce" component={AddProduce}></Route>
          <Route path="/customer" component={Customer}></Route>
          <Route path="/addcustomer" component={AddCustomer}></Route>

          <Route path="/home" component={Home}></Route>
          <Route path="/userhome" component={Userhome}></Route>
          <Route path="/test" component={Test}></Route>       
          <Route path="/usercustomer" component={UserCustomer}></Route>
          
        </Router>
      </div>
    );
  }
}