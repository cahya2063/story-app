import LoginPresenter from "./login-presenter";

export default class LoginPage {
  constructor() {
    this._showError = this.showError.bind(this);
    this.presenter = new LoginPresenter({
      showError: this._showError,
    });
  }

  async render() {
    return `
      <section class="form-page">
      <form id="login-form" class="form-card">
        <div id="loginError" class="error-message" style="display:none"></div>
          <h1>Login</h1>
          <label for="email">Email</label>
          <input id="email" name="email" type="text" placeholder="you@example.com" required />

          <label for="password">Password</label>
          <input id="password" name="password" type="password" placeholder="********" required />

          <button type="submit">Login</button>
          <p>Belum punya akun? <a href="#/register">Buat akun</a></p>
        </form>
      </section>
    `;
  }

  showError(message) {
    const errorElement = document.getElementById("loginError");
    if (errorElement) {
      errorElement.textContent = message;
      errorElement.style.display = "block";
      setTimeout(() => {
        errorElement.style.display = "none";
      }, 5000);
    }
  }
  async afterRender() {
    const form = document.getElementById("login-form");
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const email = e.target.email.value;
      const password = e.target.password.value;

      await this.presenter.manageLogin({ email, password });
    });
  }
}
