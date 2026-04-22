const mapBounds = {
  west: -10.476361,
  east: 1.765083,
  north: 60.846142,
  south: 49.1626,
  width: 628.09174,
  height: 1051.4788
};

const mapOverlayOffset = {
  x: 0,
  y: 32
};

const groupControls = [
  { id: "g01", group: "1", name: "Maidstone Group Control", place: "Maidstone", lat: 51.2726, lon: 0.529, sector: "Group Control" },
  { id: "g02", group: "2", name: "Horsham Group Control", place: "Horsham", lat: 51.0629, lon: -0.3259, sector: "Metropolitan Sector" },
  { id: "g03", group: "3", name: "Oxford Group Control", place: "Oxford", lat: 51.752, lon: -1.2577, sector: "Group Control" },
  { id: "g04", group: "4", name: "Colchester Group Control", place: "Colchester", lat: 51.8892, lon: 0.9042, sector: "Group Control" },
  { id: "g05", group: "5", name: "Watford Group Control", place: "Watford", lat: 51.6565, lon: -0.3903, sector: "Group Control" },
  { id: "g06", group: "6", name: "Norwich Group Control", place: "Norwich", lat: 52.565, lon: 1.183, sector: "Group Control" },
  { id: "g07", group: "7", name: "Bedford Group Control", place: "Bedford", lat: 52.1364, lon: -0.4675, sector: "Midland Sector" },
  { id: "g08", group: "8", name: "Coventry Group Control", place: "Coventry", lat: 52.4068, lon: -1.5197, sector: "Group Control" },
  { id: "g09", group: "9", name: "Yeovil Group Control", place: "Yeovil", lat: 50.9421, lon: -2.6333, sector: "Group Control" },
  { id: "g10", group: "10", name: "Exeter Group Control", place: "Exeter", lat: 50.7184, lon: -3.5339, sector: "Group Control" },
  { id: "g11", group: "11", name: "Truro Group Control", place: "Truro", lat: 50.2632, lon: -5.051, sector: "Group Control" },
  { id: "g12", group: "12", name: "Bristol Group Control", place: "Bristol", lat: 51.4545, lon: -2.5879, sector: "Southern Sector" },
  { id: "g13", group: "13", name: "South Wales Group Control", place: "Carmarthen", lat: 51.8576, lon: -4.3121, sector: "Group Control" },
  { id: "g14", group: "14", name: "Winchester Group Control", place: "Winchester", lat: 51.0629, lon: -1.3167, sector: "Group Control" },
  { id: "g15", group: "15", name: "Lincoln Group Control", place: "Lincoln", lat: 53.2307, lon: -0.5406, sector: "Eastern Sector" },
  { id: "g16", group: "16", name: "Shrewsbury Group Control", place: "Shrewsbury", lat: 52.7073, lon: -2.7553, sector: "Group Control" },
  { id: "g17", group: "17", name: "North Wales Group Control", place: "Wrexham / Borras", lat: 53.046, lon: -2.9916, sector: "Group Control" },
  { id: "g18", group: "18", name: "Leeds Group Control", place: "Leeds", lat: 53.8008, lon: -1.5491, sector: "Group Control" },
  { id: "g20", group: "20", name: "York Group Control", place: "York", lat: 53.959, lon: -1.0815, sector: "Group Control" },
  { id: "g21", group: "21", name: "Preston Group Control", place: "Preston", lat: 53.7632, lon: -2.7031, sector: "Western Sector" },
  { id: "g22", group: "22", name: "Carlisle Group Control", place: "Carlisle", lat: 54.8925, lon: -2.9329, sector: "Group Control" },
  { id: "g23", group: "23", name: "Durham Group Control", place: "Durham", lat: 54.7753, lon: -1.5849, sector: "Group Control" },
  { id: "g24", group: "24", name: "Edinburgh Group Control", place: "Edinburgh / Lothian", lat: 55.9, lon: -3.2, sector: "Group Control" },
  { id: "g25", group: "25", name: "Ayr Group Control", place: "Ayr / Prestwick", lat: 55.4586, lon: -4.6292, sector: "Group Control" },
  { id: "g27", group: "27", name: "Oban Group Control", place: "North Connel", lat: 56.451, lon: -5.391, sector: "Group Control" },
  { id: "g28", group: "28", name: "Dundee Group Control", place: "Dundee", lat: 56.462, lon: -2.9707, sector: "Scottish Sector" },
  { id: "g29", group: "29", name: "Aberdeen Group Control", place: "Northfield, Aberdeen", lat: 57.1497, lon: -2.0943, sector: "Group Control" },
  { id: "g30", group: "30", name: "Inverness Group Control", place: "Inverness", lat: 57.4778, lon: -4.2247, sector: "Group Control" },
  { id: "g31", group: "31", name: "Belfast Group Control", place: "Belfast / County Down", lat: 54.45, lon: -5.95, sector: "Group Control" }
];

