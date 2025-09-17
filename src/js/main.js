// main.js — Virtual Japan Travel Journal (refactored, no globals, no inline handlers)

/* ========= Utilities ========= */
var $ = function (sel, root) { return (root || document).querySelector(sel); };
var $$ = function (sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); };
var on = function (el, type, selectorOrHandler, handler) {
  // tiny event delegation utility
  if (typeof selectorOrHandler === "function") {
    el.addEventListener(type, selectorOrHandler);
  } else {
    el.addEventListener(type, function (e) {
      var match = e.target.closest(selectorOrHandler);
      if (match && el.contains(match)) handler(e, match);
    });
  }
};

function getNavbarHeight() {
  var navbar = $("#navbar");
  return navbar ? navbar.offsetHeight : 60;
}

function smoothScrollToId(id) {
  var el = document.getElementById(id);
  if (!el) return;
  var top = el.offsetTop - getNavbarHeight() + 10;
  window.scrollTo({ top: top, behavior: "smooth" });
}

/* ========= Modal ========= */
function Modal(root) {
  this.root = root;
  this.title = $("#modalTitle", root);
  this.text = $("#modalText", root);
  this.images = $("#modalImages", root);
  this.data = {}; // injected from App
  var self = this;

  // Ensure modal is hidden on initialization
  this.close();

  // close on backdrop / X / ESC
  on(root, "click", ".modal-backdrop, .modal-close", function () { self.close(); });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") self.close();
  });
}
Modal.prototype.open = function (key) {
  var d = this.data[key];
  if (!d) return;
  this.title.textContent = d.title || "";
  this.text.innerHTML = d.content || "";
  this.images.innerHTML = "";
  (d.images || []).forEach(function (src) {
    var img = document.createElement("img");
    img.src = src; img.alt = d.title || ""; img.style.width = "100%";
    img.style.height = "200px"; img.style.objectFit = "cover"; img.style.borderRadius = "0.25rem"; img.style.marginBottom = "1rem";
    this.images.appendChild(img);
  }, this);
  this.root.style.display = "flex";
  this.root.classList.add("active");
  document.body.style.overflow = "hidden";
};
Modal.prototype.close = function () {
  this.root.style.display = "none";
  this.root.classList.remove("active");
  document.body.style.overflow = "auto";
};

/* ========= Carousel ========= */
function Carousel(root) {
  this.root = root;
  this.items = $$(".carousel-item", root);
  this.idx = 0;
  if (this.items.length) this.show(0);
  var self = this;
  // controls
  on(root.parentElement, "click", ".carousel-btn.prev", function (e) { e.preventDefault(); self.change(-1); });
  on(root.parentElement, "click", ".carousel-btn.next", function (e) { e.preventDefault(); self.change(1); });
  // autoplay
  this.timer = setInterval(function () { self.change(1); }, 5000);
}
Carousel.prototype.change = function (delta) {
  if (!this.items.length) return;
  this.idx = (this.idx + delta + this.items.length) % this.items.length;
  this.show(this.idx);
};
Carousel.prototype.show = function (i) {
  this.items.forEach(function (el, k) { el.classList.toggle("active", k === i); });
};

/* ========= Navbar ========= */
function Navbar(navEl) {
  this.el = navEl;
  var self = this;
  window.addEventListener("scroll", function () {
    if (window.scrollY > 20) self.el.classList.add("scrolled");
    else self.el.classList.remove("scrolled");
    self.updateActiveLink();
  });
}
Navbar.prototype.updateActiveLink = function () {
  var ids = ["hero", "tokyo", "kyoto", "osaka", "gallery", "contact"];
  var h = getNavbarHeight();
  var pos = window.scrollY + h + 50;
  for (var i = ids.length - 1; i >= 0; i--) {
    var s = document.getElementById(ids[i]);
    if (s && s.offsetTop <= pos) {
      $$(".nav-link").forEach(function (a) {
        a.classList.toggle("active", a.getAttribute("href") === "#" + ids[i]);
      });
      break;
    }
  }
};

