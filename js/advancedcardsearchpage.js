// This file is above the ad_card_search.js page in the hierarchy of the site. The only job of this function is to render the AdvancedCardSearch component
// and serve as a more structured path for Webpack to use.

import AdvancedCardSearch from "./ad_card_search.js";
import React from "react";
import ReactDOM from "react-dom";

ReactDOM.render(
  <AdvancedCardSearch />,
  document.getElementById("advanced_search_container")
); 