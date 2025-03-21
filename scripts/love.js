// Set today's date
document.getElementById(
  "date"
).innerText = `Today is ${new Date().toLocaleDateString("ro-RO")}!`;

// Create floating hearts and flowers
function createFloatingElement(type) {
  const container = document.querySelector(
    type === "heart" ? ".hearts-container" : ".flowers-container"
  );
  const element = document.createElement("div");
  element.classList.add(type);
  element.style.left = Math.random() * 90 + "vw";

  container.appendChild(element);

  setTimeout(() => {
    element.remove();
  }, 5000);
}

// Generate elements periodically
setInterval(() => {
  createFloatingElement("heart");
  createFloatingElement("flower");
}, 500);
