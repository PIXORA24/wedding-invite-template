const events = INVITE_DATA.events;

// Filter only enabled events
const enabledEvents = Object.entries(events)
  .filter(([_, event]) => event.enabled);

// If only one event → redirect directly
if (enabledEvents.length === 1) {
  const [eventKey] = enabledEvents[0];
  window.location.replace(`invite.html?event=${eventKey}`);
}

// Multiple events → image-only selector
const grid = document.getElementById("eventGrid");

enabledEvents.forEach(([key, event]) => {
  const card = document.createElement("div");
  card.className = "event-card";

  card.innerHTML = `
    <img src="${event.path}preview.jpg?v=1" alt="">
  `;

  card.onclick = () => {
    window.location.href = `invite.html?event=${key}`;
  };

  grid.appendChild(card);
});
