const filterButtons = document.querySelectorAll(".filter");
const guideCards = document.querySelectorAll(".guide-card");
const countdown = document.querySelector("[data-countdown]");

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const target = button.dataset.filter;

    filterButtons.forEach((item) => item.classList.remove("active"));
    button.classList.add("active");

    guideCards.forEach((card) => {
      const shouldShow = target === "all" || card.dataset.type === target;
      card.classList.toggle("is-hidden", !shouldShow);
    });
  });
});

function updateCountdown() {
  if (!countdown) return;

  const releaseTime = new Date(countdown.dataset.countdown).getTime();
  const now = Date.now();
  const remaining = releaseTime - now;
  const status = document.getElementById("countdownStatus");

  if (remaining <= 0) {
    document.getElementById("days").textContent = "0";
    document.getElementById("hours").textContent = "0";
    document.getElementById("minutes").textContent = "0";
    document.getElementById("seconds").textContent = "0";
    if (status) status.textContent = "The reported release date has arrived. Check official sources for launch status.";
    return;
  }

  const seconds = Math.floor(remaining / 1000);
  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  document.getElementById("days").textContent = days;
  document.getElementById("hours").textContent = String(hours).padStart(2, "0");
  document.getElementById("minutes").textContent = String(minutes).padStart(2, "0");
  document.getElementById("seconds").textContent = String(secs).padStart(2, "0");
}

updateCountdown();
setInterval(updateCountdown, 1000);
