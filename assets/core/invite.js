const params = new URLSearchParams(window.location.search);
const eventKey = params.get("event");

if (!eventKey || !INVITE_DATA.events[eventKey]) {
  document.body.innerHTML = "Invalid event";
  throw new Error("Invalid event");
}

const event = INVITE_DATA.events[eventKey];

// Elements
const video = document.getElementById("inviteVideo");
const music = document.getElementById("inviteMusic");
const overlay = document.getElementById("tapOverlay");
const countdownEl = document.getElementById("countdown");
const mapLink = document.getElementById("mapLink");
const calendarLink = document.getElementById("calendarLink");

// Media
video.src = event.path + "video.mp4";
video.poster = event.path + "bg.jpg";
music.src = event.path + "music.mp3";
mapLink.href = event.mapLink;

// ---------------- Countdown (alive) ----------------
const eventTime = new Date(event.dateTimeISO).getTime();

function updateCountdown() {
  const diff = eventTime - Date.now();

  if (diff <= 0) {
    countdownEl.textContent = "The celebration has begun ✨";
    return;
  }

  const d = Math.floor(diff / 86400000);
  const h = Math.floor((diff / 3600000) % 24);
  const m = Math.floor((diff / 60000) % 60);
  const s = Math.floor((diff / 1000) % 60);

  countdownEl.textContent =
    `${d}d ${h}h ${m}m ${s}s to go`;
}

updateCountdown();
setInterval(updateCountdown, 1000);

// ---------------- Calendar ----------------
const startISO = event.dateTimeISO.replace(/[-:]/g, "").split(".")[0];
calendarLink.href =
  `https://www.google.com/calendar/render?action=TEMPLATE` +
  `&text=${encodeURIComponent(event.label)}` +
  `&dates=${startISO}/${startISO}` +
  `&location=${encodeURIComponent(event.venue)}`;

// ---------------- Autoplay logic ----------------
async function startInvite() {
  try {
    await video.play();
    await music.play();
    overlay.remove();
    document.documentElement.classList.add("ui-visible");
  } catch {
    overlay.style.display = "flex";
  }
}

overlay.addEventListener("click", startInvite);

window.addEventListener("DOMContentLoaded", () => {
  overlay.style.display = "none";
  startInvite();
});
