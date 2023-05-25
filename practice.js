const addEventOnElements = (elements, eventType, callback) => {
  for (const element of elements) element.addEventListener(eventType, callback);
};

const searchBox = document.querySelector("[search-box]");
const searchTogglers = document.querySelectorAll("[search-toggler]");

addEventOnElements(searchTogglers, "click", () => {
  searchBox.classList.toggle("active");
});

const API_KEY = "1e75c12f1c75e81c6b5240110c19a050";
const imageBaseUrl = "https://image.tmdb.org/t/p/";

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
      <a onclick="getMovieListItems("with_original_language=en","English")" menu-close href="./movie-list.html" class="sidebar-link">English </a>
      <a onclick="getMovieListItems("with_original_language=fr","French")" menu-close href="./movie-list.html" class="sidebar-link">French </a>
      <a onclick="getMovieListItems("with_original_language=ge","German")" menu-close href="./movie-list.html" class="sidebar-link">German </a>
      <a onclick="getMovieListItems("with_original_language=sp","Spanish")" menu-close href="./movie-list.html" class="sidebar-link">Spanish </a>
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

const toggleSiderbar = function (sidebar) {
  const sidebarBtn = document.querySelector("[menu-btn]");
  const sidebarTogglers = document.querySelectorAll("[menu-toggler]");
  const sidebarClose = document.querySelectorAll("[menu-close]");
  const overlay = document.querySelector("[overlay]");

  addEventOnElements(sidebarTogglers, "click", function () {
    sidebar.classList.toggle("active");
    sidebarBtn.classList.toggle("active");
    overlay.classList.toggle("active");
  });

  addEventOnElements(sidebarClose, "click", function () {
    sidebar.classList.remove("active");
    sidebarBtn.classList.remove("active");
    overlay.classList.remove("active");
  });
};

const pageContent = document.querySelector("[page-content]");

const genreSecondList = {
  asString(genreIdList) {
    let newGenreList = [];
    for (const genreId of genreIdList) {
      this[genreId] && newGenreList.push(this[genreId]);
    }
    return newGenreList.join(", ");
  },
};

const addHeroSlide = () => {
  const sliderItems = document.querySelectorAll("[slider-item]");
  const sliderControls = document.querySelectorAll("[slider-control]");
  let lastSliderItem = sliderItems[0];
  let lastSliderControl = sliderControls[0];
  lastSliderControl.classList.add("active");
  lastSliderItem.classList.add("active");

  const sliderStart = function () {
    lastSliderItem.classList.remove("active");
    lastSliderControl.classList.remove("active");

    sliderItems[Number(this.getAttribute("slider-control"))].classList.add(
      "active"
    );
    this.classList.add("active");

    lastSliderItem = sliderItems[Number(this.getAttribute("slider-control"))];
    lastSliderControl = this;
  };

  addEventOnElements(sliderControls, "click", sliderStart);
};