const monitoringPosts = [
  {
    id: "p-northolt",
    name: "Northolt ROC Post",
    group: "5",
    number: "62",
    lat: 51.553,
    lon: -0.418,
    status: "Opened 1967, closed 1991"
  },
  {
    id: "p-bowes-park",
    name: "Bowes Park ROC Post",
    group: "5",
    number: "61",
    lat: 51.594,
    lon: -0.125,
    status: "Opened 1964, closed 1991"
  },
  {
    id: "p-dulwich",
    name: "Dulwich ROC Post",
    group: "5",
    number: "15",
    lat: 51.437,
    lon: -0.071,
    status: "Opened 1965, closed 1991",
  },
  { id: "p-dover", name: "Dover ROC Post", group: "1", number: "7", lat: 51.2, lon: 0.72, status: "Publicly listed ROC post" },
  { id: "p-new-buckenham", name: "New Buckenham ROC Post", group: "6", number: "39", lat: 52.47, lon: 1.07, status: "Publicly listed ROC post" },
  { id: "p-olney", name: "Olney ROC Post", group: "7", number: "35", lat: 52.156, lon: -0.704, status: "Opened 1964, closed 1991" },
  { id: "p-meriden", name: "Meriden ROC Post", group: "8", number: "31", lat: 52.431, lon: -1.638, status: "Opened 1965, closed 1991" },
  { id: "p-okehampton", name: "Okehampton ROC Post", group: "10", number: "18", lat: 50.738, lon: -4.003, status: "Publicly listed ROC post" },
  { id: "p-nanpean", name: "Nanpean ROC Post", group: "11", number: "44", lat: 50.5, lon: -4.3, status: "Publicly listed ROC post" },
  { id: "p-long-ashton", name: "Long Ashton ROC Post", group: "12", number: "23", lat: 51.428, lon: -2.667, status: "Publicly listed ROC post" },
  { id: "p-carmarthen", name: "Carmarthen ROC Post", group: "13", number: "38", lat: 51.855, lon: -4.307, status: "Publicly listed ROC post" },
  { id: "p-overton-hants", name: "Overton ROC Post", group: "14", number: "20", lat: 51.244, lon: -1.263, status: "Publicly listed ROC post" },
  { id: "p-hackthorn", name: "Hackthorn ROC Post", group: "15", number: "41", lat: 53.333, lon: -0.504, status: "Publicly listed ROC post" },
  { id: "p-upton-magna", name: "Upton Magna ROC Post", group: "16", number: "19", lat: 52.711, lon: -2.665, status: "Publicly listed ROC post" },
  { id: "p-llanrhaiadr", name: "Llanrhaiadr ROC Post", group: "17", number: "24", lat: 52.85, lon: -3.3, status: "Publicly listed ROC post" },
  { id: "p-skipsea", name: "Skipsea ROC Post", group: "20", number: "21", lat: 53.9783, lon: -0.2203, status: "Opened 1959, closed 1991" },
  { id: "p-keyingham", name: "Keyingham ROC Post", group: "20", number: "56", lat: 53.7135, lon: -0.1125, status: "Opened 1965, closed 1991" },
  { id: "p-skirlaugh", name: "Skirlaugh ROC Post", group: "20", number: "57", lat: 53.8394, lon: -0.2664, status: "Opened 1959, closed 1991" },
  { id: "p-burscough", name: "Burscough ROC Post", group: "21", number: "11", lat: 53.598, lon: -2.853, status: "Opened 1962, closed 1991" },
  { id: "p-brampton", name: "Brampton ROC Post", group: "22", number: "8", lat: 54.943, lon: -2.739, status: "Opened 1959, closed 1991" },
  { id: "p-stanhope", name: "Stanhope ROC Post", group: "23", number: "27", lat: 54.748, lon: -2.009, status: "Publicly listed ROC post" },
  { id: "p-penicuik", name: "Penicuik ROC Post", group: "24", number: "12", lat: 55.831, lon: -3.223, status: "Publicly listed ROC post" },
  { id: "p-prestwick", name: "Prestwick ROC Post", group: "25", number: "36", lat: 55.496, lon: -4.611, status: "Publicly listed ROC post" },
  { id: "p-oban", name: "Oban ROC Post", group: "27", number: "7", lat: 56.415, lon: -5.472, status: "Opened 1960, closed 1968" },
  { id: "p-forfar", name: "Forfar ROC Post", group: "28", number: "29", lat: 56.644, lon: -2.889, status: "Publicly listed ROC post" },
  { id: "p-kintore", name: "Kintore ROC Post", group: "29", number: "6", lat: 57.237, lon: -2.346, status: "Publicly listed ROC post" },
  { id: "p-cannich", name: "Cannich ROC Post", group: "30", number: "14", lat: 57.349, lon: -4.762, status: "Publicly listed ROC post" },
  { id: "p-hillsborough", name: "Hillsborough ROC Post", group: "31", number: "51", lat: 54.463, lon: -6.083, status: "Publicly listed ROC post" }
];

