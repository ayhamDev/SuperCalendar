import Component from "./index.mjs.min.js";

export default Component("button-2nd", {
  Render({ data }) {
    return /*html*/ `
            <a ${
              data.src ? `href="${data.src}"` : ""
            } class="shadow cursor-pointer transition-all duration-150 active:scale-90 inline-flex items-center justify-center rounded-md border border-transparent bg-white px-5 py-2 text-base font-medium text-indigo-600 hover:bg-indigo-50">${
      data.text
    }</a>
    `;
  },
  Script() {
    return;
  },
  Style() {
    return ``;
  },
  shadowRoot: false,
});
