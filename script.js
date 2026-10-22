const SAMPLE_PRODUCTS = [
  {
    id: 'prod-1',
    name: 'Banaba',
    breed: 'Banaba Native',
    age: '6 Months',
    price: 550,
    stock: 12,
    image: 'BANABA.jpg',
    description: 'Authentic Southern Luzon native stock nearing full maturity. Distinct single comb and yellow shanks with high disease resistance.',
    characteristics: 'High-spirited, flight capable, naturally resistant to fowl pox.'
  },
  {
    id: 'prod-2',
    name: 'Darag',
    breed: 'Darag Native',
    age: '5 Months',
    price: 680,
    stock: 15,
    image: 'DARAG.jpg',
    description: 'Point-of-lay Western Visayas native chicken with yellowish-brown plumage and slate-gray legs. Produces high-flavor lean meat.',
    characteristics: 'Economical feeder, early layer, distinct slate-gray shanks.'
  },
  {
    id: 'prod-3',
    name: 'Bolinao',
    breed: 'Bolinao Native',
    age: '4 Months',
    price: 380,
    stock: 18,
    image: 'BOLINAO.jpg',
    description: 'Northern Luzon native chicken with classic barred cuckoo plumage. Excellent for dual-purpose meat and egg production.',
    characteristics: 'Heat tolerant, outstanding free-range forager, low input required.'
  },
  {
    id: 'prod-4',
    name: 'Sulu Joloano Heritage Cock',
    breed: 'Joloano Native',
    age: '6 Months',
    price: 1200,
    stock: 8,
    image: 'JOLOANO SHEKEN.jpg',
    description: 'Thick-set, heavy-framed southern Philippine heritage rooster with rich golden hackles and robust bone structure.',
    characteristics: 'Heavy build, pea comb, strong bone structure, calm demeanor.'
  },
  {
    id: 'prod-5',
    name: 'Palawan Paraoakan Tall Line',
    breed: 'Paraoakan Native',
    age: '5 Months',
    price: 950,
    stock: 15,
    image: 'PARAOKAN SHEKEN.jpg',
    description: 'Tall, lanky native breed originating from Palawan. Known as the largest Philippine native chicken with exceptional height.',
    characteristics: 'Tall upright posture, long legs, highly climate-resilient.'
  }
];

let products = [];
let cart = [];

function initProducts() {
  // Always load latest SAMPLE_PRODUCTS and sync to localStorage
  products = SAMPLE_PRODUCTS;
  localStorage.setItem('hen_harvest_products', JSON.stringify(products));
}

document.addEventListener('DOMContentLoaded', () => {
  initProducts();
  
  // Reset filter dropdown values to default on fresh page load
  const ageSelect = document.getElementById('ageFilter');
  if (ageSelect) ageSelect.value = 'all';
  
  const searchInp = document.getElementById('searchInput');
  if (searchInp) searchInp.value = '';

  renderProducts(products);

  document.getElementById('searchInput')?.addEventListener('input', applyFilters);
  document.getElementById('ageFilter')?.addEventListener('change', applyFilters);
  document.getElementById('sortBy')?.addEventListener('change', applyFilters);
  document.getElementById('resetFiltersBtn')?.addEventListener('click', resetFilters);

  document.querySelectorAll('.cat-filter-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const age = e.target.getAttribute('data-age');
      const ageFilterSelect = document.getElementById('ageFilter');
      if (ageFilterSelect) {
        ageFilterSelect.value = age;
        applyFilters();
        document.getElementById('shop').scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  document.getElementById('closeModalBtn')?.addEventListener('click', closeModal);
  document.getElementById('productModal')?.addEventListener('click', (e) => {
    if (e.target.id === 'productModal') closeModal();
  });

  document.getElementById('openCartBtn')?.addEventListener('click', openCart);
  document.getElementById('closeCartBtn')?.addEventListener('click', closeCart);
  document.getElementById('cartBackdrop')?.addEventListener('click', closeCart);
  document.getElementById('checkoutBtn')?.addEventListener('click', () => {
    if (cart.length === 0) return alert('Your cart is empty.');
    alert('Thank you for your reservation inquiry. Our farm manager will contact you.');
    cart = [];
    updateCartUI();
    closeCart();
  });
});

function renderProducts(items = products) {
  const grid = document.getElementById('productGrid');
  const emptyState = document.getElementById('emptyState');
  if (!grid) return;

  grid.innerHTML = '';

  if (items.length === 0) {
    emptyState?.classList.remove('hidden');
    return;
  } else {
    emptyState?.classList.add('hidden');
  }

  items.forEach(p => {
    const card = document.createElement('div');
    card.className = 'product-card';
    card.innerHTML = `
      <div class="product-img-wrap">
        <span class="badge-age">${p.age}</span>
        <img src="${p.image}" alt="${p.name}">
      </div>
      <div class="product-body">
        <span class="product-breed">${p.breed}</span>
        <h3 class="product-title">${p.name}</h3>
        <p class="product-desc-short">${p.description.substring(0, 85)}...</p>
        <div class="product-footer">
          <span class="product-price">₱${p.price.toLocaleString()}</span>
          <button class="product-action-link" onclick="openProductModal('${p.id}')">View Details &rarr;</button>
        </div>
      </div>
    `;
    grid.appendChild(card);
  });
}

function applyFilters() {
  const query = document.getElementById('searchInput')?.value.toLowerCase().trim() || '';
  const age = document.getElementById('ageFilter')?.value || 'all';
  const sort = document.getElementById('sortBy')?.value || 'featured';

  let filtered = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(query) || p.breed.toLowerCase().includes(query);
    
    // Checks if filter is set to 'all' or matches product age
    const matchesAge = (age === 'all') || (p.age === age);
    
    return matchesSearch && matchesAge;
  });

  if (sort === 'price-asc') {
    filtered.sort((a, b) => a.price - b.price);
  } else if (sort === 'price-desc') {
    filtered.sort((a, b) => b.price - a.price);
  }

  renderProducts(filtered);
}

