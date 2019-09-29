// This component is used to display random Commander cards for the User at the press of a button. They can then use this random Commander card to build their deck around.

import React, { Component } from "react";
import "../styles.css";

export class CommanderButton extends Component {
  constructor(props) {
    super(props);
    this.state = {
      commander: null,
      image: null,
      green: false,
      red: false,
      white: false,
      blue: false,
      black: false,
      user: "",
      errorBanner: false
    };
  }

  // These color search functions change the boolean value associated with each color to ensure that the User can only populate Commanders of their desired color.

  greenSearch() {
    var greenVal = Boolean(this.state.green);
    greenVal = !(greenVal);
    this.setState({green: greenVal})
  }

  redSearch() {
    var redVal = Boolean(this.state.red);
    redVal = !(redVal);
    this.setState({red: redVal})
  }

  whiteSearch() {
    var whiteVal = Boolean(this.state.white);
    whiteVal = !(whiteVal);
    this.setState({white: whiteVal})
  }

  blueSearch() {
    var blueVal = Boolean(this.state.blue);
    blueVal = !(blueVal);
    this.setState({blue: blueVal})
  }

  blackSearch() {
    var blackVal = Boolean(this.state.black);
    blackVal = !(blackVal);
    this.setState({black: blackVal})
  }

  // This function puts the Commander search query together for the Scryfall API and then gathers and stores the card name and image URL in the state.

  getCommander = () => {
    var searchString = String("");

    // If the User specified any colors, ensure that the User can only see Commander cards of those colors. 

    if (this.state.green){
      var searchString = searchString + "g";
    }
    if (this.state.red){
      var searchString = searchString + "r";
    }
    if (this.state.white){
      var searchString = searchString + "w";
    }
    if (this.state.blue){
      var searchString = searchString + "u";
    }
    if (this.state.black){
      var searchString = searchString + "b";
    }

    // Put together query, send query to Scryfall for desired Commander card, then store card name and image URL into state.

    fetch("https://api.scryfall.com/cards/random?q=is%3Acommander+c%3A" + searchString)
      .then(resp => {
        return resp.json();
      })
      .then(data => {
        var commanderName = String(data.name);
        var imageURL = String(data.image_uris.normal);
        this.setState({ commander: commanderName });
        this.setState({ image: imageURL });
      })
      .catch(() => {this.setState({errorBanner: true})});
  };

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

  render() {

    // If there is a catch error with any promises, display the error banner.

    let errorBanner;
    if (this.state.errorBanner == true){
      errorBanner = <div className = 'errorbanner'>Something Went Wrong! Please reload.</div>;
    }

    // If there is a User saved in the state, change the Login/Register button to a Logout button.

    var userButton = "Logout";
    if (!this.state.user){
      userButton = "Login/Register"
    }
    var commander = (this.state.commander);

    // If a Commander card has been gathered from the Scryfall API, show "Congratulations" message.

    if (commander != null) {
      var showStatement = "Congratulations! This link will help you build your deck:"
    }

    // Change syntax of Commander card name edge cases to be more friendly to EDHrec links.

    commander = String(commander);
    commander = commander.split(" //");
    commander = commander[0].replace(/, /g, "-");
    commander = commander.replace(/ /g, "-");

    // Create link to deck builder website with random Commander Card as focus.

    var commanderLink = "https://edhrec.com/commanders/" + commander;

    // HTML for the component, including smaller HTML components and their corresponding functions listed above. This component contains all information that will
    // populate the page, therefore the layout of the Commander Button page is all below. 

    return (
      <body className="commanderbackground">
        <ul className='nav'>
          <li className = 'nav'><a href="/">Home</a></li>
          <li className = 'nav'><a href="/cardsearch">Card Search</a></li>
          <li className = 'nav'><a href="/decklist">Decklist</a></li>
          <li className = 'nav'><a class="active" href="/commander">Commander</a></li>
          <li className = 'login'><a href="/loginpage" onClick={() => this.logout()}>{userButton}</a></li>
          <li className = 'login'><p>Current User: {this.state.user}</p></li>
        </ul>
        {errorBanner}
        <div className="flex-container">
          <div className = "sortby">
            <input type="checkbox" id="greenbox" onChange={() => this.greenSearch()} />
            <label for="greenbox">Green</label>
            <input type="checkbox" id="redbox" onChange={() => this.redSearch()} />
            <label for="redbox">Red</label>
            <input type="checkbox" id="whitebox" onChange={() => this.whiteSearch()} />
            <label for="whitebox">White</label>
            <input type="checkbox" id="blackbox" onChange={() => this.blackSearch()} />
            <label for="blackbox">Black</label>
            <input type="checkbox" id="bluebox" onChange={() => this.blueSearch()} />
            <label for="bluebox">Blue</label>
          </div>
          <button className="commanderbutton" onClick={() => this.getCommander()}>
            Roll Commander
          </button>
          <img src={this.state.image} className="image" />
          <p className="edhlink">{showStatement}</p>
          <a className="commanderlink" href={commanderLink}>
           {this.state.commander}
         </a>
        </div>
      </body>
    );
  }
}

export default CommanderButton;
