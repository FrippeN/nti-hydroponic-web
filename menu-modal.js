/* Local interaction only; no simulated readings or analytics. */
document.body.classList.add("js");
const menuButton = document.querySelector("#mobile-menu-button");
const menu = document.querySelector("#site-nav");
function closeMenu() {
  menu?.classList.remove("open");
  menuButton?.setAttribute("aria-expanded", "false");
}
menuButton?.addEventListener("click", () =>
  menuButton.setAttribute(
    "aria-expanded",
    String(menu.classList.toggle("open")),
  ),
);
menu
  ?.querySelectorAll("a")
  .forEach((link) => link.addEventListener("click", closeMenu));
const focusButton = document.querySelector("#focus-stream");
function closeFocus() {
  document.body.classList.remove("stream-focused");
  focusButton?.setAttribute("aria-pressed", "false");
  if (focusButton) focusButton.textContent = "Fokusläge ↗";
}
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    if (menu?.classList.contains("open")) {
      closeMenu();
      menuButton.focus();
    }
    if (document.body.classList.contains("stream-focused")) {
      closeFocus();
      focusButton.focus();
    }
  }
});
const components = {
  pipes: [
    "DEL 01",
    "Rören",
    "https://docs.google.com/document/d/1xZiDw0vZtxs7A9PQEXqGXv0PD3hgKCF5RlBsPKa1gq8/edit?tab=t.0",
  ],
  pump: [
    "DEL 02",
    "Näringspump",
    "https://docs.google.com/document/d/1m3r0Go1m03flZy4peD86VegILktGhNSBCX6hWVAp4aw/edit?tab=t.0",
  ],
  screen: [
    "DEL 03",
    "Skärmställ",
    "https://docs.google.com/document/d/146PorjY5DPyQUf7WeVyLDpOS5WUz1GbpZMapvuuqKpQ/edit?tab=t.0",
  ],
};
const componentLink = document.querySelector("#component-link");
if (componentLink) componentLink.href = components.pipes[2];
document.querySelectorAll("[data-component]").forEach((button) =>
  button.addEventListener("click", () => {
    const [number, title, url] = components[button.dataset.component];
    document
      .querySelectorAll("[data-component]")
      .forEach((other) =>
        other.setAttribute("aria-pressed", String(other === button)),
      );
    document.querySelector("#component-number").textContent = number;
    document.querySelector("#component-title").textContent = title;
    componentLink.href = url;
  }),
);
const search = document.querySelector("#doc-search");
const filters = [...document.querySelectorAll("[data-filter]")];
const cards = [...document.querySelectorAll(".document-card")];
let category = "Alla";
function filterDocuments() {
  const query = search.value.trim().toLocaleLowerCase("sv");
  let visible = 0;
  cards.forEach((card) => {
    const match =
      (category === "Alla" || card.dataset.category === category) &&
      card.dataset.title.toLocaleLowerCase("sv").includes(query);
    card.hidden = !match;
    if (match) visible++;
  });
  document.querySelector("#result-count").textContent =
    `${visible} av ${cards.length} dokument`;
  document.querySelector("#no-results").hidden = visible !== 0;
}
search?.addEventListener("input", filterDocuments);
filters.forEach((button) =>
  button.addEventListener("click", () => {
    category = button.dataset.filter;
    filters.forEach((other) =>
      other.setAttribute("aria-pressed", String(other === button)),
    );
    filterDocuments();
  }),
);
focusButton?.addEventListener("click", () => {
  const focused = document.body.classList.toggle("stream-focused");
  focusButton.setAttribute("aria-pressed", String(focused));
  focusButton.textContent = focused ? "Stäng fokusläge ↙" : "Fokusläge ↗";
});