const state = {
  controls: true,
  posts: true,
  selectedId: "g20",
  mapZoomIndex: 0,
  mapCenter: null,
  mapView: {
    x: 0,
    y: 0,
    width: mapBounds.width,
    height: mapBounds.height
  }
};

const svg = document.getElementById("roc-map");
const pointLayer = document.getElementById("roc-point-layer");
const linkLayer = document.getElementById("roc-link-layer");
const selectedPanel = document.getElementById("roc-selected");
const toggles = Array.from(document.querySelectorAll("[data-layer-toggle]"));
const mapZoomButtons = Array.from(document.querySelectorAll("[data-map-zoom]"));
const calculatorForm = document.getElementById("roc-calculator");
const reportRows = Array.from(document.querySelectorAll("[data-report-row]"));
const calculatorOutput = document.getElementById("roc-calc-output");
const clearCalculatorButton = document.querySelector("[data-calc-clear]");

const allSites = [
  ...groupControls.map((site) => ({ ...site, type: "control" })),
  ...monitoringPosts.map((site) => ({ ...site, type: site.id.includes("hq") ? "control" : "post" }))
];

const project = ({ lat, lon }) => ({
  x: ((lon - mapBounds.west) / (mapBounds.east - mapBounds.west)) * mapBounds.width + mapOverlayOffset.x,
  y: ((mapBounds.north - lat) / (mapBounds.north - mapBounds.south)) * mapBounds.height + mapOverlayOffset.y
});

const mapZoomLevels = [1, 1.35, 1.8, 2.35];

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

const createSvgElement = (tag, attributes = {}) => {
  const element = document.createElementNS("http://www.w3.org/2000/svg", tag);
  Object.entries(attributes).forEach(([key, value]) => {
    element.setAttribute(key, String(value));
  });
  return element;
};

const toRadians = (value) => (value * Math.PI) / 180;

const numberedPosts = monitoringPosts
  .filter((site) => site.number)
  .sort((first, second) => {
    const groupDiff = Number(first.group) - Number(second.group);
    if (groupDiff !== 0) return groupDiff;
    return Number(first.number) - Number(second.number);
  });

const toLocalPoint = (site, origin) => {
  const latKm = 110.574;
  const lonKm = 111.32 * Math.cos(toRadians(origin.lat));
  return {
    x: (site.lon - origin.lon) * lonKm,
    y: (site.lat - origin.lat) * latKm
  };
};

const fromLocalPoint = (point, origin) => {
  const latKm = 110.574;
  const lonKm = 111.32 * Math.cos(toRadians(origin.lat));
  return {
    lat: origin.lat + point.y / latKm,
    lon: origin.lon + point.x / lonKm
  };
};

const lineIntersection = (first, second, origin) => {
  const firstPoint = toLocalPoint(first.site, origin);
  const secondPoint = toLocalPoint(second.site, origin);
  const firstBearing = toRadians(first.bearing);
  const secondBearing = toRadians(second.bearing);
  const firstVector = { x: Math.sin(firstBearing), y: Math.cos(firstBearing) };
  const secondVector = { x: Math.sin(secondBearing), y: Math.cos(secondBearing) };
  const cross = firstVector.x * secondVector.y - firstVector.y * secondVector.x;
  if (Math.abs(cross) < 0.0001) return null;

  const delta = { x: secondPoint.x - firstPoint.x, y: secondPoint.y - firstPoint.y };
  const t = (delta.x * secondVector.y - delta.y * secondVector.x) / cross;
  return {
    x: firstPoint.x + firstVector.x * t,
    y: firstPoint.y + firstVector.y * t
  };
};

