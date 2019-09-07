// This component is used to populate a ReactTable with the library of cards specific for the logged in User. From this component, they can see the cards that they have
// added to their library, choose to delete cards from their library, and also draw a sample hand from the library of cards.

import React, { Component } from "react";
import ReactTable from "react-table";
import "../styles.css";
import ManaGenerator from "./mana_generator";
import "react-table/react-table.css";

export class DeckList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      array: [],
      imagearray: [],
      items: [],
      suggestions:[],
      text: "",
      user: ""
    };
  }

  // This function sends a GET request to the server to obtain all cards from cards table, then filters those cards to ensure that only the User's specific cards are stored in
  // the state.

  retrieveCards = () => {
    return fetch('/cards', {
      method: 'GET'
    })
    .then(resp => {
      return resp.json();
    })
    .then(data => {
      data = data.filter(data => data.user == this.state.user);
      this.setState({ array: data });
    });
  };

  // This function sends a DELETE request to the server to delete the desired card from the cards table.

  removeCards(name) {
    var cardInput = {
      "name" : name,
    }
    return fetch('/cards', {
      headers: { 'content-type': 'application/json' },
      method: 'DELETE',
      body: JSON.stringify(cardInput)
    })
    .then(res => res.text())
    .then(res => console.log(res))
  }

  // This function takes seven random cards from the entire User specific library of cards to allow the User to test and see if they have the correct balance of card types
  // in their stored library. It displays these cards in the form of their images.

  generateHand = () => {
    var handArray = [];
    var imageArray = [];
    var image;

    // Grab User specific library of cards from the state and sort randomly.

    handArray = this.state.array;
    handArray.sort(() => Math.random() - 0.5);

    // Pop element off of randomly sorted card array and push that image to the state to store. Repeat seven times.

    for (var i=0; i<7; i++){
      if (handArray.length === 0){
        break;
      }
      image = handArray.pop();
      image = image.imageurl;
      imageArray.push(image);
      this.setState({imagearray: imageArray});
    }

    // Repopulate state with all cards in the User's library.

    return fetch('/cards', {
      method: 'GET'
    })
    .then(resp => {
       return resp.json();
    })
    .then(data => {
      data = data.filter(data => data.user == this.state.user);
      this.setState({ array: data });
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

  render() {
  
      // If there is a User saved in the state, change the Login/Register button to a Logout button.

      var userButton = "Logout";
      if (!this.state.user){
        userButton = "Login/Register"
      }

      // Create ReactTable columns with Name, Mana Cost, Card Type, TCG Price, and Delete Card in order to display card information once gathered from the Scryfall API.

      const columns = [
      {
          Header: "Name",
          accessor: "name",
          width: 200,

          // Cell rendering used for the Name column to provide User with a Card Tooltip when hovering their mouse over a card. 

          Cell: row => (
            <div className="tooltip">{row.original.name}
              <span><img className="cardhover" src={row.original.imageurl} /></span>
            </div>
          )
      },
      {
          Header: "Mana Cost",
          accessor: "manacost",
          width: 100,

          // Cell rendering used for the Mana Cost column to change API mana cost syntax to a visual, image themed mana cost.

          Cell: row => (
            <ManaGenerator mana={row.original.manacost}/>
          )
      },
      {
          Header: "Card Type",
          accessor: "creaturetype",
          width: 300
      },
      {
          Header: "TCG Price",
          accessor: "tcgprice",
          width: 100, 

          // Cell rendering used for the TCG Price column to provide Users with a link straight to a popular Trading Card Game website to purchase desired card.

          Cell: row => (
            <a className="tcgprice" href={row.original.purchaseurl}>{row.original.tcgprice}</a>
          ) 
      },
      {
        Header: "Delete Card",
        accessor: "",
        width: 180, 

        // Cell rendering is used to provide Users with a button to delete the selected card from their library of cards.

        Cell: row => (
          <button onClick={() => this.removeCards(row.original.name)}>Remove from Decklist</button>
        ) 
      },
      ] 

    // HTML for the component, including smaller HTML components and their corresponding functions listed above. This component contains all information that will
    // populate the page, therefore the layout of the Deck List page is all below. Also, the ReactTable is populated with the information from the state
    // once it is received for the User to see.

    return (
      <div>
        <ul className='nav'>
          <li className = 'nav'><a href="/">Home</a></li>
          <li className = 'nav'><a href="/cardsearch">Card Search</a></li>
          <li className = 'nav'><a class="active" href="/decklist">Decklist</a></li>
          <li className = 'nav'><a href="/commander">Commander</a></li>
          <li className = 'login'><a href="/loginpage" onClick={() => this.logout()}>{userButton}</a></li>
          <li className = 'login'><p>Current User: {this.state.user}</p></li>
        </ul>
        <div className="search-container">
          <button type="submit" onClick={() => this.retrieveCards()}>Retrieve Deck</button>
        </div>
        <div className="decklist-container">
          <ReactTable data={this.state.array} columns={columns}>
          </ReactTable>
          <div className="samplehand_container">
            <img src={this.state.imagearray[0]} width="150px" height="200px"/>
            <img src={this.state.imagearray[1]} width="150px" height="200px"/>
            <img src={this.state.imagearray[2]} width="150px" height="200px"/>
            <img src={this.state.imagearray[3]} width="150px" height="200px"/>
            <img src={this.state.imagearray[4]} width="150px" height="200px"/>
            <img src={this.state.imagearray[5]} width="150px" height="200px"/>
            <img src={this.state.imagearray[6]} width="150px" height="200px"/>
          </div>
          <button onClick={() => this.generateHand()}>Generate Sample Hand</button>
        </div>
      </div>
    );
  }
}

export default DeckList;