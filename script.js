// Simple form handler
document.getElementById("contactForm").addEventListener("submit", function(e) {
  e.preventDefault();

  const name = document.getElementById("name").value;
  const email = document.getElementById("email").value;
  const message = document.getElementById("message").value;

  // For now, just show a success message
  document.getElementById("formStatus").textContent =
    `Thanks, ${name}! Your message has been received.`;

  // Clear form
  document.getElementById("contactForm").reset();
});