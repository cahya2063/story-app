import { login } from "../../../data/api";

class LoginPresenter {
  constructor(view) {
    this._view = view;
  }

  async manageLogin({ email, password }) {
    if (password.length < 8) {
      this._view.showError("Minimal password 8 karakter nihh");
      return;
    }

    try {
      const { error, loginResult } = await login({ email, password });

      if (error) {
        this._view.showError("Email atau password salah");
        return;
      }

      localStorage.setItem("token", loginResult.token);
      window.dispatchEvent(
        new CustomEvent("auth-change", {
          detail: { isLoggedIn: true },
        })
      );
      window.location.hash = "#/";
    } catch (error) {
      this._view.showError(error.message);
    }
  }
}

export default LoginPresenter;