const calculateFix = (reports) => {
  const origin = {
    lat: reports.reduce((total, report) => total + report.site.lat, 0) / reports.length,
    lon: reports.reduce((total, report) => total + report.site.lon, 0) / reports.length
  };
  const intersections = [];

  reports.forEach((first, firstIndex) => {
    reports.slice(firstIndex + 1).forEach((second) => {
      const point = lineIntersection(first, second, origin);
      if (point) intersections.push({ point, pair: `${first.site.number}/${second.site.number}` });
    });
  });

  if (intersections.length < 2) return null;

  const mean = intersections.reduce(
    (total, intersection) => ({
      x: total.x + intersection.point.x / intersections.length,
      y: total.y + intersection.point.y / intersections.length
    }),
    { x: 0, y: 0 }
  );
  const fix = fromLocalPoint(mean, origin);
  const spread = intersections.reduce((largest, intersection) => {
    const distance = Math.hypot(intersection.point.x - mean.x, intersection.point.y - mean.y);
    return Math.max(largest, distance);
  }, 0);

  return { fix, intersections, spread };
};

const renderLinks = () => {
  linkLayer.innerHTML = "";
  if (!state.controls || !state.posts) return;

  monitoringPosts.forEach((post) => {
    const control = groupControls.find((site) => site.group === post.group);
    if (!control) return;

    const start = project(post);
    const end = project(control);
    linkLayer.append(
      createSvgElement("line", {
        x1: start.x,
        y1: start.y,
        x2: end.x,
        y2: end.y,
        class: "roc-link"
      })
    );
  });
};

const renderPoints = () => {
  pointLayer.innerHTML = "";

  allSites.forEach((site) => {
    if (site.type === "control" && !state.controls) return;
    if (site.type === "post" && !state.posts) return;

    const point = project(site);
    const button = createSvgElement("g", {
      class: `roc-point roc-point-${site.type}${state.selectedId === site.id ? " is-selected" : ""}`,
      tabindex: "0",
      role: "button",
      "aria-label": `${site.name}, ${site.type === "control" ? "Group Control" : "Monitoring Post"}`,
      "data-site-id": site.id,
      transform: `translate(${point.x.toFixed(2)} ${point.y.toFixed(2)})`
    });

    button.append(createSvgElement("rect", { class: "roc-point-hit", x: -8, y: -10, width: 42, height: 20 }));
    button.append(createSvgElement("circle", { r: site.type === "control" ? 5.7 : 4.4 }));

    if (site.type === "control" || site.number) {
      const label = createSvgElement("text", { x: 8, y: 3 });
      label.textContent = site.type === "control" ? site.group : site.number;
      button.append(label);
    }

    pointLayer.append(button);
  });
};

const renderSelected = () => {
  const site = allSites.find((item) => item.id === state.selectedId) || allSites[0];
  if (!site || !(selectedPanel instanceof HTMLElement)) return;

  const source = site.type === "control" ? "SubBrit Group HQ list" : "SubBrit public post index";
  const postNumber = site.number ? `<div><dt>Post</dt><dd>No. ${site.number}</dd></div>` : "";
  selectedPanel.innerHTML = `
    <p class="roc-kicker">${site.type === "control" ? "Group Control" : "Monitoring Post"}</p>
    <h3>${site.name}</h3>
    <dl>
      <div><dt>Area</dt><dd>${site.place || site.name}</dd></div>
      ${postNumber}
      <div><dt>Group</dt><dd>No. ${site.group}</dd></div>
      <div><dt>Status</dt><dd>${site.status || site.sector}</dd></div>
      <div><dt>Source</dt><dd>${source}</dd></div>
    </dl>
  `;
};

