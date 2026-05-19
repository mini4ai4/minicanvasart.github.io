const gallery = document.getElementById('gallery');
const filtersEl = document.getElementById('filters');
const searchEl = document.getElementById('search');
const countEl = document.getElementById('count');

let allProducts = [];
let activeBoard = 'all';
let searchQuery = '';

fetch('data.json')
  .then(r => r.json())
  .then(data => {
    allProducts = data;
    buildFilters(data);
    render();
  });

function buildFilters(products) {
  const boards = [...new Set(products.map(p => p.board))].sort();
  boards.forEach(board => {
    const btn = document.createElement('button');
    btn.className = 'filter-btn';
    btn.dataset.board = board;
    btn.textContent = board;
    btn.addEventListener('click', () => setBoard(board));
    filtersEl.appendChild(btn);
  });
}

function setBoard(board) {
  activeBoard = board;
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.board === board);
  });
  render();
}

searchEl.addEventListener('input', () => {
  searchQuery = searchEl.value.toLowerCase().trim();
  render();
});

document.querySelector('.filter-btn[data-board="all"]').addEventListener('click', () => setBoard('all'));

function render() {
  const filtered = allProducts.filter(p => {
    const matchBoard = activeBoard === 'all' || p.board === activeBoard;
    const matchSearch = !searchQuery || p.title.toLowerCase().includes(searchQuery) || p.board.toLowerCase().includes(searchQuery);
    return matchBoard && matchSearch;
  });

  countEl.textContent = `${filtered.length} design${filtered.length !== 1 ? 's' : ''}`;

  if (filtered.length === 0) {
    gallery.innerHTML = '<div class="empty"><span style="font-size:40px">🎨</span><p>No designs found.</p></div>';
    return;
  }

  gallery.innerHTML = filtered.map(p => `
    <div class="card">
      <div class="card-img-wrap">
        <img src="${esc(p.image)}" alt="${esc(p.title)}" loading="lazy">
      </div>
      <div class="card-body">
        <div class="card-board">${esc(p.board)}</div>
        <div class="card-title">${esc(p.title)}</div>
        <a class="card-btn" href="${esc(p.link)}" target="_blank" rel="noopener">
          Buy on Redbubble
        </a>
      </div>
    </div>
  `).join('');
}

function esc(str) {
  return String(str).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}
