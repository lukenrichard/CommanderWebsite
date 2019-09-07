// This component is used to populate the Login page which allows the User to login to their specific library of cards with the proper credentials.

import React, { Component } from "react";
import "../styles.css";
import "react-table/react-table.css";

export class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      accounts: [],
      imagearray: [],
      items: [],
      suggestions:[],
      text: "",
      user: ""
    };
  }

  // This function takes the User input of username and password and sends it to the server in the form of a POST request.

  loginAccount = () => {

    // Gather username and password from User input.

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

  // This function allows unregistered users to create a new account.

  makeAccount = () => {

    // Gather username, password, and password check from User input.

    const username = String(document.getElementById("makeusername").value);
    const password = String(document.getElementById("makepassword").value);
    const reppassword = String(document.getElementById("reppass").value);

    // If the passwords do not match, give error and do nothing.

    if (password != reppassword){
      console.log("Passwords entered do not match.")
      return;
    }

    // Reload window and send POST request to server with new username and password information.

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

  // This function sends a GET request to the server for the current saved User and then recieves and stores the User in the state.

  getUser = () => {
    return fetch('/user', {
      method: 'GET'
    })
    .then(resp => {
      return resp.json();
    })
    .then(data => {
      data = data.username;
      this.setState({ user: data})
    });
  }

  // This function makes sure that the getUser() function runs every time a page is loaded.

  componentDidMount() {
    this.getUser();
  }

  // This function sends a GET request to the server to logout the current User, it only works if there is a User saved in the state.

  logout = () => {
    if (!this.state.user){
      return;
    }
    return fetch('/logout', {
      method: 'GET',
    })
    .then(res => res.text())
    .then(res => console.log(res))
  }

  // HTML for the component, including smaller HTML components and their corresponding functions listed above. This component contains all information that will
  // populate the page, therefore the layout of the Login page is all below.

  render() {
    
    // If there is a User saved in the state, change the Login/Register button to a Logout button.

    var userButton = "Logout";
    if (!this.state.user){
      userButton = "Login/Register"
    }

    return (
      <div>
        <ul className='nav'>
          <li className = 'nav'><a href="/">Home</a></li>
          <li className = 'nav'><a href="/cardsearch">Card Search</a></li>
          <li className = 'nav'><a href="/decklist">Decklist</a></li>
          <li className = 'nav'><a href="/commander">Commander</a></li>
          <li className = 'login'><a class="active" href="/loginpage" onClick={() => this.logout()}>{userButton}</a></li>
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