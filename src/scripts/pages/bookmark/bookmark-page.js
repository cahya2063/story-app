import { getSavedStories, deleteStory } from "../../data/database.js";

class BookmarkPage {
  async render() {
    return `
      <div class="loader">
        <span class="spinner"></span>
      </div>

      <h1>Daftar Cerita Tersimpan</h1>
      <section class="home">
        <div id="saved-story-list"></div>
      </section>
    `;
  }

  async afterRender() {
    await this.showSavedStories();
  }

  async showSavedStories() {
      try {
        this.showLoading();
        const savedStories = await getSavedStories();
        setTimeout(()=>{
            this.hideLoading()
            this.renderSavedStories(savedStories);

        }, 1000)
    } catch (error) {
      console.error("Error loading saved stories:", error);
      const container = document.getElementById("saved-story-list");
      if (container) {
        container.innerHTML = `
          <p class="error-message">Gagal memuat cerita tersimpan</p>
        `;
      }
    } 
  }

  renderSavedStories(stories) {
    const container = document.getElementById("saved-story-list");

    if (!container) {
      console.error("Container element not found");
      return;
    }

    if (stories.length === 0) {
      container.innerHTML =
        '<p style="text-align:center;">Belum ada cerita yang disimpan.</p>';
      return;
    }

    container.innerHTML = stories
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
          <button class="delete-btn btn" aria-label="Hapus cerita">
            <i class="material-icons">Hapus</i>
          </button>
        </div>
      `;
      })
      .join("");

    this.setupDeleteButtons();
  }

  setupDeleteButtons() {
    document.querySelectorAll(".delete-btn").forEach((button) => {
      button.addEventListener("click", async (e) => {
        const storyElement = e.target.closest(".card");
        if (!storyElement) return;

        const storyId = storyElement.dataset.id;
        if (!storyId) return;

        if (confirm("Apakah Anda yakin ingin menghapus cerita ini?")) {
          try {
            await deleteStory(storyId);
            storyElement.remove();

            const container = document.getElementById("saved-story-list");
            if (
              container &&
              container.querySelectorAll(".card").length === 0
            ) {
              container.innerHTML =
                '<p class="empty-message">Belum ada cerita yang disimpan.</p>';
            }
          } catch (error) {
            console.error("Gagal menghapus cerita:", error);
            alert("Gagal menghapus cerita");
          }
        }
      });
    });
  }

  showLoading() {
    const loader = document.querySelector(".loader");
    if (loader) loader.style.display = "flex";
  }

  hideLoading() {
    const loader = document.querySelector(".loader");
    if (loader) loader.style.display = "none";
  }
}

export default BookmarkPage;
