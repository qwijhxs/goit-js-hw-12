import { getImagesByQuery } from './js/pixabay-api.js';
import {
  createGallery,
  clearGallery,
  showLoader,
  hideLoader,
  showLoadMoreButton,
  hideLoadMoreButton,
} from './js/render-functions.js';
import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

const form = document.querySelector('.search-form');
const loadMoreBtn = document.querySelector('.load-more');

let currentQuery = '';
let currentPage = 1;
let totalHits = 0;

form.addEventListener('submit', async e => {
  e.preventDefault();
  const query = e.target.elements.searchQuery.value.trim();
  if (!query) return;
  currentQuery = query;
  currentPage = 1;
  clearGallery();
  hideLoadMoreButton();
  await fetchAndRenderImages();
});

loadMoreBtn.addEventListener('click', async () => {
  currentPage += 1;
  await fetchAndRenderImages(true);
});

async function fetchAndRenderImages(isLoadMore = false) {
  try {
    showLoader();
    const data = await getImagesByQuery(currentQuery, currentPage);
    totalHits = data.totalHits;
    if (data.hits.length === 0 && currentPage === 1) {
      iziToast.info({ message: 'Sorry, there are no images matching your search query.' });
      hideLoadMoreButton();
      hideLoader();
      return;
    }
    createGallery(data.hits);

    const totalPages = Math.ceil(totalHits / 15);
    if (currentPage < totalPages) {
      showLoadMoreButton();
    } else {
      hideLoadMoreButton();
      iziToast.info({ message: "We're sorry, but you've reached the end of search results." });
    }

    if (isLoadMore) {
      const { height: cardHeight } = document
        .querySelector('.gallery__item')
        .getBoundingClientRect();
      window.scrollBy({
        top: cardHeight * 2,
        behavior: 'smooth',
      });
    }
  } catch (error) {
    iziToast.error({ message: 'Something went wrong. Please try again.' });
  } finally {
    hideLoader();
  }
}