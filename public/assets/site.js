async function loadPosts() {
  return [];
}

let configPromise = null;
async function loadConfig() {
  if (!configPromise) {
    if (window.__SITE_CONFIG) {
      configPromise = Promise.resolve(window.__SITE_CONFIG);
    } else {
      const configPath = window.__SITE_CONFIG_PATH || "/assets/site-config.json";
      configPromise = fetch(configPath, { cache: "force-cache" })
        .then((response) => response.ok ? response.json() : null)
        .catch(() => null);
    }
  }
  return configPromise;
}

let searchIndexPromise = null;
let searchIndex = null;
let lastSearchActive = null;

window.__SITE_VERSION = "2026-06-01-1";

function slugify(text) {
  return text.toLowerCase().trim().replace(/\s+/g, "-");
}

function normalizeText(value) {
  return String(value || "").toLowerCase().trim();
}

function sectionLabel(section) {
  const config = window.__SITE_CONFIG || {};
  const sectionConfig = config.sections && config.sections[section];
  return (sectionConfig && sectionConfig.title) || (section === "life" ? "Life" : section === "tech" ? "Tech" : section);
}

function sectionPath(section) {
  const config = window.__SITE_CONFIG || {};
  const sectionConfig = config.sections && config.sections[section];
  return (sectionConfig && sectionConfig.href) || (section === "life" ? "/life/" : section === "tech" ? "/tech/" : `/${section}/`);
}

function postHref(post) {
  return post.href || (post.slug ? `/posts/${post.slug}/` : "/posts/");
}

function tagHref(tag) {
  return `/tags/${slugify(tag)}/`;
}

function parseDateValue(dateText) {
  if (!dateText) return null;
  const normalized = String(dateText).includes("T") ? String(dateText) : String(dateText).replace(" ", "T");
  let date = new Date(normalized);
  if (Number.isNaN(date.getTime())) {
    date = new Date(dateText);
  }
  return Number.isNaN(date.getTime()) ? null : date;
}

function formatDate(dateText) {
  const date = parseDateValue(dateText);
  if (!date) return String(dateText || "");
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric"
  });
}

function formatMonth(dateText) {
  const date = parseDateValue(dateText);
  if (!date) return String(dateText || "");
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long"
  }).format(date);
}

function formatMonthDay(dateText) {
  const date = parseDateValue(dateText);
  if (!date) return String(dateText || "");
  const month = date.toLocaleString("en-US", { month: "long" });
  const day = date.getDate();
  const suffix = (day % 10 === 1 && day % 100 !== 11)
    ? "st"
    : (day % 10 === 2 && day % 100 !== 12)
      ? "nd"
      : (day % 10 === 3 && day % 100 !== 13)
        ? "rd"
        : "th";
  return `${month} ${day}${suffix}`;
}

