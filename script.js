let items = JSON.parse(localStorage.getItem("items")) || [
  { name: "Lollipop", price: 2, desc: "Sweet and colorful!", img: "https://via.placeholder.com/150" },
  { name: "Gummy Bears", price: 3, desc: "Chewy goodness", img: "https://via.placeholder.com/150" }
];
let cart = [];
let orders = JSON.parse(localStorage.getItem("orders")) || [];
let staffMode = false;

// Render Shop
function renderItems() {
  const shopDiv = document.getElementById("items");
  shopDiv.innerHTML = "";
  const search = document.getElementById("searchBox").value.toLowerCase();
  items.filter(i => i.name.toLowerCase().includes(search)).forEach((item, index) => {
    const div = document.createElement("div");
    div.className = "item";
    div.innerHTML = `
      <img src="${item.img}" width="150"><br>
      <b>${item.name}</b><br>
      $${item.price}<br>
      <i>${item.desc}</i><br>
      <button onclick="addToCart(${index})">Add to Cart</button>
      ${staffMode ? `<button onclick="removeItem(${index})">Delete</button>` : ""}
    `;
    shopDiv.appendChild(div);
  });
}

// Render Cart
function renderCart() {
  const cartDiv = document.getElementById("cartItems");
  cartDiv.innerHTML = "";
  cart.forEach((item, i) => {
    const div = document.createElement("div");
    div.className = "cart-item";
    div.innerHTML = `${item.name} - $${item.price} 
      <button onclick="removeFromCart(${i})">Remove</button>`;
    cartDiv.appendChild(div);
  });
}

// Render Orders
function renderOrders() {
  const orderDiv = document.getElementById("orders");
  orderDiv.innerHTML = "";
  orders.forEach((o, i) => {
    const div = document.createElement("div");
    div.className = "order";
    div.innerHTML = `
      <b>Order by ${o.name}</b><br>
      Pickup: ${o.location}<br>
      Items: ${o.items.map(it => it.name).join(", ")}<br>
      <button onclick="deleteOrder(${i})">Delete Order</button>
    `;
    orderDiv.appendChild(div);
  });
}

// Cart functions
function addToCart(i) {
  cart.push(items[i]);
  renderCart();
}
function removeFromCart(i) {
  cart.splice(i, 1);
  renderCart();
}

// Staff
document.getElementById("staffLoginBtn").onclick = () => {
  const pass = prompt("Enter staff password:");
  if (pass === "otter123") {
    staffMode = true;
    document.getElementById("staffPanel").style.display = "block";
    renderItems();
    renderOrders();
  } else {
    alert("Wrong password!");
  }
};

function removeItem(i) {
  items.splice(i, 1);
  localStorage.setItem("items", JSON.stringify(items));
  renderItems();
}

document.getElementById("addItemBtn").onclick = () => {
  const name = document.getElementById("newName").value;
  const price = parseFloat(document.getElementById("newPrice").value);
  const desc = document.getElementById("newDesc").value;
  const img = document.getElementById("newImage").value;
  items.push({ name, price, desc, img });
  localStorage.setItem("items", JSON.stringify(items));
  renderItems();
};

// Checkout
document.getElementById("checkoutBtn").onclick = () => {
  if (cart.length === 0) return alert("Cart is empty!");
  document.getElementById("checkoutForm").style.display = "block";
};

document.getElementById("placeOrderBtn").onclick = () => {
  const name = document.getElementById("customerName").value;
  const location = document.getElementById("pickupLocation").value;
  if (!name || !location) return alert("Please fill all fields");
  orders.push({ name, location, items: [...cart] });
  localStorage.setItem("orders", JSON.stringify(orders));
  cart = [];
  renderCart();
  document.getElementById("checkoutForm").style.display = "none";
  alert("Order placed!");
  if (staffMode) renderOrders();
};

function deleteOrder(i) {
  orders.splice(i, 1);
  localStorage.setItem("orders", JSON.stringify(orders));
  renderOrders();
}

document.getElementById("searchBox").oninput = renderItems;

// Initial render
renderItems();
renderCart();
