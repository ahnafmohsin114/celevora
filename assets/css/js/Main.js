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
const rollingCursor = document.querySelector(".rolling-cursor");

document.addEventListener("mousemove", (e) => {
    rollingCursor.style.left = e.clientX + "px";
    rollingCursor.style.top = e.clientY + "px";
});