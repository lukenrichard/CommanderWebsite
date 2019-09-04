import React, { Component } from "react";
import "../styles.css";
import "react-table/react-table.css";

export class Login extends Component {
  constructor(props) {
    super(props);
    const user = localStorage.getItem('user');
    this.state = {
      accounts: [],
      imagearray: [],
      items: [],
      suggestions:[],
      text: "",
      user: user
    };
  }

  loginAccount = () => {
    const username = String(document.getElementById("username").value);
    const password = String(document.getElementById("password").value);
    var accountInput = {
      username : username,
      password : password
    };
    return fetch('/login', {
      headers: { 'content-type': 'application/json' },
      method: 'POST',
      body: JSON.stringify(accountInput)
    })
  };

  
  makeAccount = () => {
    const username = String(document.getElementById("makeusername").value);
    const password = String(document.getElementById("makepassword").value);
    const reppassword = String(document.getElementById("reppass").value);
    if (password != reppassword){
      console.log("Passwords entered do not match.")
      return;
    }
    window.location.reload();
    var accountInput = {
      username : username,
      password : password
    };
    return fetch('/accounts', {
      headers: { 'content-type': 'application/json' },
      method: 'POST',
      body: JSON.stringify(accountInput)
    });
  } 


  render() {
    return (
      <div>
        <ul className='nav'>
          <li className = 'nav'><a href="/">Home</a></li>
          <li className = 'nav'><a href="/cardsearch">Card Search</a></li>
          <li className = 'nav'><a href="/decklist">Decklist</a></li>
          <li className = 'nav'><a href="/commander">Commander</a></li>
          <li className = 'login'><a class="active" href="/loginpage">Login/Register</a></li>
          <li className = 'login'><p>Current User: {this.state.user}</p></li>
        </ul>
        <div className="login-container">
          <p>Username</p>
          <input type="text" placeholder="Username" id="username"/>
          <p>Password</p>
          <input type="text" placeholder="Password" id="password"/>
          <button type="submit" onClick={() => this.loginAccount()}>Submit</button>
        </div>
        <div className="login-container">
          <p>Don't have an account?</p>
          <p>Make Username</p>
          <input type="text" placeholder="Username" id="makeusername"/>
          <p>Make Password</p>
          <input type="text" placeholder="Password" id="makepassword"/>
          <p>Repeat Password</p>
          <input type="text" placeholder="Repeat Password" id="reppass"/>
          <button type="submit" onClick={() => this.makeAccount()}>Submit</button>
        </div>
      </div>
    );
  }
}

export default Login;