/* ========= App ========= */
function JapanApp() {
  this.modal = new Modal(document.getElementById("modal"));
  this.navbar = new Navbar(document.getElementById("navbar"));
  this.carousel = (function () {
    var c = $("#osakaCarousel");
    return c ? new Carousel(c) : null;
  })();

  // modal data (same as your original)
  this.modal.data = {
    about: {
      title: "About This Journey",
      content: "This virtual travel journal captures the essence of Japan through Happy Moon's perspective. Each section represents different adventures, filled with discoveries, cultural insights, and unforgettable moments under the beautiful strawberry moon.",
      images: []
    },
    "tokyo-details": {
      title: "Tokyo Anime Paradise",
      content: "Tokyo was absolutely incredible! As an anime lover, I was in heaven exploring Akihabara's electronic district and all the anime shops. The shopping malls are endless - from trendy Harajuku fashion to the latest tech gadgets. The neon lights of Shibuya crossing and the energy of this city never stops amazing me. Tokyo truly is the ultimate destination for anime culture and modern Japanese life!",
      images: ["https://images.unsplash.com/photo-1730386114645-1548682d1577?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0b2t5byUyMG5pZ2h0JTIwc2t5bGluZSUyMG5lb258ZW58MXx8fHwxNzU3OTY3ODk1fDA&ixlib=rb-4.0.3&q=80&w=1080"]
    },
    "kyoto-details": {
      title: "Kyoto Cultural Experience",
      content: "Kyoto was magical! I visited the stunning Kiyomizu-dera Temple with its wooden stage overlooking the city, and walked through the thousands of red torii gates at Fushimi Inari Shrine - it felt like stepping into a dream. Dressing up in traditional kimono was such a special experience, and the tea ceremony with authentic matcha was so peaceful and beautiful. Kyoto truly captures the soul of traditional Japan!",
      images: ["https://images.unsplash.com/photo-1652570935291-aff73d44b1f5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxreW90byUyMHRlbXBsZSUyMHRyYWRpdGlvbmFsfGVufDF8fHx8MTc1NzkyMjYxM3ww&ixlib=rb-4.0.3&q=80&w=1080"]
    },
    "kyoto-temples": {
      title: "🏯 Kiyomizu-dera & Fushimi Inari",
      content: "These two iconic sites were absolutely breathtaking!<br><br><strong>Kiyomizu-dera Temple:</strong><br>• The wooden stage offers incredible panoramic views of Kyoto<br>• Built without nails - an architectural marvel<br>• The temple's name means \"pure water\" from the nearby waterfall<br><br><strong>Fushimi Inari Shrine:</strong><br>• Thousands of red torii gates create magical tunnels<br>• Each gate is donated by individuals or companies<br>• The hike up the mountain is both spiritual and scenic<br><br>Both places felt like stepping into a different world!",
      images: ["https://images.unsplash.com/photo-1652570935291-aff73d44b1f5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxreW90byUyMHRlbXBsZSUyMHRyYWRpdGlvbmFsfGVufDF8fHx8MTc1NzkyMjYxM3ww&ixlib=rb-4.0.3&q=80&w=1080"]
    },
    "kyoto-tea": {
      title: "🍵 Tea Ceremony",
      content: "Dressing up in traditional kimono was such a special experience!<br><br><strong>Tea Ceremony:</strong><br>• Participated in an authentic matcha tea ceremony<br>• Learned the proper way to prepare and drink matcha<br>• The peaceful ritual was so meditative and beautiful<br>• Tasted traditional wagashi sweets that complemented the tea perfectly<br><br>It was like stepping back in time to experience traditional Japan!",
      images: ["assets/matcha.jpg"]
    },
    "kyoto-geisha": {
      title: "👘 Kimono Experience",
      content: "Kyoto's traditional culture is absolutely mesmerizing!<br><br><strong>Kimono Experience:</strong><br>• Wore a beautiful traditional kimono with obi belt<br>• Learned about the intricate dressing process<br>• Felt so elegant walking through the historic streets<br><br>Kyoto truly preserves the soul of traditional Japan!",
      images: ["assets/kimono.jpg"]
    },
    "gallery-1": { 
      title: "Nara Deer", 
      content: "Nara Deer are famous for their friendly nature and playful behavior.", 
      images: ["assets/nara.jpg"] 
    },
    "gallery-2": { 
      title: "Mount Fuji", 
      content: "Japan's iconic symbol stands majestically, Mount Fuji's beauty is breathtaking. Whether viewed from afar or up close, this sacred mountain radiates a peaceful power.", 
      images: ["assets/fuji.jpg"] 
    },
    "gallery-3": { 
      title: "Pokemon Center", 
      content: "Pokemon Center is a must-visit for any Pokemon fan, it's a great place to buy Pokemon merchandise and collectibles.", 
      images: ["assets/pokemon.jpg"] 
    }
  };

  this.bindEvents();
  this.setupVideoFallback();
  document.body.classList.add("loaded");
}

