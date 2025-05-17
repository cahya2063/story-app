import { API_URL } from "../config";


const ENDPOINTS = {
  REGISTER: `${API_URL.BASE_URL}/register`,
  LOGIN: `${API_URL.BASE_URL}/login`,
  STORY: `${API_URL.BASE_URL}/stories`,
  SUBSCRIBE: `${API_URL.BASE_URL}/notifications/subscribe`,
  UNSUBSCRIBE: `${API_URL.BASE_URL}/notifications/subscribe`
};

export async function login({ email, password }) {
  try {
    const response = await fetch(ENDPOINTS.LOGIN, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();
    if (!response.ok) {
      return {
        error: true,
        message: data.message || "Login gagal",
      };
    }

    return {
      error: false,
      loginResult: data.loginResult,
    };
  } catch (error) {
    return {
      error: true,
      message: "Terjadi kesalahan jaringan",
    };
  }
}

export async function createStory(formData, token) {
    const response = await fetch(`${ENDPOINTS.STORY}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Gagal menambahkan story');
    }
  
    return await response.json();

}

export async function register({ name, email, password }) {
  const response = await fetch(ENDPOINTS.REGISTER, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, password }),
  });
  const responseJson = await response.json();

  return { ...responseJson, ok: response.ok };
}

export async function viewStories(token) {
  try {
    const url = new URL(`${ENDPOINTS.STORY}`);

    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      return {
        error: true,
        message: errorData.message || "Network error",
        listStory: [],
      };
    }

    const data = await response.json();
    return {
      error: false,
      listStory: data.listStory || [],
      message: data.message || "Success",
    };
  } catch (error) {
    console.error("Fetch error:", error);
    return {
      error: true,
      message: error.message || "Network error",
      listStory: [],
    };
  }
}

export async function subscribePushNotification({endpoint, keys:{p256dh, auth}}) {
  const accessToken = localStorage.getItem('token')
  const data = JSON.stringify({
    endpoint,
    keys: {p256dh, auth}
  })

  const fetchResponse = await fetch(ENDPOINTS.SUBSCRIBE, {
    method: 'POST',
    headers:{
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}`
    },
    body: data
  })

  const json = await fetchResponse.json()

  return{
    ...json,
    ok: fetchResponse.ok
  }
}

export async function unsubscribePushNotification({endpoint}) {
  const accessToken = localStorage.getItem('token')
  const data = JSON.stringify({endpoint})

  const fetchResponse = await fetch(ENDPOINTS.UNSUBSCRIBE, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}`
    },
    body: data
  })

  const json = fetchResponse.json()

  return {
    ...json,
    ok: fetchResponse.ok
  }
}










