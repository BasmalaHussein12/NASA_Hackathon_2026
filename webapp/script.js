/* =========================
   THREE.JS - 3D EARTH
========================= */

import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.180.0/build/three.module.js";

// 1. Canvas and container
const canvas = document.querySelector("#earth-canvas");
const container = document.querySelector(".planet-container");

// Make sure the Earth elements exist
if (canvas && container) {
  // 2. Scene
  const scene = new THREE.Scene();

  // 3. Camera
  const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
  camera.position.z = 3.5;

  // 4. Renderer
  const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    alpha: true,
    antialias: true,
  });

  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.25;

  // 5. Lighting
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.45);
  scene.add(ambientLight);

  const sunlight = new THREE.DirectionalLight(0xffffff, 3.2);
  sunlight.position.set(-3, 2, 4);
  scene.add(sunlight);

  // Soft blue fill light
  const blueLight = new THREE.PointLight(0x287bff, 1.2);
  blueLight.position.set(3, -2, 2);
  scene.add(blueLight);

  // 6. Load Earth textures
  const textureLoader = new THREE.TextureLoader();

  const earthTexture = textureLoader.load(
    "https://threejs.org/examples/textures/planets/earth_atmos_2048.jpg"
  );

  const normalTexture = textureLoader.load(
    "https://threejs.org/examples/textures/planets/earth_normal_2048.jpg"
  );

  earthTexture.colorSpace = THREE.SRGBColorSpace;

  // 7. Earth sphere
  const earthGeometry = new THREE.SphereGeometry(1.15, 96, 96);

  const earthMaterial = new THREE.MeshStandardMaterial({
    map: earthTexture,
    normalMap: normalTexture,
    color: 0xffffff,
    roughness: 0.9,
    metalness: 0,
  });

  const earth = new THREE.Mesh(earthGeometry, earthMaterial);
  scene.add(earth);

  // 8. Blue atmosphere
  const atmosphereGeometry = new THREE.SphereGeometry(1.22, 96, 96);

  const atmosphereMaterial = new THREE.ShaderMaterial({
    vertexShader: `
      varying vec3 vNormal;

      void main() {
        vNormal = normalize(normalMatrix * normal);
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,

    fragmentShader: `
      varying vec3 vNormal;

      void main() {
        float intensity = pow(
          0.7 - dot(normalize(vNormal), vec3(0.0, 0.0, 1.0)),
          3.0
        );

        intensity = max(intensity, 0.0);

        gl_FragColor = vec4(0.15, 0.45, 1.0, 1.0) * intensity;
      }
    `,

    blending: THREE.AdditiveBlending,
    side: THREE.BackSide,
    transparent: true,
    depthWrite: false,
  });

  const atmosphere = new THREE.Mesh(atmosphereGeometry, atmosphereMaterial);

  scene.add(atmosphere);

  // 9. Mouse interaction
  let mouseX = 0;
  let mouseY = 0;

  let smoothMouseX = 0;
  let smoothMouseY = 0;

  window.addEventListener("mousemove", (event) => {
    mouseX = (event.clientX / window.innerWidth - 0.5) * 2;
    mouseY = (event.clientY / window.innerHeight - 0.5) * 2;
  });

  // 10. Responsive resizing
  function resizeGlobe() {
    const width = container.clientWidth;
    const height = container.clientHeight;

    if (width === 0 || height === 0) return;

    camera.aspect = width / height;
    camera.updateProjectionMatrix();

    renderer.setSize(width, height);
  }

  resizeGlobe();
  window.addEventListener("resize", resizeGlobe);

  // 11. Animation
  function animate() {
    requestAnimationFrame(animate);

    // Smooth mouse movement
    smoothMouseX += (mouseX - smoothMouseX) * 0.025;
    smoothMouseY += (mouseY - smoothMouseY) * 0.025;

    // Continuous Earth rotation
    earth.rotation.y += 0.0018;

    // Mouse-controlled tilt
    earth.rotation.y += smoothMouseX * 0.0008;
    earth.rotation.x = smoothMouseY * 0.12;

    // Keep atmosphere aligned with Earth
    atmosphere.rotation.copy(earth.rotation);

    renderer.render(scene, camera);
  }

  animate();
}

/* =========================
   PROFILE DROPDOWN
========================= */

const profileToggle = document.querySelector("#profile-toggle");
const profileDropdown = document.querySelector("#profile-dropdown");

// Check that the Profile elements exist
if (profileToggle && profileDropdown) {
  // Open and close dropdown
  profileToggle.addEventListener("click", () => {
    const isOpen = profileToggle.getAttribute("aria-expanded") === "true";

    profileToggle.setAttribute("aria-expanded", String(!isOpen));

    profileDropdown.hidden = isOpen;
  });

  // Close when clicking outside
  document.addEventListener("click", (event) => {
    if (!event.target.closest(".profile-menu")) {
      profileDropdown.hidden = true;

      profileToggle.setAttribute("aria-expanded", "false");
    }
  });

  // Close with Escape key
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      profileDropdown.hidden = true;

      profileToggle.setAttribute("aria-expanded", "false");
    }
  });
}

/* =========================
   DESTINATION SELECTION
========================= */

const destinationCards = document.querySelectorAll(
  ".destination-card:not(.coming-soon)"
);
const destinationMessage = document.querySelector("#destination-message");

destinationCards.forEach((card) => {
  card.addEventListener("click", () => {
    // Remove selection from all cards
    destinationCards.forEach((item) => {
      item.classList.remove("selected");
    });

    // Select clicked card
    card.classList.add("selected");

    // Get selected destination
    const destination = card.dataset.destination;

    // Update message
    destinationMessage.textContent = `${destination} selected! Opening the Analog Discovery Engine...`;

    destinationMessage.classList.add("active");

    // Continue to the second website (Analog Discovery Engine)
    setTimeout(() => {
      window.location.href = "engine.html";
    }, 900);
  });
});

// ===================================
// STATIC 3D MOON
// ===================================

function createPlanet(canvasId, textureURL) {
  const canvas = document.querySelector(`#${canvasId}`);

  if (!canvas) return;

  const container = canvas.parentElement;

  // Scene
  const scene = new THREE.Scene();

  // Camera
  const camera = new THREE.PerspectiveCamera(
    45,
    container.clientWidth / container.clientHeight,
    0.1,
    100
  );

  camera.position.z = 3.2;

  // Renderer
  const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    alpha: true,
    antialias: true,
  });

  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(container.clientWidth, container.clientHeight);
  renderer.outputColorSpace = THREE.SRGBColorSpace;

  // Texture
  const textureLoader = new THREE.TextureLoader();

  textureLoader.load(
    textureURL,
    (texture) => {
      texture.colorSpace = THREE.SRGBColorSpace;

      // Sphere geometry
      const geometry = new THREE.SphereGeometry(0.95, 64, 64);

      // Planet material
      const material = new THREE.MeshStandardMaterial({
        map: texture,
        roughness: 1,
        metalness: 0,
      });

      const planet = new THREE.Mesh(geometry, material);

      // Fixed orientation (no rotation)
      planet.rotation.y = -0.4;

      scene.add(planet);

      renderer.render(scene, camera);
    },
    undefined,
    (error) => {
      console.error(`Texture loading failed for ${canvasId}:`, error);
    }
  );

  // Lighting
  const ambientLight = new THREE.AmbientLight(0xffffff, 1.2);
  scene.add(ambientLight);

  const directionalLight = new THREE.DirectionalLight(0xffffff, 2);
  directionalLight.position.set(3, 2, 4);
  scene.add(directionalLight);

  // Resize
  window.addEventListener("resize", () => {
    const width = container.clientWidth;
    const height = container.clientHeight;

    camera.aspect = width / height;
    camera.updateProjectionMatrix();

    renderer.setSize(width, height);
    renderer.render(scene, camera);
  });
}

// Moon texture
createPlanet(
  "moon-canvas",
  "https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/moon_1024.jpg"
);

// Mars texture (card is display-only: "Coming Soon")
createPlanet(
  "mars-canvas",
  "https://upload.wikimedia.org/wikipedia/commons/thumb/4/46/Solarsystemscope_texture_2k_mars.jpg/1920px-Solarsystemscope_texture_2k_mars.jpg"
);
