import React, { Component } from "react";
import "../styles.css";


export class CommanderButton extends Component {
  constructor(props) {
    super(props);
    const user = localStorage.getItem('user');
    this.state = {
      commander: null,
      image: null,
      green: false,
      red: false,
      white: false,
      blue: false,
      black: false,
      user: user
    };
  }

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

  getCommander = () => {
    var searchString = String("");
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
    fetch("https://api.scryfall.com/cards/random?q=is%3Acommander+c%3A" + searchString)
      .then(resp => {
        return resp.json();
      })
      .then(data => {
        var commanderName = String(data.name);
        var imageURL = String(data.image_uris.normal);
        this.setState({ commander: commanderName });
        this.setState({ image: imageURL });
      });
  };

  render() {
    var commander = (this.state.commander);
    if (commander != null) {
      var showStatement = "Congratulations! This link will help you build your deck:"
    }
    commander = String(commander);
    commander = commander.split(" //");
    commander = commander[0].replace(/, /g, "-");
    commander = commander.replace(/ /g, "-");
    var commanderLink = "https://edhrec.com/commanders/" + commander;
    return (
      <body className="commanderbackground">
        <ul className='nav'>
          <li className = 'nav'><a href="/">Home</a></li>
          <li className = 'nav'><a href="/cardsearch">Card Search</a></li>
          <li className = 'nav'><a href="/decklist">Decklist</a></li>
          <li className = 'nav'><a class="active" href="/commander">Commander</a></li>
          <li className = 'login'><a href="/loginpage">Login/Register</a></li>
          <li className = 'login'><p>Current User: {this.state.user}</p></li>
        </ul>
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
