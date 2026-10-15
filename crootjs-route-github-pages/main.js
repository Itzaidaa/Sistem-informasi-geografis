import { setInner, onClick, getValue, show, hide } from "https://cdn.jsdelivr.net/gh/crootjs/lib@0.0.16/element.min.js";
import { getGeoJSON } from "https://cdn.jsdelivr.net/gh/crootjs/lib@0.0.16/geo.js";
import {
  createMap, addGeoJSON, fitMap, onMapClick, clearMap, setMapView
} from "https://cdn.jsdelivr.net/gh/crootjs/lib@0.0.16/map.js";

const MAP_ID = "map";
const DATA_URL = "./data/roads.geojson";
const state = { roads: null, start: null, end: null, picking: null, routeLayer: null, markerLayer: null };

function status(message, kind = "") {
  $("status").className = `status ${kind}`;
  setInner("status", message);
}
function $(id) { return document.getElementById(id); }
function fmtCoord(p) { return `${p[1].toFixed(6)}, ${p[0].toFixed(6)}`; }
function setPoint(which, coord) {
  state[which] = coord;
  setInner(which === "start" ? "startCoords" : "endCoords", fmtCoord(coord));
  drawMarkers();
}
function drawMarkers() {
  if (!state.roads) return;
  if (state.markerLayer) state.markerLayer();
  const features = [];
  if (state.start) features.push({
    type: "Feature",
    properties: { label: getValue("startName") || "Berangkat", type: "Berangkat" },
    geometry: { type: "Point", coordinates: state.start }
  });
  if (state.end) features.push({
    type: "Feature",
    properties: { label: getValue("endName") || "Tujuan", type: "Tujuan" },
    geometry: { type: "Point", coordinates: state.end }
  });
  if (features.length) {
    state.markerLayer = addGeoJSON(MAP_ID, { type: "FeatureCollection", features }, {
      style: feature => ({
        fill: feature.properties.type === "Berangkat" ? "#16a34a" : "#e11d48",
        stroke: "#ffffff",
        strokeWidth: 2,
        radius: 8
      }),
      popup: feature => feature.properties.label
    });
  }
}
function distanceText(m) {
  return m < 1000 ? `${Math.round(m)} m` : `${(m / 1000).toFixed(2)} km`;
}
function clearRoute() {
  if (state.routeLayer) {
    state.routeLayer();
    state.routeLayer = null;
  }
}
function showRoute(feature) {
  clearRoute();
  state.routeLayer = addGeoJSON(MAP_ID, feature, {
    style: { stroke: "#0284c7", strokeWidth: 6, strokeOpacity: 0.95 },
    popup: feature => `${feature.properties.distance ? distanceText(feature.properties.distance) : "Rute"}`
  });
  fitMap(MAP_ID, feature, 56);
}
function initMap() {
  createMap(MAP_ID, { center: [107.5715, -6.8690], zoom: 14 });
  getGeoJSON(DATA_URL, response => {
    if (response.status !== 200 || !response.data) {
      status("Gagal memuat data/roads.geojson. Periksa file dan jalankan lewat GitHub Pages atau server lokal.", "error");
      return;
    }
    state.roads = response.data;
    state.start = [107.575689, -6.874305];
    state.end = [107.5673, -6.8638];
    setInner("startCoords", fmtCoord(state.start));
    setInner("endCoords", fmtCoord(state.end));
    addGeoJSON(MAP_ID, state.roads, {
      style: feature => ({
        stroke: feature.properties.highway === "tertiary" ? "#9aa8b8" : "#c0cbd7",
        strokeWidth: feature.properties.highway === "tertiary" ? 3 : 2,
        strokeOpacity: 0.9
      }),
      popup: feature => feature.properties.name || "Jalan"
    });
    fitMap(MAP_ID, state.roads, 32);
    onMapClick(MAP_ID, position => {
      if (!state.picking) return;
      setPoint(state.picking, position);
      state.picking = null;
      $("pickStart").classList.remove("active");
      $("pickEnd").classList.remove("active");
      status("Titik tersimpan. Pilih titik lain atau tekan “Cari rute jalan”.", "ok");
    });
    status("Titik ULBI dan Bumi Sariwangi 2 siap. Tekan “Cari rute jalan” untuk meminta rute melalui jaringan jalan.", "ok");
  });
}

onClick("pickStart", () => {
  state.picking = "start";
  $("pickStart").classList.add("active");
  $("pickEnd").classList.remove("active");
  status("Klik lokasi titik berangkat pada peta.");
});
onClick("pickEnd", () => {
  state.picking = "end";
  $("pickEnd").classList.add("active");
  $("pickStart").classList.remove("active");
  status("Klik lokasi titik tujuan pada peta.");
});
onClick("reset", () => {
  state.start = null;
  state.end = null;
  state.picking = null;
  clearRoute();
  if (state.markerLayer) { state.markerLayer(); state.markerLayer = null; }
  setInner("startCoords", "Belum dipilih");
  setInner("endCoords", "Belum dipilih");
  hide("result");
  $("pickStart").classList.remove("active");
  $("pickEnd").classList.remove("active");
  if (state.roads) fitMap(MAP_ID, state.roads, 32);
  status("Pilihan titik direset.");
});
onClick("zoomFit", () => {
  if (state.roads) fitMap(MAP_ID, state.roads, 32);
});
onClick("findRoute", async () => {
  if (!state.start || !state.end) {
    status("Pilih titik berangkat dan titik tujuan terlebih dahulu.", "error");
    return;
  }
  // OSRM mengembalikan geometri rute jalan; peta dan gambar rute tetap memakai CrootJS.
  const button = $("findRoute");
  button.disabled = true;
  button.textContent = "Menghitung rute…";
  status("Menghubungi layanan routing untuk mencari rute jalan…");
  const coords = `${state.start[0]},${state.start[1]};${state.end[0]},${state.end[1]}`;
  const url = `https://router.project-osrm.org/route/v1/driving/${coords}?overview=full&geometries=geojson`;
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const data = await response.json();
    if (data.code !== "Ok" || !data.routes || !data.routes.length) {
      throw new Error(data.message || "Rute tidak ditemukan");
    }
    const best = data.routes[0];
    const routeFeature = {
      type: "Feature",
      properties: { name: "Rute jalan", distance: best.distance, duration: best.duration },
      geometry: best.geometry
    };
    showRoute(routeFeature);
    setInner("distance", distanceText(best.distance));
    const minutes = Math.round(best.duration / 60);
    setInner("routeMessage", `${getValue("startName") || "Berangkat"} → ${getValue("endName") || "Tujuan"}. Estimasi waktu berkendara sekitar ${minutes} menit, tanpa memperhitungkan kondisi lalu lintas.`);
    show("result");
    status("Rute jalan berhasil ditemukan dan ditampilkan pada peta.", "ok");
  } catch (error) {
    status(`Rute gagal dimuat: ${error.message}. Periksa koneksi internet lalu coba lagi.`, "error");
  } finally {
    button.disabled = false;
    button.textContent = "Cari rute jalan";
  }
});

initMap();
