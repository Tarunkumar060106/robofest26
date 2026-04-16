import gsap from "https://cdn.jsdelivr.net/npm/gsap@3.12.5/+esm";
import { ScrollTrigger } from "https://cdn.jsdelivr.net/npm/gsap@3.12.5/ScrollTrigger/+esm";

gsap.registerPlugin(ScrollTrigger);

const HERO_STATE_KEY = "__robofestHeroScriptState";

if (window[HERO_STATE_KEY]?.cleanup) {
  window[HERO_STATE_KEY].cleanup();
}

const animatedIcons = document.querySelector(".animated-icons");
const iconElements = document.querySelectorAll(".animated-icon");
const textSegments = document.querySelectorAll(".text-segment");
const placeholders = document.querySelectorAll(".placeholder-icon");
const heroHeader = document.querySelector(".hero-header");
const heroSection = document.querySelector(".hero-section, .hero");

if (
  !animatedIcons ||
  !heroHeader ||
  !heroSection ||
  iconElements.length === 0
) {
  throw new Error("Animation init failed: required DOM elements are missing.");
}

const textAnimationOrder = [];

textSegments.forEach((segment, index) => {
  textAnimationOrder.push({ segment, originalIndex: index });
});

for (let i = textAnimationOrder.length - 1; i > 0; i--) {
  const j = Math.floor(Math.random() * (i + 1));
  [textAnimationOrder[i], textAnimationOrder[j]] = [
    textAnimationOrder[j],
    textAnimationOrder[i],
  ];
}

const isMobile = window.innerWidth <= 1000;
const headerIconSize = isMobile ? 30 : 60;
const currentIconSize = iconElements[0].getBoundingClientRect().width;
const exactScale = headerIconSize / currentIconSize;
let centerStopY = 0;

const measureCenterStop = () => {
  // Reset transform before measuring so refresh/reload from mid-page remains stable.
  gsap.set(animatedIcons, { x: 0, y: 0, scale: 1 });
  const rect = animatedIcons.getBoundingClientRect();
  centerStopY = window.innerHeight / 2 - (rect.top + rect.height / 2);
};

const clearDuplicateIcons = () => {
  if (window.duplicateIcons) {
    window.duplicateIcons.forEach((duplicate) => {
      if (duplicate?.parentNode) {
        duplicate.parentNode.removeChild(duplicate);
      }
    });
    window.duplicateIcons = null;
  }
};

measureCenterStop();

const handleResize = () => {
  measureCenterStop();
  ScrollTrigger.refresh();
};

window.addEventListener("resize", handleResize);

