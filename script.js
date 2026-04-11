// Smooth scroll for nav links
document.querySelectorAll("nav ul li a").forEach(link => {
  link.addEventListener("click", e => {
    e.preventDefault();
    document.querySelector(link.getAttribute("href"))
      .scrollIntoView({ behavior: "smooth" });
  });
});

// Contact form handler
document.getElementById("contactForm").addEventListener("submit", e => {
  e.preventDefault();
  const name = document.getElementById("name").value;
  document.getElementById("formStatus").textContent =
    `Thanks, ${name}! I’ll get back to you soon.`;
  e.target.reset();
});