function renderPostList(target, posts, options = {}) {
  target.innerHTML = "";

  if (!posts.length) {
    target.innerHTML = "<p class=\"post-meta\">No posts found.</p>";
    return;
  }

  const sorted = [...posts].sort((left, right) => {
    const leftDate = parseDateValue(left.date);
    const rightDate = parseDateValue(right.date);
    const leftTime = leftDate ? leftDate.getTime() : 0;
    const rightTime = rightDate ? rightDate.getTime() : 0;
    return rightTime - leftTime;
  });
  const groupByMonth = options.groupByMonth === true;
  const groupByYear = options.groupByYear === true;

  if (groupByYear) {
    // Group posts by year and render collapsible year sections
    const years = {};
    for (const post of sorted) {
      const date = parseDateValue(post.date);
      const y = date ? date.getFullYear() : "Unknown";
      years[y] = years[y] || [];
      years[y].push(post);
    }

    // Ensure years are rendered newest-first (numeric years desc, Unknown last)
    const keys = Object.keys(years || {});
    const numeric = keys.filter((k) => k !== "Unknown").map((k) => Number(k)).filter((n) => !Number.isNaN(n));
    numeric.sort((a, b) => b - a);
    const sortedYears = numeric.map(String);
    if (keys.includes("Unknown")) sortedYears.push("Unknown");

    for (const year of sortedYears) {
      const yearItem = document.createElement('li');
      yearItem.className = 'year-item';

      const header = document.createElement('h2');
      header.className = 'year-header';
      header.textContent = year;

      const postsWrap = document.createElement('ul');
      postsWrap.className = 'year-posts';

      for (const post of years[year]) {
        const li = document.createElement('li');
        li.className = 'year-post';
        li.innerHTML = `
          <span class="year-date">${formatMonthDay(post.date)}</span>
          <a class="year-link" href="${postHref(post)}">${post.title}</a>
        `;
        postsWrap.appendChild(li);
      }

      yearItem.appendChild(header);
      yearItem.appendChild(postsWrap);
      target.appendChild(yearItem);
    }
    return;
  }

  let currentMonth = "";

  for (const post of sorted) {
    const postMonth = formatMonth(post.date);

    if (groupByMonth && postMonth !== currentMonth) {
      currentMonth = postMonth;
      const monthItem = document.createElement("li");
      monthItem.className = "archive-month-item";
      monthItem.innerHTML = `<h2 class="archive-month">${currentMonth}</h2>`;
      target.appendChild(monthItem);
    }

    const tagLinks = (post.tags || [])
      .map((tag) => `<a href=\"${tagHref(tag)}\">${tag}</a>`)
      .join(", ");
    const section = post.section || "life";

    const li = document.createElement("li");
    li.className = "post-item";
    li.innerHTML = `
      <article>
        <h2 class="post-title"><a href="${postHref(post)}">${post.title}</a></h2>
        <p class="post-excerpt">${post.excerpt}</p>
        <p class="post-meta">${formatDate(post.date)}</p>
        <p class="post-taxonomy">In <a href="${sectionPath(section)}">${sectionLabel(section)}</a></p>
        <p class="post-taxonomy">${tagLinks}</p>
      </article>
      <div class="separator-wrap"><hr class="archive-separator"></div>
    `;
    target.appendChild(li);
  }
}

function renderPagination(node, totalPages, currentPage, basePath) {
  if (!node) {
    return;
  }

  node.innerHTML = "";
  if (totalPages <= 1) {
    return;
  }

  const previous = document.createElement("a");
  previous.textContent = "Previous";
  previous.className = currentPage === 1 ? "is-disabled" : "";
  previous.href = currentPage === 2 ? `${basePath}` : `${basePath}page/${currentPage - 1}/`;

  const next = document.createElement("a");
  next.textContent = "Next";
  next.className = currentPage === totalPages ? "is-disabled" : "";
  next.href = `${basePath}page/${currentPage + 1}/`;

  if (currentPage > 1) {
    node.appendChild(previous);
  }

  const status = document.createElement("span");
  status.textContent = `${currentPage} / ${totalPages}`;
  node.appendChild(status);

  if (currentPage < totalPages) {
    node.appendChild(next);
  }
}

function updateYear() {
  const yearNode = document.querySelector("[data-year]");
  if (yearNode) {
    yearNode.textContent = String(new Date().getFullYear());
  }
}

function setupNavigationToggle() {
  const toggle = document.querySelector("[data-nav-toggle]");
  const nav = document.querySelector("[data-primary-nav]");

  if (!toggle || !nav) {
    return;
  }

  if (toggle.dataset.navBound === "true") {
    return;
  }
  toggle.dataset.navBound = "true";

  // Ensure the visible label is localized; JS will override the static 'Menu' text.
  const configMenuLabel = (window.__SITE_CONFIG && window.__SITE_CONFIG.menuLabel) || "Menu";
  if (toggle.textContent.trim() === "Menu") {
    toggle.textContent = configMenuLabel;
  }

  toggle.addEventListener("click", () => {
    const expanded = toggle.getAttribute("aria-expanded") === "true";
    toggle.setAttribute("aria-expanded", String(!expanded));
    nav.classList.toggle("is-open", !expanded);
  });
}

