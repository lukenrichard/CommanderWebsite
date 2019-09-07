// This file is above the card_search.js page in the hierarchy of the site. The only job of this function is to render the CardSearch component
// and serve as a more structured path for Webpack to use.

import CardSearch from "./card_search.js";
import React from "react";
import ReactDOM from "react-dom";

ReactDOM.render(
  <CardSearch />,
  document.getElementById("card_search_container")
); 