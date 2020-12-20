import React, { Component } from 'react';
import secure from '../image/secure.svg';
import mobile from '../image/mobile.svg';
import '../index.css';

export default class App extends Component{
  constructor(){
    super();
    this.state = {
      username: '',
      password: '',
      cpassword: '',
      class: 'container'
    }
  }

  handleSignup = () => {
    this.setState({class: 'container sign-up-mode'});
  }

  handleSignin = () => {
    this.setState({class: 'container sign-in-mode'});
  }

  render () {
    return (
      <div className={this.state.class}>
        <div className="forms-container">
          <div className="signin-signup">
            <form className="sign-in-form">
              <h2 className="title">Sign in</h2>
              <div className="input-field">
                <i className="fas fa-user"></i>
                <input type="text" placeholder="Username" />
              </div>
              <div className="input-field">
                <i className="fas fa-lock"></i>
                <input type="password" placeholder="Password" />
              </div>
              <input type="submit" value="Login" className="btn solid" />
            </form>
            <form className="sign-up-form">
              <h2 className="title">Sign up</h2>
              <div className="input-field">
                <i className="fas fa-user"></i>
                <input type="text" placeholder="Username" />
              </div>
              <div className="input-field">
                <i className="fas fa-envelope"></i>
                <input type="email" placeholder="Email" />
              </div>
              <div className="input-field">
                <i className="fas fa-lock"></i>
                <input type="password" placeholder="Password" />
              </div>
              <input type="submit" className="btn" value="Sign up" />
            </form>
          </div>
        </div>

        <div className="panels-container">
          <div className="panel left-panel">
            <div className="content">
              <h3>New here ?</h3>
              <p>
                Lorem ipsum, dolor sit amet consectetur adipisicing elit. Debitis,
                ex ratione. Aliquid!
              </p>
              <button className="btn transparent" id="sign-up-btn" onClick={this.handleSignup}>
                Sign up
              </button>
            </div>
            <img src={mobile} className="image" alt="" />
          </div>
          <div className="panel right-panel">
            <div className="content">
              <h3>One of us ?</h3>
              <p>
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Nostrum
                laboriosam ad deleniti.
              </p>
              <button className="btn transparent" id="sign-in-btn" onClick={this.handleSignin}>
                Sign in
              </button>
            </div>
            <img src={secure} className="image" alt="" />
          </div>
        </div>
      </div>
    );
  }
}