JapanApp.prototype.bindEvents = function () {
  var self = this;

  // Event delegation for clicks
  on(document, "click", function (e) {
    var a;

    // nav links
    a = e.target.closest(".nav-link");
    if (a) {
      e.preventDefault();
      smoothScrollToId(a.getAttribute("href").slice(1));
      return;
    }

    // buttons with data-target (smooth scroll)
    a = e.target.closest("button[data-target]");
    if (a) {
      e.preventDefault();
      smoothScrollToId(a.getAttribute("data-target"));
      return;
    }

    // anything with data-modal (open modal)
    a = e.target.closest("[data-modal]");
    if (a) {
      e.preventDefault();
      self.modal.open(a.getAttribute("data-modal"));
      return;
    }

    // email buttons
    a = e.target.closest('button[data-action="email"]');
    if (a) {
      e.preventDefault();
      var email = "yueyuel4@illinois.edu";
      var subject = "Questions about Japan Travel";
      var body = "Hello Happy Moon!\n\nI'm interested in your Japan travel journal and would like to learn more about...";
      window.open("mailto:" + email + "?subject=" + encodeURIComponent(subject) + "&body=" + encodeURIComponent(body));
      return;
    }

    // mobile menu toggle
    a = e.target.closest("#mobileMenuBtn");
    if (a) {
      var menu = $("#navMenu");
      if (menu) {
        menu.classList.toggle("active");
        a.classList.toggle("active");
      }
      return;
    }
  });

  // close mobile menu on link click
  on(document, "click", "#navMenu .nav-link", function () {
    var menuBtn = $("#mobileMenuBtn");
    var menu = $("#navMenu");
    if (menu && menuBtn) {
      menu.classList.remove("active");
      menuBtn.classList.remove("active");
    }
  });

  // resize hook (if you need it later)
  window.addEventListener("resize", function () {
    // responsive adjustments placeholder
  });
};

JapanApp.prototype.setupVideoFallback = function () {
  var video = document.getElementById("travelVideo");
  if (!video) return;
  video.addEventListener("error", function () {
    var c = video.parentElement;
    c.innerHTML =
      '<div class="video-placeholder"><div class="play-icon">▶️</div>' +
      "<p>Video is loading...</p><p class='video-subtitle'>Amazing moments from Japan journey</p></div>";
  });
};

/* ========= Boot ========= */
document.addEventListener("DOMContentLoaded", function () {
  // Immediately hide modal to prevent flash
  var modal = document.getElementById("modal");
  if (modal) {
    modal.style.display = "none";
  }
  
  window.japanApp = new JapanApp(); // expose if you want, otherwise omit the window assignment
});

// (optional) service worker registration can stay as-is
if ("serviceWorker" in navigator) {
  window.addEventListener("load", function () {
    navigator.serviceWorker.register("/sw.js").catch(function () {});
  });
}