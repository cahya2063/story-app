import L from "leaflet";
import { createStory } from "../../data/api";
class CreateStoryPresenter {
  constructor({ view }) {
    this.view = view;
    this.stream = null;
    this.currentLat = null;
    this.currentLng = null;
    this.map = null;
    this.marker = null;
  }

  async initCamera() {
    try {
      this.stream = await navigator.mediaDevices.getUserMedia({ video: true });
      this.view.showCamera(this.stream);
    } catch (err) {
      this.view.showError('Gagal mengakses kamera.');
      console.error(err);
    }
  }

  capturePhoto(videoElem, canvasElem, photoInputElem, photoPreviewElem, captureButton) {
    const context = canvasElem.getContext('2d');
    canvasElem.width = videoElem.videoWidth;
    canvasElem.height = videoElem.videoHeight;
    context.drawImage(videoElem, 0, 0);

    const dataURL = canvasElem.toDataURL('image/jpeg');
    photoPreviewElem.src = dataURL;
    photoPreviewElem.style.display = 'block';
    captureButton.disabled = true;

    canvasElem.toBlob((blob) => {
      const file = new File([blob], 'photo.jpg', { type: 'image/jpeg' });
      const dataTransfer = new DataTransfer();
      dataTransfer.items.add(file);
      photoInputElem.files = dataTransfer.files;
    }, 'image/jpeg');
  }

  async initMap(mapContainerId) {
    const defaultLat = 0;
    const defaultLng = 0;

    this.map = L.map(mapContainerId).setView([defaultLat, defaultLng], 2);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
    }).addTo(this.map);

    this.map.on('click', (e) => {
      const { lat, lng } = e.latlng;
      this.updateMarker(lat, lng);
    });
  }

  useMyLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          this.map.setView([latitude, longitude], 13);
          this.updateMarker(latitude, longitude);
        },
        (error) => {
          this.view.showError('Gagal mendapatkan lokasi Anda.');
          console.error(error);
        }
      );
    } else {
      this.view.showError('Geolocation tidak didukung oleh browser Anda.');
    }
  }

  updateMarker(lat, lng) {
    this.currentLat = lat;
    this.currentLng = lng;
    if (this.marker) {
      this.marker.setLatLng([lat, lng]);
    } else {
      this.marker = L.marker([lat, lng], { draggable: true }).addTo(this.map);
      this.marker.bindPopup(`Lokasi dipilih: ${lat.toFixed(4)}, ${lng.toFixed(4)}`).openPopup();

      this.marker.on('dragend', (e) => {
        const position = e.target.getLatLng();
        this.updateMarker(position.lat, position.lng);
      });
    }
  }

  async submitForm(form, photoInput, photoPreview) {
    const description = form.description.value;
    const photoFile = photoInput.files[0];
    const errorElem = document.getElementById('addStoryError');
    const successElem = document.getElementById('addStorySuccess');

    if (!photoFile) {
      errorElem.textContent = 'Mohon pilih atau ambil foto terlebih dahulu.';
      return;
    }

    const formData = new FormData();
    formData.append('description', description);
    formData.append('photo', photoFile);

    if (this.currentLat && this.currentLng) {
      formData.append('lat', this.currentLat);
      formData.append('lon', this.currentLng);
    }

    try {
      const token = localStorage.getItem('token');
      const result = await createStory(formData, token);
      successElem.textContent = 'Story berhasil ditambahkan!';
      errorElem.textContent = '';
      form.reset();
      photoPreview.style.display = 'none';
      if (this.stream) {
        this.stream.getTracks().forEach((track) => track.stop());
      }

      if (!result.error) {
        window.location.hash = "/";
      }
    } catch (err) {
      errorElem.textContent = err.message;
      successElem.textContent = '';
    }
  }

  stopCamera() {
    if (this.stream) {
      this.stream.getTracks().forEach((track) => track.stop());
    }
  }
}

export default CreateStoryPresenter;
