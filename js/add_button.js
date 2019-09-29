import React, { Component } from "react";
import "../styles.css";

// This component serves as the button component for the Add to Deck feature on the Card Search Page.

export class AddButton extends Component {
  constructor(props) {
    super(props);
    this.state = {
      input: "Add to Deck",
      isButtonDisabled: false
    };
  }

  // This function holds all of the functionality of the button when clicked.

  allFunc = () => {

    // Store the value of the addCards() function from card_search.js.

    let status = this.props.addCards(this.props.info);
    status
    .then((result) => {

    // If the status code for the promise is not 200, flag an error and show on button. Also disable the button from being pressed.

    if(result != 200) { 
      this.setState({ isButtonDisabled: true, input: "Error!" });
    }

    // If the status code is 200, show that the card is added on the button and disable button.

    else{
      this.setState({ isButtonDisabled: true, input: "Card Added!" });}});

    // Reset text on button and allow button to be pressed after 3 seconds.

    setTimeout(() => this.setState({ isButtonDisabled: false, input: "Add to Deck" }), 3000);
  }

  render() {
    return (
      <div>
        <button onClick={() => this.allFunc()} disabled={this.state.isButtonDisabled}>
          {this.state.input}
        </button>
      </div>
    );
  }
}

export default AddButton;