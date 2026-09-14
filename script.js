const products = [
  {
    id: 1,
    name: "مودم روتر فیبر نوری هوآوی HG8145V5",
    price: 2950000,
    category: "مودم",
    icon: "📡"
  },
  {
    id: 2,
    name: "روتر TP-Link Archer C6",
    price: 2180000,
    category: "روتر",
    icon: "📶"
  },
  {
    id: 3,
    name: "مودم 4G رومیزی",
    price: 4250000,
    category: "مودم",
    icon: "🌐"
  },
  {
    id: 4,
    name: "یخچال فریزر دوو",
    price: 32450000,
    category: "لوازم خانگی",
    icon: "🧊"
  },
  {
    id: 5,
    name: "ماشین لباسشویی سامسونگ",
    price: 35800000,
    category: "لوازم خانگی",
    icon: "🧺"
  },
  {
    id: 6,
    name: "تلویزیون هوشمند ال‌جی",
    price: 22900000,
    category: "لوازم خانگی",
    icon: "📺"
  },
  {
    id: 7,
    name: "جاروبرقی فیلیپس",
    price: 8900000,
    category: "لوازم خانگی",
    icon: "🧹"
  },
  {
    id: 8,
    name: "چای‌ساز برقی",
    price: 2750000,
    category: "لوازم خانگی",
    icon: "☕"
  }
];

let cart = JSON.parse(localStorage.getItem("babaeiCart")) || [];

function formatPrice(price) {
  return new Intl.NumberFormat("fa-IR").format(price);
}

function renderProducts(list = products) {
  const container = document.getElementById("products");

  if (!container) return;

  if (list.length === 0) {
    container.innerHTML = `
      <div style="grid-column:1/-1;text-align:center;padding:40px;color:#aaa;">
        محصولی پیدا نشد.
      </div>
    `;
    return;
  }

  container.innerHTML = list.map(product => `
    <article class="product-card">

      <div class="product-image">
        ${product.icon}
      </div>

      <div class="product-info">

        <span class="product-category">
          ${product.category}
        </span>

        <h3>${product.name}</h3>

        <div class="product-price">
          ${formatPrice(product.price)}
          <span>تومان</span>
        </div>

        <button
          class="add-cart"
          onclick="addToCart(${product.id})">
          افزودن به سبد خرید
        </button>

      </div>

    </article>
  `).join("");
}

function addToCart(productId) {
  const product = products.find(p => p.id === productId);

  if (!product) return;

  const existing = cart.find(item => item.id === productId);

  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({
      ...product,
      quantity: 1
    });
  }

  saveCart();

  showToast("محصول به سبد خرید اضافه شد");
}

function saveCart() {
  localStorage.setItem(
    "babaeiCart",
    JSON.stringify(cart)
  );

  renderCart();
}

function renderCart() {
  const itemsContainer =
    document.getElementById("cart-items");

  const countElement =
    document.getElementById("cart-count");

  const totalElement =
    document.getElementById("cart-total");

  if (!itemsContainer) return;

  let total = 0;
  let count = 0;

  cart.forEach(item => {
    total += item.price * item.quantity;
    count += item.quantity;
  });

  if (countElement) {
    countElement.textContent = count;
  }

  if (totalElement) {
    totalElement.textContent = formatPrice(total);
  }

  if (cart.length === 0) {
    itemsContainer.innerHTML = `
      <div style="text-align:center;padding:40px 10px;color:#888;">
        🛒<br><br>
        سبد خرید شما خالی است.
      </div>
    `;

    return;
  }

  itemsContainer.innerHTML = cart.map(item => `
    <div class="cart-item">

      <div class="cart-item-image">
        ${item.icon}
      </div>

      <div>
        <h4>${item.name}</h4>

        <p>
          ${formatPrice(item.price)}
          تومان
        </p>

        <div class="quantity">

          <button onclick="changeQuantity(${item.id}, 1)">
            +
          </button>

          <span>${item.quantity}</span>

          <button onclick="changeQuantity(${item.id}, -1)">
            −
          </button>

        </div>
      </div>

      <button
        class="remove-item"
        onclick="removeFromCart(${item.id})">
        حذف
      </button>

    </div>
  `).join("");
}

function changeQuantity(productId, amount) {
  const item = cart.find(
    product => product.id === productId
  );

  if (!item) return;

  item.quantity += amount;

  if (item.quantity <= 0) {
    cart = cart.filter(
      product => product.id !== productId
    );
  }

  saveCart();
}

