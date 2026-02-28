
const fs = require("fs");
const path = require("path");

const moviesPath = path.join(__dirname, "../data/movies_cleaned.json");
const movies = JSON.parse(fs.readFileSync(moviesPath, "utf-8"));

function normalizePopularity(value, max) {
  return max === 0 ? 0 : value / max;
}

function getWordSet(text) {
  return new Set(
    text
      .toLowerCase()
      .replace(/[^\w\s]/g, "")
      .split(" ")
      .filter(word => word.length > 3)
  );
}

// =================================
// RECOMMENDATIONS
// =================================
function getRecommendations(movieName) {
  if (!movieName) {
    return { error: "Movie name is required" };
  }

  movieName = movieName.trim().toLowerCase();

  const selectedMovie = movies.find(
    (m) => m.title.toLowerCase() === movieName
  );

  if (!selectedMovie) {
    return { error: "Movie not found in dataset" };
  }

  const maxPopularity = Math.max(
    ...movies.map(m => Number(m.popularity) || 0)
  );

  const selectedOverviewWords = getWordSet(selectedMovie.overview);

  const recommendations = movies
    .filter(movie => movie.title !== selectedMovie.title)
    .map(movie => {

      const commonGenres = movie.genres.filter(g =>
        selectedMovie.genres.includes(g)
      );

      if (commonGenres.length === 0) return null;

      const genreScore = commonGenres.length;

      const popularity = Number(movie.popularity) || 0;
      const voteAverage = Number(movie.vote_average) || 0;
      const voteCount = Number(movie.vote_count) || 0;

      const popularityScore = normalizePopularity(popularity, maxPopularity);
      const credibilityScore = Math.log(voteCount + 1);

      const movieOverviewWords = getWordSet(movie.overview);

      let overviewMatchCount = 0;
      movieOverviewWords.forEach(word => {
        if (selectedOverviewWords.has(word)) {
          overviewMatchCount++;
        }
      });

      const overviewScore = overviewMatchCount * 0.5;

      const finalScore =
        (genreScore * 3) +
        (popularityScore * 1.5) +
        (voteAverage * 2) +
        credibilityScore +
        overviewScore;

      return {
        title: movie.title,
        matchedGenres: commonGenres,
        finalScore
      };
    })
    .filter(movie => movie !== null)
    .sort((a, b) => b.finalScore - a.finalScore)
    .slice(0, 5)
    .map(movie => ({
      title: movie.title,
      matchedGenres: movie.matchedGenres,
      confidence: Math.min(
        99,
        Math.round(movie.finalScore * 2)
      )
    }));

  return {
    basedOn: selectedMovie.title,
    genres: selectedMovie.genres,
    results: recommendations
  };
}

// =================================
// TOP RATED
// =================================
function getTopRatedMovies(limit = 10) {
  const scoredMovies = movies.map(movie => {
    const weightedScore =
      movie.vote_average * Math.log(movie.vote_count + 1);

    return {
      title: movie.title,
      genres: movie.genres,
      vote_average: movie.vote_average,
      vote_count: movie.vote_count,
      score: weightedScore
    };
  });

  scoredMovies.sort((a, b) => b.score - a.score);

  return scoredMovies.slice(0, limit).map(movie => ({
    title: movie.title,
    genres: movie.genres,
    rating: movie.vote_average,
    confidence: Math.round(movie.score)
  }));
}

// =================================
// SEARCH
// =================================
function searchMovies(query, limit = 10) {
  const lowerQuery = query.toLowerCase();

  return movies
    .filter(movie =>
      movie.title.toLowerCase().includes(lowerQuery)
    )
    .slice(0, limit)
    .map(movie => ({
      title: movie.title,
      genres: movie.genres,
      rating: movie.vote_average,
      popularity: movie.popularity
    }));
}

// =================================
// GENRE FILTER
// =================================
function getMoviesByGenre(genreName, limit = 10) {
  const lowerGenre = genreName.toLowerCase();

  return movies
    .filter(movie =>
      movie.genres.some(
        genre => genre.toLowerCase() === lowerGenre
      )
    )
    .slice(0, limit)
    .map(movie => ({
      title: movie.title,
      genres: movie.genres,
      rating: movie.vote_average,
      popularity: movie.popularity
    }));
}

// =================================
// EXPORTS
// =================================
module.exports = {
  getRecommendations,
  getTopRatedMovies,
  searchMovies,
  getMoviesByGenre
};