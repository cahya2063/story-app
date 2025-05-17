import L from "leaflet";

class MapStory {
  constructor(idContainer) {
    this.map = L.map(idContainer, {
      center: [-6.9025, 107.6186],
      zoom: 5,
      scrollWheelZoom: true,
    });

    this.markers = [];
    this.baseLayer();
  }

  baseLayer() {
    const osm = L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(this.map);

    const osmHOT = L.tileLayer(
      "https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png",
      {
        attribution:
          '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }
    );

    const openTopoMap = L.tileLayer(
      "https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png",
      {
        attribution:
          'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }
    );

    this.baseLayers = {
      openStreetMap: osm,
      "openStreetMap.HOT": osmHOT,
      openToMap: openTopoMap,
    };
    L.control.layers(this.baseLayers).addTo(this.map);
  }

  createMarker(storys) {
    this.deleteMarker();

    storys
      .filter((story) => {
        return story.lat && story.lon;
      })
      .forEach((story) => {
        const marker = L.marker([story.lat, story.lon]).addTo(this.map);
        marker.bindPopup(`<b>${story.name}</b>`).openPopup();
        this.markers.push(marker);
      });
  }

  deleteMarker() {
    this.markers.forEach((marker) => {
      return this.map.removeLayer(marker);
    });
    this.markers = [];
  }

  getMap() {
    return this.map;
  }
}

export default MapStory;
