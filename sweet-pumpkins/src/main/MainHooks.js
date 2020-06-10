// Main.js
// renders each component

import React, { useState, useEffect, useRef } from "react";
import "./Main.css"
import Navigation from "./navigation/Navigation";
import Movies from "./movies/Movies";
import '../index.css'


// TODO: find a way to remove all rating entires above a threshold (8.6) and map the new highest to 10 as max, same for lowest (4.5)
const MainHooks = (props) => {

  // TODO replace state with state hook variables  
  const [movies, setMovies] = useState([]);
  const [genre, setGenre] = useState("Action");
  const [genres, setGenres] = useState([]);
  const Year = useState({
    label: "Year", min: 1975, max: 2020, step: 1, value: { min: 2000, max: 2020 }
  });
  const Rating = useState({
    label: "Rating", min: 0, max: 10, step: 0.5, value: { min: 7, max: 8.5 }
  });
  const Runtime = useState({
    label: "Runtime", min: 0, max: 300, step: 15, value: { min: 90, max: 160 }
  });
  const [moviesUrl, setMoviesUrl] = useState(`https://api.themoviedb.org/3/discover/movie?api_key=${process.env.REACT_APP_TMDB_API_KEY}&language=en-US&sort_by=popularity.desc&include_adult=false&include_video=false&page=1`);
  const [url, setUrl] = useState(`https://api.themoviedb.org/3/genre/movie/list?api_key=${process.env.REACT_APP_TMDB_API_KEY}&language=en-US`);
  const [page, setPage] = useState(1);
  const [total_page, setTotalPage] = useState(1);
   
  
  const generateUrl = params => {
    const {genres, Year, Rating, Runtime, page } = params;
    const selectedGenre = genres.find( genre => genre.name === params.genre);
    const genreId = selectedGenre.id;

    var max = Rating.value.max;
    var min = Rating.value.min;

    // TODO: add button to change sorting catagory
    const moviesUrl = `https://api.themoviedb.org/3/discover/movie?` +
      `api_key=${process.env.REACT_APP_TMDB_API_KEY}&` +
      `language=en-US&sort_by=popularity.desc&` +
      `with_genres=${genreId}&` +
      `primary_release_date.gte=${Year.value.min}-01-01&` +
      `primary_release_date.lte=${Year.value.max}-12-31&` +
      `vote_average.gte=${min}&` +
      `vote_average.lte=${max}&` +
      `with_runtime.gte=${Runtime.value.min}&` +
      `with_runtime.lte=${Runtime.value.max}&` +
      `page=${page}&`;

    setMoviesUrl(moviesUrl);
  }

  onSearchButtonClick = () => {
    setPage(1);
    generateUrl(this.state);
  }

  //
  onGenreChange = event => {
    setGenre(event.target.value);
  };

  //
  onChange = data => {
    this.setState({
      [data.type]: {
        ...this.state[data.type],
        value: data.value
      }
    });
  };

  //TODO this is probably incompatible with hooks, find workaround
  setGenres = genres => {
    setGenres(genres);
  };

  //
  fetchMovies = moviesUrl => {
    fetch(moviesUrl)
      .then(response => response.json())
      .then(data => storeMovies(data))
      .catch(error => console.log(error));
  };

  // save just specific keyed parts of the data object as movie  
  storeMovies = data => {
    const movies = data.results.map(result => {
      const {
        vote_count,
        id,
        genre_ids,
        poster_path,
        title,
        vote_average,
        release_date
      } = result;
      return { vote_count, id, genre_ids, poster_path, title, vote_average, release_date };
    });

    setMovies(movies);
    setTotalPage(data.total_pages);
  };

  //
  onPageIncrease = () => {
    const { page, total_pages } = this.state;
    const nextPage = page + 1;
    if (nextPage <= total_pages) {
      setPage(nextPage);
    }
  }
  
  //
  onPageDecrease = () => {
    const { page } = this.state;
    const nextPage = page - 1;
    if ( nextPage > 0 ) {
      setPage(nextPage);
    }
  }
//------------------------------------------
// update with useRef
  useEffect(() => {
    const savedState = getStateFromLocalStorage();
    if ( !savedState || (savedState && !savedState.movies.length)) {
      fetchMovies(moviesUrl);
    } 
    else {
      setState({ ...savedState });
      generateUrl(savedState);
    }   
  }, [props]); 

  // TODO: snapshotBeforeUpdate is an updated lifecycle component, needs adjusted for 
  useEffect(() => {

    this.saveStateToLocalStorage();
    if (moviesUrl !== prevMoviesUrl) {
      fetchMovies(moviesUrl);
    }
    if (page !== prevPage) {
      generateUrl(page);
    }
  }, [props]); 

  const prevMoviesUrl = useRef();
  const prevPage = useRef();
//------------------------------------------


  saveStateToLocalStorage = () => {
    localStorage.setItem("sweetpumpkins.params", JSON.stringify(this.state));
  }
  
  getStateFromLocalStorage = () => {
    return JSON.parse(localStorage.getItem("sweetpumpkins.params"));
  }

  //
  
  console.log(this.state);
  return (
    <section className="main">
      <Navigation
        onChange={onChange}
        onGenreChange={onGenreChange}
        setGenres={setGenres}
        onSearchButtonClick={onSearchButtonClick}
        {...this.state} 
      />
      <Movies
        movies={this.state.movies}
        page={this.state.page}
        onPageIncrease={this.onPageIncrease}
        onPageDecrease={this.onPageDecrease}
      />
    </section>
  );
}

export default MainHooks;
