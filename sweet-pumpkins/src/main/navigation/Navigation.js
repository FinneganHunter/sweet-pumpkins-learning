// Navigation.js

import React from "react";
import "./Navigation.css";
import Selection from "./Selection";
import Slider from "./Slider";
import Button from "./Button";

class Navigation extends React.Component {


  componentDidMount() {
    console.log(this.props.moviesUrl);
    fetch(this.props.url)
      .then(response => response.json())
      .then(data => this.props.setGenres( data.genres ))
      .catch(error => console.log(error));
  }


  render() {
    const { genre, genres, onGenreChange, onChange, Year, Rating, Runtime, onSearchButtonClick } = this.props;
    return (
      <section className="navigation">

        <Selection
          genre={genre}
          genres={genres}
          onGenreChange={onGenreChange}
        />

        <Slider data={Year} onChange={onChange} />
        <Slider data={Rating} onChange={onChange} />
        <Slider data={Runtime} onChange={onChange} />

        <Button onClick={onSearchButtonClick}>Search</Button>
        
      </section>
    )
  }
}

export default Navigation;