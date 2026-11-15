// Profile dropdown for pages that don't load script.js (engine.html)
(function () {
  const toggle = document.querySelector("#profile-toggle");
  const dropdown = document.querySelector("#profile-dropdown");
  if (!toggle || !dropdown) return;

  function close() {
    dropdown.hidden = true;
    toggle.setAttribute("aria-expanded", "false");
  }

  toggle.addEventListener("click", () => {
    const isOpen = toggle.getAttribute("aria-expanded") === "true";
    toggle.setAttribute("aria-expanded", String(!isOpen));
    dropdown.hidden = isOpen;
  });

  document.addEventListener("click", (e) => {
    if (!e.target.closest(".profile-menu")) close();
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") close();
  });
})();
