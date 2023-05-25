const API_KEY = "1e75c12f1c75e81c6b5240110c19a050";
const imageBaseUrl = "https://image.tmdb.org/t/p/";
import { search } from "./search";

const fetchDataFromServer = (url, callback, optionalParam) => {
  fetch(url)
    .then((res) => res.json())
    .then((data) => callback(data, optionalParam));
};

const sidebarFunction = () => {
  const genreList = {};

  fetchDataFromServer(
    `https://api.themoviedb.org/3/genre/movie/list?api_key=${API_KEY}`,
    ({ genres }) => {
      for (const { id, name } of genres) {
        genreList[id] = name;
      }
      genreLink();
    }
  );
  const sidebarInner = document.createElement("div");
  sidebarInner.classList.add("sidebar-inner");
  sidebarInner.innerHTML = `
      <div class="sidebar-list">
        <p class="title">Genre</p>
      </div>
      <div class="sidebar-list">
        <p class="title">Language</p>
        <a menu-close href="./movie-list.html" class="sidebar-link">English </a>
        <a menu-close href="./movie-list.html" class="sidebar-link">French </a>
        <a menu-close href="./movie-list.html" class="sidebar-link">German </a>
        <a menu-close href="./movie-list.html" class="sidebar-link">Spanish </a>
      </div>
      <div class="sidebar-footer">
        <p class="copyright">
          &copy; 2023, created by <span>DreamDevs</span>. all rights reserved.
        </p>
        <img
          src="./assets/images/tmdb-logo.svg"
          width="130"
          height="17"
          alt="Logo"
        />
      </div>
    `;
  const genreLink = () => {
    for (const { genreId, genreName } of Object.entries(genreList)) {
      const link = document.createElement("a");
      link.classList.add("sidebar-link");
      link.setAttribute("href", "./movie-list.html");
      link.setAttribute("menu-close", "");
      link.setAttribute(
        "onclick",
        `getMovieList("with_genres=${genreId}"), "${genreName}"`
      );
      link.textContent = genreName;
      sidebarInner.querySelectorAll(".sidebar-list")[0].appendChild(link);
    }

    const sidebar = document.querySelector("[sidebar]");
    sidebar.appendChild(sidebarInner);
    toggleSiderbar(sidebar);
  };
};

const createMovieCard = function (movie) {
  const { poster_path, title, vote_average, release_date, id } = movie;
  const card = document.createElement("div");
  card.classList.add("movie-card");
  card.innerHTML = html`
    <figure class="poster-box card-banner">
      <img
        src="${imageBaseUrl}w342${poster_path}"
        alt="${title}"
        loading="lazy"
        class="img-cover"
      />
    </figure>
    <h4 class="title">${title}</h4>
    <div class="meta-list">
      <div class="meta-item">
        <img
          src="./assets/images/star.png"
          width="20"
          height="20"
          loading="lazy"
          alt="Star rating"
        />
        <span class="span">${vote_average.toFixed(1)}</span>
      </div>
      <div class="card-badge">${release_date.split("-")[0]}</div>
    </div>
    <a href="./detail.html" title="${title}" class="card-btn"></a>
  `;

  return card;
};

const pageContent = document.querySelector("[page-content]");

const movieId = window.localStorage.getItem("movieId");

sidebarFunction();

const getGenres = function (genreList) {
  const newGenreList = [];
  for (const { name } of genreList) {
    newGenreList.push(name);
  }

  return newGenreList.join(", ");
};

const getCasts = function (castList) {
  const newCastList = [];
  for (let i = 0, len = castList.length; i < len && i < 10; i++) {
    const { name } = castList[i];
    newCastList.push(name);
  }

  return newCastList.join(", ");
};

const getDirectors = function (crewList) {
  const directors = crewList.filter(({ job }) => job === "Director");
  const directorList = [];
  for (const { name } of directors) directorList.push(name);
  return directorList.join(", ");
};

