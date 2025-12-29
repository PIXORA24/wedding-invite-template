// ================= URL + EVENT =================
const params = new URLSearchParams(window.location.search);
const eventKey = params.get("event");

if (!eventKey || !INVITE_DATA.events[eventKey]) {
  document.body.innerHTML = "Invalid event";
  throw new Error("Invalid event");
}

const event = INVITE_DATA.events[eventKey];

// ================= ELEMENTS =================
const video = document.getElementById("inviteVideo");
const music = document.getElementById("inviteMusic");
const overlay = document.getElementById("tapOverlay");
const countdownEl = document.getElementById("countdown");
const mapLink = document.getElementById("mapLink");
const calendarLink = document.getElementById("calendarLink");

// ================= MEDIA =================
video.src = event.path + "video.mp4";
video.poster = event.path + "bg.jpg";
music.src = event.path + "music.mp3";
mapLink.href = event.mapLink;

// ================= COUNTDOWN =================
const eventTime = new Date(event.dateTimeISO).getTime();

function updateCountdown() {
  const diff = eventTime - Date.now();

  if (diff <= 0) {
    countdownEl.textContent = "The celebration has begun ✨";
    return;
  }

  const days = Math.floor(diff / 86400000);
  const hours = Math.floor((diff / 3600000) % 24);
  const minutes = Math.floor((diff / 60000) % 60);

  countdownEl.textContent =
    `${days} days · ${hours} hours · ${minutes} minutes`;
}

updateCountdown();
setInterval(updateCountdown, 60000);

// ================= CALENDAR =================
const startISO = event.dateTimeISO.replace(/[-:]/g, "").split(".")[0];

calendarLink.href =
  `https://www.google.com/calendar/render?action=TEMPLATE` +
  `&text=${encodeURIComponent(event.label)}` +
  `&dates=${startISO}/${startISO}` +
  `&location=${encodeURIComponent(event.venue)}`;

// ================= TAP-TO-START (SINGLE SOURCE OF TRUTH) =================
overlay.addEventListener("click", async () => {
  try {
    await video.play();
    await music.play();

    overlay.classList.add("hide");
    document.documentElement.classList.add("ui-visible");

    setTimeout(() => {
      overlay.remove();
    }, 700);

  } catch (err) {
    console.error("Playback failed:", err);
  }
});

