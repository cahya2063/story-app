import HomePage from '../pages/home/home-page';
import CreateStory from '../pages/create/create-story-page';
import LoginPage from '../pages/auth/login/login-page';
import RegisterPage from '../pages/auth/register/register-page';

const routes = {
  "/": {
    page: new HomePage(),
    auth: true,
  },
  "/create": {
    page: new CreateStory(),
    auth: true,
  },
  "/login": {
    page: new LoginPage(),
    auth: false,
  },
  "/register": {
    page: new RegisterPage(),
    auth: false,
  },
  
};

export default routes;
