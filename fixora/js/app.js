import {
  IMG,
  categories,
  brands,
  products,
  serviceCategories,
  centers,
  plans,
  inr,
  off,
} from "./data.js";

const CART_KEY = "fixora-cart";
const USER_KEY = "fixora-user";

const state = {
  store: {
    category: "all",
    brands: new Set(),
    maxPrice: 50000,
    availability: "in",
    sort: "featured",
    q: "",
  },
};

function cart() {
  try {
    return JSON.parse(localStorage.getItem(CART_KEY) || "[]");
  } catch {
    return [];
  }
}
function saveCart(items) {
  localStorage.setItem(CART_KEY, JSON.stringify(items));
}
function cartCount() {
  return cart().reduce((n, i) => n + i.qty, 0);
}
function addToCart(id, qty = 1) {
  const items = cart();
  const found = items.find((i) => i.id === id);
  if (found) found.qty += qty;
  else items.push({ id, qty });
  saveCart(items);
  toast("Added to cart");
  render();
}
function setQty(id, qty) {
  let items = cart();
  if (qty <= 0) items = items.filter((i) => i.id !== id);
  else items = items.map((i) => (i.id === id ? { ...i, qty } : i));
  saveCart(items);
  render();
}
function user() {
  try {
    return JSON.parse(localStorage.getItem(USER_KEY) || "null");
  } catch {
    return null;
  }
}

function toast(msg) {
  const el = document.getElementById("toast");
  el.hidden = false;
  el.textContent = msg;
  clearTimeout(toast._t);
  toast._t = setTimeout(() => {
    el.hidden = true;
  }, 2200);
}

function icon(name, size = 18) {
  const s = `width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"`;
  const paths = {
    search: `<circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/>`,
    pin: `<path d="M12 21s7-6.2 7-11a7 7 0 10-14 0c0 4.8 7 11 7 11z"/><circle cx="12" cy="10" r="2.5"/>`,
    cart: `<circle cx="9" cy="20" r="1"/><circle cx="18" cy="20" r="1"/><path d="M3 4h2l2.4 12h11l2-8H7"/>`,
    user: `<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0116 0"/>`,
    menu: `<path d="M4 7h16M4 12h16M4 17h16"/>`,
    shield: `<path d="M12 3l8 4v6c0 5-3.4 7.6-8 9-4.6-1.4-8-4-8-9V7z"/>`,
    truck: `<path d="M3 7h11v8H3zM14 10h4l3 3v2h-7z"/><circle cx="7" cy="18" r="2"/><circle cx="18" cy="18" r="2"/>`,
    refresh: `<path d="M21 12a9 9 0 11-3-6.7"/><path d="M21 4v6h-6"/>`,
    check: `<path d="M20 6L9 17l-5-5"/>`,
    star: `<polygon points="12 2 15 9 22 9 17 14 19 21 12 17 5 21 7 14 2 9 9 9"/>`,
    calendar: `<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M8 3v4M16 3v4M3 10h18"/>`,
    phone: `<rect x="7" y="2" width="10" height="20" rx="2"/>`,
    play: `<polygon points="8 5 19 12 8 19"/>`,
    apple: `<path d="M16 6c-1 .1-2.5 1.2-2.5 3S15 12 16 12"/><path d="M12 7c2 0 4 1.8 4 5s-2.4 8-5.5 8c-1.5 0-2.2-.8-3.5-.8S5.5 20 4.2 20C1.8 20 1 16 1 13.5 1 9 4 7 6.5 7c1.3 0 2.2.8 3.5.8S11.7 7 12 7z"/>`,
    grid: `<rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/>`,
    facebook: `<path d="M14 8h3V4h-3c-2.8 0-5 2.2-5 5v3H6v4h3v8h4v-8h3l1-4h-4V9c0-.6.4-1 1-1z"/>`,
    instagram: `<rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor"/>`,
    twitter: `<path d="M22 5.8c-.7.3-1.5.5-2.3.6A4 4 0 0021.4 4a8 8 0 01-2.5 1 4 4 0 00-6.8 3.6A11.3 11.3 0 013 4.9a4 4 0 001.2 5.3 4 4 0 01-1.8-.5v.1a4 4 0 003.2 3.9 4 4 0 01-1.8.1 4 4 0 003.7 2.8A8 8 0 012 18.4a11.3 11.3 0 006.1 1.8c7.4 0 11.4-6.1 11.4-11.4v-.5A8 8 0 0022 5.8z"/>`,
    linkedin: `<path d="M6 9H2v12h4zM4 3a2 2 0 100 4 2 2 0 000-4zM22 21h-4v-6c0-2-2-2.5-2.5-2.5S14 13.5 14 15v6h-4V9h4v2c.8-1.5 3-2 4.5-2 3 0 3.5 2 3.5 5z"/>`,
  };
  return `<svg ${s}>${paths[name] || ""}</svg>`;
}