const renderMapView = () => {
  if (!(svg instanceof SVGSVGElement)) return;
  const zoom = mapZoomLevels[state.mapZoomIndex] || 1;
  const width = mapBounds.width / zoom;
  const height = mapBounds.height / zoom;
  const selectedSite = allSites.find((item) => item.id === state.selectedId);
  const center =
    state.mapCenter || (selectedSite ? project(selectedSite) : { x: mapBounds.width / 2, y: mapBounds.height / 2 });
  const x = clamp(center.x - width / 2, 0, mapBounds.width - width);
  const y = clamp(center.y - height / 2, 0, mapBounds.height - height);
  state.mapView = { x, y, width, height };
  svg.setAttribute("viewBox", `${x.toFixed(2)} ${y.toFixed(2)} ${width.toFixed(2)} ${height.toFixed(2)}`);
  svg.classList.toggle("is-draggable", state.mapZoomIndex > 0);

  mapZoomButtons.forEach((button) => {
    if (!(button instanceof HTMLButtonElement)) return;
    const action = button.dataset.mapZoom;
    button.disabled =
      (action === "out" || action === "reset") && state.mapZoomIndex === 0
        ? true
        : action === "in" && state.mapZoomIndex === mapZoomLevels.length - 1;
  });
};

const render = () => {
  renderLinks();
  renderPoints();
  renderSelected();
  renderMapView();
};

const selectSite = (siteId) => {
  if (!allSites.some((site) => site.id === siteId)) return;
  state.selectedId = siteId;
  if (state.mapZoomIndex > 0) {
    const site = allSites.find((item) => item.id === siteId);
    state.mapCenter = site ? project(site) : state.mapCenter;
  }
  render();
};

const populateCalculator = () => {
  reportRows.forEach((row) => {
    const select = row.querySelector("[data-report-post]");
    if (!(select instanceof HTMLSelectElement)) return;
    select.innerHTML = '<option value="">Post number</option>';
    numberedPosts.forEach((site) => {
      const option = document.createElement("option");
      option.value = site.id;
      option.textContent = `${site.number} - ${site.name}`;
      select.append(option);
    });
  });
};

const setCalculatorMessage = (message, tone = "neutral") => {
  if (!(calculatorOutput instanceof HTMLElement)) return;
  calculatorOutput.dataset.tone = tone;
  calculatorOutput.innerHTML = `<span>${message}</span>`;
};

const readCalculatorReports = () =>
  reportRows.map((row) => {
    const select = row.querySelector("[data-report-post]");
    const input = row.querySelector("[data-report-bearing]");
    const site = select instanceof HTMLSelectElement ? numberedPosts.find((item) => item.id === select.value) : null;
    const bearing = input instanceof HTMLInputElement ? Number(input.value) : Number.NaN;
    return { site, bearing };
  });

calculatorForm?.addEventListener("submit", (event) => {
  event.preventDefault();
  const reports = readCalculatorReports();
  if (reports.some((report) => !report.site || !Number.isFinite(report.bearing))) {
    setCalculatorMessage("Enter three numbered posts and true bearings.", "warn");
    return;
  }
  if (new Set(reports.map((report) => report.site.id)).size !== reports.length) {
    setCalculatorMessage("Each report must use a different post.", "warn");
    return;
  }
  if (reports.some((report) => report.bearing < 0 || report.bearing >= 360)) {
    setCalculatorMessage("Bearings must be between 0 and 359.9 degrees.", "warn");
    return;
  }

  const result = calculateFix(reports);
  if (!result) {
    setCalculatorMessage("Reports do not produce a stable intersection.", "warn");
    return;
  }

  const pairRows = result.intersections
    .map((intersection) => {
      const fix = fromLocalPoint(intersection.point, {
        lat: reports.reduce((total, report) => total + report.site.lat, 0) / reports.length,
        lon: reports.reduce((total, report) => total + report.site.lon, 0) / reports.length
      });
      return `<div><span>${intersection.pair}</span><strong>${fix.lat.toFixed(4)}, ${fix.lon.toFixed(4)}</strong></div>`;
    })
    .join("");

  calculatorOutput.dataset.tone = "ready";
  calculatorOutput.innerHTML = `
    <div class="roc-calc-result">
      <div><span>Mean fix</span><strong>${result.fix.lat.toFixed(4)}, ${result.fix.lon.toFixed(4)}</strong></div>
      <div><span>Spread</span><strong>${result.spread.toFixed(2)} km</strong></div>
      <div><span>Fix status</span><strong>Ready for site identification</strong></div>
    </div>
    <div class="roc-calc-pairs">${pairRows}</div>
  `;
});

