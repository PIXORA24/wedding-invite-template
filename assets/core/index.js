const events = INVITE_DATA.events;

// Filter enabled events
const enabledEvents = Object.entries(events).filter(
  ([_, event]) => event.enabled
);

// Auto redirect if only one event
if (enabledEvents.length === 1) {
  const [eventKey] = enabledEvents[0];
  window.location.replace(`invite.html?event=${eventKey}`);
}

// Render selector if multiple events
const grid = document.getElementById("eventGrid");

enabledEvents.forEach(([key, event]) => {
  const card = document.createElement("div");
  card.className = "event-card";

  card.innerHTML = `
    <img src="${event.path}preview.jpg?v=1" alt="${event.label}">
    <div class="event-label">${event.label}</div>
  `;

  card.addEventListener("click", () => {
    window.location.href = `invite.html?event=${key}`;
  });

  grid.appendChild(card);
});
