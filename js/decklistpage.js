// This file is above the deck_list.js page in the hierarchy of the site. The only job of this function is to render the DeckList component
// and serve as a more structured path for Webpack to use.

import DeckList from "./deck_list.js";
import React from "react";
import ReactDOM from "react-dom";

ReactDOM.render(
  <DeckList />,
  document.getElementById("deck_list_container")
); 