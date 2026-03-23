import clsx, { ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const splitTextIntoSpans = (selector: string) => {
  document.querySelectorAll(selector).forEach((element) => {
    const text = element.textContent || "";
    const splitText = text
      .split("")
      .map((char) => `<span>${char === " " ? "&nbsp;&nbsp;" : char}</span>`)
      .join("");
    element.innerHTML = splitText;
  });
};

export const splitTextIntoWords = (selector: string) => {
  document.querySelectorAll(selector).forEach((element) => {
    const text = element.textContent || "";
    const splitText = text
      .split(" ")
      .map(
        (word) =>
          `<span class="word" style="display:inline-block">${word}&nbsp;</span>`,
      )
      .join("");
    element.innerHTML = splitText;
  });
};
