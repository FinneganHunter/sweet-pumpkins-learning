// Movie.js

import React, { useState, useEffect} from "react";
import LoadingMovie from "./LoadingMovie";
import './Movie.css'

const MovieHooks = props => {

  // initial state hooks and variables
  const [movie, setMovie] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const movieIdRaw = useState(props.match.params);
  const {movieId} = movieIdRaw[0];
  console.log(movieId);
  const  movieUrl = `https://api.themoviedb.org/3/movie/${movieId}?api_key=${process.env.REACT_APP_TMDB_API_KEY}&language=en-US`;

  // useEffect hook = componentDidMount
  // really good template for useEffect
  useEffect(() => {
    setIsLoading(true);

    async function fetchData() {
      

      const response = await fetch(movieUrl);
      const data = await response.json();
      setMovie(data)

      setIsLoading(false);
    }

    fetchData();
  }, [movieUrl]);

  const {
    title,
    backdrop_path,
    release_date,
    genres,
    overview,
    vote_average,
    vote_count,
    runtime, 
    budget,
    revenue,
    tagline
  } = movie;

  const releaseYear = release_date ? release_date.substring(0, 4) : null;
  const imgUrl = `http://image.tmdb.org/t/p/w1280/${backdrop_path}`;
  const backgroundStyle = { backgroundImage: `url(${imgUrl})` };

  return (
    <div>
      {isLoading
        ? <LoadingMovie />
        : <div className="movie-page">
            <div className="movie-backdrop" style={backgroundStyle} />
            <div className="movie-details">
              <h1>
                {title}
                <span>({releaseYear})</span>
              </h1>
              <p>"{tagline}"</p>
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
                <span>{vote_average} / 10</span>
                Votes:
                <span>{vote_count}</span>
                
              </h5>
              <h5>
                Runtime:
                <span>{`${runtime} min`}</span>
              </h5>
              <h5>
                Budget:
                <span>{`$ ${budget.toLocaleString()} `}</span>
                
                With Marketing:
                <span>{`$ ${(2*budget).toLocaleString()} `}</span>
              </h5>
              <h5>
                Revenue:
                <span>{`$ ${revenue.toLocaleString()} `}</span>
              </h5>
              <h4>Overview</h4>
              <p>{overview}</p>
            </div>
          </div>
      }
    </div>
  );
}

export default MovieHooks;