import { createBrowserRouter } from "react-router";
import Login from "./features/auth/pages/login";
import Register from "./features/auth/pages/Register";
import Protected from "./features/auth/components/protected";
import Home from "./features/interview/pages/Home";
import Interview from "./features/interview/pages/interview";
import Layout from "./components/Layout";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Protected><Layout><Home/></Layout></Protected>
  },
  {
    path: "/login",
    element: <Layout><Login /></Layout>,
  },
  {
    path: "/register",
    element: <Layout><Register /></Layout>,
  },
  {
    path:"/interview/:interviewId",   
    element:<Protected><Layout><Interview/></Layout></Protected>
  }
]);
