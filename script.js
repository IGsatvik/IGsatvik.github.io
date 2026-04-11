// Typing animation
const typingText = document.querySelector(".typing");
const words = ["Innovator", "Coder", "Dreamer", "Builder"];
let i = 0;
setInterval(() => {
  typingText.textContent = words[i] + " | Satvik";
  i = (i + 1) % words.length;
}, 2000);

// Smooth scroll
document.querySelectorAll("nav ul li a").forEach(link => {
  link.addEventListener("click", e => {
    e.preventDefault();
    document.querySelector(link.getAttribute("href"))
      .scrollIntoView({ behavior: "smooth" });
  });
});

// Fade-in on scroll
const faders = document.querySelectorAll(".fade-in");
window.addEventListener("scroll", () => {
  faders.forEach(el => {
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight - 100) {
      el.classList.add("visible");
    }
  });
});

// Contact form
document.getElementById("contactForm").addEventListener("submit", e => {
  e.preventDefault();
  const name = document.getElementById("name").value;
  document.getElementById("formStatus").textContent =
    `Thanks, ${name}! Your message has been sent.`;
  e.target.reset();
});
