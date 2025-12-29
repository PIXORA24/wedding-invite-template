// Read event key from URL
const params = new URLSearchParams(window.location.search);
const eventKey = params.get("event");

// Safety check
if (!eventKey || !INVITE_DATA.events[eventKey]) {
  document.body.innerHTML = "Invalid or missing event";
  throw new Error("Invalid event");
}

const event = INVITE_DATA.events[eventKey];

// Inject title
document.getElementById("eventTitle").innerText = event.label;

// Video
const video = document.getElementById("inviteVideo");
video.src = event.path + "video.mp4";
video.poster = event.path + "bg.jpg";

// Music
const music = document.getElementById("inviteMusic");
music.src = event.path + "music.mp3";

// Map
const mapLink = document.getElementById("mapLink");
mapLink.href = event.mapLink;
