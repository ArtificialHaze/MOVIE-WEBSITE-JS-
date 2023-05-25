"use strict";

const fetchDataFromServer = (url, callback, optionalParam) => {
  fetch(url)
    .then((res) => res.json())
    .then((data) => callback(data, optionalParam));
};

export const search = () => {
  const searchWrapper = document.querySelector("[search-wrapper]");
  const searchField = document.querySelector("[search-field]");

  const searchResultsModal = document.createElement("div");
  searchResultsModal.classList.add("search-modal");

  document.querySelector("main").appendChild(searchResultsModal);

  let searchTimeOut;

  searchField.addEventListener("input", function () {
    if (!searchField.value.trim()) {
      searchResultsModal.classList.remove("active");
      searchWrapper.classList.remove("searching");
      clearTimeout(searchTimeOut);
      return;
    }

    searchWrapper.classList.add("searching");
    clearTimeout(searchTimeOut);

    searchTimeOut = setTimeout(() => {
      fetchDataFromServer(
        `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&query=${searchField.value}&page=1&include_adult=false`,
        function ({ results: movieList }) {
          searchWrapper.classList.remove("searching");
          searchResultsModal.classList.add("active");
          searchResultsModal.innerHTML = "";

          searchResultsModal.innerHTML = `
            <p class="label">Results for</p>
            <h1 class="heading">${searchField.value}</h1>
            <div class="movie-list">
              <div class="grid-list"></div>
            </div>
          `;
          for (const movie of movieList) {
            const movieCard = createMovieCard(movie);
            searchResultsModal
              .querySelector(".grid-list")
              .appendChild(movieCard);
          }
        }
      );
    }, 500);
  });
};
