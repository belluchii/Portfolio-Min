let sections = document.querySelectorAll("main section");
let nav_li = document.querySelectorAll("nav ul li");
let nav_a = document.querySelectorAll("nav ul li a");
let nav = document.querySelector("nav");
let h2s = document.querySelectorAll("h2");
let card = document.querySelector(".card-cont");
let cardH3 = document.querySelector(".card-focus-text h3");
let cardTags = document.querySelector(".card-focus-text .focus-tags");
let cardLinks = document.querySelector(".card-focus-text .focus-links");
let projectCards = document.querySelectorAll(".project-card");

const min_widths = Array.from(nav_li).map((li) => {
  let span = li.querySelector("a span");
  span.style.display = "block";
  li.style.transition = "0";
  nav.style.display = "block";
  let width = li.scrollWidth;
  span.style.display = "";
  nav.style.display = "";
  li.style.transition = "";
  return width;
});

window.addEventListener("scroll", scroll_changes);
window.addEventListener("load", scroll_changes);

window.addEventListener("scroll", focusWatcher);
window.addEventListener("load", focusWatcher);

projectCards.forEach((c) =>
  c.addEventListener("click", () => cardFocusEffect(c)),
);

card.addEventListener("click", closeCard);

function cardFocusEffect(c) {
  card.style.display = "flex";
  cardH3.textContent = c.querySelector("h3").textContent;
  c.querySelectorAll(".tags p").forEach((tag) => {
    cardTags.appendChild(tag.cloneNode(true));
  });
  c.querySelectorAll(".links a").forEach((link) => {
    cardLinks.appendChild(link.cloneNode(true));
  });
}

function closeCard() {
  card.style.display = "none";
  cardTags.innerHTML = "";
  cardLinks.innerHTML = "";
}

function focusWatcher() {
  if (window.scrollY < 500) {
    clearFocus();
    nav_li[0].classList.add("focus");
  } else if (window.scrollY < 800) {
    clearFocus();
    nav_li[1].classList.add("focus");
  } else if (window.scrollY < 1900) {
    clearFocus();
    nav_li[2].classList.add("focus");
  } else if (window.scrollY < 2450) {
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

function scroll_changes() {
  if (window.scrollY > 0) {
    for (let section of sections) {
      section.classList.add("scrolled");
    }
    for (let li of nav_li) {
      li.classList.add("li_scrolled");
      li.classList.remove("out_scrolled");
      li.style.width = li.scrollWidth + "px";
      li.offsetWidth;
      li.style.width = "250px";
    }
    for (let h of h2s) {
      h.classList.add("scrolled");
    }
  } else {
    for (let section of sections) {
      section.classList.remove("scrolled");
    }
    for (let i = 0; i < min_widths.length; i++) {
      const li = nav_li[i];
      li.classList.remove("li_scrolled");
      li.classList.add("out_scrolled");
      li.offsetWidth;
      li.style.width = min_widths[i] + 3 + "px";
    }
    for (let h of h2s) {
      h.classList.remove("scrolled");
    }
  }
}
