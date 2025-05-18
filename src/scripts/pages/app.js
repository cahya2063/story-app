import routes from "../routes/routes";
import { getActiveRoute } from "../routes/url-parser";
import { generateSubscribeButtonTemplate, generateUnsubscribeButtonTemplate, headerLogin, headerNotLogin } from "../template";
import { isServiceWorkerAvailable } from "../utils";
import { 
  isCurrentPushSubscriptionAvailable,
  subscribe,
  unsubscribe
} from "../utils/notification-helper";

class App {
  #content = null;
  #drawerButton = null;
  #navigationDrawer = null;

  constructor({ navigationDrawer, drawerButton, content }) {
    this.#content = content;
    this.#drawerButton = drawerButton;
    this.#navigationDrawer = navigationDrawer;

    this._setupDrawer();
    this._initialisation();
  }

  _setupDrawer() {
    this.#drawerButton.addEventListener("click", () => {
      this.#navigationDrawer.classList.toggle("open");
    });

    document.body.addEventListener("click", (event) => {
      if (
        !this.#navigationDrawer.contains(event.target) &&
        !this.#drawerButton.contains(event.target)
      ) {
        this.#navigationDrawer.classList.remove("open");
      }

      this.#navigationDrawer.querySelectorAll("a").forEach((link) => {
        if (link.contains(event.target)) {
          this.#navigationDrawer.classList.remove("open");
        }
      });
    });
  }

  _initialisation() {
    this.#setupNavigationList();

    window.addEventListener("auth-change", () => {
      this.#setupNavigationList();
    });
  }

  #setupNavigationList() {
    const isLoggedIn = !!localStorage.getItem("token");
    const navListMain = document.getElementById("navlist-main");
    const navList = document.getElementById("navlist");

    navListMain.innerHTML = "";
    navList.innerHTML = isLoggedIn ? headerLogin() : headerNotLogin();

    if (isLoggedIn) {
      const logoutButton = document.getElementById("logout-button");
      logoutButton?.addEventListener("click", (e) => {
        e.preventDefault();
        this.logout();
      });
    }
  }

  async #setupPushNotification(){
    console.log('setupPushNotification');
    const pushNotificationTools = document.getElementById('push-notification-tools')
    const isSubscribed = await isCurrentPushSubscriptionAvailable()
    console.log('isSubscribe', isSubscribed);
    
    if(isSubscribed){
      
      pushNotificationTools.innerHTML = generateUnsubscribeButtonTemplate()
      document.getElementById('unsubscribe-button').addEventListener('click', ()=>{
        unsubscribe().finally(()=>{
          this.#setupPushNotification()
        })
      })

      return
    }

    pushNotificationTools.innerHTML = generateSubscribeButtonTemplate()
    document.getElementById('subscribe-button').addEventListener('click', ()=>{
      subscribe().finally(()=>{
        this.#setupPushNotification()
      })
    })


  }



  logout() {
    if (confirm("apakah anda ingin logout?")) {
      localStorage.removeItem("token");
      window.dispatchEvent(new Event("auth-change"));
      window.location.hash = "#/login";
    }
  }

  async renderPage() {
  const url = getActiveRoute();
  const route = routes[url];
  const page = route ? route.page : routes["/404"].page;
  const auth = route ? route.auth : false;

  const token = localStorage.getItem("token");
  if (auth && !token) {
    window.location.hash = "#/login";
    return;
  }

  if (!document.startViewTransition) {
    this.#content.innerHTML = await page.render();
    await page.afterRender?.();
  } else {
    const transition = document.startViewTransition(async () => {
      this.#content.innerHTML = await page.render();
      await page.afterRender?.();
    });

    transition.updateCallbackDone.then(() => {
      scrollTo({ top: 0, behavior: "instant" });
      this.#setupNavigationList();

      if (isServiceWorkerAvailable()) {
        this.#setupPushNotification();
      }
    });
  }
}

  
}

export default App;
