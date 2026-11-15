// Draggable sidebar width (left panel <-> map)
(function () {
  const handle = document.getElementById("sidebarResizer");
  if (!handle) return;

  const root = document.documentElement;
  const DEFAULT_W = 460;
  const MIN_W = 320;
  const KEY = "sm-sidebar-width";

  const maxW = () => Math.max(MIN_W, Math.min(window.innerWidth * 0.7, window.innerWidth - 300));
  const clamp = (w) => Math.round(Math.min(maxW(), Math.max(MIN_W, w)));

  function refreshMap() {
    if (typeof state !== "undefined" && state.map) state.map.invalidateSize();
  }

  function setWidth(w, save) {
    w = clamp(w);
    root.style.setProperty("--sidebar-width", w + "px");
    handle.setAttribute("aria-valuenow", String(w));
    if (save) {
      try { localStorage.setItem(KEY, String(w)); } catch (e) {}
    }
    refreshMap();
  }

  // restore saved width
  try {
    const saved = parseInt(localStorage.getItem(KEY), 10);
    if (saved) setWidth(saved, false);
  } catch (e) {}

  handle.setAttribute("aria-valuemin", String(MIN_W));

  // --- mouse / touch / pen drag ---
  let startX = 0;
  let startW = 0;

  handle.addEventListener("pointerdown", (e) => {
    startX = e.clientX;
    startW = document.querySelector(".sidebar-panel").getBoundingClientRect().width;
    handle.setPointerCapture(e.pointerId);
    handle.classList.add("dragging");
    document.body.classList.add("is-resizing");
    e.preventDefault();
  });

  handle.addEventListener("pointermove", (e) => {
    if (!handle.hasPointerCapture(e.pointerId)) return;
    setWidth(startW + (e.clientX - startX), false);
  });

  function endDrag(e) {
    if (!handle.hasPointerCapture(e.pointerId)) return;
    handle.releasePointerCapture(e.pointerId);
    handle.classList.remove("dragging");
    document.body.classList.remove("is-resizing");
    setWidth(document.querySelector(".sidebar-panel").getBoundingClientRect().width, true);
  }
  handle.addEventListener("pointerup", endDrag);
  handle.addEventListener("pointercancel", endDrag);

  // double-click -> reset
  handle.addEventListener("dblclick", () => setWidth(DEFAULT_W, true));

  // keyboard: arrows resize
  handle.addEventListener("keydown", (e) => {
    const cur = document.querySelector(".sidebar-panel").getBoundingClientRect().width;
    const step = e.shiftKey ? 60 : 20;
    if (e.key === "ArrowLeft") { setWidth(cur - step, true); e.preventDefault(); }
    if (e.key === "ArrowRight") { setWidth(cur + step, true); e.preventDefault(); }
  });

  // keep within limits when the window changes
  window.addEventListener("resize", () => {
    const cur = document.querySelector(".sidebar-panel").getBoundingClientRect().width;
    if (window.innerWidth > 960) setWidth(cur, false);
  });
})();
