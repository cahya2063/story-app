export function headerLogin() {
  return `
        <li id="push-notification-tools" class="push-notification-tools"></li>
        <li>
          <a href="#/" id="home-button">
            <i class="fas fa-home"></i> Lihat cerita
          </a>
        </li>
        <li>
          <a href="#/create" id="add-button">
            <i class="fas fa-plus-circle"></i> Buat Ceritamu
          </a>
        </li>
        <li>
          <a href="#/save-story" id="home-button">
            <i class="fas fa-bookmark"></i> Simpan Cerita
          </a>
        </li>
        <li>
          <button id="logout-button">
            <i class="fas fa-sign-out-alt"></i>Keluar
          </button>
        </li>
      `;
}

export function headerNotLogin() {
  return `
        <li id="push-notification-tools" class="push-notification-tools"></li>
        <li><a href="#/login" id="login-button">Login</a></li>
        <li><a href="#/register" id="register-button">Register</a></li>
      `;
}

export function generateSubscribeButtonTemplate() {
  return `
    <button id="subscribe-button" class="btn subscribe-button">
      Subscribe <i class="fas fa-bell"></i>
    </button>
  `;
}

export function generateUnsubscribeButtonTemplate() {
  return `
    <button id="unsubscribe-button" class="btn unsubscribe-button">
      Unsubscribe <i class="fas fa-bell-slash"></i>
    </button>
  `;
}