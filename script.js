const filterButtons = document.querySelectorAll(".filter");
const guideCards = document.querySelectorAll(".guide-card");

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
