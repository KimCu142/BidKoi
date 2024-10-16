import { RouterProvider } from "react-router-dom";
import { createBrowserRouter } from "react-router-dom";
import { useParams } from "react-router-dom";

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
import Bidding from "./pages/bidding/Bidding.jsx";
import Login from "./pages/LoginPage/Login.jsx";
import Register from "./pages/LoginPage/Register.jsx";
import CreateAuction from "./pages/staff/manage-auction/index.jsx";
import RoomDetail from "./pages/staff/manage-room/index.jsx";
import Password from "./pages/profile/password/index.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import AboutUs from "./pages/about/index.jsx";
import { AuthProvider } from "./components/AuthContext.jsx";

function App() {
  const router = createBrowserRouter([
    {
      path: "/",

      element: (
        <>
          <HomePage />
        </>
      ),
    },
    {
      path: "/about",
      element: <AboutUs />,
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
      path: "/auctions/active",

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
      path: "/Bid",
      element: (
        <>
          <Header />
          <Bidding />
          <Footer />
        </>
      ),
    },

    {
      path: "/Register",
      element: <Register />,
    },
    {
      path: "/breeder-dashboard",
      element: (
        <ProtectedRoute
          element={<BreederDashboard />}
          allowedRoles={["BREEDER"]}
        />
      ),
      children: [
        {
          path: "breeder-request",
          element: <BreederRequest />,
        },
      ],
    },
    {
      path: "/staff-dashboard",
      element: (
        <ProtectedRoute element={<StaffDashboard />} allowedRoles={["STAFF"]} />
      ),
      children: [
        {
          path: "staff-request",
          element: (
            <ProtectedRoute
              element={<StaffResponse />}
              allowedRoles={["STAFF"]}
            />
          ),
        },
        {
          path: "create-auction",
          element: (
            <ProtectedRoute
              element={<CreateAuction />}
              allowedRoles={["STAFF"]}
            />
          ),
        },
        {
          path: "create-auction/:auctionId",
          element: (
            <ProtectedRoute element={<RoomDetail />} allowedRoles={["STAFF"]} />
          ),
        },
      ],
    },
    {
      path: "/auctions/active/:roomId",
      element: (
        <>
          <Header />
          <Bidding />
          <Footer />
        </>
      ),
    },
  ]);

  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  );
}

export default App;
