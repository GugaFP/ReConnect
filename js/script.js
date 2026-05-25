
const officialProducts = [
  {
    id: 1,
    name: "Camiseta Minimal",
    category: "roupas",
    price: 59.90,
    oldPrice: 119.90,
    image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=1200&auto=format&fit=crop",
    origin: "Estoque excedente",
    condition: "Nova"
  },
  {
    id: 2,
    name: "Jaqueta Oversized",
    category: "roupas",
    price: 129.90,
    oldPrice: 259.90,
    image: "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?q=80&w=1200&auto=format&fit=crop",
    origin: "Coleção anterior",
    condition: "Nova"
  },
  {
    id: 3,
    name: "Moletom Streetwear",
    category: "roupas",
    price: 99.90,
    oldPrice: 199.90,
    image: "https://images.unsplash.com/photo-1523398002811-999ca8dec234?q=80&w=1200&auto=format&fit=crop",
    origin: "Outlet circular",
    condition: "Novo"
  },
  {
    id: 4,
    name: "Bolsa Tiracolo Couro Sintético",
    category: "acessorios",
    price: 79.96,
    oldPrice: 199.90,
    image: "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?q=80&w=1200&auto=format&fit=crop",
    origin: "Estoque parado",
    condition: "Nova"
  },
  {
    id: 5,
    name: "Relógio Minimalista Metálico",
    category: "acessorios",
    price: 229.95,
    oldPrice: 459.90,
    image: "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?q=80&w=1200&auto=format&fit=crop",
    origin: "Coleção especial",
    condition: "Novo"
  },
  {
    id: 6,
    name: "Tênis Urban Essential",
    category: "calcados",
    price: 189.90,
    oldPrice: 349.90,
    image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?q=80&w=1200&auto=format&fit=crop",
    origin: "Ponta de estoque",
    condition: "Novo"
  },
  {
    id: 7,
    name: "Óculos Retro Premium",
    category: "acessorios",
    price: 149.90,
    oldPrice: 279.90,
    image: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?q=80&w=1200&auto=format&fit=crop",
    origin: "Estoque excedente",
    condition: "Novo"
  }
];

function money(value){
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function getCompanyProducts(){
  return JSON.parse(localStorage.getItem("companyProducts")) || [];
}

function getAllProducts(){
  return [...officialProducts, ...getCompanyProducts()];
}

function getCart(){
  return JSON.parse(localStorage.getItem("reconnectCart")) || [];
}

function saveCart(cart){
  localStorage.setItem("reconnectCart", JSON.stringify(cart));
  updateCartCount();
}

function updateCartCount(){
  const count = document.getElementById("cartCount");
  if(!count) return;

  const totalItems = getCart().reduce((sum, item) => sum + item.quantity, 0);
  count.textContent = totalItems;
}

function toggleMenu(){
  const nav = document.getElementById("navLinks");
  if(nav) nav.classList.toggle("open");
}

function addToCart(productId){
  const product = getAllProducts().find(item => String(item.id) === String(productId));

  if(!product) return;

  const cart = getCart();
  const existing = cart.find(item => String(item.id) === String(productId));

  if(existing){
    existing.quantity += 1;
  }else{
    cart.push({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity: 1
    });
  }

  saveCart(cart);
  alert(product.name + " foi adicionado ao carrinho!");
}

function renderProducts(){
  const grid = document.getElementById("productGrid");
  if(!grid) return;

  const search = (document.getElementById("searchInput")?.value || "").toLowerCase();
  const category = document.getElementById("categoryFilter")?.value || "todos";
  const sort = document.getElementById("sortFilter")?.value || "padrao";

  let products = getAllProducts().filter(product => {
    const matchSearch = product.name.toLowerCase().includes(search);
    const matchCategory = category === "todos" || product.category === category;
    return matchSearch && matchCategory;
  });

  if(sort === "menor") products.sort((a,b) => a.price - b.price);
  if(sort === "maior") products.sort((a,b) => b.price - a.price);
  if(sort === "desconto") products.sort((a,b) => ((b.oldPrice-b.price)/b.oldPrice) - ((a.oldPrice-a.price)/a.oldPrice));

  grid.innerHTML = products.map(product => {
    const discount = Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100);

    return `
      <article class="product-card reveal">
        <div class="product-image-wrap">
          <img src="${product.image}" alt="${product.name}">
          <span class="product-badge">Circular</span>
        </div>

        <div class="product-info">
          <h3>${product.name}</h3>

          <div class="product-meta">
            <span>${product.origin || "Empresa parceira"}</span>
            <span>${product.condition || "Novo"}</span>
          </div>

          <div class="price-area">
            <span class="current-price">${money(product.price)}</span>
            <span class="old-price">${money(product.oldPrice)}</span>
            <span class="discount">-${discount}%</span>
          </div>

          <button onclick="addToCart('${product.id}')">Adicionar ao Carrinho</button>
        </div>
      </article>
    `;
  }).join("");

  if(products.length === 0){
    grid.innerHTML = `<div class="empty-cart">Nenhum produto encontrado.</div>`;
  }
}

