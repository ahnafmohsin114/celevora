/* =========================================================
   CELEVORA — Shared site interactivity (no framework, no backend)
   ========================================================= */

document.addEventListener("DOMContentLoaded", function () {
  /* ---------- Mobile nav drawer ---------- */
  var menuToggle = document.querySelector(".menu-toggle");
  var drawerOverlay = document.querySelector(".mobile-drawer-overlay");
  var drawerClose = document.querySelector(".mobile-drawer-close");

  function openDrawer() {
    if (drawerOverlay) drawerOverlay.classList.add("open");
  }
  function closeDrawer() {
    if (drawerOverlay) drawerOverlay.classList.remove("open");
  }

  if (menuToggle) menuToggle.addEventListener("click", openDrawer);
  if (drawerClose) drawerClose.addEventListener("click", closeDrawer);
  if (drawerOverlay) {
    drawerOverlay.addEventListener("click", function (e) {
      if (e.target === drawerOverlay) closeDrawer();
    });
  }

  /* ---------- "Pages" dropdown (tap support for touch devices) ---------- */
  var dropdowns = document.querySelectorAll(".nav-dropdown");
  dropdowns.forEach(function (dd) {
    var btn = dd.querySelector(".nav-dropdown-btn");
    if (!btn) return;
    btn.addEventListener("click", function (e) {
      e.preventDefault();
      dd.classList.toggle("open");
    });
  });
  document.addEventListener("click", function (e) {
    dropdowns.forEach(function (dd) {
      if (!dd.contains(e.target)) dd.classList.remove("open");
    });
  });

  /* ---------- Wishlist (heart) toggle — stored in localStorage ---------- */
  var WISHLIST_KEY = "celevora_wishlist";

  function getWishlist() {
    try {
      return JSON.parse(localStorage.getItem(WISHLIST_KEY)) || [];
    } catch (e) {
      return [];
    }
  }

  function saveWishlist(list) {
    localStorage.setItem(WISHLIST_KEY, JSON.stringify(list));
  }

  function initWishlistButtons() {
    var wishlist = getWishlist();
    document.querySelectorAll(".fav-btn[data-id]").forEach(function (btn) {
      var id = btn.getAttribute("data-id");
      if (wishlist.indexOf(id) > -1) btn.classList.add("active");

      btn.addEventListener("click", function (e) {
        e.preventDefault();
        e.stopPropagation();
        var list = getWishlist();
        var idx = list.indexOf(id);
        if (idx > -1) {
          list.splice(idx, 1);
          btn.classList.remove("active");
        } else {
          list.push(id);
          btn.classList.add("active");
        }
        saveWishlist(list);
      });
    });
  }
  initWishlistButtons();

  /* ---------- Horizontal carousel arrows ---------- */
  document.querySelectorAll(".scroll-row-wrap").forEach(function (wrap) {
    var row = wrap.querySelector(".scroll-row");
    var left = wrap.querySelector(".scroll-arrow-left");
    var right = wrap.querySelector(".scroll-arrow-right");
    if (!row) return;

    if (left) {
      left.addEventListener("click", function () {
        row.scrollBy({ left: -row.clientWidth * 0.85, behavior: "smooth" });
      });
    }
    if (right) {
      right.addEventListener("click", function () {
        row.scrollBy({ left: row.clientWidth * 0.85, behavior: "smooth" });
      });
    }
  });

  /* ---------- Mobile filter drawer (events/vendors listing pages) ---------- */
  var filterToggleBtn = document.querySelector(".mobile-filter-btn");
  var mobileFilterSidebar = document.querySelector(".filter-sidebar.mobile-only");
  var filterCloseBtn = document.querySelector(".filter-drawer-close");

  if (filterToggleBtn && mobileFilterSidebar) {
    filterToggleBtn.addEventListener("click", function () {
      mobileFilterSidebar.parentElement.classList.add("open");
    });
  }
  if (filterCloseBtn) {
    filterCloseBtn.addEventListener("click", function () {
      document.querySelector(".mobile-filter-overlay").classList.remove("open");
    });
  }
  var mobileFilterOverlay = document.querySelector(".mobile-filter-overlay");
  if (mobileFilterOverlay) {
    mobileFilterOverlay.addEventListener("click", function (e) {
      if (e.target === mobileFilterOverlay) mobileFilterOverlay.classList.remove("open");
    });
  }

  /* ---------- Star rating filter (clickable stars set min rating) ---------- */
  document.querySelectorAll(".star-filter").forEach(function (group) {
    var stars = group.querySelectorAll("svg");
    stars.forEach(function (star, i) {
      star.addEventListener("click", function () {
        var rating = i + 1;
        var alreadyActive = star.classList.contains("active") && i === stars.length - 1;
        stars.forEach(function (s, j) {
          if (alreadyActive) {
            s.classList.remove("active");
          } else {
            s.classList.toggle("active", j <= i);
          }
        });
      });
    });
  });

  /* ---------- Package selector (vendor details page) ---------- */
  document.querySelectorAll(".package-card[data-package]").forEach(function (card) {
    card.querySelector(".package-select-btn").addEventListener("click", function () {
      var group = card.closest(".packages-grid");
      group.querySelectorAll(".package-card").forEach(function (c) {
        c.classList.remove("selected");
        var b = c.querySelector(".package-select-btn");
        b.textContent = "Select Package";
        b.classList.remove("btn-primary");
        b.classList.add("btn-outline");
      });
      card.classList.add("selected");
      var thisBtn = card.querySelector(".package-select-btn");
      thisBtn.textContent = "Selected";
      thisBtn.classList.remove("btn-outline");
      thisBtn.classList.add("btn-primary");

      // Update sticky summary card if present
      var name = card.getAttribute("data-name");
      var price = card.getAttribute("data-price");
      var summaryName = document.querySelector("[data-summary-package-name]");
      var summaryPrice = document.querySelector("[data-summary-package-price]");
      if (summaryName) summaryName.textContent = name;
      if (summaryPrice) summaryPrice.textContent = "৳" + price;
    });
  });

  /* ---------- FAQ accordion ---------- */
  document.querySelectorAll(".faq-item").forEach(function (item) {
    var question = item.querySelector(".faq-question");
    var answer = item.querySelector(".faq-answer");
    if (!question || !answer) return;

    question.addEventListener("click", function () {
      var isOpen = item.classList.contains("open");

      // close siblings
      item.parentElement.querySelectorAll(".faq-item").forEach(function (sib) {
        sib.classList.remove("open");
        sib.querySelector(".faq-answer").style.maxHeight = null;
      });

      if (!isOpen) {
        item.classList.add("open");
        answer.style.maxHeight = answer.scrollHeight + "px";
      }
    });
  });

  /* ---------- Payment method radio styling (checkout page) ---------- */
  document.querySelectorAll(".payment-method").forEach(function (label) {
    var input = label.querySelector("input[type=radio]");
    if (!input) return;
    function refresh() {
      var group = input.name;
      document.querySelectorAll('input[name="' + group + '"]').forEach(function (radio) {
        radio.closest(".payment-method").classList.toggle("checked", radio.checked);
      });
    }
    input.addEventListener("change", refresh);
    refresh();
  });

  /* ---------- Generic listing search filter (client-side, by data-search) ---------- */
  var searchInput = document.querySelector("[data-search-input]");
  if (searchInput) {
    searchInput.addEventListener("input", function () {
      var term = searchInput.value.trim().toLowerCase();
      var items = document.querySelectorAll("[data-search-item]");
      var visibleCount = 0;
      items.forEach(function (item) {
        var label = (item.getAttribute("data-search-item") || "").toLowerCase();
        var match = label.indexOf(term) > -1;
        item.style.display = match ? "" : "none";
        if (match) visibleCount++;
      });
      var counter = document.querySelector("[data-results-count]");
      if (counter) counter.textContent = visibleCount;
    });
  }

  /* ---------- Category checkbox filter (events/vendors pages) ---------- */
  var categoryCheckboxes = document.querySelectorAll("[data-filter-category]");
  var vendorTypeCheckboxes = document.querySelectorAll("[data-filter-vendortype]");

  function applyCheckboxFilters() {
    var activeCategories = Array.from(categoryCheckboxes)
      .filter(function (cb) { return cb.checked; })
      .map(function (cb) { return cb.value; });

    var activeTypes = Array.from(vendorTypeCheckboxes)
      .filter(function (cb) { return cb.checked; })
      .map(function (cb) { return cb.value; });

    var items = document.querySelectorAll("[data-search-item]");
    var visibleCount = 0;

    items.forEach(function (item) {
      var itemCategory = item.getAttribute("data-category") || "";
      var itemType = item.getAttribute("data-vendor-type") || "";

      var categoryMatch = activeCategories.length === 0 || activeCategories.indexOf(itemCategory) > -1;
      var typeMatch = activeTypes.length === 0 || activeTypes.indexOf(itemType) > -1;

      var visible = categoryMatch && typeMatch;
      item.style.display = visible ? "" : "none";
      if (visible) visibleCount++;
    });

    var counter = document.querySelector("[data-results-count]");
    if (counter) counter.textContent = visibleCount;
  }

  categoryCheckboxes.forEach(function (cb) { cb.addEventListener("change", applyCheckboxFilters); });
  vendorTypeCheckboxes.forEach(function (cb) { cb.addEventListener("change", applyCheckboxFilters); });

  var resetBtn = document.querySelector(".filter-reset");
  if (resetBtn) {
    resetBtn.addEventListener("click", function () {
      categoryCheckboxes.forEach(function (cb) { cb.checked = false; });
      vendorTypeCheckboxes.forEach(function (cb) { cb.checked = false; });
      document.querySelectorAll(".star-filter svg").forEach(function (s) { s.classList.remove("active"); });
      var minP = document.querySelector("[data-price-min]");
      var maxP = document.querySelector("[data-price-max]");
      if (minP) minP.value = "";
      if (maxP) maxP.value = "";
      applyCheckboxFilters();
    });
  }

  /* ---------- Newsletter / contact forms — demo submit feedback ---------- */
  document.querySelectorAll("form[data-demo-form]").forEach(function (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var feedback = form.querySelector("[data-form-feedback]");
      if (feedback) {
        feedback.textContent = form.getAttribute("data-success-message") || "Done! Thank you.";
        feedback.style.display = "block";
        setTimeout(function () {
          feedback.style.display = "none";
        }, 4000);
      }
      form.reset();
    });
  });

  /* ---------- Fade-up reveal on scroll ---------- */
  var revealEls = document.querySelectorAll(".fade-up");
  if ("IntersectionObserver" in window && revealEls.length) {
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("in-view");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );
    revealEls.forEach(function (el) {
      observer.observe(el);
    });
  } else {
    revealEls.forEach(function (el) {
      el.classList.add("in-view");
    });
  }

  /* ---------- Active nav link highlighting based on current path ---------- */
  var currentPath = window.location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll(".nav-links a, .mobile-drawer nav a").forEach(function (link) {
    var href = link.getAttribute("href");
    if (href === currentPath) link.classList.add("active");
  });
});

