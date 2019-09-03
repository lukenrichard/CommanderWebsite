import React, { Component } from "react";
import ReactTable from "react-table";
import "../styles.css";
import ManaGenerator from "./mana_generator";
import "react-table/react-table.css";

export class DeckList extends Component {
  constructor(props) {
    super(props);
    var user = localStorage.getItem('user');
    this.state = {
      array: [],
      imagearray: [],
      items: [],
      suggestions:[],
      text: "",
      user: user
    };
  }

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

  generateHand = () => {
    var handArray = [];
    var imageArray = [];
    var image;
    handArray = this.state.array;
    handArray.sort(() => Math.random() - 0.5);
    for (var i=0; i<7; i++){
      if (handArray.length === 0){
        break;
      }
      image = handArray.pop();
      image = image.imageurl;
      imageArray.push(image);
      this.setState({imagearray: imageArray});
    }
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

  render() {
   
      this.getUser();
      const columns = [
      {
          Header: "Name",
          accessor: "name",
          width: 200,
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
            Cell: row => (
              <a className="tcgprice" href={row.original.purchaseurl}>{row.original.tcgprice}</a>
            ) 
      },
      {
        Header: "Delete Card",
        accessor: "",
        width: 180, 
          Cell: row => (
            <button onClick={() => this.removeCards(row.original.name)}>Remove from Decklist</button>
          ) 
      },
      ] 
    return (
      <div>
        <ul className='nav'>
          <li className = 'nav'><a href="/">Home</a></li>
          <li className = 'nav'><a href="/cardsearch">Card Search</a></li>
          <li className = 'nav'><a class="active" href="/decklist">Decklist</a></li>
          <li className = 'nav'><a href="/commander">Commander</a></li>
          <li className = 'login'><a href="/loginpage">Login/Register</a></li>
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