fetchDataFromServer(
  `https://api.themoviedb.org/3/movie/${movieId}?api_key=${API_KEY}&append_to_response=casts,videos,images,releases`,
  function (movie) {
    const {
      backdrop_path,
      poster_path,
      title,
      release_date,
      runtime,
      vote_average,
      releases: {
        countries: [{ certification }],
      },
      genres,
      overview,
      casts: { cast, crew },
      videos: { results: videos },
    } = movie;

    document.title = `${title} - TVFlix`;
    const movieDetail = document.createElement("div");
    movieDetail.classList.add("movie-detail");

    movieDetail.innerHTML = `
      <div
        class="backdrop-image"
        style="background-image: url('${imageBaseUrl}${"w1280" || "original"}${
      backdrop_path || poster_path
    }')"
      >
        <figure class="poster-box movie-poster">
          <img
            src="${imageBaseUrl}w342${poster_path}"
            alt="${title} poster"
            class="img-cover"
          />
        </figure>
        <div class="detail-box">
          <div class="detail-content">
            <h1 class="heading">${title}</h1>
            <div class="meta-list">
              <div class="meta-item">
                <img
                  src="./assets/images/star.png"
                  alt="Star rating"
                  width="20"
                  height="20"
                />
                <span class="span">${vote_average.toFixed(1)}</span>
              </div>
              <div class="separator"></div>
              <div class="meta-item">${runtime} Minutes</div>
              <div class="separator"></div>
              <div class="meta-item">${release_date.split("-")[0]}</div>
              <div class="meta-item card-badge">${certification}</div>
            </div>
            <p class="genre">${getGenres(genres)}</p>
            <p class="overview">
              ${overview}
            </p>
            <ul class="detail-list">
              <div class="list-item">
                <p class="list-name">Directed by</p>
                <p>${getDirectors(crew)}</p>
              </div>
              <div class="list-item">
                <p class="list-name">Starring</p>
                <p>
                 ${getCasts(cast)}
                </p>
              </div>
            </ul>
          </div>
          <div class="title-wrapper">
            <h3 class="title-large">Trailers and clips</h3>
          </div>
          <div class="slider-list">
            <div class="slider-inner">
            </div>
          </div>
        </div>
      </div>
    `;

    for (const { key, name } of filterVideos(videos)) {
      const videoCard = document.createElement("div");
      videoCard.classList.add("video-card");
      videoCard.innerHTML = `
        <iframe
          width="500"
          height="294"
          src="https://wwww.youtube.com/embed/${key}?&theme=dark&color=white&rel=0"
          frameborder="0"
          allowfullscreen="1"
          title=${name}
          class="img-cover"
          loading="lazy"
        ></iframe>
      `;

      movieDetail.querySelector(".slider-innner").appendChild(videoCard);
    }

    pageContent.appendChild(movieDetail);
    fetchDataFromServer(
      `https://api.themoviedb.org/3/movie/${movieId}/recommendations?api_key=${API_KEY}/&page=1`,
      addSuggestions
    );
  }
);

const addSuggestions = function ({ results: movieList }, title) {
  const movieListElement = document.createElement("section");
  movieListElement.classList.add("movie-list");
  movieListElement.ariaLabel = "You may also like";
  movieListElement.innerHTML = `
      <section class="movie-list" aria-label="upcoming movie">
        <div class="title-wrapper">
          <h3 class="title-large">You may also like</h3>
        </div>
        <div class="slider-list">
          <div class="slider-inner"></div>
        </div>
      </section>
    `;

  for (const movie of movieList) {
    const movieCard = createMovieCard(movie);
    movieListElement.querySelector(".slider-inner").appendChild(movieCard);
  }
  pageContent.appendChild(movieListElement);
};

const filterVideos = function (videoList) {
  return videoList.filter(
    ({ type, site }) =>
      (type === "Trailer" || type === "Teaser") && site === "YouTube"
  );
};

search();
