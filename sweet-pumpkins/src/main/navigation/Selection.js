// Selection.js

import React from "react";
import "./Selection.css";

// const MovieListItem = ({ movie={poster_path: "null", release_date: "null", title: "null", vote_average: "null" } }) => {

const Selection = ({ genres, genre, onGenreChange }) => (
  <div className="selection">

    <label>Genre</label>

    <select value={genre} onChange={onGenreChange}>
{/*  TypeError: Cannot read property 'map' of undefined */}       
      {genres.map( genre => (
        <option key={genre.id} value={genre.name}>{genre.name}</option>
      ))}
    </select>
    
  </div>
)

export default Selection;