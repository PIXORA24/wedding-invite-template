const events = INVITE_DATA.events;

// Filter only enabled events
const enabledEvents = Object.entries(events)
  .filter(([_, event]) => event.enabled);

// Scenario 1: Only one event → auto redirect
if (enabledEvents.length === 1) {
  const [eventKey] = enabledEvents[0];
  window.location.replace(`invite.html?event=${eventKey}`);
}

// Scenario 2: Multiple events → show selector
const grid = document.getElementById("eventGrid");

enabledEvents.forEach(([key, event]) => {
  const card = document.createElement("div");
  card.style.margin = "20px";
  card.style.cursor = "pointer";

  card.innerHTML = `
    <img src="${event.path}preview.jpg?v=1" style="width:240px; display:block;">
    <div style="text-align:center; margin-top:8px; font-size:18px;">
      ${event.label}
    </div>
  `;

  card.onclick = () => {
    window.location.href = `invite.html?event=${key}`;
  };

  grid.appendChild(card);
});