const applyProgressState = (progress) => {
  textSegments.forEach((segment) => {
    gsap.set(segment, { opacity: 0 });
  });

  if (progress <= 0.3) {
    const moveProgress = progress / 0.3;
    const containerMoveY = centerStopY * moveProgress;

    if (progress <= 0.15) {
      const headerProgress = moveProgress / 0.15;
      const headerMoveY = -50 * headerProgress;
      const headerOpacity = 1 - headerProgress;

      gsap.set(heroHeader, {
        transform: `translate(-50%, calc(-50% + ${headerMoveY}px))`,
        opacity: headerOpacity,
      });
    } else {
      gsap.set(heroHeader, {
        transform: `translate(-50%, calc(-50% + -50px))`,
        opacity: 0,
      });
    }

    clearDuplicateIcons();

    gsap.set(animatedIcons, {
      x: 0,
      y: containerMoveY,
      scale: 1,
      opacity: 1,
    });

    iconElements.forEach((icon, index) => {
      const staggerDelay = index * 0.1;
      const iconStart = staggerDelay;
      const iconEnd = staggerDelay + 0.5;

      const iconProgress = gsap.utils.mapRange(
        iconStart,
        iconEnd,
        0,
        1,
        moveProgress,
      );
      const clampedProgress = Math.min(Math.max(iconProgress, 0), 1);

      const startOffset = -containerMoveY;
      const individualY = startOffset * (1 - clampedProgress);

      gsap.set(icon, {
        x: 0,
        y: individualY,
      });
    });
    return;
  }

  if (progress <= 0.6) {
    const scaleProgress = (progress - 0.3) / 0.3;

    gsap.set(heroHeader, {
      transform: `translate(-50%, calc(-50% + -50px))`,
      opacity: 0,
    });

    if (scaleProgress >= 0.5) {
      heroSection.style.backgroundColor = "#e3e3e3";
    } else {
      heroSection.style.backgroundColor = "#141414";
    }

    clearDuplicateIcons();

    const currentScale = 1 + (exactScale - 1) * scaleProgress;

    gsap.set(animatedIcons, {
      x: 0,
      y: centerStopY,
      scale: currentScale,
      opacity: 1,
    });

    iconElements.forEach((icon) => {
      gsap.set(icon, {
        x: 0,
        y: 0,
      });
    });
    return;
  }

  if (progress <= 0.75) {
    const moveProgress = (progress - 0.6) / 0.15;

    gsap.set(heroHeader, {
      transform: `translate(-50%, calc(-50% + -50px))`,
      opacity: 0,
    });

    heroSection.style.backgroundColor = "#e3e3db";

    gsap.set(animatedIcons, {
      x: 0,
      y: centerStopY,
      scale: exactScale,
      opacity: 0,
    });

    iconElements.forEach((icon) => {
      gsap.set(icon, {
        x: 0,
        y: 0,
      });
    });

    if (!window.duplicateIcons) {
      window.duplicateIcons = [];

      iconElements.forEach((icon) => {
        const duplicate = icon.cloneNode(true);
        duplicate.classList.add("duplicate-icon");
        duplicate.style.position = "absolute";
        duplicate.style.width = headerIconSize + "px";
        duplicate.style.height = headerIconSize + "px";

        document.body.appendChild(duplicate);
        window.duplicateIcons.push(duplicate);
      });
    }

    if (window.duplicateIcons) {
      window.duplicateIcons.forEach((duplicate, index) => {
        if (index < placeholders.length) {
          const iconRect = iconElements[index].getBoundingClientRect();
          const startCenterX = iconRect.left + iconRect.width / 2;
          const startCenterY = iconRect.top + iconRect.height / 2;
          const startX = startCenterX + window.pageXOffset;
          const startY = startCenterY + window.pageYOffset;

          const targetRect = placeholders[index].getBoundingClientRect();
          const targetCenterX = targetRect.left + targetRect.width / 2;
          const targetCenterY = targetRect.top + targetRect.height / 2;
          const targetX = targetCenterX + window.pageXOffset;
          const targetY = targetCenterY + window.pageYOffset;

          const moveX = targetX - startX;
          const moveY = targetY - startY;

          let currentX = 0;
          let currentY = 0;

          if (moveProgress <= 0.5) {
            const verticalProgress = moveProgress / 0.5;
            currentY = moveY * verticalProgress;
          } else {
            const horizontalProgress = (moveProgress - 0.5) / 0.5;
            currentY = moveY;
            currentX = moveX * horizontalProgress;
          }

          const finalPageX = startX + currentX;
          const finalPageY = startY + currentY;

          duplicate.style.left = finalPageX - headerIconSize / 2 + "px";
          duplicate.style.top = finalPageY - headerIconSize / 2 + "px";
          duplicate.style.opacity = "1";
          duplicate.style.display = "flex";
        }
      });
    }
    return;
  }

  gsap.set(heroHeader, {
    transform: `translate(-50%, calc(-50% + -100px))`,
    opacity: 0,
  });

  heroSection.style.backgroundColor = "#e3e3db";

  gsap.set(animatedIcons, {
    opacity: 0,
  });

  if (window.duplicateIcons) {
    window.duplicateIcons.forEach((duplicate, index) => {
      if (index < placeholders.length) {
        const targetRect = placeholders[index].getBoundingClientRect();
        const targetCenterX = targetRect.left + targetRect.width / 2;
        const targetCenterY = targetRect.top + targetRect.height / 2;
        const targetPageX = targetCenterX + window.pageXOffset;
        const targetPageY = targetCenterY + window.pageYOffset;

        duplicate.style.left = targetPageX - headerIconSize / 2 + "px";
        duplicate.style.top = targetPageY - headerIconSize / 2 + "px";
        duplicate.style.opacity = "1";
        duplicate.style.display = "flex";
      }
    });
  }

  textAnimationOrder.forEach((item, randomIndex) => {
    const segmentStart = 0.75 + randomIndex * 0.03;
    const segmentEnd = segmentStart + 0.015;

    const segmentProgress = gsap.utils.mapRange(
      segmentStart,
      segmentEnd,
      0,
      1,
      progress,
    );

    const clampedProgress = Math.max(0, Math.min(1, segmentProgress));

    gsap.set(item.segment, {
      opacity: clampedProgress,
    });
  });
};

const heroTrigger = ScrollTrigger.create({
  trigger: heroSection,
  start: "top top",
  end: `+=${window.innerHeight * 1} top`,
  pin: true,
  pinSpacing: true,
  scrub: 1,
  invalidateOnRefresh: true,
  onRefresh: (self) => {
    measureCenterStop();
    applyProgressState(self.progress);
  },
  onUpdate: (self) => applyProgressState(self.progress),
});

applyProgressState(heroTrigger.progress);

window[HERO_STATE_KEY] = {
  cleanup: () => {
    heroTrigger.kill();
    clearDuplicateIcons();
    window.removeEventListener("resize", handleResize);
  },
};
