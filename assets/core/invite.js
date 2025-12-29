// Read event key
const params = new URLSearchParams(window.location.search);
const eventKey = params.get("event");

// Safety check
if (!eventKey || !INVITE_DATA.events[eventKey]) {
  document.body.innerHTML = "Invalid or missing event";
  throw new Error("Invalid event");
}

const event = INVITE_DATA.events[eventKey];

// Elements
const video = document.getElementById("inviteVideo");
const music = document.getElementById("inviteMusic");
const overlay = document.getElementById("tapOverlay");
const tapText = document.querySelector(".tapText");
const titleEl = document.getElementById("eventTitle");
const mapLink = document.getElementById("mapLink");
const calendarLink = document.getElementById("calendarLink");
const countdownEl = document.getElementById("countdown");

// Inject event data
titleEl.innerText = event.label;
tapText.innerText = `Tap to View ${event.label} Invitation`;

video.src = event.path + "video.mp4";
video.poster = event.path + "bg.jpg";
music.src = event.path + "music.mp3";

mapLink.href = event.mapLink;

// -----------------------------
// Countdown
// -----------------------------
const eventTime = new Date(event.dateTimeISO).getTime();

function updateCountdown() {
  const now = Date.now();
  const diff = eventTime - now;

  if (diff <= 0) {
    countdownEl.innerText = "The event has started 🎉";
    clearInterval(timer);
    return;
  }

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / (1000 * 60)) % 60);

  countdownEl.innerText =
    `${days} days ${hours} hrs ${minutes} mins to go`;
}

updateCountdown();
const timer = setInterval(updateCountdown, 60000);

// -----------------------------
// Calendar link
// -----------------------------
const startISO = event.dateTimeISO.replace(/[-:]/g, "").split(".")[0];
const endISO = startISO;

calendarLink.href =
  `https://www.google.com/calendar/render?action=TEMPLATE` +
  `&text=${encodeURIComponent(event.label)}` +
  `&dates=${startISO}/${endISO}` +
  `&details=${encodeURIComponent("Invitation")}` +
  `&location=${encodeURIComponent(event.venue)}`;

// -----------------------------
// Overlay helpers
// -----------------------------
function showOverlay() {
  overlay.style.display = "flex";
}

function hideOverlay() {
  overlay.style.opacity = "0";
  setTimeout(() => overlay.remove(), 700);
}

// -----------------------------
// Try autoplay first (KEY LOGIC)
// -----------------------------
async function tryAutoplay() {
  try {
    await video.play();
    await music.play();

    // Autoplay succeeded
    hideOverlay();
    document.documentElement.classList.add("ui-visible");

  } catch (err) {
    // Autoplay blocked
    showOverlay();
  }
}

// -----------------------------
// User tap fallback (GUARANTEED)
// -----------------------------
overlay.addEventListener("click", async () => {
  try {
    await video.play();
    await music.play();

    hideOverlay();
    document.documentElement.classList.add("ui-visible");

  } catch (err) {
    console.log("User gesture failed:", err);
  }
});

// -----------------------------
// Init
// -----------------------------
window.addEventListener("DOMContentLoaded", () => {
  overlay.style.display = "none"; // hidden by default
  tryAutoplay();
});
