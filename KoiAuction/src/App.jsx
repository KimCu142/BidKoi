/* eslint-disable react/prop-types */
import { Outlet, RouterProvider } from "react-router-dom";
import { createBrowserRouter } from "react-router-dom";
import HomePage from "./pages/home/index.jsx";
import Header from "./components/header/index.jsx";
import Footer from "./components/footer/index.jsx";

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
import BidderActivities from "./pages/bidder/activities/index.jsx";
import BidderConfirmImg from "./pages/bidder/confirm-image/index.jsx";
import Profile from "./pages/profile/main-profile/index.jsx";
import Topbar from "./components/scenes/global/topbar.jsx";
import AdminDashboard from "./components/scenes/admin-dashboard/index.jsx";
import Besidebar from "./components/scenes/global/sidebar.jsx";
import SuccessPage from "./pages/success/index.jsx";
import Team from "./components/scenes/team/index.jsx";
import Invoices from "./components/scenes/invoices/index.jsx";
import Form from "./components/scenes/form/index.jsx";
import FailPage from "./pages/fail/index.jsx";
import Wallet from "./pages/wallet/index.jsx";

function AppLayout({ children }) {
  return (
    <div className="appLayout ">
      <Header />
      <div className="contentWrapper ">{children}</div>
      <Footer className="siteFooter" />
    </div>
  );
}

function DashboardLayout() {
  return (
    <div className="app">
      <Besidebar />
      <main className="content">
        <Topbar />
        <Outlet />
      </main>
    </div>
  );
}

function App() {
  const router = createBrowserRouter([
    {
      path: "/auctions/active/:roomId", // Correct path format for dynamic parameters
      element: (
        <>
          <AppLayout>
            <Bidding />
          </AppLayout>
        </>
      ),
    },
    {
      path: "/",

      element: (
        <>
          <AppLayout>
            <HomePage />
          </AppLayout>
        </>
      ),
    },
    {
      path: "/about",
      element: (
        <>
          <AppLayout>
            <AboutUs />
          </AppLayout>
        </>
      ),
    },
    {
      path: "/profile",

      element: (
        <>
          <AppLayout>
            <Profile />
          </AppLayout>
        </>
      ),
    },

    {
      path: "/wallet",

      element: (
        <>
          <AppLayout>
            <Wallet />
          </AppLayout>
        </>
      ),
    },
    {
      path: "/bidder-activities",

      element: (
        <>
          <AppLayout>
            <BidderActivities />
          </AppLayout>
        </>
      ),
    },
    {
      path: "/koi-details/:koiId",

      element: (
        <>
          <AppLayout>
            <BidderConfirmImg />
          </AppLayout>
        </>
      ),
    },
    {
      path: "/auctions/active",

      element: (
        <>
          <AppLayout>
            <Auctions />
          </AppLayout>
        </>
      ),
    },
    {
      path: "/availableaution",

      element: (
        <>
          <AppLayout>
            <Availableaution />
          </AppLayout>
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
          <AppLayout>
            <Bidding />
          </AppLayout>
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
      path: "/admin-dashboard",
      element: <DashboardLayout />,
      children: [
        { path: "dashboard", element: <AdminDashboard /> },
        { path: "team", element: <Team /> },
        // { path: "/contacts", element: <Contacts /> },
        { path: "invoices", element: <Invoices /> },
        { path: "form", element: <Form /> },
        // { path: "/bar", element: <Bar /> },
        // { path: "/pie", element: <Pie /> },
        // { path: "/line", element: <Line /> },
        // { path: "/faq", element: <FAQ /> },
        // { path: "/geography", element: <Geography /> },
        // { path: "/calendar", element: <Calendar /> },
      ],
    },
    {
      path: "/success",

      element: (
        <>
          <SuccessPage />
        </>
      ),
    },
    {
      path: "/fail",

      element: (
        <>
          <FailPage />
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