function removeFromCart(productId) {
  cart = cart.filter(
    product => product.id !== productId
  );

  saveCart();

  showToast("محصول حذف شد");
}

function openCart() {
  const overlay =
    document.getElementById("cart-overlay");

  if (overlay) {
    overlay.classList.add("active");
  }
}

function closeCart() {
  const overlay =
    document.getElementById("cart-overlay");

  if (overlay) {
    overlay.classList.remove("active");
  }
}

function searchProducts() {
  const input =
    document.getElementById("search-input");

  if (!input) return;

  const query =
    input.value.trim().toLowerCase();

  if (!query) {
    renderProducts(products);
    return;
  }

  const results = products.filter(product =>
    product.name.toLowerCase().includes(query) ||
    product.category.toLowerCase().includes(query)
  );

  renderProducts(results);
}

function filterCategory(category) {
  if (category === "همه") {
    renderProducts(products);
    return;
  }

  const filtered = products.filter(
    product => product.category === category
  );

  renderProducts(filtered);

  const section =
    document.getElementById("products-section");

  if (section) {
    section.scrollIntoView({
      behavior: "smooth"
    });
  }
}

function showToast(message) {
  const toast =
    document.getElementById("toast");

  if (!toast) return;

  toast.textContent = message;
  toast.classList.add("show");

  setTimeout(() => {
    toast.classList.remove("show");
  }, 2500);
}

/* ------------------------------
   پرداخت
-------------------------------- */

const API_URL = "http://localhost:3000";

async function checkout() {
  if (cart.length === 0) {
    showToast("سبد خرید شما خالی است");
    return;
  }

  const name = prompt("نام و نام خانوادگی:");

  if (!name) return;

  const mobile = prompt("شماره موبایل:");

  if (!mobile) return;

  const address = prompt("آدرس کامل:");

  if (!address) return;

  const postalCode = prompt("کد پستی:");

  if (!postalCode) return;

  const items = cart.map(item => ({
    productId: item.id,
    quantity: item.quantity
  }));

  try {
    showToast("در حال ثبت سفارش...");

    const orderResponse = await fetch(
      `${API_URL}/api/orders`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          customer: {
            name,
            mobile,
            address,
            postalCode
          },
          items
        })
      }
    );

    const orderData =
      await orderResponse.json();

    if (!orderResponse.ok) {
      throw new Error(
        orderData.message || "خطا در ثبت سفارش"
      );
    }

    showToast("سفارش ثبت شد؛ در حال انتقال به پرداخت...");

    const paymentResponse = await fetch(
      `${API_URL}/api/payment/create`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          orderId: orderData.order.id
        })
      }
    );

    const paymentData =
      await paymentResponse.json();

    if (!paymentResponse.ok) {
      throw new Error(
        paymentData.message || "خطا در ایجاد پرداخت"
      );
    }

    window.location.href =
      paymentData.paymentUrl;

  } catch (error) {
    console.error(error);

    showToast(
      "خطا در اتصال به سرور. پرداخت فعلاً فعال نیست."
    );
  }
}

function checkPaymentResult() {
  const params =
    new URLSearchParams(window.location.search);

  const payment =
    params.get("payment");

  const refId =
    params.get("refId");

  if (!payment) return;

  if (payment === "success") {
    alert(
      `پرداخت با موفقیت انجام شد.\nکد پیگیری: ${refId || "-"}`
    );

    cart = [];

    saveCart();

    window.history.replaceState(
      {},
      document.title,
      window.location.pathname
    );
  }

  if (payment === "cancelled") {
    alert("پرداخت لغو شد.");

    window.history.replaceState(
      {},
      document.title,
      window.location.pathname
    );
  }

  if (payment === "failed") {
    alert("پرداخت ناموفق بود.");

    window.history.replaceState(
      {},
      document.title,
      window.location.pathname
    );
  }
}

/* ------------------------------
   شروع سایت
-------------------------------- */

document.addEventListener(
  "DOMContentLoaded",
  () => {

    renderProducts();

    renderCart();

    checkPaymentResult();

    const searchInput =
      document.getElementById("search-input");

    if (searchInput) {
      searchInput.addEventListener(
        "input",
        searchProducts
      );
    }

  }
);



