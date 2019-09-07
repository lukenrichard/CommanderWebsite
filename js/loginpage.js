// This file is above the login.js page in the hierarchy of the site. The only job of this function is to render the Login component
// and serve as a more structured path for Webpack to use.

import Login from "./login.js";
import React from "react";
import ReactDOM from "react-dom";

ReactDOM.render(
  <Login />,
  document.getElementById("login_container")
); 