function resetFilters() {
  const searchInput = document.getElementById('searchInput');
  const ageFilter = document.getElementById('ageFilter');
  const sortBy = document.getElementById('sortBy');

  if (searchInput) searchInput.value = '';
  if (ageFilter) ageFilter.value = 'all';
  if (sortBy) sortBy.value = 'featured';

  renderProducts(products);
}

function openProductModal(id) {
  const p = products.find(prod => prod.id === id);
  if (!p) return;

  const content = document.getElementById('modalContent');
  if (content) {
    content.innerHTML = `
      <div class="modal-product-layout">
        <div>
          <img src="${p.image}" alt="${p.name}" class="modal-product-img">
        </div>
        <div>
          <span class="eyebrow">${p.breed}</span>
          <h2 class="modal-title">${p.name}</h2>
          <div class="modal-price">₱${p.price.toLocaleString()}</div>
          
          <table class="modal-meta-table">
            <tr><td>Age Group</td><td>${p.age}</td></tr>
            <tr><td>Availability</td><td>${p.stock > 0 ? p.stock + ' heads available' : 'Out of Stock'}</td></tr>
            <tr><td>Key Traits</td><td>${p.characteristics}</td></tr>
          </table>
          
          <p style="color: #555; font-size: 0.9rem; margin-bottom: 1.5rem;">${p.description}</p>
          
          <button class="btn btn-primary full-width" onclick="addToCart('${p.id}')" ${p.stock <= 0 ? 'disabled' : ''}>
            ${p.stock > 0 ? 'Reserve This Bird' : 'Currently Unavailable'}
          </button>
        </div>
      </div>
    `;
  }

  document.getElementById('productModal')?.classList.remove('hidden');
}

function closeModal() {
  document.getElementById('productModal')?.classList.add('hidden');
}

function addToCart(id) {
  const p = products.find(prod => prod.id === id);
  if (!p) return;

  const existing = cart.find(item => item.id === id);
  if (existing) {
    if (existing.qty < p.stock) existing.qty++;
    else alert('Maximum available farm stock reached.');
  } else {
    cart.push({ ...p, qty: 1 });
  }

  updateCartUI();
  closeModal();
  openCart();
}

function updateCartUI() {
  const countEl = document.getElementById('cartCount');
  const itemsContainer = document.getElementById('cartItemsContainer');
  const subtotalEl = document.getElementById('cartSubtotal');

  const totalQty = cart.reduce((sum, item) => sum + item.qty, 0);
  if (countEl) countEl.textContent = totalQty;

  if (!itemsContainer) return;

  if (cart.length === 0) {
    itemsContainer.innerHTML = '<p style="color:#888; font-size:0.9rem;">Your cart is empty.</p>';
    if (subtotalEl) subtotalEl.textContent = '₱0.00';
    return;
  }

  itemsContainer.innerHTML = '';
  let subtotal = 0;

  cart.forEach(item => {
    subtotal += item.price * item.qty;
    const div = document.createElement('div');
    div.className = 'cart-item';
    div.innerHTML = `
      <img src="${item.image}" alt="${item.name}" class="cart-item-img">
      <div style="flex-grow:1;">
        <h4 class="cart-item-title">${item.name}</h4>
        <div style="font-size:0.8rem; color:#666;">₱${item.price.toLocaleString()} × ${item.qty}</div>
      </div>
      <button onclick="removeFromCart('${item.id}')" style="background:none; border:none; color:#888; cursor:pointer;">&times;</button>
    `;
    itemsContainer.appendChild(div);
  });

  if (subtotalEl) subtotalEl.textContent = `₱${subtotal.toLocaleString()}`;
}

function removeFromCart(id) {
  cart = cart.filter(item => item.id !== id);
  updateCartUI();
}

function openCart() {
  document.getElementById('cartBackdrop')?.classList.remove('hidden');
  document.getElementById('cartDrawer')?.classList.remove('hidden');
}

function closeCart() {
  document.getElementById('cartBackdrop')?.classList.add('hidden');
  document.getElementById('cartDrawer')?.classList.add('hidden');
}