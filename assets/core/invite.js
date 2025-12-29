// -----------------------------
// Read event key
// -----------------------------
const params = new URLSearchParams(window.location.search);
const eventKey = params.get("event");

if (!eventKey || !INVITE_DATA.events[eventKey]) {
  document.body.innerHTML = "Invalid event";
  throw new Error("Invalid event");
}

const event = INVITE_DATA.events[eventKey];

// -----------------------------
// Elements
// -----------------------------
const video = document.getElementById("inviteVideo");
const music = document.getElementById("inviteMusic");
const overlay = document.getElementById("tapOverlay");
const tapText = document.querySelector(".tapText");
const countdownEl = document.getElementById("countdown");
const mapLink = document.getElementById("mapLink");
const calendarLink = document.getElementById("calendarLink");

// -----------------------------
// Media
// -----------------------------
tapText.innerText = `Tap to View Invitation`;

video.src = event.path + "video.mp4";
video.poster = event.path + "bg.jpg";
music.src = event.path + "music.mp3";

mapLink.href = event.mapLink;

// -----------------------------
// Countdown (live, smooth, no jitter)
// -----------------------------
const targetTime = new Date(event.dateTimeISO).getTime();

function updateCountdown() {
  const now = Date.now();
  let diff = targetTime - now;

  if (diff <= 0) {
    countdownEl.textContent = "Event Started";
    return;
  }

  const d = Math.floor(diff / (1000 * 60 * 60 * 24));
  diff %= (1000 * 60 * 60 * 24);
  const h = Math.floor(diff / (1000 * 60 * 60));
  diff %= (1000 * 60 * 60);
  const m = Math.floor(diff / (1000 * 60));
  const s = Math.floor((diff / 1000) % 60);

  countdownEl.textContent =
    `${d} days · ${String(h).padStart(2, "0")} hrs · ` +
    `${String(m).padStart(2, "0")} mins · ${String(s).padStart(2, "0")} secs`;
}

updateCountdown();
setInterval(updateCountdown, 1000);

// -----------------------------
// Calendar link
// -----------------------------
const startISO = event.dateTimeISO.replace(/[-:]/g, "").split(".")[0];

calendarLink.href =
  `https://www.google.com/calendar/render?action=TEMPLATE` +
  `&text=${encodeURIComponent(event.label)}` +
  `&dates=${startISO}/${startISO}` +
  `&details=${encodeURIComponent("Wedding Invitation")}` +
  `&location=${encodeURIComponent(event.venue)}`;

// -----------------------------
// Tap to start (single source of truth)
// -----------------------------
overlay.addEventListener("click", async () => {
  try {
    await video.play();
    await music.play();

    overlay.style.opacity = "0";
    setTimeout(() => overlay.remove(), 500);

    document.documentElement.classList.add("ui-visible");
  } catch (e) {
    console.log("Playback blocked:", e);
  }
});