function markCurrentNavLink() {
  const currentPath = window.location.pathname.replace(/\/+$/, "") || "/";
  const links = document.querySelectorAll("[data-primary-nav] a");

  links.forEach((link) => {
    const hrefPath = new URL(link.href, window.location.origin).pathname.replace(/\/+$/, "") || "/";
    link.removeAttribute("aria-current");
    if (hrefPath === currentPath) {
      link.setAttribute("aria-current", "page");
    }
  });
}

function setupLinkPrefetch() {
  const prefetched = setupLinkPrefetch.prefetched || (setupLinkPrefetch.prefetched = new Set());
  const links = document.querySelectorAll("a[href^='/']:not([data-prefetch-bound])");

  links.forEach((link) => {
    link.dataset.prefetchBound = "true";
    link.addEventListener("pointerenter", () => {
      const url = new URL(link.getAttribute("href"), window.location.origin);
      if (url.origin !== window.location.origin || prefetched.has(url.pathname)) {
        return;
      }

      prefetched.add(url.pathname);
      const prefetch = document.createElement("link");
      prefetch.rel = "prefetch";
      prefetch.href = url.pathname;
      document.head.appendChild(prefetch);
    }, { once: true });
  });
}

const initialMarks = [
  ["a", "\u963f"], ["b", "\u82ad"], ["c", "\u64e6"], ["d", "\u642d"], ["e", "\u86fe"],
  ["f", "\u53d1"], ["g", "\u5676"], ["h", "\u54c8"], ["j", "\u51fb"], ["k", "\u5580"],
  ["l", "\u5783"], ["m", "\u5988"], ["n", "\u62ff"], ["o", "\u54e6"], ["p", "\u556a"],
  ["q", "\u671f"], ["r", "\u7136"], ["s", "\u6492"], ["t", "\u584c"], ["w", "\u6316"],
  ["x", "\u6614"], ["y", "\u538b"], ["z", "\u531d"]
];

function getSearchNodes() {
  return {
    overlay: document.querySelector("[data-search-overlay]"),
    input: document.querySelector("[data-search-query]"),
    results: document.querySelector("[data-search-results]")
  };
}

function chineseInitials(value) {
  return Array.from(String(value || ""))
    .map((char) => {
      if (!/[\u3400-\u9fff]/.test(char)) return char;

      let initial = "";
      for (const [letter, mark] of initialMarks) {
        if (char.localeCompare(mark, "zh-Hans-CN") >= 0) {
          initial = letter;
        }
      }
      return initial || char;
    })
    .join("");
}

function searchableParts(item) {
  return [
    item.title,
    item.excerpt,
    item.content,
    ...(item.tags || []),
    ...(item.keywords || [])
  ];
}

async function loadSearchIndex() {
  if (searchIndex) {
    return searchIndex;
  }

  if (!searchIndexPromise) {
    searchIndexPromise = fetch("/search-index.json", { cache: "force-cache" })
      .then((response) => response.ok ? response.json() : [])
      .then((items) => items.map((item) => {
        const text = searchableParts(item).join(" ");
        const initials = chineseInitials(text);

        return {
          item,
          text: `${text} ${initials} ${initials.replace(/\s+/g, "")}`.toLowerCase()
        };
      }))
      .catch(() => []);
  }

  searchIndex = await searchIndexPromise;
  return searchIndex;
}

function renderSearchResults(results, index, query) {
  const term = query.trim().toLowerCase();
  results.innerHTML = "";

  if (!term) return;

  const matches = index
    .filter((entry) => entry.text.includes(term))
    .slice(0, 8);

  if (!matches.length) {
    const empty = document.createElement("p");
    empty.className = "search-empty";
    empty.textContent = "No results";
    results.appendChild(empty);
    return;
  }

  for (const { item } of matches) {
    const link = document.createElement("a");
    link.className = "search-result";
    link.href = item.href;

    const title = document.createElement("span");
    title.className = "search-result-title";
    title.textContent = item.title;
    link.appendChild(title);

    const tags = [...(item.tags || []), ...(item.keywords || [])].slice(0, 5);
    if (tags.length) {
      const meta = document.createElement("span");
      meta.className = "search-result-meta";
      meta.textContent = tags.map((tag) => `#${tag}`).join(" ");
      link.appendChild(meta);
    }

    results.appendChild(link);
  }
}

