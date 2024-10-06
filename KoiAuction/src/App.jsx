import { RouterProvider } from "react-router-dom";
import { createBrowserRouter } from "react-router-dom";

import Login from "./components/LoginPage/Login";
import Register from "./components/LoginPage/Register";
import HomePage from "./pages/home/index.jsx";
import Header from "./components/header/index.jsx";
import Footer from "./components/footer/index.jsx";
import Profile from "./pages/profile/index.jsx";
import Availableaution from "./pages/availableauction/availableauction.jsx";
import Auctions from "./pages/auctions/Auctions.jsx";
import BreederRequest from "./pages/breeder/manage-request/index.jsx";
import Dashboard from "./components/dashboard/index.jsx";

function App() {
  const router = createBrowserRouter([
    {
      path: "/",

      element: (
        <>
          <Header />
          <HomePage />
          <Footer />
        </>
      ),
    },
    {
      path: "/profile",

      element: (
        <>
          <Header />
          <Profile />
          <Footer />
        </>
      ),
    },

    {
      path: "/auctions",

      element: (
        <>
          <Header />
          <Auctions />
          <Footer />
        </>
      ),
    },
    {
      path: "/availableaution",

      element: (
        <>
          <Header />
  
       <Availableaution/>
          <Footer />
        </>
      ),
    },
    {
      path: "/Login",
      element: <Login />,
    },
   
    {
      path: "/Register",
      element: <Register />,
    },
    {
      path: "/dashboard",
      element: <Dashboard />,
      children: [
        {
          path: "request",
          element: <BreederRequest />,
        },
       
      ],
    },
      {
      path: "/dashboard",
      element: <Dashboard />,
      children: [
        {
          path: "request",
          element: <BreederRequest />,
        },
       
      ],
    },
  ]);

  return <RouterProvider router={router} />;
}

export default App;
