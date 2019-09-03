import React, { Component } from "react";
import ReactTable from "react-table";
import "../styles.css";
import ManaGenerator from "./mana_generator";
import "react-table/react-table.css";

export class CardSearch extends Component {
  constructor(props) {
    super(props);
    this.state = {
      array: [],
      items: [],
      suggestions: [],
      text: "",
      user: user
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

  getCards = () => {
    const input = String(document.getElementById("search").value);
    var searchInput = "https://api.scryfall.com/cards/search?order=name&q=" + input;
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

  suggestionSelected(value) {
    this.setState(() => ({
      text: value,
      suggestions: []
    }));
  }

  renderSuggestions() {
    const { suggestions } = this.state;
    if (suggestions.length == 0) {
      return null;
    }
    return (
      <ul>
        {suggestions.map(item => (
          <li onClick={() => this.suggestionSelected(item)}>{item}</li>
        ))}
      </ul>
    );
  }

  render() {
    const { text } = this.state;
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
        <div className="search-container">
          <input
            type="text"
            placeholder="Card Name"
            id="search"
            value={text}
            onChange={this.onTextChanged}
          />
          <button type="submit" onClick={() => this.getCards()}>
            Submit
          </button>
          {this.renderSuggestions()}
        </div>
        <div className="flex-container">
          <ReactTable data={this.state.array} columns={columns} />
        </div>
      </div>
    );
  }
}

export default CardSearch;