async function updateSearchResults() {
  const { input, results } = getSearchNodes();
  if (!input || !results) return;

  const index = await loadSearchIndex();
  renderSearchResults(results, index, input.value);
}

function openSearch() {
  const { overlay, input } = getSearchNodes();
  if (!overlay || !input) return;

  lastSearchActive = document.activeElement;
  overlay.hidden = false;
  document.body.classList.add("search-open");
  input.focus();
  input.select();
  updateSearchResults();
}

function closeSearch() {
  const { overlay, input, results } = getSearchNodes();
  if (!overlay || !input || !results) return;

  overlay.hidden = true;
  document.body.classList.remove("search-open");
  input.value = "";
  results.innerHTML = "";
  if (lastSearchActive && typeof lastSearchActive.focus === "function") {
    lastSearchActive.focus();
  }
}

function isTypingTarget(target) {
  return target instanceof HTMLInputElement ||
    target instanceof HTMLTextAreaElement ||
    target instanceof HTMLSelectElement ||
    target?.isContentEditable;
}

function setupSearchOverlay() {
  const { overlay, input } = getSearchNodes();
  if (!overlay || !input) return;

  if (!window.__BLOG_SEARCH_KEYS_BOUND) {
    window.__BLOG_SEARCH_KEYS_BOUND = true;
    document.addEventListener("keydown", (event) => {
      const key = event.key.toLowerCase();
      const commandSearch = (event.metaKey || event.ctrlKey) && key === "k";
      const slashSearch = key === "/" && !isTypingTarget(event.target);

      if (commandSearch || slashSearch) {
        event.preventDefault();
        openSearch();
        return;
      }

      const nodes = getSearchNodes();
      if (key === "escape" && nodes.overlay && !nodes.overlay.hidden) {
        closeSearch();
      }
    });
  }

  if (input.dataset.searchBound !== "true") {
    input.dataset.searchBound = "true";
    input.addEventListener("input", updateSearchResults);
  }

  const closeButton = overlay.querySelector("[data-search-close]");
  if (closeButton && closeButton.dataset.searchCloseBound !== "true") {
    closeButton.dataset.searchCloseBound = "true";
    closeButton.addEventListener("click", closeSearch);
  }
}

function setupArticleImages() {
  const images = document.querySelectorAll(".article img");
  images.forEach((image, index) => {
    if (!image.hasAttribute("decoding")) {
      image.setAttribute("decoding", "async");
    }

    if (!image.hasAttribute("loading")) {
      image.setAttribute("loading", index === 0 ? "eager" : "lazy");
    }
  });
}

