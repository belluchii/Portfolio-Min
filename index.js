let translations = {};
let sections = document.querySelectorAll("main section");
let nav_li = document.querySelectorAll("nav ul li");
let nav_a = document.querySelectorAll("nav ul li a");
let nav = document.querySelector("nav");
let h2s = document.querySelectorAll("h2");
let cardCont = document.querySelector(".card-cont");
let focusTitle = document.querySelector(".focus-title");
let cardTags = document.querySelector(".focus-tags");
let cardLinks = document.querySelector(".focus-links");
let swiperTrack = document.querySelector(".swiper-track");
let swiperPrev = document.querySelector(".swiper-prev");
let swiperNext = document.querySelector(".swiper-next");
let swiperDots = document.querySelector(".swiper-dots");
let projectCards = document.querySelectorAll(".project-card");

let currentSlide = 0;
let totalSlides = 0;

function measureMinWidths() {
  return Array.from(nav_li).map((li) => {
    const span = li.querySelector("a span");
    const savedLiTransition = li.style.transition;
    const savedLiWidth = li.style.width;
    const savedSpanDisplay = span.style.display;
    const savedNavDisplay = nav.style.display;

    li.style.transition = "none";
    li.style.width = "auto";
    span.style.display = "block";
    nav.style.display = "block";

    const width = li.scrollWidth;

    li.style.transition = savedLiTransition;
    li.style.width = savedLiWidth;
    span.style.display = savedSpanDisplay;
    nav.style.display = savedNavDisplay;

    return width;
  });
}

let min_widths = measureMinWidths();

let currentLang = "en";

function updateCardGrid(lang) {
  const langCap = lang.charAt(0).toUpperCase() + lang.slice(1);
  document.querySelectorAll(".project-card").forEach((c) => {
    const titleKey = `i18nTitle${langCap}`;
    const tagsKey = `i18nTags${langCap}`;

    const h3 = c.querySelector(".card-text h3");
    if (h3 && c.dataset[titleKey]) h3.textContent = c.dataset[titleKey];

    const tagsAttr = c.dataset[tagsKey];
    if (tagsAttr) {
      const container = c.querySelector(".tags");
      if (container) {
        container.innerHTML = "";
        tagsAttr.split(",").forEach((tag) => {
          const p = document.createElement("p");
          p.textContent = tag.trim();
          container.appendChild(p);
        });
      }
    }
  });
}

function setLanguage(lang) {
  currentLang = lang;
  document.documentElement.lang = lang;
  const t = translations[lang];

  document.querySelectorAll("[data-i18n]").forEach((el) => {
    const key = el.dataset.i18n;
    if (t[key] !== undefined) el.innerHTML = t[key];
  });

  updateCardGrid(lang);

  requestAnimationFrame(() => {
    min_widths = measureMinWidths();
    if (window.scrollY === 0) {
      for (let i = 0; i < nav_li.length; i++) {
        nav_li[i].style.width = min_widths[i] + 3 + "px";
      }
    }
  });

  document.getElementById("langBtn").textContent =
    lang === "es" ? "Idioma: Español" : "Language: English";
}

document.getElementById("langBtn").addEventListener("click", () => {
  setLanguage(currentLang === "es" ? "en" : "es");
});

// ---- Cargar translations.json e inicializar idioma ----
fetch("translations.json")
  .then((r) => r.json())
  .then((data) => {
    translations = data;
    setLanguage("en");
  });

// ---- Event listeners ----
window.addEventListener("scroll", scroll_changes);
window.addEventListener("load", scroll_changes);
window.addEventListener("scroll", focusWatcher);
window.addEventListener("load", focusWatcher);

projectCards.forEach((c) => {
  const videoSrc = c.dataset.video;
  if (!videoSrc) return;

  const cardImage = c.querySelector(".card-image");
  const preview = document.createElement("video");
  preview.src = videoSrc;
  preview.muted = true;
  preview.loop = true;
  preview.playsInline = true;
  preview.style.cssText =
    "position:absolute;inset:0;width:100%;height:100%;object-fit:cover;z-index:0;opacity:0;transition:opacity 0.4s;";
  cardImage.appendChild(preview);

  c.addEventListener("mouseenter", () => {
    preview.play();
    preview.style.opacity = "1";
  });
  c.addEventListener("mouseleave", () => {
    preview.pause();
    preview.style.opacity = "0";
  });
  c.addEventListener("click", () => cardFocusEffect(c));
});

projectCards.forEach((c) => {
  if (c.dataset.video) return;
  c.addEventListener("click", () => cardFocusEffect(c));
});

cardCont.addEventListener("click", (e) => {
  if (e.target === cardCont) closeCard();
});

swiperPrev.addEventListener("click", (e) => {
  e.stopPropagation();
  goToSlide(currentSlide - 1);
});
swiperNext.addEventListener("click", (e) => {
  e.stopPropagation();
  goToSlide(currentSlide + 1);
});

// ---- Swiper ----

function goToSlide(index) {
  currentSlide = Math.max(0, Math.min(index, totalSlides - 1));
  swiperTrack.style.transform = "translateX(-" + currentSlide * 100 + "%)";
  document.querySelectorAll(".swiper-dot").forEach((d, i) => {
    d.classList.toggle("active", i === currentSlide);
  });
}

