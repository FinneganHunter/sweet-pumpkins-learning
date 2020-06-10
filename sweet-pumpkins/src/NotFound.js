// NotFound.js

import React from "react";
import { Link } from "react-router-dom";
import "./NotFound.css"

const NotFound = () => (
  <section className="not-found">   
    <div>
      <h1> 404 ERROR </h1>
      <h1> Page Not Found! </h1>
      <h2> <Link to="/"> 🡢 Return to Movie List Here 🡠 </Link> </h2>       
    </div>
  </section>
);

export default NotFound;