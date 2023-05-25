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

sidebarFunction();

const currentPage = 1;
let totalPages = 0;

const pageContent = document.querySelector("[page-content]");
const genreName = window.localStorage.getItem("genreName");
const urlParam = window.localStorage.getItem("urlParam");
const fetchUrl = `https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&sort_by=popularity.desc&include_adult=false&page=${currentPage}&${urlParam}`;

fetchDataFromServer(fetchUrl, function ({ results: movieList, total_pages }) {
  totalPages = total_pages;
  document.title = `${genreName} Movies - TVFlix`;
  const movieListElement = document.createElement("section");
  movieListElement.classList.add("movie-list", "genre-list");
  movieListElement.ariaLabel = `${genreName} Movies`;
  movieListElement.innerHTML = `
      <div class="title-wrapper">
        <h1 class="heading">All ${genreName} movies</h1>
      </div>
      <div class="grid-list"></div>
      <button class="btn load-more" load-more>Load more..</button>
    `;
  for (const movie of movieList) {
    const movieCard = createMovieCard(movie);
    movieListElement.querySelector(".grid-list").appendChild(movieCard);
  }
  pageContent.appendChild(movieListElement);

  document.querySelector("[load-more]").addEventListener("click", function () {
    if (currentPage >= totalPages) {
      this.style.display = "none";
      return;
    }
    currentPage++;
    this.classList.add("loading");
    fetchDataFromServer(fetchUrl, ({ results: movieList }) => {
      this.classList.remove("loading");
      for (const movie of movieList) {
        const movieCard = createMovieCard(movie);

        movieListElement.querySelector(".grid-list").appendChild(movieCard);
      }
    });
  });
});

search();