function applyConfig(config) {
  if (!config) return;

  const siteName = config.siteTitle || config.headerTitle || "";
  if (siteName) {
    const currentTitle = document.title || "";
    const titleParts = currentTitle.split("|").map((part) => part.trim()).filter(Boolean);
    if (currentTitle.trim() === siteName) {
      document.title = siteName;
    } else if (titleParts.length > 1) {
      titleParts[titleParts.length - 1] = siteName;
      document.title = titleParts.join(" | ");
    } else if (currentTitle.trim()) {
      document.title = `${currentTitle.trim()} | ${siteName}`;
    } else {
      document.title = siteName;
    }
  }

  const brandTitle = document.querySelector(".brand h1 a");
  const brandTagline = document.querySelector(".brand p");
  if (brandTitle && config.siteTitle) {
    brandTitle.textContent = config.headerTitle || config.siteTitle;
  }
  if (brandTagline && typeof config.tagline === "string") {
    if (config.tagline) {
      brandTagline.textContent = config.tagline;
    } else {
      brandTagline.remove();
    }
  }

  const nav = document.querySelector("[data-primary-nav]");
  if (nav && Array.isArray(config.nav)) {
    nav.innerHTML = config.nav
      .filter((item) => !item.hidden)
      .map((item) => `<a href="${item.href}">${item.label}</a>`)
      .join("\n");
  }

  const archiveHeader = document.querySelector(".archive-header");
  if (archiveHeader) {
    const headerMode = archiveHeader.dataset.archiveTitle || "";
    const titleNode = archiveHeader.querySelector("h2");
    const subtitleNode = archiveHeader.querySelector("p");

    const sectionKey = archiveHeader.dataset.section || "";
    const sectionConfig = config.sections && sectionKey ? config.sections[sectionKey] : null;

    if (sectionConfig && headerMode === "section") {
      if (titleNode && sectionConfig.title) {
        titleNode.textContent = sectionConfig.title;
      }

      if (typeof sectionConfig.subtitle === "string") {
        if (sectionConfig.subtitle && subtitleNode) {
          subtitleNode.textContent = sectionConfig.subtitle;
        } else if (sectionConfig.subtitle && !subtitleNode) {
          const p = document.createElement("p");
          p.textContent = sectionConfig.subtitle;
          archiveHeader.appendChild(p);
        } else if (!sectionConfig.subtitle && subtitleNode) {
          subtitleNode.remove();
        }
      }
    }

    if (headerMode === "config") {
      if (titleNode && config.archiveTitle) {
        titleNode.textContent = config.archiveTitle;
      }

      if (typeof config.archiveSubtitle === "string") {
        if (config.archiveSubtitle && subtitleNode) {
          subtitleNode.textContent = config.archiveSubtitle;
        } else if (config.archiveSubtitle && !subtitleNode) {
          const p = document.createElement("p");
          p.textContent = config.archiveSubtitle;
          archiveHeader.appendChild(p);
        } else if (!config.archiveSubtitle && subtitleNode) {
          subtitleNode.remove();
        }
      }
    }
  }

  const footer = document.querySelector(".site-footer");
  if (footer) {
    const footerTextNode = footer.querySelector("p");
    if (footerTextNode && (config.footerTextHtml || config.footerText)) {
      if (config.footerTextHtml) {
        footerTextNode.innerHTML = config.footerTextHtml;
      } else if (config.footerText) {
        footerTextNode.textContent = config.footerText;
      }
    }

    const creditText = typeof config.footerCredit === "string" ? config.footerCredit : "";
    const creditHtml = typeof config.footerCreditHtml === "string" ? config.footerCreditHtml : "";
    let creditNode = footer.querySelector(".credits");

    if (!creditNode && (creditText || creditHtml)) {
      creditNode = document.createElement("p");
      creditNode.className = "credits";
      footer.appendChild(creditNode);
    }

    if (creditNode) {
      if (creditHtml) {
        creditNode.innerHTML = creditHtml;
      } else if (creditText) {
        creditNode.textContent = creditText;
      } else {
        creditNode.remove();
      }
    }
  }
}

function matchSearch(post, term) {
  return (
    post.title.toLowerCase().includes(term) ||
    post.excerpt.toLowerCase().includes(term) ||
    sectionLabel(post.section).toLowerCase().includes(term) ||
    (post.section || "").toLowerCase().includes(term) ||
    (post.tags || []).join(" ").toLowerCase().includes(term)
  );
}

