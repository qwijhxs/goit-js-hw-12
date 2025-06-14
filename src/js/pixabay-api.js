const API_KEY = '50849952-f022a71d57a94af4a04a87620';
const BASE_URL = 'https://pixabay.com/api/';
const PER_PAGE = 15;

export async function getImagesByQuery(query, page) {
  const url = `${BASE_URL}?key=${API_KEY}&q=${encodeURIComponent(query)}&image_type=photo&orientation=horizontal&safesearch=true&page=${page}&per_page=${PER_PAGE}`;
  const response = await fetch(url);
  if (!response.ok) throw new Error('Network response was not ok');
  return await response.json();
}