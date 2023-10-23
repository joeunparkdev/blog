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
let data = ''; //to put movie data
const topRatedMoviesUrl = 'https://api.themoviedb.org/3/movie/top_rated?language=en-US&page=1';
fetchAndDisplayMovies(topRatedMoviesUrl);

async function fetchAndDisplayMovies(url) { 
    try {
      const response = await fetch(url, options);
      if (!response.ok) {
        throw new Error(`API 요청이 실패했습니다. 응답 코드: ${response.status}`);
      }
      data = await response.json();// save movie data into data
      displayMovies(data.results); // 최고 20 영화 표시
    } catch (error) {
      console.error('영화를 가져오는 중 오류가 발생했습니다:', error);
    }
  }

// 영화 검색 및 데이터 가져오기
searchButton.addEventListener('click', () => {
  try {
      const searchTerm = searchInput.value; 
      const filteredMovies = data.results.filter(movie => movie.title.toLowerCase().includes(searchTerm));//case insensitive
      console.log(filteredMovies);
      displayMovies(filteredMovies);
  } catch (error) {
      console.error('영화를 가져오는 중 오류가 발생했습니다:', error);
  }
});

// 이벤트 핸들러에서 발생한 오류를 캐치하여 처리
window.addEventListener('error', (event) => {
    console.error('오류가 발생했습니다:', event.error);
});

//별표 (최대 5개) 표시
function displayStars(rating) {
  const starCharacter = '\u2B50'; // 별 이모티콘 유니코드 (⭐)

  const starCount = Math.round(rating / 2);
  const stars = new Array(5).fill(starCharacter).fill(' ', starCount, 5).join('');

  return stars;
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
              displayMovieId(movie.id); 
          });

            const image = document.createElement('img');
            
            image.src = `https://image.tmdb.org/t/p/w500/${movie.poster_path}`;
            image.alt = `${movie.title} poster`;

            const title = document.createElement('h2');
            title.textContent = movie.title;

            const rating = document.createElement('p');
            const stars = displayStars(movie.vote_average); 
            rating.textContent = `평점: ${stars} ${movie.vote_average}`;

            const releaseDate = document.createElement('p');
            releaseDate.textContent = `개봉일: ${movie.release_date}`;

            const overview = document.createElement('p');
            overview.textContent = `개요: ${movie.overview}`;

            movieCard.appendChild(image);
            movieCard.appendChild(title);
            movieCard.appendChild(rating);
            movieCard.appendChild(releaseDate);
            movieCard.appendChild(overview);
            movieList.appendChild(movieCard);
        }
    });
}

