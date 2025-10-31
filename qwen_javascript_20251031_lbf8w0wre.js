// Datos de productos
const products = [
  {
    id: 1,
    name: "Laptop Gamer X1",
    desc: "Portátil de alto rendimiento con procesador Intel Core i7, 16GB RAM, tarjeta gráfica RTX 4060, SSD de 1TB y pantalla de 144Hz.",
    price: 1200,
    rating: 4.5,
    img: "https://via.placeholder.com/400x200?text=Laptop+Gamer"
  },
  {
    id: 2,
    name: "PC Escritorio Pro",
    desc: "Computadora de escritorio potente con AMD Ryzen 7, 32GB RAM, SSD de 2TB, GPU GTX 1660 y gabinete RGB.",
    price: 950,
    rating: 4.7,
    img: "https://via.placeholder.com/400x200?text=PC+Escritorio"
  },
  {
    id: 3,
    name: "Monitor 27\" 4K",
    desc: "Monitor ultra nítido con resolución 4K, tasa de refresco de 144Hz, soporte HDR y panel IPS para colores precisos.",
    price: 350,
    rating: 4.8,
    img: "https://via.placeholder.com/400x200?text=Monitor+4K"
  },
  {
    id: 4,
    name: "Teclado Mecánico RGB",
    desc: "Teclado mecánico con switches azules, retroiluminación RGB personalizable y diseño ergonómico para gaming.",
    price: 80,
    rating: 4.3,
    img: "https://via.placeholder.com/400x200?text=Teclado+RGB"
  }
];

let cart = [];
let currentProduct = null;

// Renderizar productos
function renderProducts() {
  const container = document.getElementById('product-list');
  container.innerHTML = '';
  products.forEach(p => {
    const stars = renderStars(p.rating);
    const card = document.createElement('div');
    card.className = 'product-card';
    card.innerHTML = `
      <img src="${p.img}" alt="${p.name}">
      <h3>${p.name}</h3>
      <p class="price">$${p.price.toLocaleString()}</p>
      <div class="rating">${stars}</div>
    `;
    card.onclick = () => openProductModal(p);
    container.appendChild(card);
  });
}

// Mostrar estrellas
function renderStars(rating) {
  const fullStars = Math.floor(rating);
  const hasHalf = rating % 1 >= 0.5;
  let stars = '★'.repeat(fullStars);
  if (hasHalf) stars += '½';
  stars += '☆'.repeat(5 - fullStars - (hasHalf ? 1 : 0));
  return stars;
}

// Abrir modal de producto
function openProductModal(product) {
  currentProduct = product;
  document.getElementById('modal-img').src = product.img;
  document.getElementById('modal-title').textContent = product.name;
  document.getElementById('modal-desc').textContent = product.desc;
  document.getElementById('modal-rating').innerHTML = `<div class="rating">${renderStars(product.rating)}</div>`;
  document.getElementById('modal-price').textContent = `$${product.price}`;
  document.getElementById('product-modal').classList.remove('hidden');
}

function closeModal() {
  document.getElementById('product-modal').classList.add('hidden');
}

function modalAddToCart() {
  addToCart(currentProduct.id, currentProduct.name, currentProduct.price);
  closeModal();
}

// Carrito
function addToCart(id, name, price) {
  const existing = cart.find(item => item.id === id);
  if (existing) {
    existing.quantity++;
  } else {
    cart.push({ id, name, price, quantity: 1 });
  }
  updateCartUI();
}

function updateCartUI() {
  const count = cart.reduce((sum, item) => sum + item.quantity, 0);
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  document.getElementById('cart-count').textContent = count;
  document.getElementById('total').textContent = total.toFixed(2);

  const itemsDiv = document.getElementById('cart-items');
  itemsDiv.innerHTML = cart.length === 0 ? '<p>Carrito vacío</p>' :
    cart.map(item => `
      <div class="cart-item">
        <div><strong>${item.name}</strong> x${item.quantity}</div>
        <div>$${(item.price * item.quantity).toFixed(2)}</div>
      </div>
    `).join('');
}

function toggleCart() {
  document.getElementById('cart').classList.toggle('hidden');
}

// Pago
function showPaymentForm() {
  if (cart.length === 0) {
    alert("El carrito está vacío.");
    return;
  }
  document.getElementById('payment-modal').classList.remove('hidden');
}

function closePaymentForm() {
  document.getElementById('payment-modal').classList.add('hidden');
}

document.getElementById('payment-form').addEventListener('submit', function(e) {
  e.preventDefault();
  
  const cardNumber = document.getElementById('card-number').value.replace(/\s/g, '');
  if (cardNumber.length !== 16 || isNaN(cardNumber)) {
    alert("Número de tarjeta inválido.");
    return;
  }

  alert("✅ ¡Pago procesado con éxito! Gracias por tu compra.");
  cart = [];
  updateCartUI();
  closePaymentForm();
  toggleCart();
});

// Formato automático para número de tarjeta
document.getElementById('card-number').addEventListener('input', function(e) {
  let value = e.target.value.replace(/\D/g, '');
  let formatted = '';
  for (let i = 0; i < value.length; i++) {
    if (i > 0 && i % 4 === 0) formatted += ' ';
    formatted += value[i];
  }
  e.target.value = formatted.substring(0, 19);
});

// Iniciar
renderProducts();
updateCartUI();
