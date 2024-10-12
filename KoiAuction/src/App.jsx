import { RouterProvider } from "react-router-dom";
import { createBrowserRouter } from "react-router-dom";

import Login from "./pages/LoginPage/Login.jsx";
import Register from "./pages/LoginPage/Register.jsx";
import HomePage from "./pages/home/index.jsx";
import Header from "./components/header/index.jsx";
import Footer from "./components/footer/index.jsx";
import Profile from "./pages/profile/index.jsx";
import Availableaution from "./pages/availableauction/availableauction.jsx";
import Auctions from "./pages/auctions/Auctions.jsx";
import BreederRequest from "./pages/breeder/manage-request/index.jsx";

import BreederDashboard from "./pages/breeder/breeder-dashboard/index.jsx";
import StaffDashboard from "./pages/staff/staff-dashboard/index.jsx";
import StaffResponse from "./pages/staff/manage-response/index.jsx";
import CreateAuction from "./pages/staff/manage-auction/index.jsx";
import AuctionDetail from "./pages/staff/manage-room/index.jsx";

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

          <Availableaution />
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
      path: "/breeder-dashboard",
      element: <BreederDashboard />,
      children: [
        {
          path: "breeder-request",
          element: <BreederRequest />,
        },
      ],
    },
    {
      path: "/staff-dashboard",
      element: <StaffDashboard />,
      children: [
        {
          path: "staff-request",
          element: <StaffResponse />,
        },
        {
          path: "create-auction",
          element: <CreateAuction />,
        },
        {
          path: "create-auction/:auctionId",
          element: <AuctionDetail />,
        },
      ],
    },
  ]);

  return <RouterProvider router={router} />;
}

export default App;
