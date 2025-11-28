// frontend/script.js

const API_BASE = "";

// Countdown
const weddingDate = new Date("2026-02-14T00:00:00");
function updateCountdown() {
  const el = document.getElementById("countdown");
  if (!el) return;
  const now = new Date();
  const diff = weddingDate - now;
  if (diff <= 0) {
    el.textContent = "It's the big day! 💍";
    return;
  }
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const mins = Math.floor((diff / (1000 * 60)) % 60);
  el.textContent = `${days} days ${hours} hrs ${mins} mins to go`;
}
updateCountdown();
setInterval(updateCountdown, 60 * 1000);

// Fade-up on scroll
const fades = document.querySelectorAll(".fade-up");
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) {
        e.target.classList.add("in-view");
        observer.unobserve(e.target);
      }
    });
  },
  { threshold: 0.2 }
);
fades.forEach((el) => observer.observe(el));

// Dummy music toggle
const musicToggle = document.getElementById("musicToggle");
if (musicToggle) {
  let playing = false;
  musicToggle.addEventListener("click", () => {
    playing = !playing;
    musicToggle.textContent = playing ? "🔊" : "♪";
  });
}

// RSVP submit
const rsvpForm = document.getElementById("rsvpForm");
const rsvpStatus = document.getElementById("rsvpStatus");

if (rsvpForm) {
  rsvpForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    rsvpStatus.textContent = "Submitting...";
    const name = document.getElementById("rsvpName").value.trim();
    const phone = document.getElementById("rsvpPhone").value.trim();
    const email = document.getElementById("rsvpEmail").value.trim();
    const attendingVal = document.getElementById("rsvpAttending").value;
    const guestsCount = Number(document.getElementById("rsvpGuests").value || 1);
    const message = document.getElementById("rsvpMessage").value.trim();

    if (!name || attendingVal === "") {
      rsvpStatus.textContent = "Please fill name and attending.";
      return;
    }
    const attending = attendingVal === "yes";

    try {
      const res = await fetch(`${API_BASE}/api/rsvp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, phone, email, attending, guestsCount, message }),
      });
      const data = await res.json();
      if (res.ok) {
        rsvpStatus.textContent = "Thank you! Your RSVP has been saved 🤍";
        rsvpForm.reset();
      } else {
        rsvpStatus.textContent = data.error || "Something went wrong.";
      }
    } catch (err) {
      console.error(err);
      rsvpStatus.textContent = "Server error, please try again later.";
    }
  });
}

// Wishes submit + load
const wishForm = document.getElementById("wishForm");
const wishStatus = document.getElementById("wishStatus");
const wishList = document.getElementById("wishList");

async function loadWishes() {
  if (!wishList) return;
  try {
    const res = await fetch(`${API_BASE}/api/wishes`);
    const data = await res.json();
    wishList.innerHTML = "";
    data.forEach((w) => {
      const card = document.createElement("div");
      card.className = "wish-card fade-up in-view";
      card.innerHTML = `
        <div class="wish-name">${w.name}</div>
        <div class="wish-text">${w.wish}</div>
      `;
      wishList.prepend(card);
    });
  } catch (err) {
    console.error(err);
  }
}
loadWishes();

if (wishForm) {
  wishForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    wishStatus.textContent = "Sending...";
    const name = document.getElementById("wishName").value.trim();
    const wishText = document.getElementById("wishText").value.trim();
    if (!name || !wishText) {
      wishStatus.textContent = "Please fill both fields.";
      return;
    }
    try {
      const res = await fetch(`${API_BASE}/api/wishes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, wish: wishText }),
      });
      const data = await res.json();
      if (res.ok) {
        wishStatus.textContent = "Your blessing has been saved ✨";
        wishForm.reset();
        loadWishes();
      } else {
        wishStatus.textContent = data.error || "Error saving wish.";
      }
    } catch (err) {
      console.error(err);
      wishStatus.textContent = "Server error, please try later.";
    }
  });
}
