import { viewStories } from "../../data/api";

class HomePresenter {
  constructor(view) {
    this._view = view;
  }

  async showStories() {
    try {
      this._view.showLoading();

      const token = localStorage.getItem("token");
      if (!token) {
        window.location.hash = "#/login";
        return;
      }

      const { listStory, error } = await viewStories(token, true);
      if (error) throw new Error(error.message || "sepertinya ada masalah");

      // TUNGGU loading selesai, lalu render data
      setTimeout(() => {
        this._view.hideLoading();
        this._view.renderStory(listStory);
      }, 1000);
    } catch (error) {
      this._view.showError(error.message);
      this._view.hideLoading();
    }
  }
}

export default HomePresenter;
