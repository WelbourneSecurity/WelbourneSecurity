import { setText } from "./utils.js";

const SITE_URL = "https://welbournesecurity.com/";

const syncRuntimeMetadata = () => {
  const socialImageUrl = new URL("./src/social-preview.svg", SITE_URL).href;
  document.title = "Welbourne Security | Cyber Intelligence Projects and Tools";
  document.querySelector('link[rel="canonical"]')?.setAttribute("href", SITE_URL);
  document.querySelector('meta[property="og:url"]')?.setAttribute("content", SITE_URL);
  document.querySelector('meta[property="og:image"]')?.setAttribute("content", socialImageUrl);
  document.querySelector('meta[name="twitter:image"]')?.setAttribute("content", socialImageUrl);
  document.querySelectorAll("[data-site-link]").forEach((link) => link.setAttribute("href", SITE_URL));
};

const createAction = ({ label, href }, variant) => {
  const link = document.createElement("a");
  link.className = `action ${variant}`;
  link.href = href;
  link.textContent = label;
  if (/^(https?:|mailto:)/i.test(href)) {
    link.target = "_blank";
    link.rel = "noreferrer";
  }
  return link;
};

const createEmbed = ({ embedUrl, embedTitle, title, description }) => {
  if (embedUrl) {
    const frame = document.createElement("iframe");
    frame.className = "embed-frame";
    frame.src = embedUrl;
    frame.title = embedTitle || title;
    frame.loading = "lazy";
    return frame;
  }

  const placeholder = document.createElement("div");
  placeholder.className = "embed-placeholder";
  const inner = document.createElement("div");
  const strong = document.createElement("strong");
  strong.textContent = `${title} embed slot`;
  const p = document.createElement("p");
  p.textContent = description;
  inner.append(strong, p);
  placeholder.append(inner);
  return placeholder;
};

const createCertificationImage = ({ title, imagePath, linkUrl }) => {
  const frame = linkUrl ? document.createElement("a") : document.createElement("div");
  frame.className = "certification-link";

  if (linkUrl && frame instanceof HTMLAnchorElement) {
    frame.href = linkUrl;
    frame.target = "_blank";
    frame.rel = "noreferrer";
  }

  const image = document.createElement("img");
  image.className = "certification-image";
  image.src = imagePath;
  image.alt = title;
  image.loading = "lazy";
  image.width = 200;
  image.height = 200;

  frame.append(image);
  return frame;
};

const createPlatform = ({ title, profileUrl }) => {
  const link = document.createElement("a");
  link.className = "presence-link";
  link.href = profileUrl;
  link.target = "_blank";
  link.rel = "noreferrer";
  link.textContent = title;
  return link;
};

const createCertification = ({ title, description, issuer, verificationUrl, resourceUrl, resourceLabel, imagePath }, index = 0) => {
  const item = document.createElement("article");
  item.className = `certification-item${index === 0 ? " is-featured" : ""}${verificationUrl ? " is-verifiable" : ""}`;
  const linkUrl = verificationUrl || resourceUrl || "";
  item.append(imagePath ? createCertificationImage({ title, imagePath, linkUrl }) : createEmbed({ title, description }));

  const copy = document.createElement("div");
  copy.className = "certification-copy";

  const status = document.createElement("span");
  status.className = "certification-status";
  status.textContent = verificationUrl ? "Verified badge" : "Training record";
  copy.append(status);

  const heading = document.createElement("h3");
  heading.textContent = title;
  copy.append(heading);

  if (issuer) {
    const meta = document.createElement("p");
    meta.className = "certification-meta";
    meta.textContent = issuer;
    copy.append(meta);
  }

  if (description) {
    const p = document.createElement("p");
    p.textContent = description;
    copy.append(p);
  }

  if (linkUrl) {
    const link = document.createElement("a");
    link.className = "certification-text-link";
    link.href = linkUrl;
    link.target = "_blank";
    link.rel = "noreferrer";
    link.textContent = verificationUrl ? "Verify credential" : resourceLabel || "View course";
    copy.append(link);
  }

  item.append(copy);
  return item;
};

export function initPlatform(portfolio) {
  syncRuntimeMetadata();

  setText("brand-name", portfolio.profile.name);
  setText("brand-role", portfolio.profile.role);
  setText("hero-eyebrow", portfolio.profile.eyebrow);
  setText("hero-title", portfolio.profile.headline);
  setText("hero-summary", portfolio.profile.summary);
  setText("contact-heading", portfolio.profile.contactHeading);
  setText("contact-summary", portfolio.profile.contactSummary);

  const heroActions = document.getElementById("hero-actions");
  heroActions?.append(
    createAction(portfolio.profile.primaryAction, "primary"),
    createAction(portfolio.profile.secondaryAction, "secondary")
  );

  const contactActions = document.getElementById("contact-actions");
  portfolio.profile.contactActions.forEach((action, index) => {
    contactActions?.append(createAction(action, index === 0 ? "primary" : "secondary"));
  });

  const heroMetrics = document.getElementById("hero-metrics");
  portfolio.heroMetrics.forEach(({ label, value }) => {
    const item = document.createElement("div");
    item.dataset.metricLabel = label;
    const dt = document.createElement("dt");
    dt.textContent = label;
    const dd = document.createElement("dd");
    dd.textContent = value;
    const numericTarget = parseInt(value, 10);
    if (!Number.isNaN(numericTarget) && numericTarget > 0) {
      dd.dataset.countTarget = String(numericTarget);
      dd.dataset.countPad = String(value.length);
      dd.textContent = "00".slice(0, value.length);
    }
    item.append(dt, dd);
    heroMetrics?.append(item);
  });

  if ("IntersectionObserver" in window) {
    const countObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const dd = entry.target;
          const target = parseInt(dd.dataset.countTarget || "0", 10);
          const pad = parseInt(dd.dataset.countPad || "0", 10);
          if (!target) return;
          countObserver.unobserve(dd);
          const duration = 900;
          const start = performance.now();
          const tick = (now) => {
            const progress = Math.min((now - start) / duration, 1);
            const eased = 1 - (1 - progress) ** 3;
            const current = Math.round(eased * target);
            dd.textContent = String(current).padStart(pad, "0");
            if (progress < 1) requestAnimationFrame(tick);
          };
          requestAnimationFrame(tick);
        });
      },
      { threshold: 0.5 }
    );
    document.querySelectorAll("[data-count-target]").forEach((dd) => countObserver.observe(dd));
  }

  const platformList = document.getElementById("platform-list");
  portfolio.platformLinks.forEach((platform) =>
    platformList?.append(createPlatform({ title: platform.title, profileUrl: platform.href }))
  );

  const certificationGrid = document.getElementById("certification-grid");
  portfolio.certifications.forEach((cert, index) => certificationGrid?.append(createCertification(cert, index)));
}
