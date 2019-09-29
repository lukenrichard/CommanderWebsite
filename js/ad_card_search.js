// This component is used to populate the Advanced Card Search page which allows the User to search for cards with more parameters and specificity.

import React, { Component } from "react";
import ReactTable from "react-table";
import "../styles.css";
import ManaGenerator from "./mana_generator";
import AddButton from "./add_button";
import "react-table/react-table.css";

export class AdvancedCardSearch extends Component {
  constructor(props) {
    super(props);
    this.addCards = this.addCards.bind(this);
    this.state = {
      array: [],
      items: [],
      suggestions: [],
      text: "",
      user: "",
      green: false,
      red: false,
      white: false,
      blue: false,
      black: false,
      errorBanner: false
    };
  }

  // This function takes all of the card information stored by the ReactTable and puts it into a POST request to send to the server.

  addCards(cardArray) {
    var cardInput = {
      user: this.state.user,
      name: cardArray.name,
      manacost: cardArray.mana_cost,
      creaturetype: cardArray.type_line,
      power: cardArray.power,
      toughness: cardArray.toughness,
      tcgprice: cardArray.prices.usd,
      imageurl: cardArray.image_uris.normal,
      purchaseurl: cardArray.purchase_uris.tcgplayer
    };
    return fetch("/cards", {
      headers: { "content-type": "application/json" },
      method: "POST",
      body: JSON.stringify(cardInput)
    })
    .then(res => {
      return res.status;
    })
    .catch(() => this.setState({errorBanner: true}));
  }

  // These color search functions change the boolean value associated with each color to ensure that the User can only search for cards of their desired color.

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

  // This function puts together the User search query together for the Scryfall API and then gathers and stores that data in the state.

  getCards = () => {
    var color = "";
    var colorInput = "";

    // Gathers all input from the User on the Advanced Card Search Page.

    var input = String(document.getElementById("cardsearch").value);
    var cardText = String(document.getElementById("cardtext").value);
    var cmcText = String(document.getElementById("cmctext").value);

    // If the User did not enter into the cardText search bar, do not include key string in query.

    if (cardText != ""){
        cardText = "+o%3A" + cardText;
    }

    // If the User did not enter into the cmcText search bar, do not include key string in query.

    if (cmcText != ""){
        cmcText = "+cmc%3C" + cmcText;
    }

    // If any of the color boolean variables are tagged, include color specific phrase into search query.

    if (this.state.green){
      var color = color + "g";
    }
    if (this.state.red){
      var color = color + "r";
    }
    if (this.state.white){
      var color = color + "w";
    }
    if (this.state.blue){
      var color = color + "u";
    }
    if (this.state.black){
      var color = color + "b";
    }
    if (color != ""){
      colorInput = "+c%3A" + color;
    } 

    // Put together query, send query to Scryfall for desired cards, then store card information into state.

    var searchInput = "https://api.scryfall.com/cards/search?order=name&q=" + input + colorInput + cardText + cmcText;
    fetch(searchInput)
      .then(resp => {
        return resp.json();
      })
      .then(data => {
        var cardArray = data.data;
        cardArray.toString();
        this.setState({ array: cardArray });
      })
      .catch(() => {this.setState({errorBanner: true})});
  };

  // This function captures the User input when the text changes in any of the search bars on the page. It also helps filter the autocomplete suggestions that 
  // appear when the User enters into the search bar. 

  onTextChanged = e => {
    const value = e.target.value;

    // If the length of the User input is greater than 2, send query to Scryfall API to gather autocomplete suggestions. Once grabbed, store suggestions into state.

    if (value.length > 2) {
      const searchInput =
        "https://api.scryfall.com/cards/autocomplete?q=" + value;
      fetch(searchInput)
        .then(resp => {
          return resp.json();
        })
        .then(data => {
          var sugArray = data.data;
          sugArray.toString();
          this.setState({ items: sugArray });
        });
    }
    let suggestions = [];

    // If the User input is greater than 0, create a Regular Expression that filters the autocomplete suggestions only if they match the User input. Then update state to only
    // include those filtered suggestions.

    if (value.length > 0) {
      const regex = new RegExp(`^${value}`, "i");
      suggestions = this.state.items.sort().filter(v => regex.test(v));
    }
    this.setState(() => ({ suggestions, text: value }));
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

    // Create ReactTable columns with Name, Mana Cost, Card Type, TCG Price, and Add to Deck in order to display card information once gathered from the Scryfall API.

    const columns = [
      {
        Header: "Name",
        accessor: "name",
        width: 200,

        // Cell rendering used for the Name column to provide User with a Card Tooltip when hovering their mouse over a card. 

        Cell: row => (
          <div className="tooltip">
            {row.original.name}
            <span>
              <img className="cardhover" src={row.original.image_uris.normal} />
            </span>
          </div>
        )
      },
      {
        Header: "Mana Cost",
        accessor: "mana_cost",
        width: 100,

        // Cell rendering used for the Mana Cost column to change API mana cost syntax to a visual, image themed mana cost.

        Cell: row => <ManaGenerator mana={row.original.mana_cost} />
      },
      {
        Header: "Card Type",
        accessor: "type_line",
        width: 300
      },
      {
        Header: "TCG Price",
        accessor: "prices.usd",
        width: 100,

        // Cell rendering used for the TCG Price column to provide Users with a link straight to a popular Trading Card Game website to purchase desired card.

        Cell: row => (
          <a className="tcgprice" href={row.original.purchase_uris.tcgplayer}>
            {row.original.prices.usd}
          </a>
        )
      },
      {
        Header: "Add to Deck",
        accessor: "id",
        width: 100,

        // Cell rendering used for the Add to Deck column to provide Users with an option to add desired card in table to their personal library of cards.

        Cell: row => (
          <AddButton info={row.original} addCards={this.addCards}>
          </AddButton>
        )
      }
    ];

    // HTML for the component, including smaller HTML components and their corresponding functions listed above. This component contains all information that will
    // populate the page, therefore the layout of the Advanced Card Search page is all below. Also, the ReactTable is populated with the information from the state
    // once it is received for the User to see.

    return (
      <div classname = "flex-container">
        <ul className="nav">
          <li className="nav"><a href="/">Home</a></li>
          <li className="nav"><a class="active" href="/cardsearch">Card Search</a></li>
          <li className="nav"><a href="/decklist">Decklist</a></li>
          <li className="nav"><a href="/commander">Commander</a> </li>
          <li className = 'login'><a href="/loginpage" onClick={() => this.logout()}>{userButton}</a></li>
          <li className = 'login'><p>Current User: {this.state.user}</p></li>
        </ul>
        {errorBanner}
        <a className = "adsearch" href="/advancedsearch">Advanced Search</a>
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
        <div className="search-container">
          <input type="text" placeholder="Card Name" id="cardsearch"/>
          <input type="text" placeholder="Card Text" id="cardtext"/>
          <input type="text" placeholder="CMC <" id="cmctext"/>
          <button type="submit" onClick={() => this.getCards()}>
            Submit
          </button>
        </div>
        <div className="flex-container">
          <ReactTable data={this.state.array} columns={columns} />
        </div>
      </div>
    );
  }
}

export default AdvancedCardSearch;
