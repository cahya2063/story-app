import MapStory from "../../utils/map";
import HomePresenter from "./home-presenter";
import { saveStory, checkIfStorySaved } from "../../data/database";
export default class HomePage {
  constructor() {
    this._map = null;
    this._marker = [];
    this.mapStory = null;
    this.stories = [];
    this.saveButtons = [];
  }
  async render() {
    return `
      <div class="loader">
        <span class="spinner"></span>
      </div>

      
      <h1>Home Page</h1>
      <section class="home">
        <div id="daftar-story"></div>
        <div id="map" style="height: 400px; margin-top: 60px;"></div>
      </section>
    `;
  }

  async afterRender() {
    // Do your job here
    this.initialisationMap();
    const presenter = new HomePresenter(this);
    await presenter.showStories();

    
  }

  initialisationMap() {
    this.mapStory = new MapStory("map");

    this._map = this.mapStory.getMap();
    this._marker = [];
  }

  async renderStory(storys) {
    const list = document.getElementById("daftar-story");
    list.innerHTML = storys
      .map((story) => {
        return `
        <div class="card" data-id="${story.id}" data-lat="${
          story.lat || ""
        }" data-lon="${story.lon || ""}">
          <div class="card-img-holder">
            <img src="${story.photoUrl}" alt="Gambar content">
          </div>
          <p class="description">
          description : ${story.description} <br><br>
          ${
            story.lat && story.lon
              ? `

            latitude : ${story.lat.toFixed(6)} <br>
            longitude : ${story.lon.toFixed(6)}
            `
              : ""
          }
          </p>
          
          <div class="options">
            <span>
              by : ${story.name}
            </span>

          </div>
          <button class="save-btn btn" data-id="${story.id}">
            Simpan
          </button>
        </div>
      `;
      })
      .join("");
    this.stories = storys;
    this.createMarker(storys);
    this.setupSaveButtons()
  }

  setupSaveButtons() {
    const buttons = document.querySelectorAll(".save-btn");

  buttons.forEach((button) => {
    button.addEventListener("click", this.handleSaveClick.bind(this));
  });
  }

  async handleSaveClick(e) {
    const button = e.currentTarget;
    button.disabled = true;

    try {
      const storyId = button.dataset.id;
      const story = this.stories.find((s) => s.id === storyId);

      if (!story) return;

      const isCurrentlySaved = await checkIfStorySaved(storyId);
      if (isCurrentlySaved) {
        alert("Cerita ini sudah disimpan sebelumnya");
        return;
      }

      console.log(story);
      
      await saveStory(story);
      alert("Cerita berhasil disimpan!");
    } catch (error) {
      console.error("Gagal menyimpan cerita:", error);
      alert("Gagal menyimpan cerita");
    } finally {
      button.disabled = false;
    }
  }

  createMarker(storys) {
    this.mapStory.createMarker(storys);
    this._marker = this.mapStory.markers;
  }

  showError(message) {
    const errorContainer = document.getElementById("daftar-story");
    errorContainer.innerHTML = `<p style="color:red;">${message}</p>`;
  }

  showLoading() {
    document.querySelector(".loader").style.display = "flex";
  }

  hideLoading() {
    document.querySelector(".loader").style.display = "none";
  }
}
