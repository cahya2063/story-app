// CSS imports
import "../styles/styles.css";

import App from "./pages/app";
import { registerServiceWorker } from "./utils";
import { Workbox } from 'workbox-window';
document.addEventListener("DOMContentLoaded", async () => {
  const app = new App({
    content: document.querySelector("#main-content"),
    drawerButton: document.querySelector("#drawer-button"),
    navigationDrawer: document.querySelector("#navigation-drawer"),
  });

   const skipToContent = document.querySelector('.skip-link');
    skipToContent.addEventListener('click', (event) => {
      event.preventDefault(); // Mencegah perubahan hash
      document.querySelector('#main-content').focus();
    });


    skipToContent.addEventListener('keypress', (event) => {
      if (event.key === 'Enter') {
        event.preventDefault(); // Tambahkan ini juga untuk keypress
        document.querySelector('#main-content').focus();
      }
    });

  await app.renderPage();
  if ('serviceWorker' in navigator) {
    const wb = new Workbox('./sw.bundle.js');
    wb.register();
  }



  window.addEventListener("hashchange", async () => {
    await app.renderPage();
  });
});