const heroBanner = ({ results: movieList }) => {
  const banner = document.createElement("section");
  banner.classList.add("banner");
  banner.ariaLabel = "popular movies";
  banner.innerHTML = `
    <div class="banner-slider"></div>
    <div class="slider-control">
      <div class="control-inner"></div>
    </div>
  `;
  let controlItemIndex = 0;
  for (const [index, movie] of movieList.entries()) {
    const {
      release_date,
      genre_ids,
      overview,
      poster_path,
      vote_average,
      id,
      backdrop_path,
      title,
    } = movie;
    const sliderItem = document.createElement("div");
    sliderItem.classList.add("slider-item");
    sliderItem.setAttribute("slider-item", "");
    sliderItem.innerHTML = `
      <img
        src="${imageBaseUrl}w1280${backdrop_path}"
        alt="${title}"
        class="img-cover"
        loading="${index === 0 ? "eager" : "lazy"}"
      />
      <div class="banner-content">
        <h2 class="heading">${title}</h2>
        <div class="meta-list">
          <div class="meta-item">${release_date.split("-")[0]}</div>
          <div class="meta-item card-badge">${vote_average.toFixed(1)}</div>
        </div>
        <p class="genre">${genreSecondList.asString(genre_ids)}</p>
        <p class="banner-text">
         ${overview}
        </p>
        <a href="./detail.html" onclick="getMovieDetail(${id})" class="btn"
          ><img
            src="./assets/images/play_circle.png"
            width="24"
            height="24"
            alt="Circle"
            aria-hidden="true"
          />
          <span class="span">Watch now</span>
        </a>
      </div>
    `;
    banner.querySelector(".banner-slider").appendChild(sliderItem);
    const controlItem = document.createElement("button");
    controlItem.classList.add("poster-box", "slider-item");
    controlItem.setAttribute("slider-control", `${controlItemIndex}`);
    controlItemIndex++;
    controlItem.innerHTML = `
      <img
        src="${imageBaseUrl}w154${poster_path}"
        alt="Slide to ${title}"
        loading="lazy"
        draggable="false"
        class="img-cover"
      />
    `;
    banner.querySelector(".control-inner").appendChild(controlItem);
  }

  pageContent.appendChild(banner);
  addHeroSlide();

  for (const { title, path } of homePageSections) {
    fetchDataFromServer(
      `https://api.themoviedb.org/3${path}?api_key${API_KEY}&page=1`,
      createMovieList,
      title
    );
  }
};

const createMovieList = function ({ results: movieList }, title) {
  const movieListElement = document.createElement("section");
  movieListElement.classList.add("movie-list");
  movieListElement.ariaLabel = `${title}`;
  movieListElement.innerHTML = `
    <section class="movie-list" aria-label="upcoming movie">
      <div class="title-wrapper">
        <h3 class="title-large">${title}</h3>
      </div>
      <div class="slider-list">
        <div class="slider-inner">
          <div class="movie-card">
            <figure class="poster-box card-banner">
              <img
                src="./assets/images/slider-control.jpg"
                alt="SlideControl"
                class="img-cover"
              />
            </figure>
            <h4 class="title">Puss in boots: The last wish</h4>
            <div class="meta-list">
              <div class="meta-item">
                <img
                  src="./assets/images/star.png"
                  width="20"
                  height="20"
                  loading="lazy"
                  alt="Star rating"
                />
                <span class="span">8.4</span>
              </div>
              <div class="card-badge">2022</div>
            </div>
            <a
              href="./detail.html"
              title="Puss in the boots: The last wish"
              class="card-btn"
            ></a>
          </div>
        </div>
      </div>
    </section>
  `;

  for (const movie of movieList) {
    const movieCard = createMovieCard(movie);
    movieListElement.querySelector(".slider-inner").appendChild(movieCard);
  }
  pageContent.appendChild(movieListElement);
};

const createMovieCard = function (movie) {
  const { poster_path, title, vote_average, release_date, id } = movie;
  const card = document.createElement("div");
  card.classList.add("movie-card");
  card.innerHTML = `
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
    <a
      onclick="getMovieDetail(${id})"
      href="./detail.html"
      title="${title}"
      class="card-btn"
    ></a>
  `;

  return card;
};

fetchDataFromServer(
  `https://api.themoviedb.org/3/genre/movie/list?api_key=${API_KEY}`,
  ({ genres }) => {
    for (const { id, name } of genres) {
      genreSecondList[id] = name;
    }
    fetchDataFromServer(
      `https://api/themoviedb.org/3/movie/popular?api_key=${API_KEY}&page=1`,
      heroBanner
    );
  }
);

const homePageSections = [
  {
    title: "Upcoming movies",
    path: "/movie/upcoming",
  },
  {
    title: "Today's trending movies",
    path: "/trending/movie/week",
  },
  {
    title: "Top rated movies",
    path: "/movie/top_rated",
  },
];

const getMovieDetail = function (movieId) {
  window.localStorage.setItem("movieId", JSON.stringify(movieId));
};

sidebarFunction();

const getMovieListItems = function (urlParam, genreName) {
  window.localStorage.setItem("urlParam", JSON.stringify(urlParam));
  window.localStorage.setItem("genreName", JSON.stringify(genreName));
};
