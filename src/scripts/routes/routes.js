import HomePage from '../pages/home/home-page';
import CreateStory from '../pages/create/create-story-page';
import LoginPage from '../pages/auth/login/login-page';
import RegisterPage from '../pages/auth/register/register-page';
import BookmarkPage from '../pages/bookmark/bookmark-page';
import NotFound from '../pages/not-found/not-found';

const routes = {
  "/": {
    page: new HomePage(),
    auth: true,
  },
  "/create": {
    page: new CreateStory(),
    auth: true,
  },
  '/save-story': {
    page: new BookmarkPage(),
    auth: true
  },
  "/login": {
    page: new LoginPage(),
    auth: false,
  },
  "/register": {
    page: new RegisterPage(), 
    auth: false,
  },
  "/404": {
    page: new NotFound(),
    requiresAuth: false,
  },
  "*": {
    page: new NotFound(),
    requiresAuth: false,
  },
  
};

export default routes;
