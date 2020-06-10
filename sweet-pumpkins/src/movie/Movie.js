// Movie.js

import React from "react";
import LoadingMovie from "./LoadingMovie";

class Movie extends React.Component {
  state = {
    isLoading: true,
    movie: []
  }  

  UNSAFE_componentWillMount() {    
    
    console.log('componentDidMount - movie')

    const { movieId } = this.props.match.params;
    const movieUrl = `https://api.themoviedb.org/3/movie/${movieId}?api_key=${process.env.REACT_APP_TMDB_API_KEY}&language=en-US`;

    fetch(movieUrl)
      .then(response => response.json())
      .then(data => console.log(data))
      .then(data => this.setState({ movie:data }))        
      .catch(error => console.error('Error:', error));

    
      this.state.movie.length > 0 ? this.setState({isLoading: false}) : this.setState({isLoading: true});

    console.log(`movie ${this.state.movie}`);
    console.log(`movieUrl ${movieUrl}`);
  }

  render() {

    console.log(this.state.movie);

    const {
      title,
      backdrop_path,
      release_date,
      genres,
      overview,
      vote_average,
      runtime
    } = this.state.movie; 
    
    const releaseYear = release_date ? release_date.substring(0, 4) : null;
    const imgUrl = `http://image.tmdb.org/t/p/w1280/${backdrop_path}`;
    const backgroundStyle = {
      backgroundImage: `url(${imgUrl})`
    };

    return (
      <div>
        {this.state.isLoading
          ? <LoadingMovie />
          : <div className="movie-page">
              <div className="movie-backdrop" style={backgroundStyle} />
              <div className="movie-details">
                <h1>
                  {title}
                  <span>({releaseYear})</span>
                </h1>
                <section className="genres">
                  {genres.map((genre, index) => (
                    <div key={genre.id}>
                      <span>{genre.name}</span>
                      {index < genres.length - 1 && (
                        <span className="separator">|</span>
                      )}
                    </div>
                  ))}
                </section>
                <h5>
                  Rating:
                  <span>{vote_average}</span>
                </h5>
                <h5>
                  Runtime:
                  <span>{`${runtime} min`}</span>
                </h5>
                <h4>Overview</h4>
                <p>{overview}</p>
              </div>
            </div>
        }
      </div>
    );
  }
}

export default Movie;