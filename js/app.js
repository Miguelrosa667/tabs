document.addEventListener("DOMContentLoaded", () => {
  const tabsNav = document.getElementById("tabs");
  const tabButtons = Array.from(document.querySelectorAll(".tab-btn"));
  const indicator = document.getElementById("tab-indicator");
  const panels = Array.from(document.querySelectorAll(".tab-panel"));

  function moveIndicatorTo(btn) {
    const navRect = tabsNav.getBoundingClientRect();
    const btnRect = btn.getBoundingClientRect();

    indicator.style.width = `${btnRect.width}px`;
    indicator.style.transform = `translateX(${btnRect.left - navRect.left}px)`;
  }

  function activateTab(tabName) {
    tabButtons.forEach((btn) => {
      btn.classList.toggle("active", btn.dataset.tab === tabName);
    });

    panels.forEach((panel) => {
      const isTarget = panel.id === `panel-${tabName}`;
      panel.classList.toggle("active", isTarget);
      if (isTarget) {
        panel.style.animation = "none";
        void panel.offsetWidth;
        panel.style.animation = "";
      }
    });

    const activeBtn = tabButtons.find((b) => b.dataset.tab === tabName);
    if (activeBtn) moveIndicatorTo(activeBtn);
  }

  tabButtons.forEach((btn) => {
    btn.addEventListener("click", () => activateTab(btn.dataset.tab));
  });

  window.addEventListener("load", () => {
    const active = tabButtons.find((b) => b.classList.contains("active"));
    moveIndicatorTo(active);
  });
  window.addEventListener("resize", () => {
    const active = tabButtons.find((b) => b.classList.contains("active"));
    moveIndicatorTo(active);
  });

  const textBlock = document.getElementById("text-block");
  const stackInner = document.getElementById("image-stack-inner");
  const scrollThumb = document.getElementById("scroll-thumb");
  const mediaCol = document.querySelector(".media-col");

  if (textBlock && stackInner && scrollThumb && mediaCol) {
    let ticking = false;

    function updateGalleryScroll() {
      const textRect = textBlock.getBoundingClientRect();
      const windowHeight = window.innerHeight;

      const frameHeight = mediaCol.getBoundingClientRect().height;
      const stackHeight = stackInner.getBoundingClientRect().height;
      const maxTranslate = Math.max(stackHeight - frameHeight, 0);

      const totalScrollable = textRect.height - windowHeight;
      let progress = 0;

      if (totalScrollable > 0) {
        progress = (-textRect.top) / totalScrollable;
      }
      progress = Math.min(Math.max(progress, 0), 1);

      stackInner.style.transform = `translateY(-${progress * maxTranslate}px)`;

      const trackHeight = frameHeight;
      const thumbHeight = Math.max((frameHeight / stackHeight) * trackHeight, 24);
      const thumbTravel = trackHeight - thumbHeight;

      scrollThumb.style.height = `${thumbHeight}px`;
      scrollThumb.style.transform = `translateY(${progress * thumbTravel}px)`;

      ticking = false;
    }

    function onScrollOrResize() {
      if (!ticking) {
        requestAnimationFrame(updateGalleryScroll);
        ticking = true;
      }
    }

    window.addEventListener("scroll", onScrollOrResize, { passive: true });
    window.addEventListener("resize", onScrollOrResize);
    window.addEventListener("load", updateGalleryScroll);

    updateGalleryScroll();

    const imgs = stackInner.querySelectorAll("img");
    imgs.forEach((img) => {
      if (!img.complete) {
        img.addEventListener("load", updateGalleryScroll);
      }
    });
  }

  const faqItems = document.querySelectorAll(".faq-item");
  faqItems.forEach((item) => {
    const question = item.querySelector(".faq-question");
    question.addEventListener("click", () => {
      const isOpen = item.classList.contains("open");
      faqItems.forEach((i) => i.classList.remove("open"));
      if (!isOpen) item.classList.add("open");
    });
  });

  const form = document.getElementById("contact-form");
  const feedback = document.getElementById("form-feedback");

  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      feedback.textContent = "Mensagem enviada com sucesso! Em breve entraremos em contato.";
      form.reset();
      setTimeout(() => (feedback.textContent = ""), 4000);
    });
  }
});