async function boot() {
  updateYear();
  setupNavigationToggle();
  setupLinkPrefetch();
  setupSearchOverlay();
  setupArticleImages();

  const config = await loadConfig();
  applyConfig(config);
  markCurrentNavLink();
  setupLinkPrefetch();
  setupSearchOverlay();
  setupArticleImages();

  const listNode = document.querySelector("[data-post-list]");
  if (!listNode) {
    return;
  }

  const searchInput = document.querySelector("[data-search-input]");
  const pagerNode = document.querySelector("[data-pagination]");
  const pageSize = Number(listNode.dataset.pageSize || "12");
  const pageNumber = Number(listNode.dataset.page || "1");
  const filterType = listNode.dataset.filterType || "";
  const filterValue = normalizeText(listNode.dataset.filterValue);
  let sectionFilter = normalizeText(listNode.dataset.section);
  const groupBy = listNode.dataset.groupBy || "";
  const basePath = listNode.dataset.basePath || "/";

  try {

    const posts = await loadPosts();
    let filtered = posts;

    // If the page requests a named section (data-section), and there's a matching
    // config.sections entry, allow filtering by configured directories (dirs or dir)
    // which map to the post's `source` field. If dirs is empty/absent, fall back
    // to the older `filter` behavior or to matching post.section/categories.
    if (sectionFilter && config && config.sections && config.sections[sectionFilter]) {
      const sectionConfig = config.sections[sectionFilter] || {};

      // Support `dirs` (array) or `dir` (single string) to map to post.source
      const dirs = Array.isArray(sectionConfig.dirs) && sectionConfig.dirs.length
        ? sectionConfig.dirs.map(normalizeText)
        : (sectionConfig.dir ? [normalizeText(sectionConfig.dir)] : null);

      if (dirs && dirs.length) {
        filtered = filtered.filter((post) => dirs.includes(normalizeText(post.source || "")));
      } else if (sectionConfig && sectionConfig.filter) {
        if (Array.isArray(sectionConfig.filter)) {
          const filters = sectionConfig.filter.map(normalizeText);
          filtered = filtered.filter((post) => filters.includes(normalizeText(post.section || "")));
        } else {
          sectionFilter = normalizeText(sectionConfig.filter);
        }
      } else {
        // no dirs or explicit filter configured — leave filtered as full posts list
      }
    }

    // If sectionFilter is still present (either because no config existed or
    // because a simple string filter was provided), perform legacy matching
    if (sectionFilter) {
      filtered = filtered.filter((post) => normalizeText(post.section) === sectionFilter);
      if (!filtered.length) {
        filtered = posts.filter((post) => {
          const section = normalizeText(post.section || post.category || "");
          if (section) return section === sectionFilter;
          const categories = Array.isArray(post.categories) ? post.categories : [];
          return categories.map((cat) => normalizeText(cat)).includes(sectionFilter);
        });
      }
    }

    if (filterType === "tag") {
      filtered = posts.filter((post) => (post.tags || []).map((tag) => slugify(normalizeText(tag))).includes(filterValue));
    }

    const initialSearch = new URLSearchParams(window.location.search).get("q") || "";
    if (searchInput) {
      searchInput.value = initialSearch;
      if (initialSearch) {
        filtered = filtered.filter((post) => matchSearch(post, initialSearch.toLowerCase()));
      }
    }

    // support pageSize <= 0 to mean "show all posts on one page"
    const totalPages = pageSize > 0 ? Math.max(1, Math.ceil(filtered.length / pageSize)) : 1;
    const safePage = Math.min(Math.max(pageNumber, 1), totalPages);
    let pagePosts;
    if (!pageSize || pageSize <= 0) {
      pagePosts = filtered;
    } else {
      const start = (safePage - 1) * pageSize;
      pagePosts = filtered.slice(start, start + pageSize);
    }

    renderPostList(listNode, pagePosts, { groupByMonth: groupBy === "month", groupByYear: groupBy === "year" });
    renderPagination(pagerNode, totalPages, safePage, basePath);

    if (searchInput) {
      searchInput.addEventListener("input", () => {
        const term = searchInput.value.trim().toLowerCase();
        const result = term ? filtered.filter((post) => matchSearch(post, term)) : filtered;
        const toRender = (!pageSize || pageSize <= 0) ? result : result.slice(0, pageSize);
        renderPostList(listNode, toRender, { groupByMonth: groupBy === "month" });
        const pagesForResult = (!pageSize || pageSize <= 0) ? 1 : Math.max(1, Math.ceil(result.length / pageSize));
        renderPagination(pagerNode, pagesForResult, 1, basePath);
      });
    }
  } catch (error) {
    listNode.innerHTML = "<p>Unable to load posts.</p>";
  }
}

boot();
document.addEventListener("astro:page-load", boot);