function buildSwiper(slides) {
  swiperTrack.innerHTML = "";
  swiperDots.innerHTML = "";
  currentSlide = 0;
  totalSlides = slides.length;

  slides.forEach((s, i) => {
    const div = document.createElement("div");
    div.className = "swiper-slide";

    if (s.type === "image") {
      const img = document.createElement("img");
      img.src = s.src;
      div.appendChild(img);
    } else if (s.type === "video") {
      const video = document.createElement("video");
      video.muted = true;
      video.loop = true;
      video.playsInline = true;
      video.autoplay = true;
      video.style.cssText =
        "width:100%;height:100%;object-fit:contain;display:block;";
      video.src = s.src;
      div.appendChild(video);
      video.load();
      video.play().catch(() => {});
    }

    swiperTrack.appendChild(div);

    const dot = document.createElement("div");
    dot.className = "swiper-dot" + (i === 0 ? " active" : "");
    dot.addEventListener("click", (e) => {
      e.stopPropagation();
      goToSlide(i);
    });
    swiperDots.appendChild(dot);
  });

  const multiple = slides.length > 1;
  swiperPrev.style.display = multiple ? "flex" : "none";
  swiperNext.style.display = multiple ? "flex" : "none";
  swiperDots.style.display = multiple ? "flex" : "none";

  swiperTrack.style.transform = "translateX(0)";
}

// ---- Card focus ----

function cardFocusEffect(c) {
  const langCap = currentLang.charAt(0).toUpperCase() + currentLang.slice(1);
  const titleKey = `i18nTitle${langCap}`;
  const tagsKey = `i18nTags${langCap}`;

  focusTitle.textContent =
    c.dataset[titleKey] ||
    (c.querySelector("h3") ? c.querySelector("h3").textContent.trim() : "");

  cardTags.innerHTML = "";
  const tagsAttr = c.dataset[tagsKey];
  if (tagsAttr) {
    tagsAttr.split(",").forEach((tag) => {
      const p = document.createElement("p");
      p.textContent = tag.trim();
      cardTags.appendChild(p);
    });
  } else {
    c.querySelectorAll(".tags p").forEach((tag) => {
      const p = document.createElement("p");
      p.textContent = tag.textContent;
      cardTags.appendChild(p);
    });
  }

  cardLinks.innerHTML = "";
  c.querySelectorAll(".links a").forEach(({ textContent, href }) => {
    const a = document.createElement("a");
    a.textContent = textContent;
    a.href = href;
    a.target = "_blank";
    cardLinks.appendChild(a);
  });

  const slides = [];
  const imagesAttr = (c.dataset.images || "").trim();
  const videoSrc = (c.dataset.video || "").trim();

  if (imagesAttr) {
    imagesAttr.split(",").forEach((src) => {
      if (src.trim()) slides.push({ type: "image", src: src.trim() });
    });
  }
  if (videoSrc) slides.push({ type: "video", src: videoSrc });

  buildSwiper(slides);
  cardCont.style.display = "flex";
}

function closeCard() {
  cardCont.style.display = "none";
  swiperTrack.querySelectorAll("video").forEach((v) => {
    v.pause();
    v.src = "";
  });
  swiperTrack.innerHTML = "";
  cardTags.innerHTML = "";
  cardLinks.innerHTML = "";
  focusTitle.textContent = "";
}

// ---- Nav focus watcher ----

function focusWatcher() {
  if (window.scrollY < 500) {
    clearFocus();
    nav_li[0].classList.add("focus");
  } else if (window.scrollY < 800) {
    clearFocus();
    nav_li[1].classList.add("focus");
  } else if (window.scrollY < 2600) {
    clearFocus();
    nav_li[2].classList.add("focus");
  } else if (window.scrollY < 3500) {
    clearFocus();
    nav_li[3].classList.add("focus");
  } else {
    clearFocus();
    nav_li[4].classList.add("focus");
  }
}

function clearFocus() {
  for (let i = 0; i < nav_li.length; i++) {
    nav_li[i].classList.remove("focus");
    nav_a[i].classList.remove("a-focus");
  }
}

// ---- Scroll changes ----

function scroll_changes() {
  if (window.scrollY > 0) {
    for (let section of sections) section.classList.add("scrolled");
    for (let li of nav_li) {
      li.classList.add("li_scrolled");
      li.classList.remove("out_scrolled");
      li.style.width = li.scrollWidth + "px";
      li.offsetWidth; // force reflow para disparar la transición
      li.style.width = "250px";
    }
    for (let h of h2s) h.classList.add("scrolled");
  } else {
    for (let section of sections) section.classList.remove("scrolled");
    for (let i = 0; i < min_widths.length; i++) {
      const li = nav_li[i];
      li.classList.remove("li_scrolled");
      li.classList.add("out_scrolled");
      li.offsetWidth; // force reflow
      li.style.width = min_widths[i] + 3 + "px";
    }
    for (let h of h2s) h.classList.remove("scrolled");
  }
}