/* ============================================================
   CUSTOM CURSOR
   ============================================================ */
(function () {
  var dot = document.createElement("div");
  dot.id = "custom-cursor";
  var ring = document.createElement("div");
  ring.id = "custom-cursor-ring";
  document.body.appendChild(dot);
  document.body.appendChild(ring);

  var mx = -100, my = -100;
  var rx = -100, ry = -100;

  document.addEventListener("mousemove", function (e) {
    mx = e.clientX;
    my = e.clientY;
    dot.style.left = mx + "px";
    dot.style.top = my + "px";
  });

  function animateRing() {
    rx += (mx - rx) * 0.14;
    ry += (my - ry) * 0.14;
    ring.style.left = rx + "px";
    ring.style.top = ry + "px";
    requestAnimationFrame(animateRing);
  }
  animateRing();

  document.querySelectorAll("a,button,input,select,textarea,[role=button]").forEach(function (el) {
    el.addEventListener("mouseenter", function () { document.body.classList.add("cursor-hover"); });
    el.addEventListener("mouseleave", function () { document.body.classList.remove("cursor-hover"); });
  });
})();

/* ============================================================
   CART — localStorage backed
   ============================================================ */
(function () {
  var CART_KEY = "celevora_cart";

  function getCart() {
    try { return JSON.parse(localStorage.getItem(CART_KEY)) || []; }
    catch (e) { return []; }
  }

  function saveCart(c) { localStorage.setItem(CART_KEY, JSON.stringify(c)); }

  function updateCartBadge() {
    var c = getCart();
    document.querySelectorAll(".cart-count-badge").forEach(function (b) {
      b.textContent = c.length;
      b.style.display = c.length ? "flex" : "none";
    });
  }

  // Add-to-cart buttons
  document.querySelectorAll("[data-add-cart]").forEach(function (btn) {
    btn.addEventListener("click", function (e) {
      e.preventDefault();
      e.stopPropagation();
      var cart = getCart();
      var item = {
        id: btn.getAttribute("data-add-cart"),
        name: btn.getAttribute("data-name"),
        type: btn.getAttribute("data-type"),
        price: btn.getAttribute("data-price"),
        img: btn.getAttribute("data-img"),
      };
      var exists = cart.some(function (i) { return i.id === item.id; });
      if (!exists) {
        cart.push(item);
        saveCart(cart);
        btn.textContent = "Added!";
        btn.classList.add("btn-primary");
        btn.classList.remove("btn-outline");
        setTimeout(function () {
          btn.textContent = "Add to Cart";
          btn.classList.remove("btn-primary");
          btn.classList.add("btn-outline");
        }, 1800);
      }
      updateCartBadge();
    });
  });

  // Cart page rendering
  var cartList = document.getElementById("cart-items-list");
  var cartSummary = document.getElementById("cart-summary-block");
  var emptyCart = document.getElementById("cart-empty");

  if (cartList) {
    var cart = getCart();
    if (cart.length === 0) {
      cartList.style.display = "none";
      if (cartSummary) cartSummary.style.display = "none";
      if (emptyCart) emptyCart.style.display = "block";
    } else {
      if (emptyCart) emptyCart.style.display = "none";
      var total = 0;
      cart.forEach(function (item) {
        var price = parseInt(item.price, 10) || 0;
        total += price;
        var el = document.createElement("div");
        el.className = "cart-item";
        el.innerHTML = '<img class="cart-item-img" src="' + (item.img || "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=200") + '" alt="' + item.name + '">' +
          '<div class="cart-item-info"><div class="cart-item-title">' + item.name + '</div><div class="cart-item-meta">' + item.type + '</div><div class="cart-item-price">৳' + price.toLocaleString() + '</div></div>' +
          '<button class="cart-item-remove" data-remove="' + item.id + '" aria-label="Remove"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/></svg></button>';
        cartList.appendChild(el);
      });

      var subtotal = total;
      var tax = Math.round(subtotal * 0.05);
      var grandTotal = subtotal + tax;

      document.querySelectorAll("[data-cart-subtotal]").forEach(function (el) { el.textContent = "৳" + subtotal.toLocaleString(); });
      document.querySelectorAll("[data-cart-tax]").forEach(function (el) { el.textContent = "৳" + tax.toLocaleString(); });
      document.querySelectorAll("[data-cart-total]").forEach(function (el) { el.textContent = "৳" + grandTotal.toLocaleString(); });
      document.querySelectorAll("[data-cart-count]").forEach(function (el) { el.textContent = cart.length; });

      // Remove buttons
      cartList.querySelectorAll("[data-remove]").forEach(function (btn) {
        btn.addEventListener("click", function () {
          var id = btn.getAttribute("data-remove");
          var c = getCart().filter(function (i) { return i.id !== id; });
          saveCart(c);
          window.location.reload();
        });
      });
    }
  }

  // Favourites page rendering
  var favGrid = document.getElementById("fav-grid");
  var emptyFav = document.getElementById("fav-empty");

  if (favGrid) {
    var WISHLIST_KEY = "celevora_wishlist";
    var ids;
    try { ids = JSON.parse(localStorage.getItem(WISHLIST_KEY)) || []; } catch (e) { ids = []; }

    var ALL_ITEMS = [
      { id: "evt-1", name: "Dream Wedding", type: "Wedding", img: "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=600&auto=format&fit=crop", href: "event-details.html", price: "৳12,000" },
      { id: "evt-2", name: "Corporate Meet 2026", type: "Corporate", img: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=600&auto=format&fit=crop", href: "event-details.html", price: "৳8,500" },
      { id: "evt-3", name: "Rock Concert Live", type: "Concert", img: "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?q=80&w=600&auto=format&fit=crop", href: "event-details.html", price: "৳3,500" },
      { id: "evt-4", name: "Birthday Party", type: "Birthday", img: "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?q=80&w=600&auto=format&fit=crop", href: "event-details.html", price: "৳6,000" },
      { id: "evt-5", name: "Garden Anniversary Gala", type: "Anniversary", img: "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?q=80&w=600&auto=format&fit=crop", href: "event-details.html", price: "৳9,000" },
      { id: "ven-1", name: "Royal Decor Studio", type: "Decorator", img: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=600&auto=format&fit=crop", href: "vendor-details.html", price: "৳5,000" },
      { id: "ven-2", name: "Spice Route Catering", type: "Caterer", img: "https://images.unsplash.com/photo-1555244162-803834f70033?q=80&w=600&auto=format&fit=crop", href: "vendor-details.html", price: "৳3,500" },
      { id: "ven-3", name: "Lumiere Events", type: "Lighting & Sound", img: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=600&auto=format&fit=crop", href: "vendor-details.html", price: "৳4,200" },
      { id: "ven-4", name: "Harmony Live Band", type: "Entertainment", img: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?q=80&w=600&auto=format&fit=crop", href: "vendor-details.html", price: "৳6,500" },
      { id: "ven-5", name: "Frame & Flash Photography", type: "Photographer", img: "https://images.unsplash.com/photo-1500840216050-6ffa99d75160?q=80&w=600&auto=format&fit=crop", href: "vendor-details.html", price: "৳7,000" },
      { id: "venue-1", name: "Grand Pavilion Hall", type: "Venue", img: "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?q=80&w=600&auto=format&fit=crop", href: "venue-details.html", price: "৳8,500" },
      { id: "venue-2", name: "Skyline Rooftop Lounge", type: "Venue", img: "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?q=80&w=600&auto=format&fit=crop", href: "venue-details.html", price: "৳3,200" },
    ];

    var saved = ALL_ITEMS.filter(function (i) { return ids.indexOf(i.id) > -1; });

    if (saved.length === 0) {
      favGrid.style.display = "none";
      if (emptyFav) emptyFav.style.display = "block";
    } else {
      if (emptyFav) emptyFav.style.display = "none";
      saved.forEach(function (item) {
        var el = document.createElement("div");
        el.className = "fav-card";
        el.innerHTML = '<img class="fav-card-img" src="' + item.img + '" alt="' + item.name + '">' +
          '<div class="fav-card-body"><div class="fav-card-title">' + item.name + '</div><div class="fav-card-meta">' + item.type + ' · ' + item.price + '</div>' +
          '<div class="fav-card-actions"><a href="' + item.href + '" class="btn btn-primary btn-sm" style="flex:1;text-align:center">View</a>' +
          '<button class="btn btn-outline btn-sm fav-remove-btn" data-remove-fav="' + item.id + '">Remove</button></div></div>';
        favGrid.appendChild(el);
      });

      favGrid.querySelectorAll("[data-remove-fav]").forEach(function (btn) {
        btn.addEventListener("click", function () {
          var id = btn.getAttribute("data-remove-fav");
          try {
            var list = JSON.parse(localStorage.getItem(WISHLIST_KEY)) || [];
            list = list.filter(function (i) { return i !== id; });
            localStorage.setItem(WISHLIST_KEY, JSON.stringify(list));
          } catch (e) {}
          window.location.reload();
        });
      });
    }
  }

  updateCartBadge();
})();
