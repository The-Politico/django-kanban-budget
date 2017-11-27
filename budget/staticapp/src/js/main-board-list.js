import Masonry from 'masonry-layout';
import '../scss/home.scss';


const grid = document.querySelector('.boards');

const msnry = new Masonry(grid, {
  // options
  itemSelector: '.board',
  percentPosition: true,
  gutter: 5,
});
