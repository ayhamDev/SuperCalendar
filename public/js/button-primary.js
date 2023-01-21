import Component from "./index.mjs.min.js";

export default Component("button-primary", {
  Render({ data }) {
    return /*html*/ `
          
            <${data.type == "submit" ? "button" : "a"} ${
      data.src ? `href="${data.src}"` : ""
    } class="hover:shadow-lg ${
      data.full != undefined ? "w-full block" : ""
    } transition-all duration-150 active:scale-90 inline-flex items-center justify-center rounded-md border border-transparent ${
      data.red != undefined
        ? "bg-rose-500 hover:bg-rose-700"
        : "bg-indigo-600 hover:bg-indigo-700"
    } px-5 py-2 text-base font-medium text-white cursor-pointer hover:shadow-md">${
      data.text
    }</${data.type == "submit" ? "button" : "a"}>
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
