import Masonry from 'masonry-layout';

const grid = document.querySelector('.project-block-container');

const msnry = new Masonry(grid, {
  // options
  itemSelector: '.project-block',
  percentPosition: true,
  gutter: 5,
});