clearCalculatorButton?.addEventListener("click", () => {
  reportRows.forEach((row) => {
    const select = row.querySelector("[data-report-post]");
    const input = row.querySelector("[data-report-bearing]");
    if (select instanceof HTMLSelectElement) select.value = "";
    if (input instanceof HTMLInputElement) input.value = "";
  });
  setCalculatorMessage("Awaiting three post reports.");
});

toggles.forEach((toggle) => {
  toggle.addEventListener("click", () => {
    const key = toggle.dataset.layerToggle;
    if (!key || !(key in state)) return;
    state[key] = !state[key];
    toggle.classList.toggle("is-active", Boolean(state[key]));
    render();
  });
});

mapZoomButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const action = button.dataset.mapZoom;
    if (action === "in") {
      if (!state.mapCenter) {
        const selectedSite = allSites.find((item) => item.id === state.selectedId);
        state.mapCenter = selectedSite ? project(selectedSite) : { x: mapBounds.width / 2, y: mapBounds.height / 2 };
      }
      state.mapZoomIndex = clamp(state.mapZoomIndex + 1, 0, mapZoomLevels.length - 1);
    } else if (action === "out") {
      state.mapZoomIndex = clamp(state.mapZoomIndex - 1, 0, mapZoomLevels.length - 1);
      if (state.mapZoomIndex === 0) state.mapCenter = null;
    } else if (action === "reset") {
      state.mapZoomIndex = 0;
      state.mapCenter = null;
    }
    renderMapView();
  });
});

let activePanPointer = null;
let lastPanPoint = null;
let panStartPoint = null;
let didPanMap = false;

const panMap = (deltaX, deltaY) => {
  if (!(svg instanceof SVGSVGElement) || state.mapZoomIndex === 0) return;
  const rect = svg.getBoundingClientRect();
  if (!rect.width || !rect.height) return;
  const scaleX = state.mapView.width / rect.width;
  const scaleY = state.mapView.height / rect.height;
  const x = clamp(state.mapView.x - deltaX * scaleX, 0, mapBounds.width - state.mapView.width);
  const y = clamp(state.mapView.y - deltaY * scaleY, 0, mapBounds.height - state.mapView.height);
  state.mapCenter = {
    x: x + state.mapView.width / 2,
    y: y + state.mapView.height / 2
  };
  renderMapView();
};

svg?.addEventListener("pointerdown", (event) => {
  if (state.mapZoomIndex === 0) return;
  const target = event.target instanceof Element ? event.target.closest("[data-site-id]") : null;
  if (target) return;
  activePanPointer = event.pointerId;
  lastPanPoint = { x: event.clientX, y: event.clientY };
  panStartPoint = { x: event.clientX, y: event.clientY };
  didPanMap = false;
  svg.setPointerCapture(event.pointerId);
});

svg?.addEventListener("pointermove", (event) => {
  if (activePanPointer !== event.pointerId || !lastPanPoint) return;
  const deltaX = event.clientX - lastPanPoint.x;
  const deltaY = event.clientY - lastPanPoint.y;
  lastPanPoint = { x: event.clientX, y: event.clientY };
  if (panStartPoint && Math.hypot(event.clientX - panStartPoint.x, event.clientY - panStartPoint.y) > 4) {
    didPanMap = true;
    svg.classList.add("is-panning");
  }
  if (didPanMap) {
    panMap(deltaX, deltaY);
  }
});

const stopPanning = (event) => {
  if (activePanPointer !== event.pointerId) return;
  activePanPointer = null;
  lastPanPoint = null;
  panStartPoint = null;
  svg?.classList.remove("is-panning");
};

svg?.addEventListener("pointerup", stopPanning);
svg?.addEventListener("pointercancel", stopPanning);
svg?.addEventListener("lostpointercapture", () => {
  activePanPointer = null;
  lastPanPoint = null;
  panStartPoint = null;
  svg?.classList.remove("is-panning");
});

svg?.addEventListener("click", (event) => {
  if (didPanMap) {
    didPanMap = false;
    return;
  }
  const target = event.target instanceof Element ? event.target.closest("[data-site-id]") : null;
  if (!(target instanceof Element)) return;
  selectSite(target.getAttribute("data-site-id") || "");
});

svg?.addEventListener("keydown", (event) => {
  if (event.key !== "Enter" && event.key !== " ") return;
  const target = event.target instanceof Element ? event.target.closest("[data-site-id]") : null;
  if (!(target instanceof Element)) return;
  event.preventDefault();
  selectSite(target.getAttribute("data-site-id") || "");
});

populateCalculator();
render();
