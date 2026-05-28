const dataUrl = "links.json";
const titleEl = document.querySelector("#site-title");
const descriptionEl = document.querySelector("#site-description");
const tabsEl = document.querySelector("#category-tabs");
const sectionsEl = document.querySelector("#category-sections");
const statusEl = document.querySelector("#status");
const searchInput = document.querySelector("#search-input");
const categoryTemplate = document.querySelector("#category-template");
const linkTemplate = document.querySelector("#link-template");

let navigationData = null;

const text = {
  title: "\u0057\u0045\u0042 \u5bfc\u822a",
  loading: "\u6b63\u5728\u8bfb\u53d6 links.json...",
  description: "\u7f16\u8f91 links.json \u5373\u53ef\u66f4\u65b0\u9875\u9762\u5185\u5bb9\u3002",
  uncategorized: "\u672a\u5206\u7c7b",
  noResults: "\u6ca1\u6709\u627e\u5230\u5339\u914d\u7684\u7f51\u7ad9\u3002",
  missingCategories: "links.json \u7f3a\u5c11 categories \u6570\u7ec4",
  loadFailed:
    "\u65e0\u6cd5\u8bfb\u53d6 links.json\u3002\u8bf7\u53cc\u51fb start-navigation.bat \u901a\u8fc7\u672c\u5730\u670d\u52a1\u5668\u6253\u5f00\u9875\u9762\uff0c\u5e76\u786e\u8ba4 JSON \u683c\u5f0f\u6b63\u786e\u3002"
};

function slugify(value) {
  return value
    .toString()
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^\w\u4e00-\u9fa5-]/g, "");
}

function normalizeUrl(url) {
  if (/^https?:\/\//i.test(url)) {
    return url;
  }

  return `https://${url}`;
}

function getHostname(url) {
  try {
    return new URL(normalizeUrl(url)).hostname;
  } catch {
    return "";
  }
}

function showStatus(message) {
  statusEl.textContent = message;
  statusEl.classList.toggle("visible", Boolean(message));
}

function getIconLabel(icon) {
  const iconLabels = {
    apps: "A",
    palette: "P",
    school: "S",
    folder: "F"
  };

  return iconLabels[icon] || (icon || "F").slice(0, 1).toUpperCase();
}

function createTab(category, id, count) {
  const tab = document.createElement("a");
  tab.className = "category-tab";
  tab.href = `#${id}`;
  tab.innerHTML = `
    <span class="tab-icon" aria-hidden="true">${getIconLabel(category.icon)}</span>
    <span>${category.name}</span>
    <span class="count">${count}</span>
  `;
  return tab;
}

function createLinkCard(link) {
  const node = linkTemplate.content.firstElementChild.cloneNode(true);
  const url = normalizeUrl(link.url);
  const hostname = getHostname(url);
  const favicon = node.querySelector(".favicon");

  node.href = url;
  node.querySelector("strong").textContent = link.title || hostname || url;
  node.querySelector(".link-text span").textContent = link.description || hostname || url;

  if (hostname) {
    const img = document.createElement("img");
    img.alt = "";
    img.loading = "lazy";
    img.src = `https://www.google.com/s2/favicons?domain=${hostname}&sz=64`;
    img.onerror = () => {
      favicon.textContent = (link.title || hostname).slice(0, 1).toUpperCase();
    };
    favicon.append(img);
  } else {
    favicon.textContent = "?";
  }

  node.dataset.search = [link.title, link.description, link.url, hostname].filter(Boolean).join(" ").toLowerCase();
  return node;
}

function render(data) {
  titleEl.textContent = data.siteTitle || text.title;
  descriptionEl.textContent = data.description || text.description;
  document.title = data.siteTitle || text.title;

  tabsEl.replaceChildren();
  sectionsEl.replaceChildren();

  data.categories.forEach((category) => {
    const links = Array.isArray(category.links) ? category.links : [];
    const id = `category-${slugify(category.name || text.uncategorized)}`;
    const section = categoryTemplate.content.firstElementChild.cloneNode(true);

    section.id = id;
    section.querySelector(".section-icon").textContent = getIconLabel(category.icon);
    section.querySelector("h2").textContent = category.name || text.uncategorized;
    section.querySelector(".count").textContent = links.length;

    const grid = section.querySelector(".link-grid");
    links.forEach((link) => grid.append(createLinkCard(link)));

    tabsEl.append(createTab(category, id, links.length));
    sectionsEl.append(section);
  });

  updateActiveTab();
}

function filterLinks(query) {
  const term = query.trim().toLowerCase();
  let visibleCount = 0;

  document.querySelectorAll(".category-section").forEach((section) => {
    let sectionCount = 0;

    section.querySelectorAll(".link-card").forEach((card) => {
      const visible = !term || card.dataset.search.includes(term);
      card.classList.toggle("hidden", !visible);
      if (visible) {
        sectionCount += 1;
        visibleCount += 1;
      }
    });

    section.classList.toggle("hidden", sectionCount === 0);
    section.querySelector(".count").textContent = sectionCount;
  });

  showStatus(term && visibleCount === 0 ? text.noResults : "");
}

function updateActiveTab() {
  const sections = [...document.querySelectorAll(".category-section:not(.hidden)")];
  const tabs = [...document.querySelectorAll(".category-tab")];
  const current = sections.findLast((section) => section.getBoundingClientRect().top <= 150) || sections[0];

  tabs.forEach((tab) => {
    tab.classList.toggle("active", current && tab.getAttribute("href") === `#${current.id}`);
  });
}

async function loadNavigation() {
  showStatus(text.loading);

  try {
    const response = await fetch(dataUrl, { cache: "no-store" });
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    navigationData = await response.json();
    if (!Array.isArray(navigationData.categories)) {
      throw new Error(text.missingCategories);
    }

    render(navigationData);
    showStatus("");
  } catch (error) {
    console.error(error);
    showStatus(text.loadFailed);
  }
}

searchInput.addEventListener("input", (event) => filterLinks(event.target.value));
document.addEventListener("scroll", updateActiveTab, { passive: true });
window.addEventListener("resize", updateActiveTab);

loadNavigation();
