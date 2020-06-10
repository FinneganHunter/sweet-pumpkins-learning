// Main.js
// renders each component

import React from "react";
import "./Main.css"
import Navigation from "./navigation/Navigation";
import Movies from "./movies/Movies";
import '../index.css'

// TODO: adjust the semicolons to be their correct syntax for component
// TODO: adjust lifecycle to be Hooks or (updated components ie. snapshotBeforeUpdate & componentDidUpdate) based
// TODO: find a way to remove all rating entires above a threshold (8.6) and map the new highest to 10 as max, same for lowest (4.5)
class Main extends React.Component {

  // initial state 
  state = {
    movies: [],
    genre: "Action",
    genres: [],
    Year: {
      label: "Year", min: 1975, max: 2020, step: 1, value: { min: 2000, max: 2020 }
    },
    Rating: {
      label: "Rating", min: 0, max: 10, step: 0.5, value: { min: 7, max: 8.5 }
    },
    Runtime: { 
      label: "Runtime", min: 0, max: 300, step: 15, value: { min: 90, max: 160 }
    },
    
    moviesUrl: `https://api.themoviedb.org/3/discover/movie?api_key=${process.env.REACT_APP_TMDB_API_KEY}&language=en-US&sort_by=popularity.desc&include_adult=false&include_video=false&page=1`,
    page: 1,
    total_pages: 1,
    url: `https://api.themoviedb.org/3/genre/movie/list?api_key=${process.env.REACT_APP_TMDB_API_KEY}&language=en-US`

  }

  generateUrl = params => {
    const {genres, Year, Rating, Runtime, page } = params;
    const selectedGenre = genres.find( genre => genre.name === params.genre);
    const genreId = selectedGenre.id;

    var max = Rating.value.max;
    var min = Rating.value.min;
    // if(Rating.value.max >= 8.5)
    //   max = 8.5;
    // if(Rating.value.min <= 4.5)
    //   max = 4.5;
  //   function map_range(value, low1, high1, low2, high2) {
  //     return low2 + (high2 - low2) * (value - low1) / (high1 - low1);
  // }

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

    this.setState({ moviesUrl });
  }

  onSearchButtonClick = () => {
    this.setState({page: 1});
    this.generateUrl(this.state);
  }

  // works
  componentDidMount() {
    const savedState = this.getStateFromLocalStorage();
    if ( !savedState || (savedState && !savedState.movies.length)) {
      this.fetchMovies(this.state.moviesUrl);
    } else {
      this.setState({ ...savedState });
      this.generateUrl(savedState);
    }   
  }

  //
  onGenreChange = event => {
    this.setState({ genre: event.target.value });    
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

  //
  setGenres = genres => {
    this.setState({genres});
  };

  //
  fetchMovies = moviesUrl => {
    fetch(moviesUrl)
      .then(response => response.json())
      .then(data => this.storeMovies(data))
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

    this.setState({ movies, total_pages: data.total_pages });
  };

  // TODO: snapshotBeforeUpdate is an updated lifecycle component, needs adjusted for 
  UNSAFE_componentWillUpdate(nextProps, nextState) {
  // ??? 
  // getSnapshotBeforeUpdate(nextProps, nextState){
  // componentDidUpdate(nextProps, nextState) {
    this.saveStateToLocalStorage();
    if (this.state.moviesUrl !== nextState.moviesUrl) {
      this.fetchMovies(nextState.moviesUrl);
    }
    if (this.state.page !== nextState.page) {
      this.generateUrl(nextState);
    }
  }

  saveStateToLocalStorage = () => {
    localStorage.setItem("sweetpumpkins.params", JSON.stringify(this.state));
  }
  
  getStateFromLocalStorage = () => {
    return JSON.parse(localStorage.getItem("sweetpumpkins.params"));
  }

  //
  onPageIncrease = () => {
    const { page, total_pages } = this.state;
    const nextPage = page + 1;
    if (nextPage <= total_pages) {
      this.setState({ page: nextPage })
    }
  }
  
  //
  onPageDecrease = () => {
    const { page } = this.state;
    const nextPage = page - 1;
    if ( nextPage > 0 ) {
      this.setState({ page: nextPage })
    }
  }

  //
  render() {
    console.log(this.state);
    return (
      <section className="main">
        <Navigation
          onChange={this.onChange}
          onGenreChange={this.onGenreChange}
          setGenres={this.setGenres}
          onSearchButtonClick={this.onSearchButtonClick}
          {...this.state} 
        />
        <Movies
          movies={this.state.movies}
          page={this.state.page}
          onPageIncrease={this.onPageIncrease}
          onPageDecrease={this.onPageDecrease}
        />
      </section>
    )
  }
}

export default Main;
