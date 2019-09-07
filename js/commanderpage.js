// This file is above the commander_button.js page in the hierarchy of the site. The only job of this function is to render the CommanderButton component
// and serve as a more structured path for Webpack to use.

import CommanderButton from "./commander_button.js";
import React from "react";
import ReactDOM from "react-dom";

ReactDOM.render(
    <CommanderButton />,
    document.getElementById("commander_button_container")
  ); 
  
