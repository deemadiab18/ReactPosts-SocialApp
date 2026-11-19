import { createBrowserRouter } from "react-router-dom";
import MainLayout from "../layout/MainLayout/MainLayout";
import Profile from "../pages/profile/Profile";
import Feed from "../pages/feed/Feed";
import NotFound from "../pages/NotFound/NotFound";
import AuthLayout from "../layout/AuthLayout/AuthLayout";
import Login from "../pages/auth/login/Login";
import Register from "../pages/auth/register/Register";
import ProtectedRoutes from "../components/ProtectedRoutes/ProtectedRoutes";
import PostDetails from "../pages/posts/PostDetails";
import ChangePassword from "../pages/change-password/ChangePassword";
import Notifications from "../pages/notifications/Notifications";

const basename = import.meta.env.BASE_URL.replace(/\/$/, "");

export const routes = createBrowserRouter(
  [
  {
    path: "",
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: (
          <ProtectedRoutes>
            <Feed />
          </ProtectedRoutes>
        ),
      },
      {
        path: "posts/:postId",
        element: (
          <ProtectedRoutes>
            <PostDetails />
          </ProtectedRoutes>
        ),
      },
      {
        path: "profile",
        element: (
          <ProtectedRoutes>
            <Profile />
          </ProtectedRoutes>
        ),
      },
      {
        path: "change-password",
        element: (
          <ProtectedRoutes>
            <ChangePassword />
          </ProtectedRoutes>
        ),
      },
      {
        path: "notifications",
        element: (
          <ProtectedRoutes>
            <Notifications />
          </ProtectedRoutes>
        ),
      },
      { path: "*", element: <NotFound /> },
    ],
  },
  {
    path: "auth",
    element: <AuthLayout />,
    children: [
      { index: true, element: <Login /> },
      { path: "login", element: <Login /> },
      { path: "register", element: <Register /> },
      { path: "*", element: <NotFound /> },
    ],
  },
  ],
  basename ? { basename } : undefined,
);