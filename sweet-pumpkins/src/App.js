
// App.js

import React from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom"
import Header from "./header/Header";
import Main from "./main/Main";
// import MainHooks from "./main/MainHooks";
import MovieHooks from "./movie/MovieHooks"
import NotFound from "./NotFound";

// appears that route works but returns not found and never loads Movie compoenet
const App = () => {
  return (
    <BrowserRouter>
      <div>
        <Header />
        <Switch>
          <Route path='/' exact         component={Main}  />
          <Route path='/movie/:movieId' component={MovieHooks} />
          <Route                        component={NotFound} />
        </Switch>
      </div>
    </BrowserRouter>
  );
};

export default App;
