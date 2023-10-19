// DOM 요소 가져오기
const searchInput = document.getElementById('search-input');
const searchButton = document.getElementById('search-button');
const movieList = document.getElementById('movie-list');

// TMDB API 엔드포인트 및 API 키
const apiEndpoint = 'https://api.themoviedb.org/3/search/movie';
const apiKey = '022f4470077dbf626d377eceeafa2ccb';
const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIwMjJmNDQ3MDA3N2RiZjYyNmQzNzdlY2VlYWZhMmNjYiIsInN1YiI6IjY1MzA5ZThiN2ViNWYyMDBhZWMwNGUwZCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.kKTUishqIajYhK8uExzcVHotagXfiN0AH6vcVxJj-yg'
    }
  };
  
// Corrected URL for top-rated movies
const topRatedMoviesUrl = 'https://api.themoviedb.org/3/movie/top_rated?language=en-US&page=1';

// Call the function to fetch and display top-rated movies when the page loads
fetchAndDisplayMovies(topRatedMoviesUrl);

// Function to fetch and display movies based on a URL
async function fetchAndDisplayMovies(url) {
    try {
      const response = await fetch(url, options);
      if (!response.ok) {
        throw new Error(`API 요청이 실패했습니다. 응답 코드: ${response.status}`);
      }
      const data = await response.json();
      displayMovies(data.results); // Display the top 20 movies
    } catch (error) {
      console.error('영화를 가져오는 중 오류가 발생했습니다:', error);
    }
  }

// 영화 검색 및 데이터 가져오기
searchButton.addEventListener('click', async () => {
    try {
        const searchTerm = searchInput.value;
        const apiUrl = `${apiEndpoint}?api_key=${apiKey}&query=${searchTerm}`;

        const response = await fetch(apiUrl);
        if (!response.ok) {
            throw new Error(`API 요청이 실패했습니다. 응답 코드: ${response.status}`);
        }
        const data = await response.json();
        displayMovies(data.results);
    } catch (error) {
        console.error('영화를 가져오는 중 오류가 발생했습니다:', error);
    }
});

// 이벤트 핸들러에서 발생한 오류를 캐치하여 처리
window.addEventListener('error', (event) => {
    console.error('오류가 발생했습니다:', event.error);
});

//별표(5개 최대) 표시
function displayStars(rating) {
  const starCharacter = '\u2B50'; // Unicode escape sequence for the star emoji (⭐)

  let starsHTML = '';
  for (let i = 0; i < Math.round(rating/2); i++) {
    starsHTML += starCharacter;
  }
  console.log(starsHTML);

  return starsHTML;
}

//카드 클릭 시에는 클릭한 영화 id 를 나타내는 alert 창 표시
function displayMovieId(movieId) {
  alert(`Clicked movie ID: ${movieId}`);
}

// 영화 목록을 화면에 표시
function displayMovies(movies) {
    movieList.innerHTML = '';

    movies.forEach(movie => {
        if (movie.poster_path) {
            const movieCard = document.createElement('div');
            movieCard.classList.add('movie-card');
            movieCard.addEventListener('click', () => {
              console.log('Card clicked');
              displayMovieId(movie.id); // Pass the movie's ID to the function
          });

            const image = document.createElement('img');
            
            image.src = `https://image.tmdb.org/t/p/w500/${movie.poster_path}`;
            image.alt = `${movie.title} poster`;

            const title = document.createElement('h2');
            title.textContent = movie.title;

            const rating = document.createElement('p');
            const stars = displayStars(movie.vote_average); 
            rating.textContent = `평점: ${stars}`;

            const releaseDate = document.createElement('p');
            releaseDate.textContent = `개봉일: ${movie.release_date}`;

            const overview = document.createElement('p');
            overview.textContent = `개요: ${movie.overview}`;

            // Append elements to the movieCard
            movieCard.appendChild(image);
            movieCard.appendChild(title);
            movieCard.appendChild(rating);
            movieCard.appendChild(releaseDate);
            movieCard.appendChild(overview);

            // Append the movieCard to the movieList
            movieList.appendChild(movieCard);
        }
    });
}