function logo() {
  return `<a class="logo" href="#/">
    <span class="logo-mark">f</span>
    <span><span class="logo-text">Fixora</span><span class="logo-sub">Fix Today. A Better Tomorrow.</span></span>
  </a>`;
}

function header(active) {
  const storeMode = ["store", "cart", "product", "checkout"].includes(active);
  const u = user();
  const nav = storeMode
    ? [
        ["#/", "Home"],
        ["#/services", "Find Services"],
        ["#/store", "Store"],
        ["#/track", "Track Repair"],
        ["#/subscriptions", "Subscriptions"],
        ["#/help", "Help"],
      ]
    : [
        ["#/", "Home"],
        ["#/services", "Find Services"],
        ["#/how-it-works", "How It Works"],
        ["#/subscriptions", "Subscriptions"],
        ["#/vendors", "For Vendors"],
        ["#/help", "Help"],
      ];
  const actions = storeMode
    ? `<form class="search-mini" data-navsearch>
         ${icon("search", 16)}
         <input name="q" placeholder="Search for parts, accessories..." value="${escapeAttr(state.store.q)}" />
       </form>
       <a class="icon-btn" href="#/cart" aria-label="Cart">${icon("cart", 18)}${cartCount() ? `<span class="cart-count">${cartCount()}</span>` : ""}</a>
       <a class="icon-btn" href="${u ? "#/track" : "#/login"}" aria-label="Account">${icon("user", 18)}</a>
       <button class="icon-btn menu-btn" data-menu>${icon("menu", 18)}</button>`
    : `<a class="icon-btn" href="#/store" aria-label="Search">${icon("search", 18)}</a>
       ${
         u
           ? `<a class="btn btn-outline btn-sm" href="#/track">${escapeHtml(u.name.split(" ")[0])}</a>`
           : `<a class="btn btn-ghost btn-sm" href="#/login">Login</a>
              <a class="btn btn-primary btn-sm" href="#/signup">Sign Up</a>`
       }
       <button class="icon-btn menu-btn" data-menu>${icon("menu", 18)}</button>`;

  return `<header class="header"><div class="container header-inner">
    ${logo()}
    <nav class="nav">${nav
      .map(
        ([href, label]) =>
          `<a href="${href}" class="${active === href.replace("#/", "") || (active === "home" && href === "#/") || (active === "store" && href === "#/store") ? "active" : ""}">${label}</a>`
      )
      .join("")}</nav>
    <div class="header-actions">${actions}</div>
  </div></header>`;
}

function footer() {
  return `<footer class="footer"><div class="container">
    <div class="footer-grid">
      <div>
        ${logo()}
        <p>Your trusted partner for electronics repairs, parts and accessories.</p>
        <div class="socials">
          <a href="#/" aria-label="Facebook">${icon("facebook", 14)}</a>
          <a href="#/" aria-label="Instagram">${icon("instagram", 14)}</a>
          <a href="#/" aria-label="Twitter">${icon("twitter", 14)}</a>
          <a href="#/" aria-label="LinkedIn">${icon("linkedin", 14)}</a>
        </div>
      </div>
      <div><h4>Shop</h4>
        <a href="#/store">All Products</a>
        <a href="#/store">Mobile Parts</a>
        <a href="#/store">Laptop Parts</a>
        <a href="#/store">Accessories</a>
        <a href="#/store">Tools & Kits</a>
      </div>
      <div><h4>Help</h4>
        <a href="#/track">Track Order</a>
        <a href="#/help">Returns & Refunds</a>
        <a href="#/help">Shipping Policy</a>
        <a href="#/help">FAQ</a>
        <a href="#/help">Contact Support</a>
      </div>
      <div><h4>Company</h4>
        <a href="#/">About Fixora</a>
        <a href="#/vendors">For Vendors</a>
        <a href="#/help">Careers</a>
        <a href="#/help">Blog</a>
        <a href="#/help">Press</a>
      </div>
      <div><h4>Subscribe for Updates</h4>
        <p>Get offers, new arrivals and tech tips.</p>
        <form class="sub-form" data-subscribe>
          <input type="email" name="email" required placeholder="Enter your email" />
          <button class="btn btn-primary" type="submit">${icon("check", 16)}</button>
        </form>
      </div>
    </div>
    <div class="legal"><span>© 2026 Fixora. All rights reserved.</span><span>Same Devices. A Better Tomorrow.</span></div>
  </div></footer>`;
}

function layout(active, html) {
  return `${header(active)}${html}${footer()}`;
}

function pageHome() {
  return layout(
    "home",
    `<section class="hero"><div class="container hero-grid">
      <div>
        <div class="eyebrow">Trusted electronics repair platform</div>
        <h1 class="h1">Your Electronics.<br><span>Expertly Fixed.</span></h1>
        <p class="lead">Find trusted repair experts, book doorstep service, or get your device picked up and delivered—without the hassle.</p>
        <form class="location-row" data-findcenter>
          <div class="field">${icon("pin", 18)}<input name="loc" placeholder="Enter your location (e.g. Chennai)" required /></div>
          <button class="btn btn-primary" type="submit">Find a Service Center</button>
        </form>
        <div class="popular-links">Popular:
          <a href="#/book">Mobile Repair</a>
          <a href="#/book">Laptop Repair</a>
          <a href="#/book">Screen Replacement</a>
          <a href="#/book">Battery Change</a>
        </div>
        <div class="trust-inline">
          <div class="trust-chip">${icon("shield")} Verified Technicians</div>
          <div class="trust-chip">${icon("truck")} Doorstep Service</div>
          <div class="trust-chip">${icon("refresh")} Pickup & Drop</div>
          <div class="trust-chip">${icon("check")} Transparent Pricing</div>
        </div>
      </div>
      <div class="hero-photo">
        <img src="${IMG.heroRepair}" alt="Technician repairing a smartphone at a Fixora bench" />
        <div class="float-card top">
          <div style="color:var(--blue)">${icon("check")}</div>
          <div><strong>10,000+</strong><span>Devices Repaired</span></div>
        </div>
        <div class="float-card" style="bottom:22px;left:22px">
          <div style="color:var(--amber)">${icon("star", 16)}</div>
          <div><strong>4.8/5</strong><span>Customer Rating</span></div>
        </div>
        <div class="float-card quote">Good Devices<br><span>Brighter Days</span></div>
      </div>
    </div></section>

    <section class="section"><div class="container">
      <div class="section-head"><h2>Popular Service Categories</h2><a class="link" href="#/services">View All Services →</a></div>
      <div class="cat-grid">
        ${serviceCategories
          .map(
            (c) => `<a class="cat-card" href="#/book">
              <img src="${c.image}" alt="${c.name}" />
              <div class="body"><h3>${c.name}</h3><p>${c.desc}</p></div>
            </a>`
          )
          .join("")}
      </div>
    </div></section>

    <section class="section" style="padding-top:0"><div class="container">
      <div class="section-head"><div><h2>How It Works</h2><p>Getting your device repaired is simple and hassle-free.</p></div></div>
      <div class="steps">
        ${[
          ["search", "1. Search", "Find trusted service centers near you"],
          ["calendar", "2. Book", "Choose a service, time and preferred option"],
          ["truck", "3. Service", "Visit, doorstep, or pickup & drop"],
          ["check", "4. Track", "Get real-time updates on your repair"],
          ["phone", "5. Get Back", "Receive your device, ready to go"],
        ]
          .map(
            ([i, t, d]) =>
              `<div class="step"><div class="step-icon">${icon(i)}</div><h3>${t}</h3><p>${d}</p></div>`
          )
          .join("")}
      </div>
    </div></section>

    <section class="section" style="padding-top:0"><div class="container">
      <div class="cta-panel">
        <div class="cta-copy">
          <h2>Device troubles?<br>We'll come to you.</h2>
          <p>Book a doorstep repair or schedule a pickup and drop at your convenience.</p>
          <a class="btn btn-white" href="#/book" style="margin-top:16px">Book a Repair Now →</a>
          <ul class="perk-list">
            <li>${icon("shield")} Safe & Secure Handling</li>
            <li>${icon("check")} Real-time Tracking</li>
            <li>${icon("user")} Trained Professionals</li>
            <li>${icon("calendar")} Convenient Scheduling</li>
          </ul>
        </div>
        <div class="cta-photo"><img src="${IMG.delivery}" alt="Fixora courier handing over a repaired device" /></div>
      </div>
    </div></section>

    <section class="section" style="padding:12px 0 40px"><div class="container">
      <div class="stats">
        <div class="stat"><b>10K+</b><span>Devices Repaired</span></div>
        <div class="stat"><b>4.8/5</b><span>Customer Rating</span></div>
        <div class="stat"><b>500+</b><span>Verified Technicians</span></div>
        <div class="stat"><b>25+</b><span>Cities Covered</span></div>
      </div>
    </div></section>

    <section class="section" style="padding-top:0"><div class="container">
      <div class="section-head"><h2>What Our Customers Say</h2><a class="link" href="#/help">View All Reviews →</a></div>
      <div class="reviews">
        ${[
          [IMG.portrait1, "Arjun K.", "Chennai", "Super convenient! They picked up my laptop, repaired it and delivered it back within 2 days. Great service!"],
          [IMG.portrait2, "Priya S.", "Bangalore", "Transparent pricing and genuine parts. Finally a reliable repair service!"],
          [IMG.portrait3, "Rahul M.", "Hyderabad", "The technician was professional and explained everything clearly. Highly recommended!"],
        ]
          .map(
            ([img, name, city, quote]) => `<article class="review">
              <div class="stars">★★★★★</div>
              <p>“${quote}”</p>
              <div class="who"><img src="${img}" alt="${name}" /><div><b>${name}</b><br><small>${city}</small></div></div>
            </article>`
          )
          .join("")}
      </div>
    </div></section>

    <section class="app-band"><div class="container app-grid">
      <div>
        <h2 class="h1" style="font-size:36px;color:#fff">Download the Fixora App</h2>
        <p class="lead" style="color:#94a3b8">Book, track, and manage your repairs on the go.</p>
        <div class="store-badges">
          <a class="store-badge" href="#/"><span>GET IT ON</span><b>Google Play</b></a>
          <a class="store-badge" href="#/"><span>Download on the</span><b>App Store</b></a>
        </div>
      </div>
      <div class="phone-shot">
        <img src="${IMG.appPhone}" alt="Fixora mobile app on a smartphone" />
      </div>
    </div></section>`
  );
}

function filteredProducts() {
  const s = state.store;
  let list = products.filter((p) => {
    if (s.category !== "all" && p.category !== s.category) return false;
    if (s.brands.size && !s.brands.has(p.brand)) return false;
    if (p.price > s.maxPrice) return false;
    if (s.availability === "in" && !p.stock) return false;
    if (s.availability === "out" && p.stock) return false;
    if (s.q && !`${p.name} ${p.brand}`.toLowerCase().includes(s.q.toLowerCase())) return false;
    return true;
  });
  if (s.sort === "price-asc") list.sort((a, b) => a.price - b.price);
  if (s.sort === "price-desc") list.sort((a, b) => b.price - a.price);
  if (s.sort === "rating") list.sort((a, b) => b.rating - a.rating);
  return list;
}

function productCard(p) {
  const badge = p.badge
    ? `<span class="badge ${p.badge.toLowerCase()}">${p.badge}</span>`
    : "";
  return `<article class="product">
    <a class="media" href="#/product/${p.id}">${badge}<img src="${p.image}" alt="${escapeAttr(p.name)}" /></a>
    <div class="info">
      <h3><a href="#/product/${p.id}">${p.name}</a></h3>
      <div class="meta">★ ${p.rating} (${p.reviews})</div>
      <div class="price"><b>${inr(p.price)}</b><s>${inr(p.mrp)}</s><span class="off">${off(p.price, p.mrp)}% OFF</span></div>
      <div class="stock ${p.stock ? "" : "out"}">${p.stock ? "● In Stock" : "● Out of Stock"}</div>
      <button class="btn btn-outline btn-sm btn-block" ${p.stock ? `data-add="${p.id}"` : "disabled"}>
        ${icon("cart", 14)} Add to Cart
      </button>
    </div>
  </article>`;
}

function pageStore() {
  const list = filteredProducts();
  const catCounts = Object.fromEntries(
    categories.map((c) => [
      c.id,
      c.id === "all" ? products.length : products.filter((p) => p.category === c.id).length,
    ])
  );
  return layout(
    "store",
    `<section class="store-hero"><div class="container store-hero-grid">
      <div>
        <div class="kicker">FIXORA STORE</div>
        <h1 class="h1">Genuine Parts.<br><span>Greater Possibilities.</span></h1>
        <p class="lead">High-quality electronics parts, accessories and tools for longer life and better performance.</p>
        <div class="feature-row">
          <div>${icon("check")} 100% Genuine Parts</div>
          <div>${icon("shield")} Quality Assured</div>
          <div>${icon("truck")} Fast & Secure Delivery</div>
          <div>${icon("refresh")} Easy Returns</div>
        </div>
      </div>
      <img src="${IMG.heroStore}" alt="Desk with laptop, phone, watch and accessories" />
    </div></section>

    <div class="container">
      <div class="cat-pills">
        ${categories
          .map(
            (c) => `<button class="pill ${state.store.category === c.id ? "active" : ""}" data-cat="${c.id}">
              ${c.image ? `<img src="${c.image}" alt="">` : `<span class="ico">${icon("grid")}</span>`}
              <b>${c.name}</b>
            </button>`
          )
          .join("")}
      </div>

      <div class="store-layout">
        <aside class="filters">
          <div class="filter-head"><h3>Filters</h3><a class="link" href="#/store" data-clear>Clear All</a></div>
          <div class="filter-group"><h4>Category</h4>
            ${categories
              .filter((c) => c.id !== "all")
              .map(
                (c) => `<label class="check"><input type="radio" name="cat" value="${c.id}" ${state.store.category === c.id ? "checked" : ""}/> ${c.name}<span>(${catCounts[c.id]})</span></label>`
              )
              .join("")}
          </div>
          <div class="filter-group"><h4>Brand</h4>
            <input class="brand-search" data-brandq placeholder="Search brand..." />
            <div data-brandlist>
              ${brands
                .map(
                  (b) =>
                    `<label class="check"><input type="checkbox" data-brand="${b}" ${state.store.brands.has(b) ? "checked" : ""}/> ${b}<span>(${products.filter((p) => p.brand === b).length})</span></label>`
                )
                .join("")}
            </div>
          </div>
          <div class="filter-group"><h4>Price Range</h4>
            <input class="range" type="range" min="0" max="50000" step="100" value="${state.store.maxPrice}" data-price />
            <div class="meta">₹0 — ${inr(state.store.maxPrice)}</div>
          </div>
          <div class="filter-group"><h4>Availability</h4>
            <label class="check"><input type="radio" name="avail" value="in" ${state.store.availability === "in" ? "checked" : ""}/> In Stock</label>
            <label class="check"><input type="radio" name="avail" value="out" ${state.store.availability === "out" ? "checked" : ""}/> Out of Stock</label>
            <label class="check"><input type="radio" name="avail" value="all" ${state.store.availability === "all" ? "checked" : ""}/> All</label>
          </div>
        </aside>
        <div>
          <div class="products-head">
            <h2>Popular Products</h2>
            <label>Sort by:
              <select data-sort>
                <option value="featured" ${state.store.sort === "featured" ? "selected" : ""}>Featured</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="rating">Rating</option>
              </select>
            </label>
          </div>
          <div class="product-grid">${list.length ? list.map(productCard).join("") : `<div class="empty">No products match these filters.</div>`}</div>
          <div class="promo">
            <div class="copy">
              <div class="kicker" style="color:#93c5fd">LIMITED TIME OFFER</div>
              <h2>Up to 40% Off on Accessories</h2>
              <p>Cables, chargers, cases, earphones and more.</p>
              <button class="btn btn-white" data-cat="accessories">Shop Now</button>
            </div>
            <img src="${IMG.promoAccessories}" alt="Headphones, watch and tech accessories" />
          </div>
        </div>
      </div>
      <div class="trust-bar">
        <div class="trust-item">${icon("shield")}<b>Genuine Products</b>Sourced from trusted suppliers</div>
        <div class="trust-item">${icon("check")}<b>Secure Payments</b>100% safe and encrypted</div>
        <div class="trust-item">${icon("truck")}<b>Fast Delivery</b>Across India</div>
        <div class="trust-item">${icon("refresh")}<b>Easy Returns</b>Hassle-free 7-day returns</div>
        <div class="trust-item">${icon("user")}<b>Expert Support</b>Get help from our team</div>
      </div>
    </div>`
  );
}

function pageProduct(id) {
  const p = products.find((x) => x.id === id);
  if (!p) return pageStore();
  const related = products.filter((x) => x.category === p.category && x.id !== p.id).slice(0, 4);
  return layout(
    "product",
    `<div class="container page-hero">
      <p class="eyebrow"><a href="#/store">Store</a> / ${p.brand}</p>
      <div class="store-hero-grid">
        <img src="${p.image}" alt="${escapeAttr(p.name)}" style="height:360px;object-fit:contain;background:#f8fafc;border-radius:24px;padding:24px" />
        <div>
          ${p.badge ? `<span class="badge ${p.badge.toLowerCase()}" style="position:static">${p.badge}</span>` : ""}
          <h1 class="h1" style="font-size:32px">${p.name}</h1>
          <p class="meta">★ ${p.rating} (${p.reviews} reviews) · ${p.brand}</p>
          <div class="price" style="margin:14px 0"><b style="font-size:28px">${inr(p.price)}</b><s>${inr(p.mrp)}</s><span class="off">${off(p.price, p.mrp)}% OFF</span></div>
          <p class="lead">OEM-grade spare used by Fixora technicians. Includes 6-month replacement warranty when installed at a Fixora center.</p>
          <div class="feature-row">
            <button class="btn btn-primary" ${p.stock ? `data-add="${p.id}"` : "disabled"}>${icon("cart")} Add to Cart</button>
            <a class="btn btn-outline" href="#/book">Book installation</a>
          </div>
        </div>
      </div>
      <h2>Related products</h2>
      <div class="product-grid">${related.map(productCard).join("")}</div>
    </div>`
  );
}

function pageCart() {
  const items = cart()
    .map((i) => ({ ...i, p: products.find((x) => x.id === i.id) }))
    .filter((i) => i.p);
  const sub = items.reduce((n, i) => n + i.p.price * i.qty, 0);
  return layout(
    "cart",
    `<div class="container page-hero">
      <h1>Your Cart</h1>
      ${
        items.length === 0
          ? `<div class="empty">Cart is empty. <a class="link" href="#/store">Continue shopping</a></div>`
          : `<table class="cart-table">${items
              .map(
                (i) => `<tr>
                <td><img src="${i.p.image}" alt="" width="64" height="64" style="object-fit:contain;background:#f8fafc;border-radius:10px"></td>
                <td><b>${i.p.name}</b><div class="meta">${i.p.brand}</div></td>
                <td>${inr(i.p.price)}</td>
                <td class="qty"><button data-qty="${i.id}:${i.qty - 1}">−</button>${i.qty}<button data-qty="${i.id}:${i.qty + 1}">+</button></td>
                <td><b>${inr(i.p.price * i.qty)}</b></td>
              </tr>`
              )
              .join("")}</table>
            <div style="display:flex;justify-content:flex-end;margin-top:20px">
              <div class="form" style="width:min(360px,100%)">
                <div class="filter-head"><span>Subtotal</span><b>${inr(sub)}</b></div>
                <p class="meta">Shipping calculated at checkout. GST included.</p>
                <a class="btn btn-primary btn-block" href="#/checkout">Checkout</a>
              </div>
            </div>`
      }
    </div>`
  );
}

function pageCheckout() {
  const items = cart();
  if (!items.length) return pageCart();
  return layout(
    "checkout",
    `<div class="container page-hero"><h1>Checkout</h1>
      <form class="form" data-checkout style="max-width:560px">
        <div class="two">
          <div><label>Full name</label><input name="name" required /></div>
          <div><label>Phone</label><input name="phone" required /></div>
        </div>
        <label>Address</label><textarea name="addr" rows="3" required></textarea>
        <label>City</label>
        <select name="city"><option>Chennai</option><option>Bangalore</option><option>Hyderabad</option><option>Mumbai</option><option>Delhi</option></select>
        <button class="btn btn-primary" type="submit">Place order (demo)</button>
      </form>
    </div>`
  );
}

function pageServices() {
  return layout(
    "services",
    `<div class="container page-hero">
      <div class="eyebrow">Find Services</div>
      <h1>Service centers near you</h1>
      <p class="lead">Verified Fixora partners with transparent pricing and genuine parts.</p>
      <form class="location-row" data-findcenter style="margin:18px 0 28px">
        <div class="field">${icon("pin")}<input name="loc" placeholder="City or pincode" /></div>
        <button class="btn btn-primary">Search</button>
      </form>
      <div class="card-grid">
        ${centers
          .map(
            (c) => `<article class="center-card">
              <img src="${c.image}" alt="${c.name}" />
              <div class="pad">
                <h3>${c.name}</h3>
                <p class="meta">${c.address}, ${c.city}</p>
                <p>★ ${c.rating} · ${c.eta}</p>
                <a class="btn btn-primary btn-sm" href="#/book">Book here</a>
              </div>
            </article>`
          )
          .join("")}
      </div>
      <h2 style="margin-top:36px">Browse by device</h2>
      <div class="cat-grid" style="margin-top:16px">
        ${serviceCategories
          .map(
            (c) => `<a class="cat-card" href="#/book"><img src="${c.image}" alt="${c.name}" /><div class="body"><h3>${c.name}</h3><p>${c.desc}</p></div></a>`
          )
          .join("")}
      </div>
    </div>`
  );
}

function pageHow() {
  return layout(
    "how-it-works",
    `<div class="container page-hero">
      <h1>How Fixora works</h1>
      <p class="lead">Five steps from a broken device to a working one — with tracking at every stage.</p>
      <div class="steps" style="margin-top:28px">
        ${[
          ["search", "Search", "Use your locality to find rated centers or doorstep slots."],
          ["calendar", "Book", "Pick screen, battery, charging port, or a diagnosis."],
          ["truck", "Service", "Walk-in, doorstep technician, or pickup & drop."],
          ["check", "Track", "Status updates from diagnosis to QC."],
          ["phone", "Get back", "Collect in-store or receive it at home."],
        ]
          .map(
            ([i, t, d]) =>
              `<div class="step"><div class="step-icon">${icon(i)}</div><h3>${t}</h3><p>${d}</p></div>`
          )
          .join("")}
      </div>
      <div style="margin-top:32px"><a class="btn btn-primary" href="#/book">Start a repair</a></div>
    </div>`
  );
}

function pageBook() {
  return layout(
    "book",
    `<div class="container page-hero">
      <h1>Book a repair</h1>
      <p class="lead">Same-day slots in 25+ cities. Transparent estimate before we start.</p>
      <form class="form" data-book style="max-width:640px;margin-top:20px">
        <div class="two">
          <div><label>Device</label>
            <select name="device">${serviceCategories.map((c) => `<option>${c.name}</option>`).join("")}</select>
          </div>
          <div><label>Issue</label>
            <select name="issue"><option>Screen replacement</option><option>Battery</option><option>Charging port</option><option>Water damage</option><option>Software / diagnostics</option></select>
          </div>
        </div>
        <div class="two">
          <div><label>City</label><input name="city" placeholder="Chennai" required /></div>
          <div><label>Mode</label>
            <select name="mode"><option>Doorstep</option><option>Pickup & drop</option><option>Visit center</option></select>
          </div>
        </div>
        <label>Phone</label><input name="phone" required placeholder="10-digit mobile" />
        <button class="btn btn-primary" type="submit">Confirm booking</button>
      </form>
    </div>`
  );
}

function pageTrack() {
  return layout(
    "track",
    `<div class="container page-hero">
      <h1>Track repair</h1>
      <p class="lead">Try demo ID <b>FX-48291</b></p>
      <form class="form" data-track style="max-width:480px">
        <label>Repair / order ID</label>
        <input name="id" placeholder="FX-48291" required />
        <button class="btn btn-primary">Track</button>
      </form>
      <div id="track-result" style="margin-top:24px"></div>
    </div>`
  );
}

function pagePlans() {
  return layout(
    "subscriptions",
    `<div class="container page-hero">
      <h1>Fixora Care plans</h1>
      <p class="lead">Priority repairs, parts discounts, and coverage for the devices you actually use.</p>
      <div class="card-grid" style="margin-top:24px">
        ${plans
          .map(
            (p) => `<article class="plan" style="${p.featured ? "border-color:var(--blue);box-shadow:var(--shadow)" : ""}">
              <div class="pad">
                <h3>${p.name}</h3>
                <p><b style="font-size:32px">${inr(p.price)}</b><span class="meta">${p.per}</span></p>
                <ul>${p.items.map((i) => `<li>${i}</li>`).join("")}</ul>
                <button class="btn ${p.featured ? "btn-primary" : "btn-outline"} btn-block" data-plan="${p.name}">Choose plan</button>
              </div>
            </article>`
          )
          .join("")}
      </div>
    </div>`
  );
}

function pageHelp() {
  const faqs = [
    ["Do you use genuine parts?", "Yes. Fixora Store and service centers use OEM or certified equivalent parts with warranty."],
    ["How long does a screen replacement take?", "Most phone screens are completed the same day; laptops may take 24–48 hours."],
    ["What is the return window for store orders?", "Unused accessories can be returned within 7 days. Installed parts follow the service warranty."],
    ["Which cities are covered?", "25+ cities including Chennai, Bangalore, Hyderabad, Mumbai and Delhi NCR."],
  ];
  return layout(
    "help",
    `<div class="container page-hero">
      <h1>Help & support</h1>
      <div class="card-grid" style="margin-top:20px">
        ${faqs
          .map(
            ([q, a]) =>
              `<article class="help-card pad"><h3>${q}</h3><p class="lead">${a}</p></article>`
          )
          .join("")}
      </div>
    </div>`
  );
}

function pageVendors() {
  return layout(
    "vendors",
    `<div class="container page-hero">
      <h1>Partner with Fixora</h1>
      <p class="lead">Bring your service center or spare-parts inventory onto a platform customers already trust.</p>
      <form class="form" data-vendor style="max-width:560px;margin-top:20px">
        <label>Business name</label><input name="biz" required />
        <label>Type</label><select><option>Repair center</option><option>Parts distributor</option></select>
        <label>City</label><input name="city" required />
        <label>Email</label><input type="email" name="email" required />
        <button class="btn btn-primary">Apply</button>
      </form>
    </div>`
  );
}

function pageAuth(mode) {
  const signup = mode === "signup";
  return `${header(mode)}<div class="auth-wrap"><form class="auth" data-auth="${mode}">
    ${logo()}
    <h1>${signup ? "Create your Fixora account" : "Welcome back"}</h1>
    ${signup ? `<label>Name</label><input name="name" required />` : ""}
    <label>Email</label><input type="email" name="email" required />
    <label>Password</label><input type="password" name="password" required minlength="6" />
    <button class="btn btn-primary btn-block" style="margin-top:8px">${signup ? "Sign Up" : "Login"}</button>
    <p class="meta" style="margin-top:12px">${
      signup ? `Already have an account? <a class="link" href="#/login">Login</a>` : `New here? <a class="link" href="#/signup">Sign Up</a>`
    }</p>
  </form></div>${footer()}`;
}

function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}
function escapeAttr(s) {
  return escapeHtml(s);
}

function parseRoute() {
  const hash = location.hash.replace(/^#\/?/, "");
  const [path, ...rest] = hash.split("/");
  if (!path) return { name: "home" };
  if (path === "product") return { name: "product", id: rest[0] };
  return { name: path };
}

function render() {
  const r = parseRoute();
  const root = document.getElementById("app");
  const pages = {
    home: pageHome,
    store: pageStore,
    cart: pageCart,
    checkout: pageCheckout,
    services: pageServices,
    "how-it-works": pageHow,
    book: pageBook,
    track: pageTrack,
    subscriptions: pagePlans,
    help: pageHelp,
    vendors: pageVendors,
    login: () => pageAuth("login"),
    signup: () => pageAuth("signup"),
    product: () => pageProduct(r.id),
  };
  root.innerHTML = (pages[r.name] || pageHome)();
  bind();
  window.scrollTo(0, 0);
}

function bind() {
  document.querySelector("[data-menu]")?.addEventListener("click", () => {
    const nav = document.querySelector(".nav");
    if (!nav) return;
    nav.style.display = nav.style.display === "flex" ? "" : "flex";
    nav.style.flexDirection = "column";
    nav.style.position = "absolute";
    nav.style.top = "72px";
    nav.style.right = "16px";
    nav.style.background = "#fff";
    nav.style.padding = "12px";
    nav.style.border = "1px solid var(--line)";
    nav.style.borderRadius = "12px";
  });

  document.querySelector("[data-navsearch]")?.addEventListener("submit", (e) => {
    e.preventDefault();
    state.store.q = new FormData(e.target).get("q") || "";
    location.hash = "#/store";
    render();
  });

  document.querySelectorAll("[data-add]").forEach((btn) =>
    btn.addEventListener("click", () => addToCart(btn.getAttribute("data-add")))
  );
  document.querySelectorAll("[data-qty]").forEach((btn) =>
    btn.addEventListener("click", () => {
      const [id, q] = btn.getAttribute("data-qty").split(":");
      setQty(id, Number(q));
    })
  );
  document.querySelectorAll("[data-cat]").forEach((el) =>
    el.addEventListener("click", () => {
      state.store.category = el.getAttribute("data-cat");
      location.hash = "#/store";
      render();
    })
  );
  document.querySelector("[data-clear]")?.addEventListener("click", (e) => {
    e.preventDefault();
    state.store = { category: "all", brands: new Set(), maxPrice: 50000, availability: "in", sort: "featured", q: "" };
    render();
  });
  document.querySelectorAll('input[name="cat"]').forEach((el) =>
    el.addEventListener("change", () => {
      state.store.category = el.value;
      render();
    })
  );
  document.querySelectorAll("[data-brand]").forEach((el) =>
    el.addEventListener("change", () => {
      if (el.checked) state.store.brands.add(el.getAttribute("data-brand"));
      else state.store.brands.delete(el.getAttribute("data-brand"));
      render();
    })
  );
  document.querySelector("[data-price]")?.addEventListener("change", (e) => {
    state.store.maxPrice = Number(e.target.value);
    render();
  });
  document.querySelectorAll('input[name="avail"]').forEach((el) =>
    el.addEventListener("change", () => {
      state.store.availability = el.value;
      render();
    })
  );
  document.querySelector("[data-sort]")?.addEventListener("change", (e) => {
    state.store.sort = e.target.value;
    render();
  });
  document.querySelector("[data-brandq]")?.addEventListener("input", (e) => {
    const q = e.target.value.toLowerCase();
    document.querySelectorAll("[data-brand]").forEach((box) => {
      const row = box.closest(".check");
      row.style.display = box.getAttribute("data-brand").toLowerCase().includes(q) ? "" : "none";
    });
  });

  document.querySelector("[data-findcenter]")?.addEventListener("submit", (e) => {
    e.preventDefault();
    location.hash = "#/services";
    render();
  });
  document.querySelector("[data-book]")?.addEventListener("submit", (e) => {
    e.preventDefault();
    toast("Booking confirmed. Track with FX-48291");
    location.hash = "#/track";
    render();
    showTrack("FX-48291");
  });
  document.querySelector("[data-track]")?.addEventListener("submit", (e) => {
    e.preventDefault();
    showTrack(new FormData(e.target).get("id"));
  });
  document.querySelector("[data-subscribe]")?.addEventListener("submit", (e) => {
    e.preventDefault();
    toast("You're on the list. Welcome to Fixora.");
    e.target.reset();
  });
  document.querySelector("[data-vendor]")?.addEventListener("submit", (e) => {
    e.preventDefault();
    toast("Application received. We'll reach out this week.");
  });
  document.querySelector("[data-checkout]")?.addEventListener("submit", (e) => {
    e.preventDefault();
    saveCart([]);
    toast("Order placed. We'll ship genuine parts shortly.");
    location.hash = "#/store";
    render();
  });
  document.querySelectorAll("[data-plan]").forEach((btn) =>
    btn.addEventListener("click", () => toast(`${btn.getAttribute("data-plan")} selected`))
  );
  document.querySelector("[data-auth]")?.addEventListener("submit", (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    localStorage.setItem(
      USER_KEY,
      JSON.stringify({
        name: fd.get("name") || "Thameemul",
        email: fd.get("email"),
      })
    );
    toast("Signed in");
    location.hash = "#/";
    render();
  });
}

function showTrack(id) {
  const box = document.getElementById("track-result");
  if (!box) return;
  const known = String(id).toUpperCase().trim() === "FX-48291";
  if (!known) {
    box.innerHTML = `<div class="empty">No job found for that ID. Use FX-48291 for the demo.</div>`;
    return;
  }
  box.innerHTML = `<div class="form"><h3>Laptop repair · FX-48291</h3>
    <p class="meta">Doorstep pickup · Chennai · Battery replacement</p>
    <div class="timeline">
      <div class="tl"><div class="dot"></div><div><b>Picked up</b><div class="meta">Yesterday, 4:10 PM</div></div></div>
      <div class="tl"><div class="dot"></div><div><b>Diagnosis complete</b><div class="meta">Genuine battery recommended</div></div></div>
      <div class="tl"><div class="dot"></div><div><b>Repair in progress</b><div class="meta">ETA today 7:00 PM</div></div></div>
      <div class="tl"><div class="dot pending"></div><div><b>Out for delivery</b><div class="meta">Pending</div></div></div>
    </div></div>`;
}

window.addEventListener("hashchange", render);
render();
