import React, { Component } from "react";
import ReactTable from "react-table";
import "../styles.css";
import ManaGenerator from "./mana_generator";
import "react-table/react-table.css";

export class AdvancedCardSearch extends Component {
  constructor(props) {
    super(props);
    const user = localStorage.getItem('user');
    this.state = {
      array: [],
      items: [],
      suggestions: [],
      text: "",
      user: user,
      green: false,
      red: false,
      white: false,
      blue: false,
      black: false
    };
  }

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
    console.log(cardInput);
    return fetch("/cards", {
      headers: { "content-type": "application/json" },
      method: "POST",
      body: JSON.stringify(cardInput)
    });
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

  getCards = () => {
    var color = "";
    var colorInput = "";
    var input = String(document.getElementById("cardsearch").value);
    var cardText = String(document.getElementById("cardtext").value);
    var cmcText = String(document.getElementById("cmctext").value);
    if (cardText != ""){
        cardText = "+o%3A" + cardText;
    }
    if (cmcText != ""){
        cmcText = "+cmc%3C" + cmcText;
    }
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
    var searchInput = "https://api.scryfall.com/cards/search?order=name&q=" + input + colorInput + cardText + cmcText;
    fetch(searchInput)
      .then(resp => {
        return resp.json();
      })
      .then(data => {
        var cardArray = data.data;
        cardArray.toString();
        this.setState({ array: cardArray });
      });
  };

  onTextChanged = e => {
    const value = e.target.value;
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
    if (value.length > 0) {
      const regex = new RegExp(`^${value}`, "i");
      suggestions = this.state.items.sort().filter(v => regex.test(v));
    }
    this.setState(() => ({ suggestions, text: value }));
  };

  render() {
    const columns = [
      {
        Header: "Name",
        accessor: "name",
        width: 200,
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
        Cell: row => (
          <button onClick={() => this.addCards(row.original)}>
            Add to Deck
          </button>
        )
      }
    ];
    return (
      <div classname = "flex-container">
        <ul className="nav">
          <li className="nav"><a href="/">Home</a></li>
          <li className="nav"><a class="active" href="/cardsearch">Card Search</a></li>
          <li className="nav"><a href="/decklist">Decklist</a></li>
          <li className="nav"><a href="/commander">Commander</a> </li>
          <li className = 'login'><a href="/loginpage">Login/Register</a></li>
          <li className = 'login'><p>Current User: {this.state.user}</p></li>
        </ul>
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
