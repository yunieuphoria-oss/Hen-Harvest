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
    name: ' Darag ',
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
    age: '6+ Months',
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

function loadData() {
  const stored = localStorage.getItem('hen_harvest_products') || localStorage.getItem('cluck_products');
  if (stored) {
    try { products = JSON.parse(stored); } catch(e) { products = SAMPLE_PRODUCTS; }
  } else {
    products = SAMPLE_PRODUCTS;
  }
  saveData();
}

function saveData() {
  localStorage.setItem('hen_harvest_products', JSON.stringify(products));
}

document.addEventListener('DOMContentLoaded', () => {
  loadData();
  renderAdminTable();
  updateStats();

  document.getElementById('productForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const id = document.getElementById('prodId').value;
    
    const newProd = {
      id: id || 'prod-' + Date.now(),
      name: document.getElementById('prodName').value,
      breed: document.getElementById('prodBreed').value,
      age: document.getElementById('prodAge').value,
      price: parseFloat(document.getElementById('prodPrice').value),
      stock: parseInt(document.getElementById('prodStock').value),
      image: document.getElementById('prodImage').value,
      description: document.getElementById('prodDesc').value,
      characteristics: document.getElementById('prodChar').value || 'Standard heritage traits'
    };

    if (id) {
      const idx = products.findIndex(p => p.id === id);
      if (idx !== -1) products[idx] = newProd;
    } else {
      products.unshift(newProd);
    }

    saveData();
    resetForm();
    renderAdminTable();
    updateStats();
  });

  document.getElementById('cancelBtn').addEventListener('click', resetForm);
});

function renderAdminTable() {
  const tbody = document.getElementById('adminTableBody');
  if (!tbody) return;

  tbody.innerHTML = '';
  products.forEach(p => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td><strong>${p.name}</strong></td>
      <td>${p.breed}</td>
      <td>${p.age}</td>
      <td>₱${p.price.toLocaleString()}</td>
      <td>${p.stock}</td>
      <td>
        <button class="btn btn-secondary btn-sm" onclick="editProduct('${p.id}')">Edit</button>
        <button class="btn btn-danger btn-sm" onclick="deleteProduct('${p.id}')">Delete</button>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

function updateStats() {
  document.getElementById('statTotal').textContent = products.length;
  const totalHeadCount = products.reduce((sum, p) => sum + p.stock, 0);
  document.getElementById('statStock').textContent = totalHeadCount;
  
  const lowStock = products.filter(p => p.stock < 5).length;
  document.getElementById('statLow').textContent = lowStock;

  const totalVal = products.reduce((sum, p) => sum + (p.price * p.stock), 0);
  document.getElementById('statValue').textContent = '₱' + totalVal.toLocaleString();
}

function editProduct(id) {
  const p = products.find(item => item.id === id);
  if (!p) return;

  document.getElementById('prodId').value = p.id;
  document.getElementById('prodName').value = p.name;
  document.getElementById('prodBreed').value = p.breed;
  document.getElementById('prodAge').value = p.age;
  document.getElementById('prodPrice').value = p.price;
  document.getElementById('prodStock').value = p.stock;
  document.getElementById('prodImage').value = p.image;
  document.getElementById('prodDesc').value = p.description;
  document.getElementById('prodChar').value = p.characteristics;

  document.getElementById('formTitle').textContent = 'Edit Listing';
  document.getElementById('saveBtn').textContent = 'Update Listing';
  document.getElementById('cancelBtn').classList.remove('hidden');
}

function deleteProduct(id) {
  if (confirm('Are you sure you want to remove this poultry listing?')) {
    products = products.filter(p => p.id !== id);
    saveData();
    renderAdminTable();
    updateStats();
  }
}

function resetForm() {
  document.getElementById('prodId').value = '';
  document.getElementById('productForm').reset();
  document.getElementById('formTitle').textContent = 'Add New Bird';
  document.getElementById('saveBtn').textContent = 'Save Listing';
  document.getElementById('cancelBtn').classList.add('hidden');
}