function renderCart(){
  const container = document.getElementById("cartItems");
  if(!container) return;

  const cart = getCart();

  if(cart.length === 0){
    container.innerHTML = `<div class="empty-cart">Seu carrinho está vazio. Volte ao marketplace para adicionar produtos.</div>`;
    document.getElementById("subtotal").textContent = money(0);
    document.getElementById("cartTotal").textContent = money(0);
    return;
  }

  let total = 0;

  container.innerHTML = cart.map(item => {
    total += item.price * item.quantity;

    return `
      <div class="cart-item">
        <img src="${item.image}" alt="${item.name}">

        <div>
          <h3>${item.name}</h3>
          <p>${money(item.price)} cada</p>
        </div>

        <div class="cart-actions">
          <button class="qty-btn" onclick="changeQuantity('${item.id}', -1)">-</button>
          <strong>${item.quantity}</strong>
          <button class="qty-btn" onclick="changeQuantity('${item.id}', 1)">+</button>
          <button class="remove-btn" onclick="removeFromCart('${item.id}')">Remover</button>
        </div>
      </div>
    `;
  }).join("");

  document.getElementById("subtotal").textContent = money(total);
  document.getElementById("cartTotal").textContent = money(total);
}

function changeQuantity(id, amount){
  const cart = getCart();
  const item = cart.find(product => String(product.id) === String(id));

  if(!item) return;

  item.quantity += amount;

  const updatedCart = cart.filter(product => product.quantity > 0);
  saveCart(updatedCart);
  renderCart();
}

function removeFromCart(id){
  const cart = getCart().filter(product => String(product.id) !== String(id));
  saveCart(cart);
  renderCart();
}

function clearCart(){
  localStorage.removeItem("reconnectCart");
  updateCartCount();
  renderCart();
}

function setupCompanyForm(){
  const form = document.getElementById("companyForm");
  if(!form) return;

  form.addEventListener("submit", function(event){
    event.preventDefault();

    const name = document.getElementById("newProductName").value;
    const category = document.getElementById("newProductCategory").value;
    const price = Number(document.getElementById("newProductPrice").value);
    const oldPrice = Number(document.getElementById("newProductOldPrice").value);
    const image = document.getElementById("newProductImage").value || "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?q=80&w=1200&auto=format&fit=crop";

    const companyProducts = getCompanyProducts();

    companyProducts.push({
      id: "empresa-" + Date.now(),
      name,
      category,
      price,
      oldPrice,
      image,
      origin: "Empresa parceira",
      condition: "Novo"
    });

    localStorage.setItem("companyProducts", JSON.stringify(companyProducts));

    alert("Produto cadastrado com sucesso! Ele já aparecerá no Marketplace.");
    form.reset();
  });
}

function setupCheckout(){
  const form = document.getElementById("checkoutForm");
  if(!form) return;

  form.addEventListener("submit", function(event){
    event.preventDefault();
    localStorage.removeItem("reconnectCart");
    updateCartCount();
    alert("Pedido confirmado com sucesso! Esta é uma simulação de compra.");
    window.location.href = "marketplace.html";
  });
}

function setupOngForm(){
  const form = document.getElementById("ongForm");
  if(!form) return;

  form.addEventListener("submit", function(event){
    event.preventDefault();
    alert("Cadastro da ONG enviado com sucesso!");
    form.reset();
  });
}

document.addEventListener("DOMContentLoaded", function(){
  updateCartCount();
  renderProducts();
  renderCart();
  setupCompanyForm();
  setupCheckout();
  setupOngForm();
});
